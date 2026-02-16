import { z } from 'zod';
import { insertItemSchema, updateItemSchema, items, insertReleaseNoteSchema, releaseNotes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  items: {
    list: {
      method: 'GET' as const,
      path: '/api/items',
      input: z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        brand: z.string().optional(),
        buyerEmail: z.string().optional(),
        buyerName: z.string().optional(),
        buyerPhone: z.string().optional(),
        collectionStatus: z.string().optional(),
        companyName: z.string().optional(),
        companyId: z.string().optional(),
        agreementReference: z.string().optional(),
        auctionDisplayId: z.string().optional(),
        lotDisplayId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
      }).optional(),
      responses: {
        200: z.object({
          items: z.array(z.custom<typeof items.$inferSelect>()),
          total: z.number(),
          page: z.number(),
          limit: z.number(),
        }),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/items/:id',
      responses: {
        200: z.custom<typeof items.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/items',
      input: insertItemSchema,
      responses: {
        201: z.custom<typeof items.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/items/:id',
      input: updateItemSchema,
      responses: {
        200: z.custom<typeof items.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  releaseNotes: {
    list: {
      method: 'GET' as const,
      path: '/api/release-notes',
      responses: {
        200: z.array(z.custom<typeof releaseNotes.$inferSelect>()),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ItemResponse = z.infer<typeof api.items.get.responses[200]>;
export type ItemsListResponse = z.infer<typeof api.items.list.responses[200]>;
export type UpdateItemRequest = z.infer<typeof api.items.update.input>;
export type InsertItem = z.infer<typeof insertItemSchema>;
