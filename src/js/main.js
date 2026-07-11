// Entry for index.html: Shabbat times search page.
import './shared.js';
import { getShabbatTimes } from './api.js';
import { renderShabbatTimes, renderError, clearResults } from './render.js';
import { copyResults } from './clipboard.js';
import { announceToScreenReader } from './a11y.js';

const zipInput = document.getElementById('zipCodeInput');
const inputContainer = document.getElementById('inputContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const copyButton = document.getElementById('copyButton');
const copyFeedback = document.getElementById('copyFeedback');

function setLoading(loading) {
  loadingIndicator.style.display = loading ? 'block' : 'none';
}

function showError(message) {
  renderError(message);
  announceToScreenReader(message);
}

async function loadTimes(location, successMessage) {
  setLoading(true);
  try {
    const data = await getShabbatTimes(location);
    renderShabbatTimes(data);
    copyButton.style.display = 'inline-flex';
    announceToScreenReader(successMessage);
  } catch (error) {
    console.error('Error fetching data:', error);
    showError('Unable to fetch Shabbat times. Please check the zip code and try again.');
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

  loadTimes({ zip }, 'Shabbat times loaded successfully');
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

// Auto-focus on desktop only
if (window.innerWidth > 768) {
  window.addEventListener('load', () => zipInput.focus());
}
