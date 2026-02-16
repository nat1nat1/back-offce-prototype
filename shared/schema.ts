import { pgTable, text, serial, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  displayId: text("display_id").notNull(),
  title: text("title").notNull(),
  auctionTitle: text("auction_title").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(),
  collectionStatus: text("collection_status").notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerPhone: text("buyer_phone").notNull(),
  brand: text("brand").notNull(),
  lotDisplayId: text("lot_display_id").notNull(),
  auctionDisplayId: text("auction_display_id").notNull(),
  agreementReference: text("agreement_reference").notNull(),
  companyName: text("company_name").notNull(),
  companyId: text("company_id").notNull(),
  imageUrl: text("image_url"),

  // Details - Core
  lotTitle: text("lot_title"),
  lotNumber: text("lot_number"),
  externalReference: text("external_reference"),
  productName: text("product_name"),
  itemDescription: text("item_description"),
  additionalInformation: text("additional_information"),
  remarks: text("remarks"),

  // Details - Classification
  category: text("category"),
  subcategory: text("subcategory"),
  favouriteCategories: text("favourite_categories").array().default([]),

  // Details - Language
  sourceLanguage: text("source_language"),
  translated: boolean("translated").default(false),

  // Details - Validation
  errorCount: integer("error_count").default(0),
  validationFailures: text("validation_failures").array().default([]),

  // Details - System
  itemSource: text("item_source"),
  platform: text("platform"),

  // Media & Specs - Media
  primaryImageUrl: text("primary_image_url"),
  imageGallery: text("image_gallery").array().default([]),
  documents: text("documents").array().default([]),
  ownershipProofUrl: text("ownership_proof_url"),
  uploadName: text("upload_name"),
  mediaUploaded: boolean("media_uploaded").default(false),
  tour3dUrl: text("tour_3d_url"),

  // Media & Specs - Specs
  model: text("model"),
  productType: text("product_type"),
  quantity: integer("quantity").default(1),
  length: real("length"),
  width: real("width"),
  height: real("height"),
  seatHeight: real("seat_height"),
  depth: real("depth"),
  weight: real("weight"),
  material: text("material"),
  colour: text("colour"),
  hsCode: text("hs_code"),
  gtin: text("gtin"),

  // Logistics
  location: text("location"),
  collectionWindow: text("collection_window"),
  collectionContactInfo: text("collection_contact_info"),
  deliveryTerms: text("delivery_terms"),
  allocation: text("allocation"),
  dayPartition: text("day_partition"),
  specialHandlingNotes: text("special_handling_notes"),

  // Commercials
  startingPrice: real("starting_price"),
  estimatedPrice: real("estimated_price"),
  retailPrice: real("retail_price"),
  currency: text("currency").default("EUR"),
  saleType: text("sale_type"),
  vatRate: real("vat_rate"),
  marginGood: boolean("margin_good").default(false),
  bidDepositRequired: boolean("bid_deposit_required").default(false),
  additionalCosts: real("additional_costs"),
  additionalCostsLabel: text("additional_costs_label"),

  // Seller & Agreement
  sellerName: text("seller_name"),
  sellerId: text("seller_id"),
  billingEntity: text("billing_entity"),
  agreementId: text("agreement_id"),
  agreementName: text("agreement_name"),
  storefront: text("storefront"),
  siteManager: text("site_manager"),

  // Listings
  auctionName: text("auction_name"),
  lotIdNumber: text("lot_id_number"),
  listingStatus: text("listing_status"),
  closingDate: timestamp("closing_date"),
  saleAttempt: integer("sale_attempt").default(1),
  publishingStatus: text("publishing_status"),
  synced: boolean("synced").default(false),
  buyerId: integer("buyer_id").references(() => buyers.id),

  // History - Audit
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: text("updated_by"),
});

export const insertItemSchema = createInsertSchema(items).omit({ id: true });
export const updateItemSchema = createInsertSchema(items).omit({ id: true, createdAt: true }).partial();

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;

// History events for timeline
export const historyEvents = pgTable("history_events", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  eventType: text("event_type").notNull(),
  eventTitle: text("event_title").notNull(),
  eventDescription: text("event_description").notNull(),
  eventDate: timestamp("event_date").notNull(),
  userId: text("user_id"),
  metadata: text("metadata"),
});

export const insertHistoryEventSchema = createInsertSchema(historyEvents).omit({ id: true });
export type HistoryEvent = typeof historyEvents.$inferSelect;
export type InsertHistoryEvent = z.infer<typeof insertHistoryEventSchema>;

export const releaseNotes = pgTable("release_notes", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
});

export const insertReleaseNoteSchema = createInsertSchema(releaseNotes).omit({ id: true });
export type ReleaseNote = typeof releaseNotes.$inferSelect;
export type InsertReleaseNote = z.infer<typeof insertReleaseNoteSchema>;

// Buyers
export const buyers = pgTable("buyers", {
  id: serial("id").primaryKey(),
  buyerId: text("buyer_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  accountType: text("account_type").notNull(), // "Company" or "Private"
  companyName: text("company_name"),
  vatNumber: text("vat_number"),
  buyerStatus: text("buyer_status").notNull(), // "Buyer" or "Guest"
  registeredDate: timestamp("registered_date"),
  country: text("country"),
  isBlocked: boolean("is_blocked").default(false),
  
  // Additional fields from Atlas
  riskAssessment: text("risk_assessment"), // "Under review", "Unavailable", "Approved", etc.
  storefront: text("storefront"),
  dateOfBirth: timestamp("date_of_birth"),
  chamberOfCommerceNumber: text("chamber_of_commerce_number"),
  vatVerifiedDate: timestamp("vat_verified_date"),
  
  // Registration address
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  postalCode: text("postal_code"),
  
  // Financial summary
  outstandingBalance: real("outstanding_balance").default(0),
  paymentOrdersCount: integer("payment_orders_count").default(0),
  lotsAwaitingCheckout: integer("lots_awaiting_checkout").default(0),
  
  // Notes
  notes: text("notes"),
});

// Mock invoices for prototype
export const buyerInvoices = pgTable("buyer_invoices", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").references(() => buyers.id),
  invoiceNumber: text("invoice_number").notNull(),
  poNumber: text("po_number"),
  amount: real("amount").notNull(),
  currency: text("currency").default("EUR"),
  status: text("status").notNull(), // "Paid", "Pending", "Overdue"
  invoiceDate: timestamp("invoice_date").notNull(),
});

// Mock payment orders for prototype
export const paymentOrders = pgTable("payment_orders", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").references(() => buyers.id),
  poNumber: text("po_number").notNull(),
  invoiceNumber: text("invoice_number"),
  amount: real("amount").notNull(),
  currency: text("currency").default("EUR"),
  status: text("status").notNull(), // "Paid", "Pending"
  orderDate: timestamp("order_date").notNull(),
});

export const insertBuyerSchema = createInsertSchema(buyers).omit({ id: true });
export type Buyer = typeof buyers.$inferSelect;
export type InsertBuyer = z.infer<typeof insertBuyerSchema>;

export const insertBuyerInvoiceSchema = createInsertSchema(buyerInvoices).omit({ id: true });
export type BuyerInvoice = typeof buyerInvoices.$inferSelect;
export type InsertBuyerInvoice = z.infer<typeof insertBuyerInvoiceSchema>;

export const insertPaymentOrderSchema = createInsertSchema(paymentOrders).omit({ id: true });
export type PaymentOrder = typeof paymentOrders.$inferSelect;
export type InsertPaymentOrder = z.infer<typeof insertPaymentOrderSchema>;
