import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPuppySchema, insertLitterSchema, insertDepositSchema, insertMailingListSchema, insertPaymentMethodSchema, insertEmailSettingsSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

const SessionStore = MemoryStore(session);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.session.userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }
  next();
}

function requireManager(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.session.userRole !== "admin" && req.session.userRole !== "manager") {
    return res.status(403).json({ error: "Forbidden - Manager access required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET environment variable is required for security");
  }

  const isProduction = process.env.NODE_ENV === "production";
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
      },
    })
  );

  // ============ AUTHENTICATION ============

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: "Account is disabled" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await storage.updateUserLastLogin(user.id);
      
      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json(null);
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.json(null);
    }

    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    });
  });

  // ============ USERS (Admin only) ============

  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const safeUsers = allUsers.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const { username, password, displayName, role } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        displayName: displayName || username,
        role: role || "viewer",
      });

      res.status(201).json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const { password, ...updates } = req.body;
      
      if (password) {
        updates.password = await bcrypt.hash(password, 10);
      }

      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        isActive: user.isActive,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      if (req.params.id === req.session.userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Setup initial admin account if none exists
  app.post("/api/auth/setup", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      if (allUsers.length > 0) {
        return res.status(400).json({ error: "Admin already exists" });
      }

      const { username, password, displayName } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        displayName: displayName || "Admin",
        role: "admin",
      });

      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.status(201).json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ error: "Setup failed" });
    }
  });

  app.get("/api/auth/needs-setup", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json({ needsSetup: allUsers.length === 0 });
    } catch (error) {
      res.json({ needsSetup: true });
    }
  });

  // ============ NOTIFICATIONS ============

  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const allNotifications = await storage.getAllNotifications();
      res.json(allNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread", requireAuth, async (req, res) => {
    try {
      const unread = await storage.getUnreadNotifications();
      res.json(unread);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification read:", error);
      res.status(500).json({ error: "Failed to mark notification read" });
    }
  });

  app.post("/api/notifications/read-all", requireAuth, async (req, res) => {
    try {
      await storage.markAllNotificationsRead();
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications read:", error);
      res.status(500).json({ error: "Failed to mark notifications read" });
    }
  });

  app.delete("/api/notifications/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteNotification(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // ============ PUPPIES ============
  
  app.get("/api/puppies", async (req, res) => {
    try {
      const allPuppies = await storage.getAllPuppies();
      res.json(allPuppies);
    } catch (error) {
      console.error("Error fetching puppies:", error);
      res.status(500).json({ error: "Failed to fetch puppies" });
    }
  });

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

  app.post("/api/puppies", requireManager, async (req, res) => {
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

  app.patch("/api/puppies/:id", requireManager, async (req, res) => {
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

  app.delete("/api/puppies/:id", requireManager, async (req, res) => {
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

  app.get("/api/litters", async (req, res) => {
    try {
      const allLitters = await storage.getAllLitters();
      res.json(allLitters);
    } catch (error) {
      console.error("Error fetching litters:", error);
      res.status(500).json({ error: "Failed to fetch litters" });
    }
  });

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

  app.post("/api/litters", requireManager, async (req, res) => {
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

  app.patch("/api/litters/:id", requireManager, async (req, res) => {
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

  app.delete("/api/litters/:id", requireManager, async (req, res) => {
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

  app.get("/api/deposits", requireAuth, async (req, res) => {
    try {
      const allDeposits = await storage.getAllDeposits();
      res.json(allDeposits);
    } catch (error) {
      console.error("Error fetching deposits:", error);
      res.status(500).json({ error: "Failed to fetch deposits" });
    }
  });

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

  app.post("/api/deposits", async (req, res) => {
    try {
      const parsed = insertDepositSchema.parse(req.body);
      const deposit = await storage.createDeposit(parsed);
      
      await storage.createNotification({
        type: "new_deposit",
        title: "New Deposit Received",
        message: `${parsed.customerName} submitted a ${parsed.breedType} deposit of $${(parsed.amount / 100).toFixed(2)} via ${parsed.paymentMethod}`,
        relatedId: deposit.id,
        isRead: false,
      });
      
      res.status(201).json(deposit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid deposit data", details: error.errors });
      }
      console.error("Error creating deposit:", error);
      res.status(500).json({ error: "Failed to create deposit" });
    }
  });

  app.patch("/api/deposits/:id", requireManager, async (req, res) => {
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

  app.get("/api/mailing-list", requireAuth, async (req, res) => {
    try {
      const entries = await storage.getAllMailingList();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching mailing list:", error);
      res.status(500).json({ error: "Failed to fetch mailing list" });
    }
  });

  app.post("/api/mailing-list", async (req, res) => {
    try {
      const parsed = insertMailingListSchema.parse(req.body);
      
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

  // ============ PAYPAL ============

  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // ============ PAYMENT METHODS ============

  app.get("/api/payment-methods", async (req, res) => {
    try {
      const methods = await storage.getAllPaymentMethods();
      res.json(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  });

  app.get("/api/payment-methods/:method", async (req, res) => {
    try {
      const method = await storage.getPaymentMethod(req.params.method);
      if (!method) {
        return res.status(404).json({ error: "Payment method not found" });
      }
      res.json(method);
    } catch (error) {
      console.error("Error fetching payment method:", error);
      res.status(500).json({ error: "Failed to fetch payment method" });
    }
  });

  app.post("/api/payment-methods", requireManager, async (req, res) => {
    try {
      const parsed = insertPaymentMethodSchema.parse(req.body);
      const method = await storage.createPaymentMethod(parsed);
      res.status(201).json(method);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid payment method data", details: error.errors });
      }
      console.error("Error creating payment method:", error);
      res.status(500).json({ error: "Failed to create payment method" });
    }
  });

  app.patch("/api/payment-methods/:method", requireManager, async (req, res) => {
    try {
      const method = await storage.updatePaymentMethod(req.params.method, req.body);
      if (!method) {
        return res.status(404).json({ error: "Payment method not found" });
      }
      res.json(method);
    } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({ error: "Failed to update payment method" });
    }
  });

  app.delete("/api/payment-methods/:method", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deletePaymentMethod(req.params.method);
      if (!deleted) {
        return res.status(404).json({ error: "Payment method not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      res.status(500).json({ error: "Failed to delete payment method" });
    }
  });

  // ============ EMAIL SETTINGS ============

  app.get("/api/email-settings", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getEmailSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching email settings:", error);
      res.status(500).json({ error: "Failed to fetch email settings" });
    }
  });

  app.post("/api/email-settings", requireAdmin, async (req, res) => {
    try {
      const parsed = insertEmailSettingsSchema.parse(req.body);
      const existingSettings = await storage.getEmailSettings();
      
      let settings;
      if (existingSettings) {
        settings = await storage.updateEmailSettings(parsed);
      } else {
        settings = await storage.createEmailSettings(parsed);
      }
      res.status(201).json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email settings", details: error.errors });
      }
      console.error("Error saving email settings:", error);
      res.status(500).json({ error: "Failed to save email settings" });
    }
  });

  app.patch("/api/email-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.updateEmailSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error("Error updating email settings:", error);
      res.status(500).json({ error: "Failed to update email settings" });
    }
  });

  return httpServer;
}
