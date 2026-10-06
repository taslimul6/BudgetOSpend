const COLUMNS = ["id", "type", "title", "amount", "category", "date", "description", "recurring"];

// Quotes a cell and neutralises spreadsheet formula injection (=, +, -, @).
function cell(value) {
  let text = value === undefined || value === null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function expensesToCSV(expenses) {
  const rows = expenses.map((e) => COLUMNS.map((col) => cell(e[col])).join(","));
  return [COLUMNS.join(","), ...rows].join("\r\n");
}

export function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
