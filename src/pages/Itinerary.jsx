import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getTripById } from "../utils/storage";

export default function Itinerary() {
  const [params] = useSearchParams();
  const tripId = params.get("tripId");
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) setTrip(getTripById(tripId));
  }, [tripId]);

  if (!tripId) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold">Itinerary</h1>
        <p className="mt-2 text-white/80">
          No trip selected. Go to Home and click “Plan trip” on a destination.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-white px-4 py-2 font-semibold text-indigo-700 hover:bg-white/90"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold">Itinerary</h1>
        <p className="mt-2 text-white/80">Trip not found.</p>
        <Link
          to="/saved"
          className="mt-6 inline-block rounded-xl bg-white px-4 py-2 font-semibold text-indigo-700 hover:bg-white/90"
        >
          View Saved Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-extrabold">Itinerary</h1>
      <p className="mt-2 text-white/80">
        Trip: <span className="font-semibold text-white">{trip.destinationName}</span>{" "}
        {trip.countryCode ? `(${trip.countryCode})` : ""}
      </p>

      <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
        <p className="text-white/80">
          Itinerary builder is next. For now, this confirms that “Plan trip” creates a saved trip and opens it correctly.
        </p>
        <Link
          to="/saved"
          className="mt-5 inline-block rounded-xl bg-white px-4 py-2 font-semibold text-indigo-700 hover:bg-white/90"
        >
          View Saved Trips
        </Link>
      </div>
    </div>
  );
}
