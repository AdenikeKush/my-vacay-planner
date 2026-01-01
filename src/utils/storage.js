const KEY = "travelmate_saved_trips";

export function getSavedTrips() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveTrip(trip) {
  const trips = getSavedTrips();
  const exists = trips.some((t) => t.id === trip.id);

  const updated = exists
    ? trips.map((t) => (t.id === trip.id ? trip : t))
    : [trip, ...trips];

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function deleteTrip(id) {
  const trips = getSavedTrips().filter((t) => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(trips));
  return trips;
}

export function getTripById(id) {
  return getSavedTrips().find((t) => t.id === id) || null;
}
