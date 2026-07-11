// Renders Hebcal results into #shabbatTimes using DOM APIs (no innerHTML
// string building, so no escaping concerns).
import { startCountdown, stopCountdown } from './countdown.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function renderItem(item) {
  const category = item.category || '';
  const title = item.title || 'Untitled Event';
  const hebrew = item.hebrew || '';
  const date = formatDate(item.date);

  const isTimed = category === 'candles' || category === 'havdalah';
  const li = el('li', isTimed || category === 'holiday' ? category : 'other');

  if (isTimed) {
    const row = el('div', 'time-row');
    row.append(el('span', 'time-label', title), el('span', 'time-value', formatTime(item.date)));
    li.append(row);
    if (date) li.append(el('div', 'time-date', date));
  } else {
    li.append(el('div', 'event-title', title));
    if (hebrew) li.append(el('div', 'event-subtitle', hebrew));
    if (date) li.append(el('div', 'event-date', date));
  }

  return li;
}

// Torah portion gets its own card with English + Hebrew names and a link
// to the Hebcal reading page.
function renderParshaCard(item) {
  const card = el('div', 'parsha-card');
  card.append(el('div', 'parsha-eyebrow', 'This week’s Torah portion'));

  if (item.link) {
    const link = el('a', 'parsha-title', item.title || '');
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    card.append(link);
  } else {
    card.append(el('div', 'parsha-title', item.title || ''));
  }

  if (item.hebrew) {
    card.append(el('div', 'parsha-hebrew', item.hebrew));
  }

  return card;
}

export function renderShabbatTimes(data) {
  const container = document.getElementById('shabbatTimes');
  stopCountdown();
  container.replaceChildren();

  const wrapper = el('div', 'hebcal-container');
  const inner = el('div');

  if (data.location?.title) {
    inner.append(el('h3', null, data.location.title));
  }

  const items = data.items.filter((item) => item && typeof item === 'object');
  const parsha = items.find((item) => item.category === 'parashat');

  if (parsha) {
    inner.append(renderParshaCard(parsha));
  }

  const list = el('ul', 'hebcal-results');
  for (const item of items) {
    if (item === parsha) continue;
    list.append(renderItem(item));
  }
  inner.append(list);

  wrapper.append(inner);
  container.append(wrapper);

  startCountdown(inner, items);
}

export function renderError(message, retry) {
  const container = document.getElementById('shabbatTimes');
  stopCountdown();
  container.replaceChildren();

  const box = el('div', 'error-card');
  const icon = document.createElement('box-icon');
  icon.setAttribute('name', 'error-circle');
  icon.setAttribute('type', 'solid');
  icon.setAttribute('color', '#ef4444');
  icon.setAttribute('size', 'md');
  box.append(icon, el('p', null, message));

  if (retry) {
    const button = el('button', 'btn btn-primary', 'Try Again');
    button.type = 'button';
    button.addEventListener('click', retry);
    box.append(button);
  }

  container.append(box);
}

export function clearResults() {
  stopCountdown();
  document.getElementById('shabbatTimes').replaceChildren();
}
