/**
 * Alicia Clothes — Thu lead vào Google Sheet + gửi email
 *
 * CÁCH CÀI ĐẶT (làm một lần):
 * 1. Mở https://sheets.google.com → Tạo bảng mới (vd: "Alicia Leads")
 * 2. Hàng 1 gõ tiêu đề: Thời gian | Tên | Email | SĐT | Nội dung yêu cầu
 * 3. Extensions → Apps Script → dán toàn bộ file này → Save
 * 4. Sửa NOTIFY_EMAIL bên dưới nếu cần
 * 5. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL Web app → dán vào GOOGLE_SCRIPT_URL trong index.html
 */

const NOTIFY_EMAIL = "ngothanhngoc0101@gmail.com";
const SHEET_NAME = "Sheet1"; // đổi nếu tab sheet khác tên

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || "{}";
    const data = JSON.parse(raw);

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const requestContent = String(data.request_content || "").trim();

    if (!name || !email || !phone || !requestContent) {
      return jsonResponse({ ok: false, error: "missing_fields" });
    }

    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    sheet.appendRow([timestamp, name, email, phone, requestContent]);

    const subject = "[Alicia Clothes] Lead mới: " + name;
    const body = [
      "Có khách hàng mới đăng ký trên website.",
      "",
      "Thời gian: " + timestamp,
      "Tên: " + name,
      "Email: " + email,
      "SĐT: " + phone,
      "Nội dung yêu cầu: " + requestContent,
    ].join("\n");

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
      replyTo: email,
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: "Alicia lead endpoint is running." });
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
