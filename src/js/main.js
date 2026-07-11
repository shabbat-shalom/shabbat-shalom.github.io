// Entry for index.html: Shabbat times search page.
import './shared.js';
import { getShabbatTimes } from './api.js';
import { renderShabbatTimes, renderError, clearResults } from './render.js';
import { copyResults } from './clipboard.js';
import { announceToScreenReader } from './a11y.js';
import { saveLocation, getSavedLocation, clearSavedLocation } from './storage.js';

const zipInput = document.getElementById('zipCodeInput');
const inputContainer = document.getElementById('inputContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const copyButton = document.getElementById('copyButton');
const copyFeedback = document.getElementById('copyFeedback');

let lastQuery = null;

function setLoading(loading) {
  loadingIndicator.style.display = loading ? 'block' : 'none';
}

function showError(message, retryable = false) {
  renderError(message, retryable && lastQuery ? () => loadTimes(lastQuery) : undefined);
  announceToScreenReader(message);
}

async function loadTimes(location, successMessage = 'Shabbat times loaded successfully') {
  lastQuery = location;
  setLoading(true);
  clearResults();
  try {
    const data = await getShabbatTimes(location);
    renderShabbatTimes(data);
    saveLocation(location, data.location?.title);
    copyButton.style.display = 'inline-flex';
    announceToScreenReader(successMessage);
  } catch (error) {
    console.error('Error fetching data:', error);
    const offline = !navigator.onLine;
    showError(
      offline
        ? 'You appear to be offline. Reconnect and try again.'
        : 'Unable to fetch Shabbat times. Please check the zip code and try again.',
      true
    );
    copyButton.style.display = 'none';
  } finally {
    setLoading(false);
    inputContainer.style.display = 'block';
  }
}

function validateAndSearch() {
  const zip = zipInput.value.trim();

  if (zip.length < 5) {
    showError('Please enter a valid 5-digit zip code.');
    return;
  }
  if (!/^\d{5}$/.test(zip)) {
    showError('Please enter only numbers (5 digits).');
    return;
  }

  loadTimes({ zip });
}

function useCurrentLocation() {
  zipInput.value = '';

  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }

  inputContainer.style.display = 'none';
  clearResults();
  setLoading(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      loadTimes(
        { lat: position.coords.latitude, lon: position.coords.longitude },
        'Shabbat times loaded for your location'
      );
    },
    (error) => {
      console.error('Error getting location:', error);
      let message = 'Unable to retrieve your location. ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message += 'Please enable location permissions and try again.';
          break;
        case error.POSITION_UNAVAILABLE:
          message += 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          message += 'Location request timed out.';
          break;
        default:
          message += 'An unknown error occurred.';
      }
      showError(message);
      setLoading(false);
      inputContainer.style.display = 'block';
    }
  );
}

function resetSearch() {
  zipInput.value = '';
  clearResults();
  clearSavedLocation();
  lastQuery = null;
  copyButton.style.display = 'none';
  copyFeedback.style.display = 'none';
  announceToScreenReader('Search reset');
}

document.getElementById('searchButton').addEventListener('click', validateAndSearch);
document.getElementById('locationButton').addEventListener('click', useCurrentLocation);
document.getElementById('resetButton').addEventListener('click', resetSearch);
copyButton.addEventListener('click', () => copyResults(showError));

zipInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    validateAndSearch();
  }
});

// Auto-load times for the last searched location on return visits.
const saved = getSavedLocation();
if (saved) {
  if (saved.zip) zipInput.value = saved.zip;
  loadTimes(
    saved.zip ? { zip: saved.zip } : { lat: saved.lat, lon: saved.lon },
    saved.cityTitle ? `Shabbat times loaded for ${saved.cityTitle}` : undefined
  );
} else if (window.innerWidth > 768) {
  // Auto-focus on desktop only
  window.addEventListener('load', () => zipInput.focus());
}
