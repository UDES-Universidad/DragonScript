
namespace FORM {

    export class Model {
        form: GoogleAppsScript.Forms.Form

        constructor(id_url: string) {
            this.form = this.conn(id_url)
        }

        /**
         * Connects to form
         * @param id_url : URL or ID of Google Form
         */
        conn(id_url: string) {
            if (id_url.indexOf('https://docs.google.com/forms/')) {
                return FormApp.openByUrl(id_url);
            } else if (id_url) {
                return FormApp.openByUrl(id_url);
            }

            return FormApp.getActiveForm();
        }

        infoQuestions() {
            // Obtiene las preguntas
            let items = this.form.getItems()
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

            return questions
        }

    }


}
