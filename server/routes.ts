import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPuppySchema, insertLitterSchema, insertDepositSchema, insertMailingListSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ PUPPIES ============
  
  // Get all puppies
  app.get("/api/puppies", async (req, res) => {
    try {
      const allPuppies = await storage.getAllPuppies();
      res.json(allPuppies);
    } catch (error) {
      console.error("Error fetching puppies:", error);
      res.status(500).json({ error: "Failed to fetch puppies" });
    }
  });

  // Get single puppy
  app.get("/api/puppies/:id", async (req, res) => {
    try {
      const puppy = await storage.getPuppyById(req.params.id);
      if (!puppy) {
        return res.status(404).json({ error: "Puppy not found" });
      }
      res.json(puppy);
    } catch (error) {
      console.error("Error fetching puppy:", error);
      res.status(500).json({ error: "Failed to fetch puppy" });
    }
  });

  // Create puppy
  app.post("/api/puppies", async (req, res) => {
    try {
      const parsed = insertPuppySchema.parse(req.body);
      const puppy = await storage.createPuppy(parsed);
      res.status(201).json(puppy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid puppy data", details: error.errors });
      }
      console.error("Error creating puppy:", error);
      res.status(500).json({ error: "Failed to create puppy" });
    }
  });

  // Update puppy
  app.patch("/api/puppies/:id", async (req, res) => {
    try {
      const puppy = await storage.updatePuppy(req.params.id, req.body);
      if (!puppy) {
        return res.status(404).json({ error: "Puppy not found" });
      }
      res.json(puppy);
    } catch (error) {
      console.error("Error updating puppy:", error);
      res.status(500).json({ error: "Failed to update puppy" });
    }
  });

  // Delete puppy
  app.delete("/api/puppies/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePuppy(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Puppy not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting puppy:", error);
      res.status(500).json({ error: "Failed to delete puppy" });
    }
  });

  // ============ LITTERS ============

  // Get all litters
  app.get("/api/litters", async (req, res) => {
    try {
      const allLitters = await storage.getAllLitters();
      res.json(allLitters);
    } catch (error) {
      console.error("Error fetching litters:", error);
      res.status(500).json({ error: "Failed to fetch litters" });
    }
  });

  // Get single litter
  app.get("/api/litters/:id", async (req, res) => {
    try {
      const litter = await storage.getLitterById(req.params.id);
      if (!litter) {
        return res.status(404).json({ error: "Litter not found" });
      }
      res.json(litter);
    } catch (error) {
      console.error("Error fetching litter:", error);
      res.status(500).json({ error: "Failed to fetch litter" });
    }
  });

  // Create litter
  app.post("/api/litters", async (req, res) => {
    try {
      const parsed = insertLitterSchema.parse(req.body);
      const litter = await storage.createLitter(parsed);
      res.status(201).json(litter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid litter data", details: error.errors });
      }
      console.error("Error creating litter:", error);
      res.status(500).json({ error: "Failed to create litter" });
    }
  });

  // Update litter
  app.patch("/api/litters/:id", async (req, res) => {
    try {
      const litter = await storage.updateLitter(req.params.id, req.body);
      if (!litter) {
        return res.status(404).json({ error: "Litter not found" });
      }
      res.json(litter);
    } catch (error) {
      console.error("Error updating litter:", error);
      res.status(500).json({ error: "Failed to update litter" });
    }
  });

  // Delete litter
  app.delete("/api/litters/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLitter(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Litter not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting litter:", error);
      res.status(500).json({ error: "Failed to delete litter" });
    }
  });

  // ============ DEPOSITS ============

  // Get all deposits
  app.get("/api/deposits", async (req, res) => {
    try {
      const allDeposits = await storage.getAllDeposits();
      res.json(allDeposits);
    } catch (error) {
      console.error("Error fetching deposits:", error);
      res.status(500).json({ error: "Failed to fetch deposits" });
    }
  });

  // Get single deposit
  app.get("/api/deposits/:id", async (req, res) => {
    try {
      const deposit = await storage.getDepositById(req.params.id);
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }
      res.json(deposit);
    } catch (error) {
      console.error("Error fetching deposit:", error);
      res.status(500).json({ error: "Failed to fetch deposit" });
    }
  });

  // Create deposit
  app.post("/api/deposits", async (req, res) => {
    try {
      const parsed = insertDepositSchema.parse(req.body);
      const deposit = await storage.createDeposit(parsed);
      res.status(201).json(deposit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid deposit data", details: error.errors });
      }
      console.error("Error creating deposit:", error);
      res.status(500).json({ error: "Failed to create deposit" });
    }
  });

  // Update deposit
  app.patch("/api/deposits/:id", async (req, res) => {
    try {
      const deposit = await storage.updateDeposit(req.params.id, req.body);
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }
      res.json(deposit);
    } catch (error) {
      console.error("Error updating deposit:", error);
      res.status(500).json({ error: "Failed to update deposit" });
    }
  });

  // ============ MAILING LIST ============

  // Subscribe to mailing list
  app.post("/api/mailing-list", async (req, res) => {
    try {
      const parsed = insertMailingListSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getMailingListByEmail(parsed.email);
      if (existing) {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      
      const entry = await storage.addToMailingList(parsed);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email data", details: error.errors });
      }
      console.error("Error subscribing to mailing list:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  return httpServer;
}
