const CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

/* Cities */
export async function searchCities(keyword) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${encodeURIComponent(keyword)}&max=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const json = await res.json();
  return (json?.data || []).map((c) => ({
    id: c.id,
    name: c.name,
    country: c.address?.countryCode,
    lat: c.geoCode?.latitude,
    lng: c.geoCode?.longitude,
  }));
}

/* Flights preview */
export async function getFlightOffers(origin = "LON", destination, departDate) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departDate}&adults=1&max=5`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return (await res.json())?.data || [];
}

/* Hotels preview */
export async function getHotelOffers(cityCode) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return (await res.json())?.data?.slice(0, 6) || [];
}
