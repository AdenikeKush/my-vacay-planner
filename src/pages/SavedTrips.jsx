import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedTrips, deleteTrip } from "../utils/storage";

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(getSavedTrips());
  }, []);

  function handleDelete(id) {
    const updated = deleteTrip(id);
    setTrips(updated);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-extrabold">Saved Trips</h1>
      <p className="mt-2 text-white/80">
        View and manage your saved itineraries.
      </p>

      {trips.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <p className="text-white/80">
            No saved trips yet. Search for a destination on the Home page and click{" "}
            <span className="font-semibold text-white">Plan trip</span>.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-xl bg-white px-4 py-2 font-semibold text-indigo-700 hover:bg-white/90"
          >
            Go to Home
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur"
            >
              <p className="text-lg font-bold">{t.destinationName}</p>
              <p className="text-white/70">
                {t.countryCode || ""}{" "}
                {t.startDate && t.endDate ? `• ${t.startDate} → ${t.endDate}` : ""}
              </p>

              <div className="mt-4 flex gap-3">
                <Link
                  to={`/itinerary?tripId=${encodeURIComponent(t.id)}`}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-white/90"
                >
                  Open
                </Link>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
