
namespace FORM {

    export function conn(id_url: string) {
        if (id_url.indexOf('https://docs.google.com/forms/')) {
            return FormApp.openByUrl(id_url);
        } else if (id_url) {
            return FormApp.openByUrl(id_url);
        }

        return FormApp.getActiveForm();
    }

}

export function Questions(form: GoogleAppsScript.Forms.Form, array_of?: string) {
    // Obtiene las preguntas
    let items = form.getItems()
    let questions = []

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        questions.push(
            {
                type: item.getType(),
                id: item.getId(),
                index: item.getIndex(),
                title: item.getTitle(),
                help_text: item.getHelpText(),
            }
        );
    }

    if (array_of) {
        let list = []
        for (const item of questions) {
            list.push(item[array_of]);
        }
        return list;
    } else {
        return questions;
    }

}