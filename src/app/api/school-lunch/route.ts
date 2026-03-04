import { NextRequest, NextResponse } from "next/server";
import { fetchSchoolLunches } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const week = Number(req.nextUrl.searchParams.get("week"));
  if (!week) return NextResponse.json({ error: "Missing week param" }, { status: 400 });

  try {
    const lunches = await fetchSchoolLunches(week);
    return NextResponse.json(lunches);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch school lunch" }, { status: 500 });
  }
}
