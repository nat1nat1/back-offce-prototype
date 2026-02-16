import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertItem } from "@shared/routes";
import type { HistoryEvent } from "@shared/schema";

export function useItems(params?: Record<string, any>, options?: { enabled?: boolean }) {
  const cleanParams = params 
    ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== ''))
    : undefined;

  const url = cleanParams 
    ? `${api.items.list.path}?${new URLSearchParams(cleanParams).toString()}`
    : api.items.list.path;

  return useQuery({
    queryKey: [api.items.list.path, cleanParams],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch items");
      return api.items.list.responses[200].parse(await res.json());
    },
    enabled: options?.enabled ?? true,
  });
}

export function useItem(id: number) {
  return useQuery({
    queryKey: [api.items.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.items.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch item");
      return api.items.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useItemHistory(itemId: number) {
  return useQuery<HistoryEvent[]>({
    queryKey: ['/api/items', itemId, 'history'],
    queryFn: async () => {
      const res = await fetch(`/api/items/${itemId}/history`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!itemId,
  });
}

export function useItemStats() {
  return useQuery<{ total: number; created: number; reserved: number; paid: number }>({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats', { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}

export function useRecentActivity(limit: number = 10) {
  return useQuery<HistoryEvent[]>({
    queryKey: ['/api/activity', limit],
    queryFn: async () => {
      const res = await fetch(`/api/activity?limit=${limit}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
  });
}

export function useBuyerByItem(itemId: number) {
  return useQuery({
    queryKey: ['/api/items', itemId, 'buyer'],
    queryFn: async () => {
      const res = await fetch(`/api/items/${itemId}/buyer`, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch buyer");
      return res.json();
    },
    enabled: !!itemId,
  });
}

export function useBuyerInvoices(buyerId: number | undefined) {
  return useQuery({
    queryKey: ['/api/buyers', buyerId, 'invoices'],
    queryFn: async () => {
      const res = await fetch(`/api/buyers/${buyerId}/invoices`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return res.json();
    },
    enabled: !!buyerId,
  });
}

export function useBuyerPaymentOrders(buyerId: number | undefined) {
  return useQuery({
    queryKey: ['/api/buyers', buyerId, 'payment-orders'],
    queryFn: async () => {
      const res = await fetch(`/api/buyers/${buyerId}/payment-orders`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch payment orders");
      return res.json();
    },
    enabled: !!buyerId,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertItem) => {
      const res = await fetch(api.items.create.path, {
        method: api.items.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.items.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create item");
      }
      return api.items.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useUpdateItem(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<InsertItem>) => {
      const url = buildUrl(api.items.update.path, { id });
      const res = await fetch(url, {
        method: api.items.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.items.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) {
          throw new Error("Item not found");
        }
        throw new Error("Failed to update item");
      }
      return api.items.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.get.path, id] });
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}
