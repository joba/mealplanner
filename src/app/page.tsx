import Link from "next/link";
import WeekCalendar from "@/components/WeekCalendar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Middagsplanering</h1>
        <Link
          href="/meals"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Receptbibliotek
        </Link>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <WeekCalendar />
      </div>
    </main>
  );
}
