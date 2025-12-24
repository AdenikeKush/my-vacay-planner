import { Link, useParams } from "react-router-dom";

function titleCase(text = "") {
  return text
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function DestinationDetails() {
  const { slug } = useParams();
  const cityName = titleCase(slug);

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
          <h1 className="text-3xl sm:text-4xl font-extrabold">{cityName}</h1>
          <p className="mt-2 text-white/80">
            This is the destination details page. Next we’ll show flights, hotels,
            attractions, weather, and an “Add to itinerary” button.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="rounded-xl bg-white text-indigo-700 font-semibold px-6 py-3 hover:opacity-90">
              Add to Itinerary
            </button>

            <Link
              to="/itinerary"
              className="rounded-xl bg-indigo-900/40 border border-white/15 px-6 py-3 font-semibold hover:bg-indigo-900/55 text-center"
            >
              View Itinerary
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
