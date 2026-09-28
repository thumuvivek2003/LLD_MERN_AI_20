/**
 * Minimal RFC-4180-ish CSV helpers used by Import (parse) and Export (download).
 * Deliberately small: the backend owns real import/export semantics.
 */

export const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i += 1;
        } else quoted = false;
      } else value += char;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(value);
      value = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else value += char;
  }
  if (value !== '' || row.length) {
    row.push(value);
    rows.push(row);
  }

  const cleaned = rows.filter((r) => r.some((cell) => cell.trim() !== ''));
  if (!cleaned.length) return { headers: [], rows: [] };

  const headers = cleaned[0].map((h) => h.trim());
  const dataRows = cleaned.slice(1).map((cells) =>
    headers.reduce((acc, header, i) => {
      acc[header] = (cells[i] ?? '').trim();
      return acc;
    }, {}),
  );
  return { headers, rows: dataRows };
};

const escapeCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = (headers, rows) =>
  [headers.map(escapeCell).join(','), ...rows.map((row) => row.map(escapeCell).join(','))].join(
    '\n',
  );

export const downloadFile = (filename, content, mime = 'text/csv;charset=utf-8') => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the selected file'));
    reader.readAsText(file);
  });
