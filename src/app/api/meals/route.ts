import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { meals } from "../../../../drizzle/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const all = await db.select().from(meals).orderBy(asc(meals.name));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { name, description } = body as { name: string; description?: string };
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const [meal] = await db.insert(meals).values({ name: name.trim(), description }).returning();
  return NextResponse.json(meal, { status: 201 });
}
