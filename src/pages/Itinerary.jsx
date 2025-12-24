import { Link } from "react-router-dom";

export default function Itinerary() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 rounded-3xl bg-white/10 backdrop-blur border border-white/10 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Your Itinerary</h1>
          <p className="mt-2 text-white/80">
            This page will store the destinations, flights, and hotels you add.
            Next we’ll save items to localStorage so your itinerary stays after refresh.
          </p>

          <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-5">
            <p className="text-white/80">
              No items yet. Add a destination from the details page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
