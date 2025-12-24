import { Link } from "react-router-dom";

const SAMPLE_DESTINATIONS = [
  {
    id: 1,
    city: "Tokyo",
    country: "Japan",
    vibe: "Neon city lights, culture & food",
    tag: "City adventure",
    color: "from-pink-500 to-rose-500",
    slug: "tokyo",
  },
  {
    id: 2,
    city: "Doha",
    country: "Qatar",
    vibe: "Desert views & modern skyline",
    tag: "Desert escape",
    color: "from-amber-400 to-orange-500",
    slug: "doha",
  },
  {
    id: 3,
    city: "Cairo",
    country: "Egypt",
    vibe: "Ancient history & Nile sunsets",
    tag: "History & culture",
    color: "from-emerald-500 to-teal-500",
    slug: "cairo",
  },
];

export default function DestinationList() {
  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="text-2xl font-semibold mb-4 text-left text-white/95">
        Popular picks
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {SAMPLE_DESTINATIONS.map((dest) => (
          <Link
            key={dest.id}
            to={`/destination/${dest.slug}`}
            className={`rounded-2xl p-4 text-left text-white bg-gradient-to-br ${dest.color} shadow-lg hover:opacity-95 transition`}
          >
            <p className="text-xs uppercase tracking-wide text-white/80 mb-1">
              {dest.tag}
            </p>

            <h3 className="text-lg font-bold">{dest.city}</h3>

            <p className="text-sm text-white/90 mb-2">{dest.country}</p>

            <p className="text-sm text-white/90">{dest.vibe}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
