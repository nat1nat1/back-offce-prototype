import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertItemSchema, updateItemSchema, insertHistoryEventSchema, insertBuyerSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.items.list.path, async (req, res) => {
    try {
      const result = await storage.getItems(req.query);
      res.json(result);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.items.get.path, async (req, res) => {
    try {
      const item = await storage.getItem(Number(req.params.id));
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.items.create.path, async (req, res) => {
    try {
      const input = insertItemSchema.parse(req.body);
      const item = await storage.createItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Error creating item:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.items.update.path, async (req, res) => {
    try {
      const existingItem = await storage.getItem(Number(req.params.id));
      if (!existingItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      const updates = updateItemSchema.parse(req.body);
      const item = await storage.updateItem(Number(req.params.id), updates);
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Error updating item:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/items/:id/history", async (req, res) => {
    try {
      const events = await storage.getHistoryEvents(Number(req.params.id));
      res.json(events);
    } catch (error) {
      console.error("Error fetching history events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getItemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/activity", async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const events = await storage.getRecentHistoryEvents(limit);
      res.json(events);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/items/:id/buyer", async (req, res) => {
    try {
      const buyer = await storage.getBuyerByItemId(Number(req.params.id));
      if (!buyer) {
        return res.status(404).json({ message: "Buyer not found for this item" });
      }
      res.json(buyer);
    } catch (error) {
      console.error("Error fetching buyer for item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.releaseNotes.list.path, async (req, res) => {
    try {
      const notes = await storage.getReleaseNotes();
      res.json(notes);
    } catch (error) {
      console.error("Error fetching release notes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/seed", async (req, res) => {
    try {
      const existing = await storage.getItems({ limit: 1 });
      if (existing.total === 0) {
        await seedDatabase();
        res.json({ message: "Database seeded" });
      } else {
        res.json({ message: "Database already has data" });
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/reseed", async (req, res) => {
    try {
      await seedDatabase();
      res.json({ message: "Database reseeded with new data" });
    } catch (error) {
      console.error("Error reseeding database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/buyers", async (req, res) => {
    try {
      const result = await storage.getBuyers(req.query);
      res.json(result);
    } catch (error) {
      console.error("Error fetching buyers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/buyers/:id", async (req, res) => {
    try {
      const buyer = await storage.getBuyer(Number(req.params.id));
      if (!buyer) {
        return res.status(404).json({ message: "Buyer not found" });
      }
      res.json(buyer);
    } catch (error) {
      console.error("Error fetching buyer:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/seed-buyers", async (req, res) => {
    try {
      await seedBuyers();
      res.json({ message: "Buyers seeded" });
    } catch (error) {
      console.error("Error seeding buyers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/buyers/:id/invoices", async (req, res) => {
    try {
      const invoices = await storage.getBuyerInvoices(Number(req.params.id));
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching buyer invoices:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/buyers/:id/payment-orders", async (req, res) => {
    try {
      const orders = await storage.getPaymentOrders(Number(req.params.id));
      res.json(orders);
    } catch (error) {
      console.error("Error fetching payment orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manual seed endpoint - visit /api/seed in browser to populate the database
  // Add ?force=true to clear and reseed
  app.get("/api/seed", async (req, res) => {
    try {
      const forceReseed = req.query.force === 'true';
      const existing = await storage.getItems({ limit: 1 });
      
      if (existing.total > 0 && !forceReseed) {
        return res.json({ 
          success: false, 
          message: "Database already has data. Add ?force=true to clear and reseed.",
          itemCount: existing.total
        });
      }
      
      // If force reseed, clear all data first
      if (forceReseed) {
        const schema = await import("@shared/schema");
        const { db } = await import("./db");
        // Clear in order respecting foreign keys - items must be deleted before buyers
        console.log("Force reseed: Clearing all data...");
        try {
          await db.delete(schema.paymentOrders);
          console.log("Deleted payment orders");
          await db.delete(schema.buyerInvoices);
          console.log("Deleted buyer invoices");
          await db.delete(schema.historyEvents);
          console.log("Deleted history events");
          await db.delete(schema.items);
          console.log("Deleted items");
          await db.delete(schema.buyers);
          console.log("Deleted buyers");
          await db.delete(schema.releaseNotes);
          console.log("Deleted release notes");
        } catch (deleteError) {
          console.error("Error during deletion:", deleteError);
          throw deleteError;
        }
      }
      
      // Seed buyers first (items have foreign key to buyers)
      const buyerIds = await seedBuyers();
      await seedDatabase(buyerIds);
      
      const afterSeed = await storage.getItems({ limit: 1 });
      res.json({ 
        success: true, 
        message: forceReseed ? "Database cleared and reseeded successfully!" : "Database seeded successfully!",
        itemCount: afterSeed.total
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error seeding database", 
        error: String(error) 
      });
    }
  });

  return httpServer;
}

export async function seedDatabase(buyerIds: number[] = [1, 2, 3, 4, 5]) {
  // Generate 50 diverse items across categories
  const statuses = ["Created", "Reserved", "Paid"];
  const collectionStatuses = ["Not collected", "Pending", "Collected"];
  const buyers = [
    { id: buyerIds[0] || 1, name: "Thibaut Ickx", email: "t.ickx@bedrijf.be", phone: "+32 478 55 12 34" },
    { id: buyerIds[1] || 2, name: "Emma Janssen", email: "e.janssen@example.nl", phone: "+31 6 12345678" },
    { id: buyerIds[2] || 3, name: "Marcus de Groot", email: "m.degroot@zakelijk.nl", phone: "+31 6 98765432" },
    { id: buyerIds[3] || 4, name: "Precision Parts BV", email: "inkoop@precisionparts.nl", phone: "+31 40 1234567" },
    { id: buyerIds[4] || 5, name: "Galerie Amsterdam", email: "acquisitions@galerie-adam.nl", phone: "+31 20 7654321" }
  ];

  const itemTemplates = [
    { category: "Sofas and chaises longues", subcategory: "Corner Sofas", brand: "Henders en Hazel", products: ["Hoekbank Napels", "Hoekbank Como", "Loungebank Oslo"], image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
    { category: "Sofas and chaises longues", subcategory: "Armchairs", brand: "Henders en Hazel", products: ["Fauteuil Milano", "Relaxfauteuil Vienna", "Clubfauteuil London"], image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
    { category: "Tables", subcategory: "Dining Tables", brand: "Richmond Interiors", products: ["Eettafel Oakdale 220cm", "Eettafel Blackbone 200cm", "Eettafel Kensington 180cm"], image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400" },
    { category: "Tables", subcategory: "Coffee Tables", brand: "Zuiver", products: ["Salontafel Marble", "Salontafel Oak", "Bijzettafel Round"], image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400" },
    { category: "Industrial Machinery", subcategory: "CNC Machines", brand: "Haas", products: ["VF-2SS Machining Center", "ST-10 CNC Lathe", "UMC-750 5-Axis Mill"], image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400" },
    { category: "Industrial Machinery", subcategory: "Welding Equipment", brand: "Lincoln Electric", products: ["Power Wave S500", "Precision TIG 375", "IDEALARC DC-600"], image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400" },
    { category: "Fine Art", subcategory: "Paintings", brand: "Antique", products: ["19th Century Dutch Landscape", "Portrait of a Lady", "Maritime Scene"], image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400" },
    { category: "Fine Art", subcategory: "Sculptures", brand: "Contemporary", products: ["Bronze Horse", "Abstract Steel Form", "Marble Bust"], image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400" },
    { category: "Electronics", subcategory: "Audio Equipment", brand: "Denon", products: ["AV Receiver AVR-X4800H", "Turntable DP-450USB", "CD Player DCD-1600NE"], image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400" },
    { category: "Electronics", subcategory: "Displays", brand: "Samsung", products: ["55\" QLED 4K Display", "75\" Commercial Display", "Video Wall Module"], image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
    { category: "Office Furniture", subcategory: "Desks", brand: "Steelcase", products: ["Sit-Stand Desk", "Executive Desk", "Reception Counter"], image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400" },
    { category: "Office Furniture", subcategory: "Chairs", brand: "Herman Miller", products: ["Aeron Chair", "Embody Chair", "Sayl Chair"], image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400" },
    { category: "Vehicles", subcategory: "Forklifts", brand: "Toyota", products: ["Electric Forklift 8FBET18", "Diesel Forklift 8FD25", "Reach Truck 8BRU18"], image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400" },
    { category: "Vehicles", subcategory: "Vans", brand: "Mercedes-Benz", products: ["Sprinter 316 CDI", "Vito 116 CDI", "Citan 109 CDI"], image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400" },
    { category: "Catering Equipment", subcategory: "Ovens", brand: "Rational", products: ["iCombi Pro 10-1/1", "iCombi Classic 6-1/1", "iVario Pro 2-S"], image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
    { category: "Catering Equipment", subcategory: "Refrigeration", brand: "Liebherr", products: ["GKPv 6573", "FKvsl 4113", "LCexv 4010"], image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400" },
    { category: "Medical Equipment", subcategory: "Imaging", brand: "Siemens", products: ["Magnetom Aera 1.5T", "Somatom go.All CT", "Ysio Max X-Ray"], image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400" },
    { category: "Construction", subcategory: "Excavators", brand: "Caterpillar", products: ["320 GC Excavator", "308 CR Mini Excavator", "336 Large Excavator"], image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400" },
    { category: "Garden", subcategory: "Lawn Mowers", brand: "John Deere", products: ["Z994R Zero-Turn", "X584 Lawn Tractor", "AutoTrac 3E"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    { category: "Lighting", subcategory: "Stage Lighting", brand: "Martin", products: ["MAC Encore Performance", "Rush MH 6 Wash", "VDO Sceptron 20"], image: "https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400" }
  ];

  const itemsData = [];
  let lotNumber = 100;

  for (let i = 0; i < 50; i++) {
    const template = itemTemplates[i % itemTemplates.length];
    const product = template.products[i % template.products.length];
    const buyer = buyers[i % 5];
    const statusIndex = i % 3;
    const displayId = `0${40 + Math.floor(i / 10)}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(75 + ((i * 3) % 26))}${i}`;
    
    const baseDate = new Date("2026-01-15");
    baseDate.setDate(baseDate.getDate() - (i * 2));

    itemsData.push({
      displayId,
      buyerId: buyer.id,
      lotNumber: String(lotNumber + i),
      externalReference: `REF-2025-${String(lotNumber + i).padStart(3, '0')}`,
      productName: product.split(' ')[0],
      lotTitle: `${template.brand} - ${product}`,
      itemDescription: `High quality ${product.toLowerCase()} from ${template.brand}. Excellent condition with full documentation.`,
      additionalInformation: `Complete with all accessories and documentation. Professional maintenance history available.`,
      remarks: i % 4 === 0 ? "Priority sale - seller relocating" : null,
      title: `${template.brand} - ${product}`,
      auctionTitle: `${template.category} Auction - January 2026`,
      date: baseDate,
      status: statuses[statusIndex],
      collectionStatus: collectionStatuses[statusIndex],
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      brand: template.brand,
      model: product.split(' ').slice(1).join(' ') || product,
      productType: template.subcategory,
      lotDisplayId: displayId,
      auctionDisplayId: `AUC-2026-${String(i + 1).padStart(3, '0')}`,
      agreementReference: `AGR-${2026}-${String(i + 1000).padStart(6, '0')}`,
      companyName: "TBAuctions",
      companyId: "TBA",
      category: template.category,
      subcategory: template.subcategory,
      sourceLanguage: i % 3 === 0 ? "en" : "nl",
      translated: i % 5 === 0,
      itemSource: i % 2 === 0 ? "Atlas" : "Site Manager",
      platform: i % 3 === 0 ? "Atlas" : "TWK",
      primaryImageUrl: template.image,
      imageGallery: [template.image],
      mediaUploaded: true,
      quantity: 1,
      weight: 10 + (i * 5),
      length: 50 + (i * 3),
      width: 40 + (i * 2),
      height: 30 + (i * 2),
      material: ["Wood", "Metal", "Fabric", "Leather", "Plastic"][i % 5],
      colour: ["Black", "White", "Brown", "Grey", "Blue"][i % 5],
      hsCode: ["9401.61", "8456.11", "9403.40", "8471.30", "8528.72"][i % 5],
      location: ["Amsterdam Warehouse", "Rotterdam Storage", "Eindhoven Industrial", "Utrecht Distribution", "Den Haag Facility"][i % 5],
      collectionWindow: "Mon-Fri 09:00-17:00",
      collectionContactInfo: "Contact warehouse for appointment",
      deliveryTerms: i % 2 === 0 ? "Buyer collection only" : "Delivery available",
      allocation: `Section ${String.fromCharCode(65 + (i % 10))}-${(i % 20) + 1}`,
      dayPartition: ["Morning", "Afternoon", "Full day"][i % 3],
      specialHandlingNotes: i % 3 === 0 ? "Heavy item - assistance required" : null,
      startingPrice: 100 + (i * 50),
      estimatedPrice: 500 + (i * 100),
      retailPrice: 1000 + (i * 200),
      currency: "EUR",
      saleType: i % 4 === 0 ? "Reserve price" : "No reserve price",
      vatRate: 21,
      marginGood: i % 2 === 0,
      bidDepositRequired: i % 5 === 0,
      additionalCosts: i % 3 === 0 ? 50 : 0,
      additionalCostsLabel: i % 3 === 0 ? "Handling fee" : null,
      sellerName: ["JC Furniture", "Industrial Surplus BV", "Estate Sales NL", "Commercial Clearance", "Professional Equipment"][i % 5],
      sellerId: `SEL-${String(i % 5 + 1).padStart(3, '0')}`,
      billingEntity: ["JC Furniture VOF", "Industrial Surplus BV", "Estate Sales NL BV", "Commercial Clearance BV", "Professional Equipment NL"][i % 5],
      agreementId: `AGR-2026-${(i % 10) + 1}`,
      agreementName: `${template.category} Sale Agreement`,
      storefront: ["Troostwijk Netherlands", "Troostwijk Industrial", "Troostwijk Art & Antiques"][i % 3],
      siteManager: ["Peter van Dijk", "Hans Mulder", "Lisa Bakker", "Marie-Claire Dubois", "Jan de Vries"][i % 5],
      auctionName: `${template.category} Auction - January 2026`,
      lotIdNumber: displayId,
      listingStatus: ["DRAFT", "READY_FOR_CHECKOUT", "COMPLETED"][statusIndex],
      closingDate: baseDate,
      publishingStatus: ["Draft", "Published", "Completed"][statusIndex],
      saleAttempt: 1,
      synced: statusIndex > 0,
      updatedBy: "admin@tbauctions.com",
    });
  }

  const itemsDataTyped = itemsData as any[];

  const createdItems: any[] = [];
  for (const item of itemsDataTyped) {
    const created = await storage.createItem(item);
    createdItems.push(created);
  }

  const historyEventsData = [
    {
      itemId: createdItems[0].id,
      eventType: "status_changed",
      eventTitle: "Status changed",
      eventDescription: "Item's status has changed to READY_FOR_CHECKOUT",
      eventDate: new Date("2026-01-04T20:46:00"),
      userId: "admin@tbauctions.com"
    },
    {
      itemId: createdItems[0].id,
      eventType: "lot_hammered",
      eventTitle: "Lot hammered down",
      eventDescription: "Lot 041-HZR has been hammered down automatically",
      eventDate: new Date("2026-01-04T20:46:00"),
      userId: "system"
    },
    {
      itemId: createdItems[0].id,
      eventType: "checkout_created",
      eventTitle: "Checkout created",
      eventDescription: "Checkout status READY for lot A1-38994-9",
      eventDate: new Date("2026-01-04T20:46:00"),
      userId: "system"
    },
    {
      itemId: createdItems[0].id,
      eventType: "bidding_closed",
      eventTitle: "Lot bidding closed",
      eventDescription: "Bidding finished for item 041-HZR on TWK platform with bid amount 960.00 EUR",
      eventDate: new Date("2026-01-04T20:46:00"),
      userId: "system"
    },
    {
      itemId: createdItems[0].id,
      eventType: "item_copied",
      eventTitle: "Item copied",
      eventDescription: "New item 042-4KF",
      eventDate: new Date("2026-01-02T09:05:00"),
      userId: "admin@tbauctions.com"
    },
    {
      itemId: createdItems[0].id,
      eventType: "status_changed",
      eventTitle: "Status changed",
      eventDescription: "Item's status has changed to RESERVED",
      eventDate: new Date("2025-12-24T11:10:00"),
      userId: "system"
    },
    {
      itemId: createdItems[0].id,
      eventType: "item_published",
      eventTitle: "Item published",
      eventDescription: "Item 041-HZR published for platform TWK with saleId A1-38994 with start date Dec 29, 2025 15:00 and end date Jan 04, 2026 19:48",
      eventDate: new Date("2025-12-24T11:10:00"),
      userId: "admin@tbauctions.com"
    },
    {
      itemId: createdItems[0].id,
      eventType: "item_updated",
      eventTitle: "Item updated",
      eventDescription: "Item has been updated.",
      eventDate: new Date("2025-12-24T11:10:00"),
      userId: "admin@tbauctions.com"
    },
    {
      itemId: createdItems[0].id,
      eventType: "item_updated",
      eventTitle: "Item updated",
      eventDescription: "Item has been updated.",
      eventDate: new Date("2025-12-24T11:07:00"),
      userId: "admin@tbauctions.com"
    },
    {
      itemId: createdItems[0].id,
      eventType: "item_updated",
      eventTitle: "Item updated",
      eventDescription: "Item has been updated.",
      eventDate: new Date("2025-12-24T10:52:00"),
      userId: "admin@tbauctions.com"
    },
    {
      itemId: createdItems[0].id,
      eventType: "item_created",
      eventTitle: "Item created",
      eventDescription: "Item 042-8HG was created from template",
      eventDate: new Date("2025-12-20T14:30:00"),
      userId: "admin@tbauctions.com"
    },
    {
      itemId: createdItems[2].id,
      eventType: "status_changed",
      eventTitle: "Status changed",
      eventDescription: "Item's status has changed to PAID",
      eventDate: new Date("2025-12-22T10:15:00"),
      userId: "system"
    },
    {
      itemId: createdItems[2].id,
      eventType: "payment_received",
      eventTitle: "Payment received",
      eventDescription: "Payment of 825.00 EUR received via bank transfer",
      eventDate: new Date("2025-12-22T10:14:00"),
      userId: "system"
    },
    {
      itemId: createdItems[2].id,
      eventType: "item_collected",
      eventTitle: "Item collected",
      eventDescription: "Item collected by buyer Marcus de Groot",
      eventDate: new Date("2025-12-23T14:00:00"),
      userId: "l.bakker@tbauctions.com"
    },
    {
      itemId: createdItems[3].id,
      eventType: "status_changed",
      eventTitle: "Status changed",
      eventDescription: "Item's status has changed to RESERVED",
      eventDate: new Date("2026-01-03T16:00:00"),
      userId: "system"
    },
    {
      itemId: createdItems[3].id,
      eventType: "bidding_closed",
      eventTitle: "Lot bidding closed",
      eventDescription: "Bidding finished for item 045-2MN on TWK platform with bid amount 47,500.00 EUR",
      eventDate: new Date("2026-01-03T16:00:00"),
      userId: "system"
    }
  ];

  for (const event of historyEventsData) {
    await storage.createHistoryEvent(event);
  }

  const notes = [
    {
      date: new Date("2025-12-19"),
      title: "Items Search: Returned to Inventory Status, Better Filters & Clearer Errors",
      content: `We've added a Returned to inventory status to item cards, making it easy to see when an item has previously been up for sale and is now back in inventory

Auto-suggest is now available for the Company name and Company ID filters, helping you quickly find and apply the right filter as you type

The item search error message has been improved to give clearer feedback when something goes wrong

A new Lot display ID filter has been added, so you can directly search for a specific lot by its display ID

We've fixed an issue where the calendar filter was displayed incorrectly in Safari`,
      tags: ["search", "ui"]
    },
    {
      date: new Date("2025-12-12"),
      title: "Get an exact Buyer match",
      content: `Get suggestions as you type into the Buyer Filter for name, email and phone number, so you can filter for exactly who you're looking for`,
      tags: ["search"]
    },
    {
      date: new Date("2025-12-10"),
      title: "Items Search: Storefront Links & Lot Visibility Filter, scroll to top",
      content: `Links to relevant storefronts have been added next to the lot display ID, so you can see what our customers see

If a lot is hidden from the storefront, we're now showing an icon next to the lot display ID to let you know

Similarly, we've also created a filter so you can isolate hidden lots if you need to find them

To help you return to the top of a long list quickly, we've added a 'scroll to top' button`,
      tags: ["search", "ui"]
    },
    {
      date: new Date("2025-12-05"),
      title: "Items search: Lot end date",
      content: `A new filter for lot end date has been added

Lot end date is displayed on the item card when available`,
      tags: ["search"]
    },
    {
      date: new Date("2025-12-03"),
      title: "Item card: Buyer blocked indicator",
      content: `If a buyer is blocked, an icon is now shown next to the buyer's name.`,
      tags: ["ui"]
    },
    {
      date: new Date("2025-11-28"),
      title: "Navigation improvements and faster movement between Atlas, Efficy, and key pages",
      content: `Auction IDs now link to both Atlas & Efficy

Introduced 'sticky' pagination that stays visible while scrolling and remembers your last page-size preference

Item IDs now link directly through to Atlas`,
      tags: ["ui", "search"]
    },
    {
      date: new Date("2025-11-20"),
      title: "Items search: Buyer phone number",
      content: `Items can now be searched by buyer phone number

Buyer phone number is displayed on the item card when available

A new filter for buyer phone number has been added`,
      tags: ["search"]
    },
    {
      date: new Date("2025-11-13"),
      title: "New filter for items search",
      content: `Items can now be filtered by collection status

Filter by collection status is now available in the filter modal

Collection status is also visible in the item card when applicable`,
      tags: ["search"]
    },
    {
      date: new Date("2025-11-11"),
      title: "Light and dark mode",
      content: `We've added the ability to switch from light to dark mode. The Default is using your system settings.

Added theming`,
      tags: ["ui"]
    },
    {
      date: new Date("2025-11-10"),
      title: "Pagination, more links and search improvements",
      content: `You can now browse results across multiple pages, select more links in the item card and more easily manage your searches

Buyer name and email now link directly to the Atlas Buyer details page

Invoice numbers now link to the Atlas Invoice filtered results page

Select how many results to display per page

Navigate quickly between pages to find exactly what you need

Search bar now is clearable with an X button

Search filter by brand is now available`,
      tags: ["search"]
    },
    {
      date: new Date("2025-11-05"),
      title: "Improved functionality in item search results",
      content: `Company links now point to the company overview page in ATLAS

General UI improvements in item search results

Copy button on hover for information fields in the item search results

Search results are not shown for empty queries without filters and a message is displayed instead`,
      tags: ["search"]
    },
    {
      date: new Date("2025-11-03"),
      title: "Buyer email search and new navigation",
      content: `We've added the ability to search for buyer emails.

Search buyer emails

Refined left navigation`,
      tags: ["buyers", "ui"]
    },
    {
      date: new Date("2025-10-28"),
      title: "New filters in Items Search",
      content: `We have added new filters to the Items Search feature to help you refine your search results more effectively.

Filter by Buyer Name

Filter by Buyer Email

Filter by Company Name

Filter by Company ID

Filter by Agreement Reference`,
      tags: ["search"]
    },
    {
      date: new Date("2025-10-24"),
      title: "New searchable field: Item title",
      content: `We've added the ability to search for Item Titles in their source language. Enjoy!`,
      tags: ["search"]
    },
    {
      date: new Date("2025-10-15"),
      title: "Welcome to Atlas Back Office Search",
      content: `This is the very first version of Atlas Back Office Search: a new tool designed to help you find what you need more easily on Atlas. We're starting simple and building iteratively, with regular updates and new features to come.

In this first version, you can:

Quickly find Items using search

View key information directly in item cards

Click through to start workflows in Atlas

Thanks for trying it out - and stay tuned for improvements coming soon.`,
      tags: ["search", "ui"]
    }
  ];

  for (const note of notes) {
    await storage.createReleaseNote(note);
  }
}

export async function seedBuyers() {
  const schema = await import("@shared/schema");
  const buyersTable = schema.buyers;
  const buyerInvoices = schema.buyerInvoices;
  const paymentOrders = schema.paymentOrders;
  const { db } = await import("./db");

  try {
    // Create buyers first (items reference these by ID 1-5)
    const buyersData = [
      {
        buyerId: "BUY-001",
        name: "Thibaut Ickx",
        email: "t.ickx@bedrijf.be",
        phone: "+32 478 55 12 34",
        accountType: "Company",
        companyName: "Bedrijf BVBA",
        buyerStatus: "Buyer",
        country: "Belgium"
      },
      {
        buyerId: "BUY-002",
        name: "Emma Janssen",
        email: "e.janssen@example.nl",
        phone: "+31 6 12345678",
        accountType: "Private",
        companyName: null,
        buyerStatus: "Buyer",
        country: "Netherlands"
      },
      {
        buyerId: "BUY-003",
        name: "Marcus de Groot",
        email: "m.degroot@zakelijk.nl",
        phone: "+31 6 98765432",
        accountType: "Company",
        companyName: "De Groot Trading BV",
        buyerStatus: "Buyer",
        country: "Netherlands",
        riskAssessment: "Approved",
        storefront: "TBAuctions Netherlands",
        dateOfBirth: new Date('1985-06-15'),
        chamberOfCommerceNumber: "12345678",
        vatVerifiedDate: new Date('2023-01-10'),
        addressLine1: "Keizersgracht 123",
        city: "Amsterdam",
        postalCode: "1015 CJ",
        outstandingBalance: 1250.50,
        paymentOrdersCount: 3,
        lotsAwaitingCheckout: 1,
        notes: "High-value customer since 2020. Prefers pickup for logistics."
      },
      {
        buyerId: "BUY-004",
        name: "Precision Parts BV",
        email: "inkoop@precisionparts.nl",
        phone: "+31 40 1234567",
        accountType: "Company",
        companyName: "Precision Parts BV",
        buyerStatus: "Buyer",
        country: "Netherlands"
      },
      {
        buyerId: "BUY-005",
        name: "Galerie Amsterdam",
        email: "acquisitions@galerie-adam.nl",
        phone: "+31 20 7654321",
        accountType: "Company",
        companyName: "Galerie Amsterdam BV",
        buyerStatus: "Buyer",
        country: "Netherlands"
      }
    ];

    // Insert all buyers
    const insertedBuyers = await db.insert(buyersTable).values(buyersData).returning();
    
    // Find Marcus (buyer 3) for invoices and payment orders
    const marcus = insertedBuyers.find(b => b.email === 'm.degroot@zakelijk.nl');
    
    if (marcus) {
      // Add 3 invoices for Marcus
      await db.insert(buyerInvoices).values([
        {
          buyerId: marcus.id,
          invoiceNumber: 'INV-2023-001',
          poNumber: 'PO-998877',
          amount: 4500.00,
          currency: 'EUR',
          status: 'Paid',
          invoiceDate: new Date('2023-11-10')
        },
        {
          buyerId: marcus.id,
          invoiceNumber: 'INV-2023-002',
          poNumber: 'PO-998878',
          amount: 1250.50,
          currency: 'EUR',
          status: 'Pending',
          invoiceDate: new Date('2023-12-05')
        },
        {
          buyerId: marcus.id,
          invoiceNumber: 'INV-2023-003',
          poNumber: 'PO-998879',
          amount: 890.00,
          currency: 'EUR',
          status: 'Paid',
          invoiceDate: new Date('2023-12-20')
        }
      ]);

      // Add 3 payment orders for Marcus
      await db.insert(paymentOrders).values([
        {
          buyerId: marcus.id,
          poNumber: 'PO-998877',
          invoiceNumber: 'INV-2023-001',
          amount: 4500.00,
          currency: 'EUR',
          status: 'Paid',
          orderDate: new Date('2023-11-05')
        },
        {
          buyerId: marcus.id,
          poNumber: 'PO-998878',
          invoiceNumber: 'INV-2023-002',
          amount: 1250.50,
          currency: 'EUR',
          status: 'Pending',
          orderDate: new Date('2023-12-01')
        },
        {
          buyerId: marcus.id,
          poNumber: 'PO-998879',
          invoiceNumber: 'INV-2023-003',
          amount: 890.00,
          currency: 'EUR',
          status: 'Paid',
          orderDate: new Date('2023-12-15')
        }
      ]);
    }
    console.log("Buyers and related data seeded successfully");
    // Return buyer IDs in order for seedDatabase to use
    return insertedBuyers.map(b => b.id);
  } catch (error) {
    console.error("Error seeding buyers:", error);
    throw error;
  }
}
