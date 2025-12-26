import React from "react";

export default function DestinationList({ destinations = [], onSelect }) {
  if (!destinations.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((d) => (
        <button
          key={d.id}
          onClick={() => onSelect?.(d)}
          className="text-left rounded-2xl p-6 shadow-lg transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-white/60"
          style={{
            background: d.gradient || "linear-gradient(135deg, #ff3d77, #ff7a00)",
          }}
        >
          <div className="text-xs font-semibold tracking-widest uppercase text-white/80">
            {d.tag || "POPULAR"}
          </div>

          <div className="mt-2 text-2xl font-extrabold text-white">
            {d.city}
          </div>

          <div className="text-white/90">{d.country}</div>

          {d.subtitle ? (
            <div className="mt-3 text-sm text-white/90">{d.subtitle}</div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
