import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { meals } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  const { id } = await params;
  const body = await req.json();
  const { name, description } = body as { name: string; description?: string };
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const [meal] = await db
    .update(meals)
    .set({ name: name.trim(), description })
    .where(eq(meals.id, Number(id)))
    .returning();
  return NextResponse.json(meal);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  const { id } = await params;
  await db.delete(meals).where(eq(meals.id, Number(id)));
  return new NextResponse(null, { status: 204 });
}
