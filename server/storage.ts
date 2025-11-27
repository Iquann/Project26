import { 
  type User, type InsertUser,
  type Puppy, type InsertPuppy,
  type Litter, type InsertLitter,
  type Deposit, type InsertDeposit,
  type MailingListEntry, type InsertMailingList,
  users, puppies, litters, deposits, mailingList
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Puppies
  getAllPuppies(): Promise<Puppy[]>;
  getPuppyById(id: string): Promise<Puppy | undefined>;
  createPuppy(puppy: InsertPuppy): Promise<Puppy>;
  updatePuppy(id: string, puppy: Partial<InsertPuppy>): Promise<Puppy | undefined>;
  deletePuppy(id: string): Promise<boolean>;
  
  // Litters
  getAllLitters(): Promise<Litter[]>;
  getLitterById(id: string): Promise<Litter | undefined>;
  getLittersByBreed(breed: string): Promise<Litter[]>;
  createLitter(litter: InsertLitter): Promise<Litter>;
  updateLitter(id: string, litter: Partial<InsertLitter>): Promise<Litter | undefined>;
  deleteLitter(id: string): Promise<boolean>;
  
  // Deposits
  getAllDeposits(): Promise<Deposit[]>;
  getDepositById(id: string): Promise<Deposit | undefined>;
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  updateDeposit(id: string, deposit: Partial<InsertDeposit>): Promise<Deposit | undefined>;
  
  // Mailing List
  addToMailingList(entry: InsertMailingList): Promise<MailingListEntry>;
  getMailingListByEmail(email: string): Promise<MailingListEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Puppies
  async getAllPuppies(): Promise<Puppy[]> {
    return db.select().from(puppies);
  }

  async getPuppyById(id: string): Promise<Puppy | undefined> {
    const [puppy] = await db.select().from(puppies).where(eq(puppies.id, id));
    return puppy;
  }

  async createPuppy(insertPuppy: InsertPuppy): Promise<Puppy> {
    const [puppy] = await db.insert(puppies).values(insertPuppy).returning();
    return puppy;
  }

  async updatePuppy(id: string, updates: Partial<InsertPuppy>): Promise<Puppy | undefined> {
    const [puppy] = await db.update(puppies).set(updates).where(eq(puppies.id, id)).returning();
    return puppy;
  }

  async deletePuppy(id: string): Promise<boolean> {
    const result = await db.delete(puppies).where(eq(puppies.id, id)).returning();
    return result.length > 0;
  }

  // Litters
  async getAllLitters(): Promise<Litter[]> {
    return db.select().from(litters);
  }

  async getLitterById(id: string): Promise<Litter | undefined> {
    const [litter] = await db.select().from(litters).where(eq(litters.id, id));
    return litter;
  }

  async getLittersByBreed(breed: string): Promise<Litter[]> {
    return db.select().from(litters).where(eq(litters.breed, breed));
  }

  async createLitter(insertLitter: InsertLitter): Promise<Litter> {
    const [litter] = await db.insert(litters).values(insertLitter).returning();
    return litter;
  }

  async updateLitter(id: string, updates: Partial<InsertLitter>): Promise<Litter | undefined> {
    const [litter] = await db.update(litters).set(updates).where(eq(litters.id, id)).returning();
    return litter;
  }

  async deleteLitter(id: string): Promise<boolean> {
    const result = await db.delete(litters).where(eq(litters.id, id)).returning();
    return result.length > 0;
  }

  // Deposits
  async getAllDeposits(): Promise<Deposit[]> {
    return db.select().from(deposits);
  }

  async getDepositById(id: string): Promise<Deposit | undefined> {
    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, id));
    return deposit;
  }

  async createDeposit(insertDeposit: InsertDeposit): Promise<Deposit> {
    const [deposit] = await db.insert(deposits).values(insertDeposit).returning();
    return deposit;
  }

  async updateDeposit(id: string, updates: Partial<InsertDeposit>): Promise<Deposit | undefined> {
    const [deposit] = await db.update(deposits).set(updates).where(eq(deposits.id, id)).returning();
    return deposit;
  }

  // Mailing List
  async addToMailingList(entry: InsertMailingList): Promise<MailingListEntry> {
    const [result] = await db.insert(mailingList).values(entry).returning();
    return result;
  }

  async getMailingListByEmail(email: string): Promise<MailingListEntry | undefined> {
    const [entry] = await db.select().from(mailingList).where(eq(mailingList.email, email));
    return entry;
  }
}

export const storage = new DatabaseStorage();
