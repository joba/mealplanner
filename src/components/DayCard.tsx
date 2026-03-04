"use client";

import { useState } from "react";
import MealPicker from "./MealPicker";

interface PlanEntry {
  id: number;
  date: string;
  mealId?: number | null;
  mealName?: string | null;
  customMeal?: string | null;
  notes?: string | null;
}

interface LunchDay {
  date: string;
  meals: string[];
}

interface Props {
  date: Date;
  plan?: PlanEntry | null;
  lunch?: LunchDay | null;
  isToday: boolean;
  onRefresh: () => void;
}

const WEEKDAYS = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

// Every fourth Friday is treated as a non-school day, starting March 27 2026.
const FOURTH_FRIDAY_REF = new Date(2026, 2, 27); // local midnight
const MS_28_DAYS = 28 * 24 * 60 * 60 * 1000;

function isEveryFourthFriday(date: Date): boolean {
  if (date.getDay() !== 5) return false;
  const diff = date.getTime() - FOURTH_FRIDAY_REF.getTime();
  return diff >= 0 && diff % MS_28_DAYS === 0;
}

export default function DayCard({ date, plan, lunch, isToday, onRefresh }: Props) {
  const [picking, setPicking] = useState(false);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const isoDate = `${y}-${m}-${d}`;
  const weekday = WEEKDAYS[date.getDay()];
  const dayLabel = date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  const dinnerLabel = plan?.mealName ?? plan?.customMeal;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6 || (date.getDay() === 5 && !isEveryFourthFriday(date));

  return (
    <>
      <div
        className={`rounded-2xl border p-4 flex flex-col gap-3 transition-shadow hover:shadow-md ${
          isToday ? "border-indigo-400 bg-indigo-50/50" : isWeekend ? "border-gray-100 bg-gray-50/50" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-baseline justify-between">
          <span className={`font-semibold capitalize ${isToday ? "text-indigo-700" : "text-gray-800"}`}>
            {weekday}
          </span>
          <span className="text-xs text-gray-400">{dayLabel}</span>
        </div>

        {/* School lunch */}
        {lunch && lunch.meals.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Skolmat</p>
            {lunch.meals.map((m, i) => (
              <p key={i} className="text-xs text-gray-500 italic leading-snug">{m}</p>
            ))}
          </div>
        )}
        {!lunch && !isWeekend && (
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-gray-300 font-medium">Skolmat</p>
            <p className="text-xs text-gray-300 italic">—</p>
          </div>
        )}

        {/* Dinner */}
        <div className="mt-auto">
          <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1">Middag</p>
          <button
            onClick={() => setPicking(true)}
            className={`w-full text-left rounded-xl px-3 py-2 text-sm border transition-colors ${
              dinnerLabel
                ? "border-indigo-200 bg-indigo-50 text-indigo-800 font-medium hover:bg-indigo-100"
                : "border-dashed border-gray-300 text-gray-400 hover:border-indigo-300 hover:text-indigo-400"
            }`}
          >
            {dinnerLabel ?? "+ Lägg till middag"}
          </button>
        </div>
      </div>

      {picking && (
        <MealPicker
          date={isoDate}
          currentMealId={plan?.mealId}
          currentCustom={plan?.customMeal}
          onClose={() => setPicking(false)}
          onSaved={onRefresh}
        />
      )}
    </>
  );
}
