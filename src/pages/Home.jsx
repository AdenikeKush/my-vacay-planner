import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { searchCities } from "../api/amadeus";

export default function Home() {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");

  async function handleSearch(query) {
    try {
      setStatus("loading");
      setError("");
      const data = await searchCities(query);
      setResults(Array.isArray(data) ? data : []);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e?.message || "Search failed. Please try again.");
    }
  }

  // Optional: show popular picks only when there are no results
  const showPopularPicks = results.length === 0 && status !== "loading";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 text-white">
      <div className="px-6 pb-14">
        {/* HERO */}
        <h1 className="mx-auto mt-16 max-w-5xl text-center text-5xl font-extrabold">
          My Vacay Planner
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-white/80">
          Plan your trips, explore destinations, and build your itinerary — stress free.
        </p>

        {/* SEARCH */}
        <SearchBar onSearch={handleSearch} />

        {/* STATUS */}
        <div className="mx-auto mt-6 w-full max-w-3xl">
          {status === "loading" && (
            <p className="text-center text-white/80">Searching…</p>
          )}
          {status === "error" && (
            <p className="text-center text-red-200">{error}</p>
          )}
        </div>

        {/* RESULTS */}
        <SearchResults results={results} />

        {/* POPULAR PICKS (put your old section here) */}
        {showPopularPicks && (
          <section className="mx-auto mt-14 w-full max-w-5xl">
            <h2 className="mb-6 text-2xl font-bold">Popular picks</h2>

            {/* ✅ Paste your existing Popular Picks cards/grid below */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Example placeholders — replace with your original cards */}
              <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 p-6">
                <p className="text-xs font-semibold tracking-widest opacity-90">
                  CITY ADVENTURE
                </p>
                <p className="mt-3 text-3xl font-extrabold">Tokyo</p>
                <p className="opacity-90">Japan</p>
                <p className="mt-4 text-sm opacity-90">Neon city lights, culture & food</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                <p className="text-xs font-semibold tracking-widest opacity-90">
                  DESERT ESCAPE
                </p>
                <p className="mt-3 text-3xl font-extrabold">Doha</p>
                <p className="opacity-90">Qatar</p>
                <p className="mt-4 text-sm opacity-90">Desert views & modern skyline</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-6">
                <p className="text-xs font-semibold tracking-widest opacity-90">
                  HISTORY & CULTURE
                </p>
                <p className="mt-3 text-3xl font-extrabold">Cairo</p>
                <p className="opacity-90">Egypt</p>
                <p className="mt-4 text-sm opacity-90">Ancient history & Nile sunsets</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
