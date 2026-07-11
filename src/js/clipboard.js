import { announceToScreenReader } from './a11y.js';

const COPY_TITLE = 'Shabbat Times';

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return normalizeText(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function escapeHtmlPreservingWhitespace(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function dateFromHebcalString(dateString) {
  const match = String(dateString || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function formatDate(dateString) {
  const date = dateFromHebcalString(dateString);
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatClockTime(hours, minutes) {
  const hourNumber = Number(hours);
  const suffix = hourNumber >= 12 ? 'PM' : 'AM';
  const displayHour = hourNumber % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
}

function formatTimeFromDate(dateString) {
  const match = String(dateString || '').match(/T(\d{2}):(\d{2})/);
  if (!match) return '';
  return formatClockTime(match[1], match[2]);
}

function formatTimeFromTitle(title) {
  const match = normalizeText(title).match(/:\s*(\d{1,2}):(\d{2})\s*([ap])\.?m\.?$/i);
  if (!match) return '';
  return `${Number(match[1])}:${match[2]} ${match[3].toUpperCase()}M`;
}

function itemLabel(item) {
  return normalizeText(item.title)
    .replace(/\s*:\s*\d{1,2}:\d{2}\s*[ap]\.?m\.?$/i, '')
    || 'Untitled Event';
}

function isTimedItem(item) {
  return item.category === 'candles' || item.category === 'havdalah';
}

function itemWhen(item) {
  const date = formatDate(item.date);
  const time = isTimedItem(item) ? formatTimeFromDate(item.date) || formatTimeFromTitle(item.title) : '';

  if (date && time) return `${date} at ${time}`;
  return date || time;
}

function itemEntry(item) {
  return {
    label: itemLabel(item),
    when: itemWhen(item),
    hebrew: normalizeText(item.hebrew),
  };
}

function buildClipboardModel(data) {
  const items = Array.isArray(data?.items)
    ? data.items.filter((item) => item && typeof item === 'object')
    : [];
  const parsha = items.find((item) => item.category === 'parashat');

  return {
    title: COPY_TITLE,
    location: normalizeText(data?.location?.title),
    times: items.filter(isTimedItem).map(itemEntry),
    parsha: parsha ? itemEntry(parsha) : null,
    other: items.filter((item) => item !== parsha && !isTimedItem(item)).map(itemEntry),
  };
}

function plainEntry(entry) {
  const firstLine = entry.when ? `${entry.label}: ${entry.when}` : entry.label;
  return entry.hebrew ? `${firstLine}\n${entry.hebrew}` : firstLine;
}

function htmlEntry(entry) {
  const label = escapeHtml(entry.label);
  const when = escapeHtml(entry.when);
  const hebrew = escapeHtml(entry.hebrew);

  return [
    '<p>',
    `<strong>${label}${when ? ':' : ''}</strong>${when ? ` ${when}` : ''}`,
    hebrew ? `<br><span dir="auto">${hebrew}</span>` : '',
    '</p>',
  ].join('');
}

function plainTextToHtml(text) {
  return `<div>${escapeHtmlPreservingWhitespace(text).replace(/\n/g, '<br>')}</div>`;
}

export function formatClipboardContent(data, fallbackText = '') {
  const model = buildClipboardModel(data);

  if (!model.location && model.times.length === 0 && !model.parsha && model.other.length === 0) {
    const plainText = String(fallbackText || '').trim();
    return { plainText, html: plainTextToHtml(plainText) };
  }

  const lines = [model.title];
  if (model.location) lines.push(model.location);

  if (model.times.length) {
    lines.push('', ...model.times.map(plainEntry));
  }

  if (model.parsha) {
    lines.push('', plainEntry({ ...model.parsha, label: 'Torah portion', when: model.parsha.label }));
  }

  if (model.other.length) {
    lines.push('', ...model.other.map(plainEntry));
  }

  const htmlParts = ['<div>', `<p><strong>${escapeHtml(model.title)}</strong>`];
  if (model.location) htmlParts.push(`<br>${escapeHtml(model.location)}`);
  htmlParts.push('</p>');

  model.times.forEach((entry) => htmlParts.push(htmlEntry(entry)));

  if (model.parsha) {
    htmlParts.push(htmlEntry({ ...model.parsha, label: 'Torah portion', when: model.parsha.label }));
  }

  model.other.forEach((entry) => htmlParts.push(htmlEntry(entry)));
  htmlParts.push('</div>');

  return {
    plainText: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    html: htmlParts.join(''),
  };
}

function showFeedback(feedback) {
  feedback.style.display = 'flex';
  announceToScreenReader('Shabbat times copied to clipboard');
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
}

function fallbackCopy(content, feedback, onError) {
  const text = content.plainText;
  const html = content.html;
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();

  const copyListener = (event) => {
    if (!event.clipboardData) return;
    event.clipboardData.setData('text/plain', text);
    event.clipboardData.setData('text/html', html);
    event.preventDefault();
  };

  try {
    document.addEventListener('copy', copyListener);
    if (!document.execCommand('copy')) {
      throw new Error('Copy command was rejected.');
    }
    showFeedback(feedback);
  } catch (err) {
    console.error('Fallback: Could not copy text: ', err);
    onError('Failed to copy. Please try again.');
  } finally {
    document.removeEventListener('copy', copyListener);
    document.body.removeChild(textArea);
  }
}

async function writeClipboard(content) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;

  if (navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([content.plainText], { type: 'text/plain' }),
          'text/html': new Blob([content.html], { type: 'text/html' }),
        }),
      ]);
      return true;
    } catch (err) {
      console.warn('Could not copy rich text; falling back to plain text.', err);
    }
  }

  if (navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(content.plainText);
    return true;
  }

  return false;
}

export function copyResults(data, onError) {
  const handleError = typeof onError === 'function' ? onError : () => {};
  const fallbackText = document.getElementById('shabbatTimes')?.innerText || '';
  const content = formatClipboardContent(data, fallbackText);
  const feedback = document.getElementById('copyFeedback');

  if (!content.plainText) {
    handleError('No Shabbat times to copy yet.');
    return;
  }

  if (!feedback) {
    handleError('Copy feedback element is missing.');
    return;
  }

  writeClipboard(content).then(
    (copied) => {
      if (copied) {
        showFeedback(feedback);
      } else {
        fallbackCopy(content, feedback, handleError);
      }
    },
    (err) => {
      console.error('Could not copy text: ', err);
      fallbackCopy(content, feedback, handleError);
    }
  );
}
