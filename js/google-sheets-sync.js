/**
 * js/google-sheets-sync.js
 * Frontend client for syncing reading telemetry to Google Sheets.
 */

(function (global) {
  const GOOGLE_SHEETS_CONFIG = {
    // Replace with your Google Apps Script Web App URL
    SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
    TIMEOUT_MS: 10000
  };

  async function syncToGoogleSheets(payload) {
    if (!GOOGLE_SHEETS_CONFIG.SCRIPT_URL || GOOGLE_SHEETS_CONFIG.SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
      console.warn("[Sync Warning] Google Script Web App URL is not configured.");
      return { success: false, reason: "UNCONFIGURED_URL" };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GOOGLE_SHEETS_CONFIG.TIMEOUT_MS);

    const formattedPayload = {
      userId: payload.userId || "Anonymous",
      scriptureId: payload.scriptureId || "Unknown",
      lastReadIndex: payload.lastReadIndex || 0,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(GOOGLE_SHEETS_CONFIG.SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        // text/plain is required to bypass CORS preflight blocking in Apps Script
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(formattedPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP network error status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("[Sync Error] Synchronization failed:", error);
      return { success: false, error: error.message };
    }
  }

  const syncModule = { syncToGoogleSheets, GOOGLE_SHEETS_CONFIG };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = syncModule;
  } else {
    global.syncToGoogleSheets = syncToGoogleSheets;
    global.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
