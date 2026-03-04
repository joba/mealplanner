"use client";

import { useEffect, useRef, useState } from "react";

interface Meal {
  id: number;
  name: string;
  description?: string | null;
}

interface Props {
  date: string;
  currentMealId?: number | null;
  currentCustom?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function MealPicker({
  date,
  currentMealId,
  currentCustom,
  onClose,
  onSaved,
}: Props) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState("");
  const [custom, setCustom] = useState(currentCustom ?? "");
  const [tab, setTab] = useState<"library" | "custom">(
    currentMealId ? "library" : "custom",
  );
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/meals")
      .then((r) => r.json())
      .then(setMeals);
  }, []);

  async function saveMeal(mealId?: number) {
    setSaving(true);
    await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        mealId: mealId ?? null,
        customMeal: mealId ? null : custom || null,
      }),
    });
    setSaving(false);
    onSaved();
    onClose();
  }

  async function clearMeal() {
    setSaving(true);
    await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, mealId: null, customMeal: null }),
    });
    setSaving(false);
    onSaved();
    onClose();
  }

  const filtered = meals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-96 max-h-[85vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg text-gray-500">Välj middag</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-sm font-medium ${tab === "library" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"}`}
            onClick={() => setTab("library")}
          >
            Receptbibliotek
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${tab === "custom" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"}`}
            onClick={() => setTab("custom")}
          >
            Fri text
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tab === "library" ? (
            <>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-500"
                placeholder="Sök recept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {filtered.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Inga recept hittades
                </p>
              )}
              {filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => saveMeal(m.id)}
                  disabled={saving}
                  className={`w-full text-left px-3 py-2 rounded-lg border hover:bg-indigo-50 hover:border-indigo-300 transition-colors ${
                    m.id === currentMealId
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-medium text-sm">{m.name}</p>
                  {m.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {m.description}
                    </p>
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="space-y-3">
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-gray-500"
                rows={3}
                placeholder="T.ex. Köttbullar med potatismos..."
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => saveMeal()}
                disabled={saving || !custom.trim()}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors"
              >
                Spara
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={clearMeal}
            disabled={saving}
            className="w-full text-sm text-red-500 hover:text-red-700 py-1"
          >
            Rensa middag
          </button>
        </div>
      </div>
    </div>
  );
}
