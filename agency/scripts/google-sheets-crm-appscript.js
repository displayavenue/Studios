/**
 * DisplayAvenue free CRM → Google Sheet
 *
 * Setup (5 minutes):
 * 1. Create a Google Sheet named "DisplayAvenue Leads"
 * 2. Extensions → Apps Script → paste this file
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into Admin → CRM → Sheets webhook URL
 *    and set sheets.enabled = true (or enable in crm.json)
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Leads");
    if (!sheet) {
      sheet = ss.insertSheet("Leads");
      sheet.appendRow([
        "Created At",
        "Lead ID",
        "Source",
        "Channel",
        "Name",
        "Phone",
        "Email",
        "Business",
        "Industry",
        "Plan",
        "Budget",
        "Timeline",
        "Score",
        "Temperature",
        "Page",
        "UTM Source",
        "UTM Campaign",
        "Message",
        "WhatsApp Link",
      ]);
    }

    sheet.appendRow([
      data.created_at || new Date().toISOString(),
      data.id || "",
      data.source || "",
      data.channel || "",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.business || "",
      data.industry || "",
      data.plan || "",
      data.budget || "",
      data.timeline || "",
      data.lead_score || "",
      data.lead_temperature || "",
      data.page || "",
      data.utm_source || "",
      data.utm_campaign || "",
      data.message || "",
      data.whatsapp_url || "",
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: "DisplayAvenue Leads CRM" }),
  ).setMimeType(ContentService.MimeType.JSON);
}
