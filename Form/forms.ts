namespace Form {

    export function conn(id: string): GoogleAppsScript.Forms.Form {
        // Se coneta con un formulario.
        if (id.indexOf('https://docs.google.com/forms/') >= 0) {
            return FormApp.openByUrl(id);
        } else {
            return FormApp.openById(id);
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

}