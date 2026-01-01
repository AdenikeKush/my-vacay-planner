import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getTripById, saveTrip } from "../utils/storage";
import { getFlightOffers, getHotelOffers } from "../api/amadeus";
import { HERO_IMAGES } from "../utils/heroImages";
import { MEMORY_GALLERIES } from "../utils/memories";

/* ---------------- Helpers ---------------- */

function makeId() {
  return crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function toISODate(value) {
  return typeof value === "string" ? value : "";
}

function daysBetween(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  const start = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diff = end.getTime() - start.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function ensureItineraryShape(itinerary) {
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return [
      {
        id: makeId(),
        title: "Day 1",
        items: [],
      },
    ];
  }

  return itinerary.map((d, idx) => ({
    id: d?.id || makeId(),
    title: d?.title || `Day ${idx + 1}`,
    items: Array.isArray(d?.items)
      ? d.items.map((it) => ({
          id: it?.id || makeId(),
          time: it?.time || "",
          title: it?.title || "",
          notes: it?.notes || "",
        }))
      : [],
  }));
}

function safeCurrency(amount, currency) {
  if (amount == null) return "";
  const n = Number(amount);
  if (Number.isNaN(n)) return "";
  return `${n.toFixed(2)} ${currency || ""}`.trim();
}

// Demo-friendly mappings (until you store real IATA codes per destination)
function pickAirportCode(trip) {
  const name = (trip?.destinationName || "").toLowerCase();

  if (name.includes("tokyo")) return "TYO";
  if (name.includes("osaka")) return "OSA";
  if (name.includes("kyoto")) return "KIX";
  if (name.includes("cairo")) return "CAI";
  if (name.includes("doha")) return "DOH";
  if (name.includes("paris")) return "PAR";
  if (name.includes("london")) return "LON";
  if (name.includes("manchester")) return "MAN";

  return "TYO";
}

function pickHotelCityCode(trip) {
  // Amadeus hotel by city uses an IATA city code (same mapping is fine for demo)
  return pickAirportCode(trip);
}

function heroSrcForTrip(trip) {
  const name = (trip?.destinationName || "").trim().toLowerCase();
  const country = (trip?.countryCode || "").trim().toLowerCase();

  const firstWord = name.split(" ")[0] || "";
  return (
    HERO_IMAGES[name] ||
    HERO_IMAGES[firstWord] ||
    HERO_IMAGES[country] ||
    "/images/tokyo.jpg"
  );
}

function galleryKeyForTrip(trip) {
  const name = (trip?.destinationName || "").trim().toLowerCase();
  const country = (trip?.countryCode || "").trim().toLowerCase();

  // For your current memories setup:
  // - Japan trip could be "Tokyo" or "Japan"
  // - country code might be "JP"
  if (country === "jp") return "japan";
  if (name.includes("tokyo") || name.includes("japan")) return "japan";

  // Later we’ll add egypt/qatar keys here too
  return null;
}

/* ---------------- Component ---------------- */

export default function Itinerary() {
  const [params] = useSearchParams();
  const tripId = params.get("tripId");

  const [trip, setTrip] = useState(null);

  // Save UX
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // Planner state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState([]);
  const [activeDayId, setActiveDayId] = useState(null);

  // Draft activity inputs
  const [draftTime, setDraftTime] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  // Flights & hotels preview state
  const [flightStatus, setFlightStatus] = useState("idle"); // idle | loading | error
  const [hotelStatus, setHotelStatus] = useState("idle");
  const [flightError, setFlightError] = useState("");
  const [hotelError, setHotelError] = useState("");
  const [flightOffers, setFlightOffers] = useState([]);
  const [hotelList, setHotelList] = useState([]);

  const activeDay = useMemo(
    () => days.find((d) => d.id === activeDayId) || null,
    [days, activeDayId]
  );

  const totalDaysFromDates = useMemo(
    () => daysBetween(startDate, endDate),
    [startDate, endDate]
  );

  const heroSrc = useMemo(() => heroSrcForTrip(trip), [trip]);

  const memoriesKey = useMemo(() => galleryKeyForTrip(trip), [trip]);
  const memories = useMemo(() => {
    if (!memoriesKey) return null;
    return MEMORY_GALLERIES[memoriesKey] || null;
  }, [memoriesKey]);

  function setFlash(msg) {
    setSavedMsg(msg);
    window.clearTimeout(setFlash._t);
    setFlash._t = window.setTimeout(() => setSavedMsg(""), 2200);
  }

  // Load trip
  useEffect(() => {
    if (!tripId) return;

    const found = getTripById(tripId);
    setTrip(found);

    if (found) {
      setStartDate(toISODate(found.startDate || ""));
      setEndDate(toISODate(found.endDate || ""));

      const shaped = ensureItineraryShape(found.itinerary);
      setDays(shaped);
      setActiveDayId(shaped[0]?.id || null);
    }
  }, [tripId]);

  async function handleSave() {
    if (!trip) return;

    setSaving(true);
    try {
      const updatedTrip = {
        ...trip,
        startDate,
        endDate,
        itinerary: days,
        updatedAt: new Date().toISOString(),
      };

      saveTrip(updatedTrip);
      setTrip(updatedTrip);
      setFlash("Saved ✅");
    } catch (e) {
      setFlash("Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleGenerateDaysFromDates() {
    const n = totalDaysFromDates;
    if (!n) return;

    const newDays = Array.from({ length: n }).map((_, idx) => {
      const existing = days[idx];
      return {
        id: existing?.id || makeId(),
        title: `Day ${idx + 1}`,
        items: existing?.items || [],
      };
    });

    setDays(newDays);
    setActiveDayId(newDays[0]?.id || null);
    setFlash("Days updated from dates ✅");
  }

  function handleAddDay() {
    const nextNum = days.length + 1;
    const newDay = { id: makeId(), title: `Day ${nextNum}`, items: [] };
    const updated = [...days, newDay];
    setDays(updated);
    setActiveDayId(newDay.id);
  }

  function handleRemoveLastDay() {
    if (days.length <= 1) return;
    const updated = days.slice(0, -1);
    setDays(updated);
    if (!updated.some((d) => d.id === activeDayId)) {
      setActiveDayId(updated[0]?.id || null);
    }
  }

  function handleAddItem() {
    if (!activeDay) return;

    const title = draftTitle.trim();
    const notes = draftNotes.trim();
    const time = draftTime.trim();

    if (!title) {
      setFlash("Add a title for the activity.");
      return;
    }

    const newItem = { id: makeId(), time, title, notes };

    const updatedDays = days.map((d) => {
      if (d.id !== activeDay.id) return d;
      return { ...d, items: [newItem, ...(d.items || [])] };
    });

    setDays(updatedDays);
    setDraftTime("");
    setDraftTitle("");
    setDraftNotes("");
  }

  function handleDeleteItem(itemId) {
    if (!activeDay) return;
    const updatedDays = days.map((d) => {
      if (d.id !== activeDay.id) return d;
      return { ...d, items: d.items.filter((it) => it.id !== itemId) };
    });
    setDays(updatedDays);
  }

  function handleEditItem(itemId, field, value) {
    if (!activeDay) return;

    const updatedDays = days.map((d) => {
      if (d.id !== activeDay.id) return d;
      return {
        ...d,
        items: d.items.map((it) =>
          it.id === itemId ? { ...it, [field]: value } : it
        ),
      };
    });

    setDays(updatedDays);
  }

  async function fetchPreviews() {
    if (!trip) return;

    const destinationCode = pickAirportCode(trip);
    const hotelCityCode = pickHotelCityCode(trip);

    const depart =
      startDate ||
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    setFlightStatus("loading");
    setHotelStatus("loading");
    setFlightError("");
    setHotelError("");

    try {
      const flights = await getFlightOffers("LON", destinationCode, depart);
      setFlightOffers(Array.isArray(flights) ? flights : []);
      setFlightStatus("idle");
    } catch (e) {
      setFlightOffers([]);
      setFlightStatus("error");
      setFlightError("Could not load flights preview.");
    }

    try {
      const hotels = await getHotelOffers(hotelCityCode);
      setHotelList(Array.isArray(hotels) ? hotels : []);
      setHotelStatus("idle");
    } catch (e) {
      setHotelList([]);
      setHotelStatus("error");
      setHotelError("Could not load hotels preview.");
    }
  }

  useEffect(() => {
    if (trip) fetchPreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  /* ---------------- Guards ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-lg">
        <div className="absolute inset-0">
          <img
            src={heroSrc}
            alt={trip.destinationName}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-indigo-900/70" />
        </div>

        <div className="relative z-10 px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-widest text-white/80">
                TRAVELMATE ITINERARY
              </p>
              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                {trip.destinationName}{" "}
                {trip.countryCode ? (
                  <span className="text-white/80">({trip.countryCode})</span>
                ) : null}
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Build a day-by-day plan, preview flights and hotels, and save everything for your presentation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/saved"
                className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Saved Trips
              </Link>

              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-white/90 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {savedMsg ? (
            <div className="mt-4 inline-block rounded-xl bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
              {savedMsg}
            </div>
          ) : null}
        </div>
      </div>

      {/* Dates + Day Controls */}
      <div className="mt-8 grid gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-white/50"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">End date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-white/50"
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/80">
            {totalDaysFromDates
              ? `Trip length: ${totalDaysFromDates} day(s)`
              : "Tip: set start and end date to auto-generate days."}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerateDaysFromDates}
              disabled={!totalDaysFromDates}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-white/90 disabled:opacity-60"
            >
              Generate days from dates
            </button>

            <button
              onClick={handleAddDay}
              className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Add day
            </button>

            <button
              onClick={handleRemoveLastDay}
              disabled={days.length <= 1}
              className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
            >
              Remove last day
            </button>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="mt-7 flex flex-wrap gap-3">
        {days.map((d) => {
          const isActive = d.id === activeDayId;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDayId(d.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-indigo-700"
                  : "border border-white/30 text-white hover:bg-white/10"
              }`}
            >
              {d.title}
            </button>
          );
        })}
      </div>

      {/* Add Activity */}
      <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {activeDay ? `Add activity to ${activeDay.title}` : "Add activity"}
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Add real memories from Japan, Egypt, and Qatar to make your demo unforgettable.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
          >
            Save trip
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-semibold">Time (optional)</label>
            <input
              value={draftTime}
              onChange={(e) => setDraftTime(e.target.value)}
              placeholder="09:00"
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Activity title</label>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Visit Senso-ji Temple"
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/50"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-sm font-semibold">Notes (optional)</label>
            <textarea
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="Address, transport plan, ticket info, reminders..."
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/50"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleAddItem}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-white/90"
          >
            Add activity
          </button>

          <span className="text-sm text-white/70">
            Tip: add 4–6 activities across Day 1–3 for a strong presentation demo.
          </span>
        </div>
      </div>

      {/* Activities List */}
      <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
        <h2 className="text-xl font-bold">
          {activeDay ? `${activeDay.title} Plan` : "Day Plan"}
        </h2>

        {!activeDay || activeDay.items.length === 0 ? (
          <p className="mt-3 text-white/80">
            No activities yet. Add your first activity above.
          </p>
        ) : (
          <div className="mt-4 grid gap-4">
            {activeDay.items.map((it) => (
              <div
                key={it.id}
                className="rounded-3xl border border-white/15 bg-white/5 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="grid w-full gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-semibold text-white/70">
                        Time
                      </label>
                      <input
                        value={it.time}
                        onChange={(e) =>
                          handleEditItem(it.id, "time", e.target.value)
                        }
                        placeholder="09:00"
                        className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 outline-none focus:border-white/50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-white/70">
                        Title
                      </label>
                      <input
                        value={it.title}
                        onChange={(e) =>
                          handleEditItem(it.id, "title", e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-white/50"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-xs font-semibold text-white/70">
                        Notes
                      </label>
                      <textarea
                        value={it.notes}
                        onChange={(e) =>
                          handleEditItem(it.id, "notes", e.target.value)
                        }
                        rows={2}
                        className="mt-2 w-full resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-white/50"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(it.id)}
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

      {/* Flights + Hotels Preview */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Flights Preview</h2>
            <button
              onClick={fetchPreviews}
              className="rounded-xl border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          <p className="mt-2 text-sm text-white/70">
            Showing sample flight offers (origin: London). Destination codes are mapped for a smooth demo.
          </p>

          {flightStatus === "loading" && (
            <p className="mt-4 text-white/80">Loading flights…</p>
          )}

          {flightStatus === "error" && (
            <p className="mt-4 text-red-200">{flightError}</p>
          )}

          {flightStatus !== "loading" && flightOffers.length === 0 && (
            <p className="mt-4 text-white/80">No flight offers found right now.</p>
          )}

          <div className="mt-4 grid gap-3">
            {flightOffers.slice(0, 5).map((offer) => {
              const price = safeCurrency(
                offer?.price?.total,
                offer?.price?.currency
              );
              const firstItin = offer?.itineraries?.[0];
              const firstSeg = firstItin?.segments?.[0];
              const lastSeg =
                firstItin?.segments?.[firstItin?.segments?.length - 1];

              const depart = firstSeg?.departure?.at
                ?.slice(0, 16)
                ?.replace("T", " ");
              const arrive = lastSeg?.arrival?.at
                ?.slice(0, 16)
                ?.replace("T", " ");

              const from = firstSeg?.departure?.iataCode || "LON";
              const to = lastSeg?.arrival?.iataCode || pickAirportCode(trip);

              return (
                <div
                  key={offer.id}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {from} → {to}
                    </p>
                    <p className="font-bold">{price}</p>
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    {depart ? `Depart: ${depart}` : "Depart time unavailable"}
                    {arrive ? ` • Arrive: ${arrive}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Stops: {Math.max((firstItin?.segments?.length || 1) - 1, 0)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Hotels Preview</h2>
            <button
              onClick={fetchPreviews}
              className="rounded-xl border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          <p className="mt-2 text-sm text-white/70">
            Showing hotels by city code for demo purposes.
          </p>

          {hotelStatus === "loading" && (
            <p className="mt-4 text-white/80">Loading hotels…</p>
          )}

          {hotelStatus === "error" && (
            <p className="mt-4 text-red-200">{hotelError}</p>
          )}

          {hotelStatus !== "loading" && hotelList.length === 0 && (
            <p className="mt-4 text-white/80">No hotels found right now.</p>
          )}

          <div className="mt-4 grid gap-3">
            {hotelList.slice(0, 6).map((h) => (
              <div
                key={h.hotelId}
                className="rounded-2xl border border-white/15 bg-white/5 p-4"
              >
                <p className="font-semibold">{h.name}</p>
                <p className="mt-1 text-sm text-white/70">
                  {h.address?.cityName || trip.destinationName}
                  {h.address?.countryCode ? ` • ${h.address.countryCode}` : ""}
                </p>
                {h.geoCode?.latitude && h.geoCode?.longitude ? (
                  <p className="mt-1 text-xs text-white/60">
                    {h.geoCode.latitude}, {h.geoCode.longitude}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Japan Memories Gallery */}
      {memories ? (
        <div className="mt-10 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <h2 className="text-2xl font-extrabold">My Japan Memories</h2>
          <p className="mt-2 text-white/80">
            Photos and video from my trip — included to support the final presentation demo.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memories.map((m, idx) =>
              m.type === "image" ? (
                <div
                  key={`${m.src}-${idx}`}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
                >
                  <img
                    src={m.src}
                    alt={`Japan memory ${idx + 1}`}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  key={`${m.src}-${idx}`}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
                >
                  <video
                    src={m.src}
                    controls
                    className="h-48 w-full object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>
      ) : null}

      {/* Bottom actions */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Back to Home
        </Link>

        <Link
          to="/saved"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-white/90"
        >
          View Saved Trips
        </Link>
      </div>
    </div>
  );
}
