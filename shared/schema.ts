import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  role: text("role").notNull().default("viewer"), // "admin", "manager", "viewer"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Puppies table
export const puppies = pgTable("puppies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  color: text("color").notNull(),
  gender: text("gender").notNull(),
  price: integer("price").notNull(),
  status: text("status").notNull().default("Available"),
  imageSrc: text("image_src"),
  birthDate: text("birth_date"),
  litterId: varchar("litter_id"),
  description: text("description"),
  weight: text("weight"),
  personality: text("personality"),
  vaccinated: boolean("vaccinated").default(false),
  microchipped: boolean("microchipped").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPuppySchema = createInsertSchema(puppies).omit({
  id: true,
  createdAt: true,
});

export type InsertPuppy = z.infer<typeof insertPuppySchema>;
export type Puppy = typeof puppies.$inferSelect;

// Litters table
export const litters = pgTable("litters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  motherName: text("mother_name").notNull(),
  fatherName: text("father_name").notNull(),
  breed: text("breed").notNull(),
  expectedDate: text("expected_date").notNull(),
  spotsAvailable: integer("spots_available").notNull(),
  totalSpots: integer("total_spots").notNull(),
  price: integer("price").notNull(),
  status: text("status").notNull().default("Upcoming"),
  description: text("description"),
  imageSrc: text("image_src"),
  motherImageSrc: text("mother_image_src"),
  fatherImageSrc: text("father_image_src"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLitterSchema = createInsertSchema(litters).omit({
  id: true,
  createdAt: true,
});

export type InsertLitter = z.infer<typeof insertLitterSchema>;
export type Litter = typeof litters.$inferSelect;

// Deposits table
export const deposits = pgTable("deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  puppyId: varchar("puppy_id"),
  litterId: varchar("litter_id"),
  breedType: text("breed_type").notNull(),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  paypalOrderId: text("paypal_order_id"),
  cryptoAddress: text("crypto_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
});

export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Deposit = typeof deposits.$inferSelect;

// Mailing list subscriptions
export const mailingList = pgTable("mailing_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  miniGoldendoodles: boolean("mini_goldendoodles").default(false),
  teacupGoldendoodles: boolean("teacup_goldendoodles").default(false),
  miniBernedoodles: boolean("mini_bernedoodles").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMailingListSchema = createInsertSchema(mailingList).omit({
  id: true,
  createdAt: true,
});

export type InsertMailingList = z.infer<typeof insertMailingListSchema>;
export type MailingListEntry = typeof mailingList.$inferSelect;

// Payment Methods table
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  method: text("method").notNull().unique(),
  displayName: text("display_name").notNull(),
  name: text("name"),
  accountInfo: text("account_info"),
  instructions: text("instructions"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  updatedAt: true,
});

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

// Email Settings table
export const emailSettings = pgTable("email_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderEmail: text("sender_email").notNull(),
  senderName: text("sender_name"),
  provider: text("provider").notNull(),
  apiKey: text("api_key"),
  gmailEmail: text("gmail_email"),
  gmailPassword: text("gmail_password"),
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port"),
  smtpUsername: text("smtp_username"),
  smtpPassword: text("smtp_password"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmailSettingsSchema = createInsertSchema(emailSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertEmailSettings = z.infer<typeof insertEmailSettingsSchema>;
export type EmailSettings = typeof emailSettings.$inferSelect;

// Notifications table for admin alerts
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "new_deposit", "new_inquiry", "payment_completed"
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: varchar("related_id"), // ID of deposit, puppy, etc.
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Site Settings table for general configuration
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
