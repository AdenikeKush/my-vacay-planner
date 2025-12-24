import { useState } from "react";
import SearchBar from "../components/SearchBar";
import DestinationList from "../components/DestinationList";

export default function Home() {
  const [query, setQuery] = useState("");

  function handleSearch() {
    const cleaned = query.trim();
    if (!cleaned) return;
    alert(`Searching for: ${cleaned}`);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            My Vacay Planner
          </h1>

          <p className="text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plan your trips, explore destinations, and build your itinerary — stress free.
          </p>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
          />
        </header>

        <DestinationList />
      </div>
    </div>
  );
}
