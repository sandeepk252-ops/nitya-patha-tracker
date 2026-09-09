/**
 * NITYA PATHA - SANSKRIT PARAYANA PROGRESS TRACKER
 * Free Google Apps Script Backend
 * 
 * Instructions:
 * 1. Go to https://script.google.com or open your Google Sheet > Extensions > Apps Script
 * 2. Paste this complete code into Code.gs
 * 3. Click 'Deploy' > 'New Deployment'
 * 4. Select type: 'Web App'
 * 5. Set 'Execute as': 'Me'
 * 6. Set 'Who has access': 'Anyone' (so family devices can sync seamlessly with 0 login)
 * 7. Click 'Deploy', authorize permissions, and copy the Web App URL!
 * 8. Paste the Web App URL in Nitya Patha App > Settings > Cloud Sync.
 */

const SHEET_NAME = '17Lv8Ig6UGpR2zb-VXfB-rYVgk4zmnSyQi-zfk2Tdj5M';

function doGet(e) {
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Nitya Patha - Sanskrit Progress Tracker');
    let sheet = doc.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.getRange('A1:B1').setValues([['Key', 'JSON_Data']]);
    }

    const val = sheet.getRange('B2').getValue();
    const payload = val ? JSON.parse(val) : null;

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      payload: payload,
      sheetUrl: doc.getUrl(),
      lastSync: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const doc = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Nitya Patha - Sanskrit Progress Tracker');
    let sheet = doc.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.getRange('A1:B1').setValues([['Key', 'JSON_Data']]);
    }

    if (data.action === 'SAVE' && data.payload) {
      sheet.getRange('A2').setValue('FAMILY_DATA');
      sheet.getRange('B2').setValue(JSON.stringify(data.payload));
      sheet.getRange('C2').setValue(new Date().toISOString());

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Family progress synchronized successfully to Google Sheet!',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
