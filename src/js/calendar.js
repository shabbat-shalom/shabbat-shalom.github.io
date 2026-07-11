// Entry for calendar.html: Hebcal events rendered with FullCalendar.
import './shared.js';

const calendarEl = document.getElementById('calendar');
const loadingEl = document.getElementById('calendarLoading');
const errorEl = document.getElementById('calendarError');
const retryButton = document.getElementById('calendarRetry');
const mobileQuery = window.matchMedia('(max-width: 640px)');

const hebcalParams = new URLSearchParams({
  cfg: 'fc',
  v: '1',
  i: 'off',
  maj: 'on',
  min: 'on',
  nx: 'on',
  mf: 'on',
  ss: 'on',
  mod: 'on',
  lg: 's',
  s: 'on',
});

const hebcalEventsUrl = `https://www.hebcal.com/hebcal?${hebcalParams.toString()}`;

function setLoading(isLoading) {
  if (loadingEl) loadingEl.hidden = !isLoading;
}

function setError(isErrored) {
  if (errorEl) errorEl.hidden = !isErrored;
}

function toolbarForViewport(isMobile) {
  return isMobile
    ? {
        left: 'prev,next',
        center: 'title',
        right: 'today',
      }
    : {
        left: 'title',
        center: '',
        right: 'prev,next today',
      };
}

function isEditableElement(element) {
  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(element?.tagName) || element?.isContentEditable;
}

function initCalendar() {
  const FullCalendar = window.FullCalendar;
  if (!calendarEl || !FullCalendar?.Calendar) {
    retryButton?.addEventListener('click', () => window.location.reload());
    setError(true);
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: toolbarForViewport(mobileQuery.matches),
    height: 'auto',
    eventDisplay: 'block',
    dayMaxEvents: true,
    navLinks: true,
    nowIndicator: true,
    buttonText: {
      today: 'Today',
    },
    events: {
      url: hebcalEventsUrl,
      cache: true,
    },
    loading(isLoading) {
      setLoading(isLoading);
      if (isLoading) setError(false);
    },
    eventSourceFailure() {
      setLoading(false);
      setError(true);
    },
  });

  calendar.render();

  retryButton?.addEventListener('click', () => {
    setError(false);
    calendar.refetchEvents();
  });

  mobileQuery.addEventListener('change', (event) => {
    calendar.setOption('headerToolbar', toolbarForViewport(event.matches));
  });

  document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || isEditableElement(event.target)) return;
    if (event.key === 'ArrowLeft') {
      calendar.prev();
    } else if (event.key === 'ArrowRight') {
      calendar.next();
    }
  });
}

initCalendar();
