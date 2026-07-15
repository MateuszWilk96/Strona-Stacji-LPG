const CONFIG = {
  LPG_EMAIL: 'twoja.stacja.lpg@gmail.com',
  INSURANCE_EMAIL: 'twoja.strefa.ubezpieczen.pl@gmail.com',
  TIMEZONE: 'Europe/Warsaw',
  LPG_SHEET: 'Zamowienia LPG',
  INSURANCE_SHEET: 'Ubezpieczenia',
  DASHBOARD_SHEET: 'Statystyki'
};

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');
    const isInsurance = data.type === 'insurance-lead';
    const sheetName = isInsurance ? CONFIG.INSURANCE_SHEET : CONFIG.LPG_SHEET;
    const id = createId(isInsurance ? 'UBEZ' : 'LPG');
    const receivedAt = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    const record = { ID: id, Status: 'Nowe', Otrzymano: receivedAt, ...data };

    appendRecord(sheetName, record);
    updateDashboard();
    sendFormattedEmail(isInsurance, record);

    return jsonResponse({ ok: true, id });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function createId(prefix) {
  const date = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyyMMdd');
  const suffix = Utilities.getUuid().slice(0, 6).toUpperCase();
  return `${prefix}-${date}-${suffix}`;
}

function appendRecord(sheetName, record) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  const keys = Object.keys(record);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(keys);
    sheet.getRange(1, 1, 1, keys.length).setFontWeight('bold').setBackground('#dbeafe');
    sheet.setFrozenRows(1);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  keys.forEach((key) => {
    if (!headers.includes(key)) {
      sheet.getRange(1, headers.length + 1).setValue(key).setFontWeight('bold').setBackground('#dbeafe');
      headers.push(key);
    }
  });

  const row = headers.map((header) => normalizeValue(record[header]));
  sheet.appendRow(row);
  sheet.autoResizeColumns(1, headers.length);
}

function normalizeValue(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function sendFormattedEmail(isInsurance, record) {
  const recipient = isInsurance ? CONFIG.INSURANCE_EMAIL : CONFIG.LPG_EMAIL;
  const title = isInsurance ? `Nowe zapytanie ubezpieczeniowe ${record.ID}` : `Nowe zamówienie LPG ${record.ID}`;
  const accent = isInsurance ? '#047857' : '#2563eb';
  const rows = Object.entries(record)
    .filter(([key]) => !['type'].includes(key))
    .map(([key, value]) => `<tr><td style="padding:10px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700">${escapeHtml(key)}</td><td style="padding:10px;border:1px solid #e5e7eb">${escapeHtml(normalizeValue(value))}</td></tr>`)
    .join('');

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#0f172a">
      <div style="background:${accent};color:white;padding:24px;border-radius:14px 14px 0 0">
        <h1 style="margin:0;font-size:24px">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 14px 14px">
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <p style="margin-top:20px;color:#64748b;font-size:12px">Wiadomość wygenerowana automatycznie przez stronę internetową.</p>
      </div>
    </div>`;

  MailApp.sendEmail({ to: recipient, subject: title, htmlBody });
}

function updateDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET) || spreadsheet.insertSheet(CONFIG.DASHBOARD_SHEET);
  sheet.clear();
  sheet.getRange('A1:B1').setValues([['Wskaźnik', 'Wartość']]).setFontWeight('bold').setBackground('#fde68a');
  sheet.getRange('A2:B6').setValues([
    ['Wszystkie zamówienia LPG', countDataRows(CONFIG.LPG_SHEET)],
    ['Wszystkie zapytania ubezpieczeniowe', countDataRows(CONFIG.INSURANCE_SHEET)],
    ['Nowe zamówienia LPG', countStatus(CONFIG.LPG_SHEET, 'Nowe')],
    ['Nowe zapytania ubezpieczeniowe', countStatus(CONFIG.INSURANCE_SHEET, 'Nowe')],
    ['Ostatnia aktualizacja', Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss')]
  ]);
  sheet.autoResizeColumns(1, 2);
}

function countDataRows(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
}

function countStatus(sheetName, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return 0;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const column = headers.indexOf('Status') + 1;
  if (!column) return 0;
  return sheet.getRange(2, column, sheet.getLastRow() - 1).getValues().flat().filter((value) => value === status).length;
}

function createSpreadsheetBackup() {
  const file = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  const folderName = 'Kopie strony LPG i Ubezpieczenia';
  const folders = DriveApp.getFoldersByName(folderName);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  const stamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd_HH-mm');
  file.makeCopy(`${file.getName()}_backup_${stamp}`, folder);
}

function installDailyBackupTrigger() {
  ScriptApp.getProjectTriggers().filter((trigger) => trigger.getHandlerFunction() === 'createSpreadsheetBackup').forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('createSpreadsheetBackup').timeBased().everyDays(1).atHour(2).create();
}

function escapeHtml(text) {
  return String(text).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
