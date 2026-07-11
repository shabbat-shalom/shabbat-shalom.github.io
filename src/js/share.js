import { announceToScreenReader } from './a11y.js';
import { showNotification } from './pwa/network-status.js';

function getMetaContent(selector) {
  return document.querySelector(selector)?.getAttribute('content')?.trim() || '';
}

function buildShareData() {
  return {
    title: getMetaContent('meta[property="og:title"]') || document.title || 'Jewish Times',
    text:
      getMetaContent('meta[name="description"]') ||
      'Find accurate Shabbat times and Zmanim for your location.',
    url: window.location.href,
  };
}

function copyWithTextArea(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Copy command was rejected.');
    }
  } finally {
    document.body.removeChild(textArea);
  }
}

async function copyUrlToClipboard(url) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return;
    } catch (error) {
      console.warn('Could not use Clipboard API; trying fallback copy.', error);
    }
  }

  copyWithTextArea(url);
}

async function sharePage() {
  const shareData = buildShareData();

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      announceToScreenReader('Share options opened');
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.warn('Could not open native share options; copying link instead.', error);
    }
  }

  try {
    await copyUrlToClipboard(shareData.url);
    showNotification('Link copied to clipboard', 'success');
    announceToScreenReader('Link copied to clipboard');
  } catch (error) {
    console.error('Could not copy link:', error);
    showNotification('Unable to copy link. Please copy the address from your browser.', 'warning');
    announceToScreenReader('Unable to copy link');
  }
}

export function initShare() {
  const shareButtons = document.querySelectorAll('[data-share-page]');
  if (!shareButtons.length) return;

  shareButtons.forEach((shareButton) => {
    shareButton.addEventListener('click', sharePage);
  });
}
