# Process Emails for Accountant

## Description

This script is designed to automate the processing of emails intended for an accountant. It extracts relevant information from the emails, saves any attachments to Google Drive, and logs the details in a Google Spreadsheet. The script helps streamline the handling of accountant-related emails, ensuring that attachments are organized and easily accessible.

## Use Case

The primary use case for this script is for individuals or organizations that need to process and organize emails sent to their accountant. By automating this process, it reduces manual work and minimizes the risk of missing important attachments or information.

## Instructions

1. **Setup Google Spreadsheet:**
   - Create a new Google Spreadsheet or use an existing one.
   - Note down the Spreadsheet ID from the URL.

2. **Setup Google Drive Folder:**
   - Create a base folder in Google Drive where you want to save the email attachments.
   - Note down the Folder ID from the URL.

3. **Update Script Constants:**
   - Replace `YOUR_SPREADSHEET_ID` with your Google Spreadsheet ID.
   - Replace `YOUR_DRIVE_FOLDER_ID` with your Google Drive Folder ID.
   - Replace `email@accountant.com` with your accountant's email address.

4. **Run the Script:**
   - Open Google Apps Script editor in your Google account.
   - Create a new script and copy-paste the provided code.
   - Save and run the script.

## Pre-conditions

- You must have a Google account.
- The script requires access to your Gmail, Google Drive, and Google Sheets.
- Ensure you have the necessary permissions to access and modify the Google Spreadsheet and Google Drive folder.

## Script Configuration

```javascript
var sheet_id = "YOUR_SPREADSHEET_ID"; // Replace with your Google Spreadsheet ID
var base_folder_id = "YOUR_DRIVE_FOLDER_ID"; // Replace with the ID of the folder in Google Drive where attachments will be saved
var accountant_email = "email@accountant.com"; // Replace with your accountant's email address
var label_name = "PROCESSED"; // Label name to mark emails as processed
var max_emails = 10; // Maximum number of emails to process per execution
```

## Script Functions

### `process_emails_for_accountant()`

This is the main function that processes emails intended for the accountant, extracts relevant information, saves attachments to Google Drive, and logs the details in a Google Spreadsheet.

### `process_message(message, sheet, base_folder_id)`

This function processes a single email message by extracting metadata and saving attachments to Google Drive.

### `save_attachments_to_drive(attachments, base_folder_id, type, email_uid)`

This function saves email attachments to Google Drive, organizing them by type and email UID.

## Limitations

- The script processes a maximum of 10 emails per execution. This limit can be adjusted by changing the `max_emails` variable.
- The script only processes emails sent to the specified accountant's email address within the last 7 days.
- The script requires a specific format for the email subject to categorize the attachments. The format should include the document type in square brackets (e.g., `[Invoice]`).

## Warnings

- Ensure that the Google Spreadsheet and Google Drive folder IDs are correct to avoid errors.
- The script requires access to your Gmail, Google Drive, and Google Sheets. Make sure to review the permissions and security implications before running the script.
- Handle sensitive information such as email addresses and document contents with care. Ensure that the script and its outputs are stored securely.

## Example

An example email subject format: `[Invoice] March 2025 Billing`

This subject will categorize the email as an "INVOICE" and save the attachments in a folder named "INVOICE" inside the specified base folder, with a subfolder named after the email UID.

## Conclusion

This script automates the processing of accountant-related emails, saving time and ensuring that attachments are organized in Google Drive and logged in a Google Spreadsheet. By following the setup instructions and understanding the limitations, users can efficiently manage their accountant's emails.