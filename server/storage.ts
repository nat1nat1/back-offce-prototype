import { db } from "./db";
import {
  items,
  releaseNotes,
  historyEvents,
  buyers,
  buyerInvoices,
  paymentOrders,
  type Item,
  type InsertItem,
  type UpdateItem,
  type ReleaseNote,
  type InsertReleaseNote,
  type HistoryEvent,
  type InsertHistoryEvent,
  type Buyer,
  type InsertBuyer,
  type BuyerInvoice,
  type InsertBuyerInvoice,
  type PaymentOrder,
  type InsertPaymentOrder
} from "@shared/schema";
import { eq, like, and, sql, desc } from "drizzle-orm";

export interface IStorage {
  getItems(params: any): Promise<{ items: Item[]; total: number; page: number; limit: number }>;
  getItem(id: number): Promise<Item | undefined>;
  getBuyerByItemId(itemId: number): Promise<Buyer | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, updates: UpdateItem): Promise<Item>;
  getHistoryEvents(itemId: number): Promise<HistoryEvent[]>;
  createHistoryEvent(event: InsertHistoryEvent): Promise<HistoryEvent>;
  getRecentHistoryEvents(limit?: number): Promise<HistoryEvent[]>;
  getItemStats(): Promise<{ total: number; created: number; reserved: number; paid: number }>;
  getReleaseNotes(): Promise<ReleaseNote[]>;
  createReleaseNote(note: InsertReleaseNote): Promise<ReleaseNote>;
  getBuyers(params: any): Promise<{ buyers: Buyer[]; total: number; page: number; limit: number }>;
  getBuyer(id: number): Promise<Buyer | undefined>;
  createBuyer(buyer: InsertBuyer): Promise<Buyer>;
  getBuyerInvoices(buyerId: number): Promise<BuyerInvoice[]>;
  createBuyerInvoice(invoice: InsertBuyerInvoice): Promise<BuyerInvoice>;
  getPaymentOrders(buyerId: number): Promise<PaymentOrder[]>;
  createPaymentOrder(order: InsertPaymentOrder): Promise<PaymentOrder>;
}

export class DatabaseStorage implements IStorage {
  async getItems(params: any): Promise<{ items: Item[]; total: number; page: number; limit: number }> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (params.search) {
      const searchLower = `%${params.search.toLowerCase()}%`;
      conditions.push(sql`
        lower(${items.title}) LIKE ${searchLower} OR
        lower(${items.displayId}) LIKE ${searchLower} OR
        lower(${items.buyerName}) LIKE ${searchLower} OR
        lower(${items.buyerEmail}) LIKE ${searchLower}
      `);
    }

    if (params.status) {
      conditions.push(eq(items.status, params.status));
    }

    if (params.brand) {
      conditions.push(eq(items.brand, params.brand));
    }

    if (params.collectionStatus) {
      conditions.push(eq(items.collectionStatus, params.collectionStatus));
    }

    if (params.buyerEmail) {
      conditions.push(sql`lower(${items.buyerEmail}) LIKE ${`%${params.buyerEmail.toLowerCase()}%`}`);
    }

    if (params.buyerName) {
      conditions.push(sql`lower(${items.buyerName}) LIKE ${`%${params.buyerName.toLowerCase()}%`}`);
    }

    if (params.companyName) {
      conditions.push(sql`lower(${items.companyName}) LIKE ${`%${params.companyName.toLowerCase()}%`}`);
    }

    if (params.companyId) {
      conditions.push(sql`lower(${items.companyId}) LIKE ${`%${params.companyId.toLowerCase()}%`}`);
    }

    if (params.agreementReference) {
      conditions.push(sql`lower(${items.agreementReference}) LIKE ${`%${params.agreementReference.toLowerCase()}%`}`);
    }

    if (params.auctionDisplayId) {
      conditions.push(sql`lower(${items.auctionDisplayId}) LIKE ${`%${params.auctionDisplayId.toLowerCase()}%`}`);
    }

    if (params.lotDisplayId) {
      conditions.push(sql`lower(${items.lotDisplayId}) LIKE ${`%${params.lotDisplayId.toLowerCase()}%`}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(whereClause);

    const total = Number(countResult?.count || 0);

    const result = await db
      .select()
      .from(items)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(items.date));

    return {
      items: result,
      total,
      page,
      limit,
    };
  }

  async getItem(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }

  async getBuyerByItemId(itemId: number): Promise<Buyer | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, itemId));
    if (!item || !item.buyerEmail) return undefined;
    // Match buyer by email since items don't have a direct buyerId foreign key
    const [buyer] = await db.select().from(buyers).where(eq(buyers.email, item.buyerEmail));
    return buyer;
  }

  async createItem(item: InsertItem): Promise<Item> {
    const [newItem] = await db.insert(items).values(item).returning();
    return newItem;
  }

  async updateItem(id: number, updates: UpdateItem): Promise<Item> {
    const [updatedItem] = await db
      .update(items)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return updatedItem;
  }

  async getHistoryEvents(itemId: number): Promise<HistoryEvent[]> {
    return await db
      .select()
      .from(historyEvents)
      .where(eq(historyEvents.itemId, itemId))
      .orderBy(desc(historyEvents.eventDate));
  }

  async createHistoryEvent(event: InsertHistoryEvent): Promise<HistoryEvent> {
    const [newEvent] = await db.insert(historyEvents).values(event).returning();
    return newEvent;
  }

  async getRecentHistoryEvents(limit: number = 10): Promise<HistoryEvent[]> {
    return await db
      .select()
      .from(historyEvents)
      .orderBy(desc(historyEvents.eventDate))
      .limit(limit);
  }

  async getItemStats(): Promise<{ total: number; created: number; reserved: number; paid: number }> {
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(items);
    
    const [createdResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(eq(items.status, 'Created'));
    
    const [reservedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(eq(items.status, 'Reserved'));
    
    const [paidResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(eq(items.status, 'Paid'));

    return {
      total: Number(totalResult?.count || 0),
      created: Number(createdResult?.count || 0),
      reserved: Number(reservedResult?.count || 0),
      paid: Number(paidResult?.count || 0),
    };
  }

  async getReleaseNotes(): Promise<ReleaseNote[]> {
    return await db.select().from(releaseNotes).orderBy(desc(releaseNotes.date));
  }

  async createReleaseNote(note: InsertReleaseNote): Promise<ReleaseNote> {
    const [newNote] = await db.insert(releaseNotes).values(note).returning();
    return newNote;
  }

  async getBuyers(params: any): Promise<{ buyers: Buyer[]; total: number; page: number; limit: number }> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (params.search) {
      const searchLower = `%${params.search.toLowerCase()}%`;
      conditions.push(sql`
        lower(${buyers.buyerId}) LIKE ${searchLower} OR
        lower(${buyers.name}) LIKE ${searchLower} OR
        lower(${buyers.email}) LIKE ${searchLower}
      `);
    }

    if (params.buyerId) {
      conditions.push(sql`lower(${buyers.buyerId}) LIKE ${`%${params.buyerId.toLowerCase()}%`}`);
    }

    if (params.name) {
      conditions.push(sql`lower(${buyers.name}) LIKE ${`%${params.name.toLowerCase()}%`}`);
    }

    if (params.email) {
      conditions.push(sql`lower(${buyers.email}) LIKE ${`%${params.email.toLowerCase()}%`}`);
    }

    if (params.accountType) {
      conditions.push(eq(buyers.accountType, params.accountType));
    }

    if (params.buyerStatus) {
      conditions.push(eq(buyers.buyerStatus, params.buyerStatus));
    }

    if (params.isBlocked !== undefined) {
      conditions.push(eq(buyers.isBlocked, params.isBlocked === 'true'));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(buyers)
      .where(whereClause);

    const total = Number(countResult?.count || 0);

    const result = await db
      .select()
      .from(buyers)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(buyers.registeredDate));

    return {
      buyers: result,
      total,
      page,
      limit,
    };
  }

  async getBuyer(id: number): Promise<Buyer | undefined> {
    const [buyer] = await db.select().from(buyers).where(eq(buyers.id, id));
    return buyer;
  }

  async createBuyer(buyer: InsertBuyer): Promise<Buyer> {
    const [newBuyer] = await db.insert(buyers).values(buyer).returning();
    return newBuyer;
  }

  async getBuyerInvoices(buyerId: number): Promise<BuyerInvoice[]> {
    return await db
      .select()
      .from(buyerInvoices)
      .where(eq(buyerInvoices.buyerId, buyerId))
      .orderBy(desc(buyerInvoices.invoiceDate));
  }

  async createBuyerInvoice(invoice: InsertBuyerInvoice): Promise<BuyerInvoice> {
    const [newInvoice] = await db.insert(buyerInvoices).values(invoice).returning();
    return newInvoice;
  }

  async getPaymentOrders(buyerId: number): Promise<PaymentOrder[]> {
    return await db
      .select()
      .from(paymentOrders)
      .where(eq(paymentOrders.buyerId, buyerId))
      .orderBy(desc(paymentOrders.orderDate));
  }

  async createPaymentOrder(order: InsertPaymentOrder): Promise<PaymentOrder> {
    const [newOrder] = await db.insert(paymentOrders).values(order).returning();
    return newOrder;
  }
}

export const storage = new DatabaseStorage();
