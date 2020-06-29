namespace ALERTS {

    type GoogleApp = GoogleAppsScript.Spreadsheet.SpreadsheetApp | GoogleAppsScript.Document.DocumentApp | GoogleAppsScript.Slides.SlidesApp

    export function confirm_yes_no(GoogleApp: GoogleApp, txt: string) {
        // Display a dialog box with a message and "Yes" and "No" buttons.
        let ui = GoogleApp.getUi();
        let response = ui.alert(txt, ui.ButtonSet.YES_NO);

        // Process the user's response.
        if (response == ui.Button.YES) {
            return true;
        } else {
            return false;
        }
    }

}