/**
 * NITYA PATHA - SANSKRIT PARAYANA PROGRESS TRACKER
 * Free Google Apps Script Backend
 *
 * Instructions:
 * 1. Go to https://script.google.com or open your Google Sheet > Extensions > Apps Script
 * 2. Paste this complete code into Code.gs, replacing everything
 * 3. Click 'Deploy' > 'Manage deployments' > pick the existing deployment > Edit (pencil) > New version > Deploy
 *    (Use "Manage deployments", NOT "New deployment" — that keeps your existing /exec URL the same.)
 * 4. If prompted, re-authorize permissions.
 * 5. Test using the testDoPost() function below (Run button in the editor) before checking the app.
 */

// The actual Spreadsheet ID — the long string in your Sheet's URL between /d/ and /edit
const SPREADSHEET_ID = '17Lv8Ig6UGpR2zb-VXfB-rYVgk4zmnSyQi-zfk2Tdj5M';

// The tab (sheet) name INSIDE that spreadsheet where data will be written
const SHEET_NAME = 'NityaPathaData';

function getDoc_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet_(doc) {
  let sheet = doc.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
    sheet.getRange('A1:C1').setValues([['Key', 'JSON_Data', 'LastUpdated']]);
  }
  return sheet;
}

function doGet(e) {
  try {
    const doc = getDoc_();
    const sheet = getOrCreateSheet_(doc);

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
    const doc = getDoc_();
    const sheet = getOrCreateSheet_(doc);

    if (data.action === 'SAVE' && data.payload) {
      sheet.getRange('A2').setValue('FAMILY_DATA');
      sheet.getRange('B2').setValue(JSON.stringify(data.payload));
      sheet.getRange('C2').setValue(new Date().toISOString());
      SpreadsheetApp.flush();

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

/**
 * TEST HELPER — run this directly in the Apps Script editor (select it from the
 * function dropdown, click Run) to verify doPost works WITHOUT needing the deployed
 * web app or the actual front-end. Check View > Logs afterward for the result.
 */
function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'SAVE',
        payload: { test: true, members: [{ id: 'm1', name: 'Test User', progress: {} }] }
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}    return ContentService.createTextOutput(JSON.stringify({
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
