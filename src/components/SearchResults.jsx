import { useNavigate } from "react-router-dom";
import { saveTrip } from "../utils/storage";

function makeId() {
  return crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export default function SearchResults({ results = [] }) {
  const navigate = useNavigate();

  if (!results.length) return null;

  function handlePlanTrip(r) {
    const trip = {
      id: makeId(),
      destinationName: r.name,
      countryCode: r.country,
      startDate: "",
      endDate: "",
      itinerary: [],
      createdAt: new Date().toISOString(),
    };

    saveTrip(trip);
    navigate(`/itinerary?tripId=${encodeURIComponent(trip.id)}`);
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-6">
      <h2 className="mb-4 text-xl font-semibold">Search results</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur"
          >
            <p className="text-lg font-bold">{r.name}</p>
            <p className="text-white/70">
              {r.country}
              {r.state ? ` • ${r.state}` : ""}
            </p>

            <button
              onClick={() => handlePlanTrip(r)}
              className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-white/90"
            >
              Plan trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
