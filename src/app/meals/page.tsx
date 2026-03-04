"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Meal {
  id: number;
  name: string;
  description?: string | null;
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const r = await fetch("/api/meals");
    if (r.ok) setMeals(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function addMeal(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: desc.trim() || null }),
    });
    setName("");
    setDesc("");
    setSaving(false);
    load();
  }

  async function saveEdit(id: number) {
    if (!editName.trim()) return;
    setSaving(true);
    await fetch(`/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() || null }),
    });
    setEditingId(null);
    setSaving(false);
    load();
  }

  async function deleteMeal(id: number) {
    if (!confirm("Ta bort receptet?")) return;
    await fetch(`/api/meals/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">← Tillbaka</Link>
        <h1 className="text-xl font-bold text-gray-900">Receptbibliotek</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Add form */}
        <form onSubmit={addMeal} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-semibold text-gray-700">Lägg till recept</h2>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Namn på rätten *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Beskrivning (valfritt)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors"
          >
            Spara
          </button>
        </form>

        {/* Meal list */}
        <div className="space-y-2">
          {meals.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Inga recept ännu. Lägg till ett ovan!</p>
          )}
          {meals.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-200 p-4">
              {editingId === m.id ? (
                <div className="space-y-2">
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Beskrivning (valfritt)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(m.id)}
                      disabled={saving}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Spara
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800">{m.name}</p>
                    {m.description && <p className="text-sm text-gray-500 mt-0.5">{m.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditingId(m.id); setEditName(m.name); setEditDesc(m.description ?? ""); }}
                      className="text-xs text-gray-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => deleteMeal(m.id)}
                      className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
