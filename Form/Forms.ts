namespace FORMS {

    export function conn(id_url: string) {
        if (id_url.indexOf('https://docs.google.com/forms/')) {
            return FormApp.openByUrl(id_url);
        } else if (id_url) {
            return FormApp.openByUrl(id_url);
        }

        return FormApp.getActiveForm();
    }

}
