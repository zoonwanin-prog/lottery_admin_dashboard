import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Lottery Types
export const lotteryTypes = mysqlTable("lottery_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull(), // Thai Govt, Laos, Hanoi, Stock
  code: varchar("code", { length: 20 }).notNull().unique(), // thai-govt, laos, hanoi, stock
  icon: varchar("icon", { length: 10 }), // emoji or icon identifier
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LotteryType = typeof lotteryTypes.$inferSelect;
export type InsertLotteryType = typeof lotteryTypes.$inferInsert;

// Payout Rates for each lottery type
export const payoutRates = mysqlTable("payout_rates", {
  id: int("id").autoincrement().primaryKey(),
  lotteryTypeId: int("lottery_type_id").notNull().references(() => lotteryTypes.id),
  rateType: varchar("rate_type", { length: 64 }).notNull(), // "3 Digits Top", "2 Digits Bottom", etc.
  rate: int("rate").notNull(), // e.g., 800 for 3-digit top
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PayoutRate = typeof payoutRates.$inferSelect;
export type InsertPayoutRate = typeof payoutRates.$inferInsert;

// Closed Numbers (blocked numbers for each lottery)
export const closedNumbers = mysqlTable("closed_numbers", {
  id: int("id").autoincrement().primaryKey(),
  lotteryTypeId: int("lottery_type_id").notNull().references(() => lotteryTypes.id),
  number: varchar("number", { length: 10 }).notNull(), // 3-digit or 2-digit number
  type: mysqlEnum("type", ["closed", "half-pay"]).default("closed").notNull(), // closed or half-pay (50%)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClosedNumber = typeof closedNumbers.$inferSelect;
export type InsertClosedNumber = typeof closedNumbers.$inferInsert;

// Yee-Kee Rounds (5-minute or 15-minute draws)
export const yeeKeeRounds = mysqlTable("yee_kee_rounds", {
  id: int("id").autoincrement().primaryKey(),
  roundNumber: int("round_number").notNull(),
  drawTime: timestamp("draw_time").notNull(),
  result: varchar("result", { length: 5 }), // 5-digit result like "12345"
  totalBets: int("total_bets").default(0).notNull(),
  targetProfitPercentage: int("target_profit_percentage").default(50).notNull(),
  targetProfit: int("target_profit").default(0).notNull(),
  actualProfit: int("actual_profit").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "active", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type YeeKeeRound = typeof yeeKeeRounds.$inferSelect;
export type InsertYeeKeeRound = typeof yeeKeeRounds.$inferInsert;

// Bets placed by members
export const bets = mysqlTable("bets", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("member_id").notNull().references(() => users.id),
  lotteryTypeId: int("lottery_type_id").notNull().references(() => lotteryTypes.id),
  yeeKeeRoundId: int("yee_kee_round_id").references(() => yeeKeeRounds.id), // null if not yee-kee
  betNumber: varchar("bet_number", { length: 10 }).notNull(),
  betAmount: int("bet_amount").notNull(),
  rateType: varchar("rate_type", { length: 64 }).notNull(),
  multiplier: int("multiplier").default(1).notNull(),
  status: mysqlEnum("status", ["pending", "won", "lost", "cancelled"]).default("pending").notNull(),
  winAmount: int("win_amount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bet = typeof bets.$inferSelect;
export type InsertBet = typeof bets.$inferInsert;

// Members (users who can place bets)
export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  username: varchar("username", { length: 64 }).notNull().unique(),
  balance: int("balance").default(0).notNull(), // in satang or smallest unit
  credit: int("credit").default(0).notNull(),
  status: mysqlEnum("status", ["active", "suspended", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

// Transactions (deposits, withdrawals, winnings)
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("member_id").notNull().references(() => members.id),
  type: mysqlEnum("type", ["deposit", "withdrawal", "win", "loss", "adjustment"]).notNull(),
  amount: int("amount").notNull(),
  description: text("description"),
  relatedBetId: int("related_bet_id").references(() => bets.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Admin Settings
export const adminSettings = mysqlTable("admin_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = typeof adminSettings.$inferInsert;