import { getCurrentUserId } from "./auth";

const KEY = "travelmate_trips";

/* helpers */
function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}
function write(v) {
  localStorage.setItem(KEY, JSON.stringify(v));
}
function uid() {
  return crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

/* public api */

export function getAllTrips() {
  const userId = getCurrentUserId();
  if (!userId) return [];
  return read().filter((t) => t.userId === userId);
}

export function getTripById(id) {
  const userId = getCurrentUserId();
  if (!userId) return null;
  return read().find((t) => t.id === id && t.userId === userId) || null;
}

export function saveTrip(trip) {
  const userId = getCurrentUserId();
  if (!userId) return;

  const all = read();
  const next = all.some((t) => t.id === trip.id)
    ? all.map((t) => (t.id === trip.id ? { ...trip, userId } : t))
    : [{ ...trip, userId }, ...all];

  write(next);
}

/* --- DEMO AUTO SEED --- */

export function seedDemoTripOnce() {
  const userId = getCurrentUserId();
  if (!userId) return;

  const all = read();
  if (all.some((t) => t.userId === userId)) return; // already has trips

  const demoTrip = {
    id: uid(),
    userId,
    destinationName: "Tokyo",
    countryCode: "JP",
    startDate: "2025-04-02",
    endDate: "2025-04-05",
    createdAt: new Date().toISOString(),
    itinerary: [
      {
        id: uid(),
        title: "Day 1",
        items: [
          { id: uid(), time: "10:00", title: "Senso-ji Temple", notes: "Asakusa – Tokyo’s oldest temple" },
          { id: uid(), time: "13:00", title: "Nakamise Street", notes: "Street snacks & souvenirs" },
          { id: uid(), time: "18:00", title: "Tokyo Skytree", notes: "Sunset city view" },
        ],
      },
      {
        id: uid(),
        title: "Day 2",
        items: [
          { id: uid(), time: "09:00", title: "Meiji Shrine", notes: "Forest walk & shrine visit" },
          { id: uid(), time: "12:00", title: "Harajuku Takeshita Street", notes: "Shopping & crepes" },
          { id: uid(), time: "18:30", title: "Shibuya Crossing", notes: "World’s busiest crossing" },
        ],
      },
      {
        id: uid(),
        title: "Day 3",
        items: [
          { id: uid(), time: "10:00", title: "Tsukiji Outer Market", notes: "Fresh sushi brunch" },
          { id: uid(), time: "14:00", title: "teamLab Borderless", notes: "Digital art museum" },
          { id: uid(), time: "19:00", title: "Roppongi Hills Sky Deck", notes: "Night skyline" },
        ],
      },
    ],
  };

  write([demoTrip, ...all]);
}
