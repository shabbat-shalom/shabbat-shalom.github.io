import { announceToScreenReader } from './a11y.js';

function showFeedback(feedback) {
  feedback.style.display = 'flex';
  announceToScreenReader('Shabbat times copied to clipboard');
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
}

function fallbackCopy(text, feedback, onError) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    showFeedback(feedback);
  } catch (err) {
    console.error('Fallback: Could not copy text: ', err);
    onError('Failed to copy. Please try again.');
  }

  document.body.removeChild(textArea);
}

export function copyResults(onError) {
  const text = document.getElementById('shabbatTimes').innerText;
  const feedback = document.getElementById('copyFeedback');

  if (!navigator.clipboard) {
    fallbackCopy(text, feedback, onError);
    return;
  }

  navigator.clipboard.writeText(text).then(
    () => showFeedback(feedback),
    (err) => {
      console.error('Could not copy text: ', err);
      onError('Failed to copy. Please try again.');
    }
  );
}
