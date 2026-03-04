import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { dinnerPlan, meals } from "../../../../drizzle/schema";
import { and, gte, lte, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = getDb();
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  if (!from || !to) return NextResponse.json({ error: "Missing from/to params" }, { status: 400 });

  const rows = await db
    .select({
      id: dinnerPlan.id,
      date: dinnerPlan.date,
      mealId: dinnerPlan.mealId,
      mealName: meals.name,
      customMeal: dinnerPlan.customMeal,
      notes: dinnerPlan.notes,
    })
    .from(dinnerPlan)
    .leftJoin(meals, eq(dinnerPlan.mealId, meals.id))
    .where(and(gte(dinnerPlan.date, from), lte(dinnerPlan.date, to)));

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { date, mealId, customMeal, notes } = body as {
    date: string;
    mealId?: number | null;
    customMeal?: string;
    notes?: string;
  };
  if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

  const [row] = await db
    .insert(dinnerPlan)
    .values({ date, mealId: mealId ?? null, customMeal, notes })
    .onConflictDoUpdate({
      target: dinnerPlan.date,
      set: { mealId: mealId ?? null, customMeal, notes },
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
