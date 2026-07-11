// Renders Hebcal results into #shabbatTimes using DOM APIs (no innerHTML
// string building, so no escaping concerns).

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
  const li = el('li', isTimed ? category : (category === 'parashat' || category === 'holiday') ? category : 'other');

  if (isTimed) {
    const row = el('div', 'time-row');
    row.append(el('span', 'time-label', title), el('span', 'time-value', formatTime(item.date)));
    li.append(row);
    if (date) li.append(el('div', 'time-date', date));
  } else if (category === 'parashat' || category === 'holiday') {
    li.append(el('div', 'event-title', title));
    if (hebrew) li.append(el('div', 'event-subtitle', hebrew));
    if (date) li.append(el('div', 'event-date', date));
  } else {
    li.append(el('div', 'event-title', title));
    if (date) li.append(el('div', 'event-date', date));
  }

  return li;
}

export function renderShabbatTimes(data) {
  const container = document.getElementById('shabbatTimes');
  container.replaceChildren();

  const wrapper = el('div', 'hebcal-container');
  const inner = el('div');

  if (data.location?.title) {
    inner.append(el('h3', null, data.location.title));
  }

  const list = el('ul', 'hebcal-results');
  for (const item of data.items) {
    if (item && typeof item === 'object') list.append(renderItem(item));
  }
  inner.append(list);

  // Attribution required by Hebcal's API terms
  const copyright = el('div', 'copyright');
  const link = el('a', null, 'Powered by Hebcal.com');
  link.href = data.link || 'https://www.hebcal.com/';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  copyright.append(link);
  inner.append(copyright);

  wrapper.append(inner);
  container.append(wrapper);
}

export function renderError(message) {
  const container = document.getElementById('shabbatTimes');
  container.replaceChildren();

  const box = el('div', 'error-card');
  const icon = document.createElement('box-icon');
  icon.setAttribute('name', 'error-circle');
  icon.setAttribute('type', 'solid');
  icon.setAttribute('color', '#ef4444');
  icon.setAttribute('size', 'md');
  box.append(icon, el('p', null, message));
  container.append(box);
}

export function clearResults() {
  document.getElementById('shabbatTimes').replaceChildren();
}
