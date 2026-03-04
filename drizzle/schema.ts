import { pgTable, serial, text, date, integer, timestamp } from "drizzle-orm/pg-core";

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dinnerPlan = pgTable("dinner_plan", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  mealId: integer("meal_id").references(() => meals.id, { onDelete: "set null" }),
  customMeal: text("custom_meal"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});
