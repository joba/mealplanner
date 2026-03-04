import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { dinnerPlan } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  const { id } = await params;
  await db.delete(dinnerPlan).where(eq(dinnerPlan.id, Number(id)));
  return new NextResponse(null, { status: 204 });
}
