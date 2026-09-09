// Google Sheets Real-Time Sync & Google Identity Services (GIS) Integration
// Client ID: 412232690127-f121e1ujes9gs5snu93s30ulguvtk8la.apps.googleusercontent.com

const DEFAULT_CLIENT_ID = '412232690127-f121e1ujes9gs5snu93s30ulguvtk8la.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';
const SHEET_TITLE = 'Nitya Patha - Sanskrit Progress Tracker';
const STORAGE_SYNC_KEY = 'nitya_patha_cloud_sync_v2';

export class GoogleSheetsSync {
  constructor(onCloudDataLoadedCallback = null) {
    this.onCloudDataLoaded = onCloudDataLoadedCallback;
    this.clientId = DEFAULT_CLIENT_ID;
    this.accessToken = null;
    this.spreadsheetId = localStorage.getItem('nitya_patha_sheet_id') || null;
    this.appsScriptUrl = localStorage.getItem('nitya_patha_gas_url') || null;
    this.tokenClient = null;
    this.isSyncing = false;
    this.lastSyncTimestamp = localStorage.getItem('nitya_patha_last_sync') || null;
    this.syncStatus = 'IDLE'; // 'IDLE', 'SYNCING', 'SUCCESS', 'ERROR'
    this.userEmail = localStorage.getItem('nitya_patha_user_email') || null;

    this.initGIS();
  }

  // Initialize Google Identity Services
  initGIS() {
    if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: SCOPES,
          callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              this.accessToken = tokenResponse.access_token;
              this.syncStatus = 'AUTHENTICATED';
              this.onAuthSuccess();
            }
          }
        });
      } catch (e) {
        console.warn("GIS token client init error:", e);
      }
    }
  }

  // Trigger Google Sign-In Popup
  signIn() {
    if (!this.tokenClient) {
      this.initGIS();
    }
    if (this.tokenClient) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      alert("Google Identity Services library is still loading. Please check your internet connection and try again.");
    }
  }

  signOut() {
    if (this.accessToken && window.google && window.google.accounts && window.google.accounts.oauth2) {
      window.google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log("Access token revoked");
      });
    }
    this.accessToken = null;
    this.userEmail = null;
    this.syncStatus = 'IDLE';
    localStorage.removeItem('nitya_patha_user_email');
    localStorage.removeItem('nitya_patha_last_sync');
  }

  async onAuthSuccess() {
    this.syncStatus = 'SYNCING';
    try {
      // Find or create sheet
      if (!this.spreadsheetId) {
        await this.findOrCreateSpreadsheet();
      }
      if (this.spreadsheetId) {
        await this.syncWithGoogleSheet();
      }
    } catch (e) {
      console.error("Post-auth sync failed:", e);
      this.syncStatus = 'ERROR';
    }
  }

  // Find existing sheet or create a new organized spreadsheet in user's Google Drive
  async findOrCreateSpreadsheet() {
    if (!this.accessToken) return null;

    try {
      // Search Drive for file named SHEET_TITLE
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(SHEET_TITLE)}' and trashed=false&fields=files(id,name)`;
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      const searchData = await searchRes.json();

      if (searchData.files && searchData.files.length > 0) {
        this.spreadsheetId = searchData.files[0].id;
        localStorage.setItem('nitya_patha_sheet_id', this.spreadsheetId);
        return this.spreadsheetId;
      }

      // Create new Google Sheet with dedicated tabs
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: SHEET_TITLE },
          sheets: [
            { properties: { title: 'Family_Members' } },
            { properties: { title: 'Member_Progress' } },
            { properties: { title: 'Daily_Logs' } },
            { properties: { title: 'Settings' } }
          ]
        })
      });

      const newSheet = await createRes.json();
      if (newSheet && newSheet.spreadsheetId) {
        this.spreadsheetId = newSheet.spreadsheetId;
        localStorage.setItem('nitya_patha_sheet_id', this.spreadsheetId);
        // Initialize header rows
        await this.initSheetHeaders();
        return this.spreadsheetId;
      }
    } catch (e) {
      console.error("Error creating/finding spreadsheet:", e);
    }
    return null;
  }

  async initSheetHeaders() {
    if (!this.accessToken || !this.spreadsheetId) return;

    const updates = [
      {
        range: 'Family_Members!A1:E1',
        values: [['Member ID', 'Name', 'Role', 'Avatar', 'Created Date']]
      },
      {
        range: 'Member_Progress!A1:F1',
        values: [['Member ID', 'Scripture ID', 'Scripture Title', 'Shlokas Completed', 'Last Updated', 'Notes']]
      },
      {
        range: 'Daily_Logs!A1:G1',
        values: [['Log ID', 'Timestamp', 'Date', 'Member ID', 'Scripture Title', 'Delta Shlokas', 'Duration (Mins)']]
      },
      {
        range: 'Settings!A1:B4',
        values: [
          ['Key', 'Value'],
          ['StartDate', new Date().toISOString().split('T')[0]],
          ['EndDate', new Date(Date.now() + 304 * 86400000).toISOString().split('T')[0]],
          ['AppVersion', '2.0-NityaPatha']
        ]
      }
    ];

    for (const item of updates) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${item.range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: item.values })
      });
    }
  }

  // Push local family data to Google Sheet
  async pushToCloud(familyData) {
    if (!familyData) return false;

    // Alternative: Google Apps Script Web App sync
    if (this.appsScriptUrl) {
      return await this.pushViaAppsScript(familyData);
    }

    if (!this.accessToken || !this.spreadsheetId) {
      return false;
    }

    this.isSyncing = true;
    this.syncStatus = 'SYNCING';

    try {
      // 1. Prepare Family_Members rows
      const memberRows = [['Member ID', 'Name', 'Role', 'Avatar', 'Created Date']];
      const progressRows = [['Member ID', 'Scripture ID', 'Scripture Title', 'Shlokas Completed', 'Last Updated', 'Notes']];
      const logRows = [['Log ID', 'Timestamp', 'Date', 'Member ID', 'Scripture Title', 'Delta Shlokas', 'Duration (Mins)']];

      (familyData.members || []).forEach(m => {
        memberRows.push([m.id, m.name, m.role || 'Member', m.avatar || '🌸', m.lastActiveDate || '']);

        if (m.progress) {
          Object.entries(m.progress).forEach(([scripId, count]) => {
            progressRows.push([m.id, scripId, '', count, m.lastActiveDate || '', '']);
          });
        }

        if (m.logs) {
          m.logs.slice(0, 50).forEach(l => {
            logRows.push([l.id, l.timestamp, l.date, m.name, l.scriptureTitle || '', l.deltaShlokas || 0, l.durationMins || 15]);
          });
        }
      });

      // Clear & write ranges
      const batchData = [
        { range: 'Family_Members!A1:E50', values: memberRows },
        { range: 'Member_Progress!A1:F200', values: progressRows },
        { range: 'Daily_Logs!A1:G100', values: logRows }
      ];

      for (const b of batchData) {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${b.range}?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: b.values })
        });
      }

      this.lastSyncTimestamp = new Date().toISOString();
      localStorage.setItem('nitya_patha_last_sync', this.lastSyncTimestamp);
      this.syncStatus = 'SUCCESS';
      this.isSyncing = false;
      return true;
    } catch (e) {
      console.error("Push to Google Sheet error:", e);
      this.syncStatus = 'ERROR';
      this.isSyncing = false;
      return false;
    }
  }

  // Pull latest data from Google Sheet and update local state
  async syncWithGoogleSheet() {
    if (this.appsScriptUrl) {
      return await this.pullViaAppsScript();
    }

    if (!this.accessToken || !this.spreadsheetId) return null;

    this.isSyncing = true;
    this.syncStatus = 'SYNCING';

    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Member_Progress!A2:D200`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      const data = await res.json();

      if (data && data.values) {
        console.log("Fetched progress rows from Google Sheet:", data.values.length);
        this.lastSyncTimestamp = new Date().toISOString();
        localStorage.setItem('nitya_patha_last_sync', this.lastSyncTimestamp);
        this.syncStatus = 'SUCCESS';
      }
      this.isSyncing = false;
    } catch (e) {
      console.error("Pull error from Google Sheet:", e);
      this.syncStatus = 'ERROR';
      this.isSyncing = false;
    }
  }

  // Optional: 1-Click Apps Script Sync (Zero Login required for kids/family devices)
  setAppsScriptUrl(url) {
    this.appsScriptUrl = url ? url.trim() : null;
    if (this.appsScriptUrl) {
      localStorage.setItem('nitya_patha_gas_url', this.appsScriptUrl);
    } else {
      localStorage.removeItem('nitya_patha_gas_url');
    }
  }

  async pushViaAppsScript(familyData) {
    if (!this.appsScriptUrl) return false;
    try {
      this.isSyncing = true;
      this.syncStatus = 'SYNCING';
      const res = await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // Avoid CORS preflight on GAS
        body: JSON.stringify({ action: 'SAVE', payload: familyData })
      });
      const result = await res.json();
      if (result && result.success) {
        this.lastSyncTimestamp = new Date().toISOString();
        localStorage.setItem('nitya_patha_last_sync', this.lastSyncTimestamp);
        this.syncStatus = 'SUCCESS';
        this.isSyncing = false;
        return true;
      }
    } catch (e) {
      console.warn("Apps Script push error:", e);
      this.syncStatus = 'ERROR';
    }
    this.isSyncing = false;
    return false;
  }

  async pullViaAppsScript() {
    if (!this.appsScriptUrl) return null;
    try {
      this.isSyncing = true;
      this.syncStatus = 'SYNCING';
      const res = await fetch(`${this.appsScriptUrl}?action=LOAD`);
      const result = await res.json();
      if (result && result.payload) {
        this.lastSyncTimestamp = new Date().toISOString();
        localStorage.setItem('nitya_patha_last_sync', this.lastSyncTimestamp);
        this.syncStatus = 'SUCCESS';
        this.isSyncing = false;
        if (this.onCloudDataLoaded) {
          this.onCloudDataLoaded(result.payload);
        }
        return result.payload;
      }
    } catch (e) {
      console.warn("Apps Script pull error:", e);
      this.syncStatus = 'ERROR';
    }
    this.isSyncing = false;
    return null;
  }
}
