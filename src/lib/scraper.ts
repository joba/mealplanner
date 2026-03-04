export interface DayLunch {
  date: string; // ISO yyyy-mm-dd
  weekday: string; // e.g. "Måndag"
  weekNumber: number;
  meals: string[];
}

const LUNCH_KEYWORDS = ["lunch", "lunch 1", "lunch1"];

export async function fetchSchoolLunches(weekNumber: number): Promise<DayLunch[]> {
  const url = process.env.SCHOOL_LUNCH_URL!;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch school lunch page: ${res.status}`);
  const html = await res.text();

  // Extract the weekData JS variable embedded in the HTML
  const marker = "var weekData = ";
  const start = html.indexOf(marker);
  if (start === -1) throw new Error("weekData not found in page");

  // Find the matching closing brace by walking the JSON
  let depth = 0;
  let jsonStart = start + marker.length;
  let jsonEnd = jsonStart;
  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
  }

  const raw = JSON.parse(html.slice(jsonStart, jsonEnd)) as WeekData;

  const week = raw.Weeks.find((w) => w.WeekNumber === weekNumber);
  if (!week) return [];

  return week.Days.map((day): DayLunch => {
    const dateMs = parseInt(day.DayMenuDate.replace(/[^0-9]/g, ""), 10);
    const date = new Date(dateMs);
    const isoDate = date.toISOString().split("T")[0];

    const lunchMeals = day.DayMenus.filter((m) =>
      LUNCH_KEYWORDS.includes(m.MenuAlternativeName?.toLowerCase() ?? "")
    ).map((m) => m.DayMenuName ?? m.MenuAlternativeName ?? "");

    return {
      date: isoDate,
      weekday: day.WeekDayName ?? "",
      weekNumber,
      meals: lunchMeals,
    };
  });
}

// Raw types from Mashie weekData
interface WeekData {
  Weeks: Week[];
}
interface Week {
  WeekNumber: number;
  Days: Day[];
}
interface Day {
  DayMenuDate: string; // "/Date(1234567890000)/"
  WeekDayName?: string;
  IsHoliday: boolean;
  DayMenus: DayMenu[];
}
interface DayMenu {
  DayMenuName?: string;
  MenuAlternativeName?: string;
}
