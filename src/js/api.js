const BASE_URL = 'https://www.hebcal.com/shabbat';
const DEFAULT_PARAMS = { cfg: 'json', b: '18', M: 'on', m: '50' };

// Fetch Shabbat times from Hebcal for either { zip } or { lat, lon }.
export async function getShabbatTimes(location) {
  const params = new URLSearchParams(DEFAULT_PARAMS);

  if (location.zip) {
    params.set('zip', location.zip);
  } else {
    params.set('latitude', location.lat);
    params.set('longitude', location.lon);
  }

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  if (!data || typeof data !== 'object' || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('No Shabbat times found for this location.');
  }

  return data;
}
