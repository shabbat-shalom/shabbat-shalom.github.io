// Countdown card: time until candle lighting, or until Havdalah when
// Shabbat is in progress. Uses the items' ISO timestamps directly — they
// carry the searched location's UTC offset, so the math is correct even
// when the device is in a different timezone.

let timerId = null;

function findNext(items, category, now) {
  return items.find((item) => item.category === category && new Date(item.date) > now);
}

function formatRemaining(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

function computeState(items) {
  const now = new Date();
  const nextCandles = findNext(items, 'candles', now);
  const nextHavdalah = findNext(items, 'havdalah', now);

  if (nextCandles && (!nextHavdalah || new Date(nextCandles.date) < new Date(nextHavdalah.date))) {
    return {
      label: 'Candle lighting in',
      value: formatRemaining(new Date(nextCandles.date) - now),
    };
  }
  if (nextHavdalah) {
    return {
      label: 'Shabbat now · Havdalah in',
      value: formatRemaining(new Date(nextHavdalah.date) - now),
      active: true,
    };
  }
  return null;
}

export function stopCountdown() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

// Renders (and keeps ticking) a countdown card inside `container`.
export function startCountdown(container, items) {
  stopCountdown();

  const card = document.createElement('div');
  card.className = 'countdown-card';
  const label = document.createElement('div');
  label.className = 'countdown-label';
  const value = document.createElement('div');
  value.className = 'countdown-value';
  card.append(label, value);

  function update() {
    const state = computeState(items);
    if (!state) {
      stopCountdown();
      card.remove();
      return;
    }
    label.textContent = state.label;
    value.textContent = state.value;
    card.classList.toggle('countdown-card--active', Boolean(state.active));
  }

  if (!computeState(items)) return;
  container.prepend(card);
  update();
  timerId = setInterval(update, 30 * 1000);
}
