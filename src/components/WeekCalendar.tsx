"use client";

import { useCallback, useEffect, useState } from "react";
import DayCard from "./DayCard";
import { getISOWeek, getMondayOfWeek, getWeekDates, toISO } from "@/lib/week";

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

export default function WeekCalendar() {
  const [monday, setMonday] = useState(() => getMondayOfWeek(new Date()));
  const [plan, setPlan] = useState<PlanEntry[]>([]);
  const [lunches, setLunches] = useState<LunchDay[]>([]);

  const weekDates = getWeekDates(monday);
  const weekNumber = getISOWeek(monday);
  const from = toISO(weekDates[0]);
  const to = toISO(weekDates[6]);
  const todayISO = toISO(new Date());

  const loadPlan = useCallback(async () => {
    const r = await fetch(`/api/plan?from=${from}&to=${to}`);
    if (r.ok) setPlan(await r.json());
  }, [from, to]);

  const loadLunches = useCallback(async () => {
    const r = await fetch(`/api/school-lunch?week=${weekNumber}`);
    if (r.ok) setLunches(await r.json());
  }, [weekNumber]);

  useEffect(() => {
    loadPlan();
    loadLunches();
  }, [loadPlan, loadLunches]);

  function prevWeek() {
    setMonday((m) => {
      const d = new Date(m);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }

  function nextWeek() {
    setMonday((m) => {
      const d = new Date(m);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }

  function goToday() {
    setMonday(getMondayOfWeek(new Date()));
  }

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevWeek}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Föregående vecka"
        >
          ←
        </button>
        <div className="flex-1 text-center">
          <span className="font-semibold text-gray-800">Vecka {weekNumber}</span>
          <span className="text-sm text-gray-400 ml-2">
            {from} – {to}
          </span>
        </div>
        <button
          onClick={nextWeek}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Nästa vecka"
        >
          →
        </button>
        <button
          onClick={goToday}
          className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Idag
        </button>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {weekDates.map((date) => {
          const iso = toISO(date);
          return (
            <DayCard
              key={iso}
              date={date}
              plan={plan.find((p) => p.date === iso) ?? null}
              lunch={lunches.find((l) => l.date === iso) ?? null}
              isToday={iso === todayISO}
              onRefresh={loadPlan}
            />
          );
        })}
      </div>
    </div>
  );
}
