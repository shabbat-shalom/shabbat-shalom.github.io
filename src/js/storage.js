// Persists the user's last successful search so times auto-load on return.
const LOCATION_KEY = 'jtimes:location';

export function saveLocation(location, cityTitle) {
  try {
    localStorage.setItem(
      LOCATION_KEY,
      JSON.stringify({ ...location, cityTitle, savedAt: new Date().toISOString() })
    );
  } catch {
    // localStorage unavailable (private mode, etc.) — silently skip
  }
}

export function getSavedLocation() {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.zip || (saved.lat != null && saved.lon != null)) return saved;
    return null;
  } catch {
    return null;
  }
}

export function clearSavedLocation() {
  try {
    localStorage.removeItem(LOCATION_KEY);
  } catch {
    // ignore
  }
}
