/**
 * Form creator.
 * */

class GformCreator {
  private app: GoogleAppsScript.Forms.Form;

  get id():string {
    return this.app.getId();
  }

  get urlEdit(): string {
    return this.app.getEditUrl();
  }

  /**
   * Connects to the application.
   * @param urlOrId (string): URL or id or nothing to
   * connect to the active form.
   * */
  public connect(urlOrId?: string): GformCreator {
    if (urlOrId && urlOrId.includes('google.com')) {
      this.app = FormApp.openByUrl(urlOrId);
    } else if (urlOrId) {
      this.app = FormApp.openById(urlOrId);
    }
    this.app = FormApp.getActiveForm();
    return this;
  }

  /**
   * Gets information about questions.
   * */
  public infoQuestions() {
    // Obtiene las preguntas
    const items = this.app.getItems();
    const questions = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      questions.push({
        type: item.getType(),
        id: item.getId(),
        index: item.getIndex(),
        title: item.getTitle(),
        help_text: item.getHelpText(),
      });
    }
    return questions;
  }
}

/*
 * namespace FORM {

    export class Model {
        form: GoogleAppsScript.Forms.Form

        constructor(id_url: string) {
            this.form = this.conn(id_url)
        }

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


}*/
