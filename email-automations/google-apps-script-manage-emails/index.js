/**
 * Process emails intended for the accountant, extract relevant information,
 * save attachments to Google Drive, and log the details in a Google Spreadsheet.
 */
function main() {
  var sheet_id = "YOUR_SPREADSHEET_ID"; // Replace with your Google Spreadsheet ID
  var base_folder_id = "YOUR_DRIVE_FOLDER_ID"; // Replace with the ID of the folder in Google Drive where attachments will be saved
  var accountant_email = "email@accountant.com"; // Replace with your accountant's email address
  var label_name = "PROCESSED"; // Label name to mark emails as processed
  var max_emails = 10; // Maximum number of emails to process per execution
  
  var sheet = SpreadsheetApp.openById(sheet_id).getActiveSheet();

  // Define column titles
  var column_titles = ["Date", "Email UID", "Sender", "Recipient", "Subject", "Drive Folder"];

  // Check if the spreadsheet has headers, if not, add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(column_titles);
  }
  
  try {
    // Search for emails sent to the accountant in the last 7 days that are not labeled as PROCESSED
    var threads = GmailApp.search("to:" + accountant_email + " newer_than:7d -label:" + label_name, 0, max_emails);
    
    // Get or create the PROCESSED label
    var label = GmailApp.getUserLabelByName(label_name);
    if (!label) {
      label = GmailApp.createLabel(label_name);
    }
    
    threads.forEach(thread => {
      var messages = thread.getMessages();
      messages.forEach(message => {
        try {
          process_message(message, sheet, base_folder_id);
        } catch (error) {
          // Log errors in the spreadsheet
          sheet.appendRow([new Date(), "ERROR", "Failed to process an email", error.message]);
        }
      });
      
      // Label the entire thread as PROCESSED to avoid processing it again
      thread.addLabel(label);
    });
  } catch (error) {
    // Log errors in the spreadsheet
    sheet.appendRow([new Date(), "ERROR", "Failed to search emails", error.message]);
  }
}

/**
 * Process a single email message by extracting metadata and saving attachments to Google Drive.
 * @param {GmailMessage} message - The email message to process.
 * @param {Sheet} sheet - The Google Spreadsheet to log details.
 * @param {string} base_folder_id - The ID of the base folder in Google Drive.
 */
function process_message(message, sheet, base_folder_id) {
  var subject = message.getSubject() || "NO SUBJECT";
  var date = message.getDate();
  var recipient = message.getTo();
  var sender = message.getFrom();
  var email_uid = message.getId(); // Get the email UID
  var attachments = message.getAttachments();
  
  // Extract the document type from the subject and convert to uppercase
  var type_match = subject.match(/\[(.*?)\]/);
  var type = type_match ? type_match[1].toUpperCase() : "NO_CATEGORY";
  
  var folder_url = "No files";
  
  if (attachments.length > 0) {
    // Create a specific folder in Drive for this email only if it has attachments
    folder_url = save_attachments_to_drive(attachments, base_folder_id, type, email_uid);
  }
  
  // Log the email details in the spreadsheet
  sheet.appendRow([date, email_uid, sender, recipient, subject, folder_url]);
}

/**
 * Save email attachments to Google Drive, organizing them by type and email UID.
 * @param {Array.<Blob>} attachments - The email attachments to save.
 * @param {string} base_folder_id - The ID of the base folder in Google Drive.
 * @param {string} type - The type/category of the document.
 * @param {string} email_uid - The UID of the email.
 * @returns {string} - The URL of the folder where attachments are saved.
 */
function save_attachments_to_drive(attachments, base_folder_id, type, email_uid) {
  var base_folder = DriveApp.getFolderById(base_folder_id);
  var type_folders = base_folder.getFoldersByName(type);
  var type_folder;
  
  // Check if a folder for the document type already exists, if not, create one
  if (type_folders.hasNext()) {
    type_folder = type_folders.next();
  } else {
    type_folder = base_folder.createFolder(type);
  }
  
  var email_folders = type_folder.getFoldersByName(email_uid);
  var email_folder;
  
  // Check if a folder for the email UID already exists, if not, create one
  if (email_folders.hasNext()) {
    email_folder = email_folders.next();
  } else {
    email_folder = type_folder.createFolder(email_uid);
  }
  
  // Save each attachment in the email's folder
  attachments.forEach(file => {
    email_folder.createFile(file);
  });
  
  return email_folder.getUrl(); // Return the URL of the folder where attachments are saved
}