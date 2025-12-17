import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Puppies table
export const puppies = pgTable("puppies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  breed: text("breed").notNull(), // "Mini Goldendoodle", "Teacup Goldendoodle", "Mini Bernedoodle", etc.
  color: text("color").notNull(),
  gender: text("gender").notNull(), // "Male" or "Female"
  price: integer("price").notNull(),
  status: text("status").notNull().default("Available"), // "Available", "Reserved", "Sold"
  imageSrc: text("image_src"),
  birthDate: text("birth_date"),
  litterId: varchar("litter_id"),
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
  status: text("status").notNull().default("Upcoming"), // "Upcoming", "Born", "Selection Open", "Sold Out"
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
  breedType: text("breed_type").notNull(), // "Goldendoodle" or "Bernedoodle"
  amount: integer("amount").notNull(), // In cents
  paymentMethod: text("payment_method").notNull(), // "paypal", "cashapp", "zelle", "applepay", "crypto"
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "completed", "failed", "refunded"
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

// Payment Methods table - stores payment details for different methods
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  method: text("method").notNull().unique(), // "cashapp", "zelle", "applepay", "crypto"
  displayName: text("display_name").notNull(), // "Cash App", "Zelle", etc
  name: text("name"), // Account holder name
  accountInfo: text("account_info"), // Tag, account number, email, wallet address, etc
  instructions: text("instructions"), // Payment instructions
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  updatedAt: true,
});

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

// Email Settings table - stores email configuration
export const emailSettings = pgTable("email_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderEmail: text("sender_email").notNull(), // Email address to send from
  senderName: text("sender_name"), // Display name for emails
  provider: text("provider").notNull(), // "sendgrid", "gmail", "custom"
  apiKey: text("api_key"), // SendGrid API key
  gmailEmail: text("gmail_email"), // Gmail address
  gmailPassword: text("gmail_password"), // Gmail app password
  smtpHost: text("smtp_host"), // SMTP host for custom
  smtpPort: integer("smtp_port"), // SMTP port
  smtpUsername: text("smtp_username"), // SMTP username
  smtpPassword: text("smtp_password"), // SMTP password
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmailSettingsSchema = createInsertSchema(emailSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertEmailSettings = z.infer<typeof insertEmailSettingsSchema>;
export type EmailSettings = typeof emailSettings.$inferSelect;
