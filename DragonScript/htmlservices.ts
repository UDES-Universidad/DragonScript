namespace HTMLSERVISE {

    export function include(filename: string) {
        return HtmlService.createHtmlOutputFromFile(filename)
            .getContent();
    }


    type param_sidebar = {
        template: string,
        title: string
    }

    export function sidebar(param: param_sidebar): void {
        let ui = HtmlService.createTemplateFromFile(param.template).evaluate()
            .setTitle(param.title);
        SpreadsheetApp.getUi().showSidebar(ui);
    }


    type param_modeal_dialog = {
        template: string,
        title: string,
        width?: number,
        height?: number
    }

    export function modal_dialog(param: param_modeal_dialog): void {
        let html = HtmlService.createTemplateFromFile(param.template).evaluate();

        if (param.width) {
            html.setWidth(param.width);
        }

        if (param.height) {
            html.setHeight(param.height);
        }

        SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
            .showModalDialog(html, param.title);
    }

}
