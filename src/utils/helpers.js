
/**
 * Copy text to clipboard.
 * @param {string} text - The text to copy.
 * @param {function} onComplete - Callback function called after copying.
 */
export const copyToClipboard = (text, onComplete) => {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if (onComplete) onComplete();
  });
};

/**
 * Download content as a file.
 * @param {string|Blob} content - The content to download.
 * @param {string} filename - The name of the file.
 * @param {string} type - The MIME type of the file.
 */
export const downloadFile = async (content, filename, type) => {
  let blob;
  if (content instanceof Blob) {
    blob = content;
  } else {
    if (type === 'pdf') {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const splitText = doc.splitTextToSize(content, 180);
      doc.text(splitText, 10, 10);
      blob = doc.output('blob');
    } else {
      blob = new Blob([content], { type: type === 'md' ? 'text/markdown' : 'text/plain' });
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith(`.${type}`) ? filename : `${filename}.${type}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
