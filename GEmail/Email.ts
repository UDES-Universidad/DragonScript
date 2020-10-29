namespace EMAIL {

  /**
   * Envía correo electrónico. 200 si el correo fue enviado.
   * @param to : Correo objetivo.
   * @param subject : Asunto.
   * @param htmlBody : Cuerpo del mensaje HTML.
   */
  export function send_email(to: string, 
    subject: string, 
    htmlBody: string, 
    cc?: string) {
    try {
      let email_data = {
        to: to,
        subject: subject,
        htmlBody: htmlBody,
      }
      
      if (cc) {
        email_data['cc'] = cc;
      }

      let email = MailApp.sendEmail(email_data);
      return email;
    } catch (error) {
      return error
    }
  }


  /**
   * Obtiene Html de un template y sustitulle los datos
   * por los que se encuentren en data_sustitution.
   * Los datos que se sutituirán en el HTML deben ir precedidos
   * y sucedidos por '##'. Ej.: ##name##. Estos marcadores responden
   * a las claves de los objetos enlistados en data_sustitution.
   * @param template : Plantilla de donde se extraerá el HTML.
   * @param data_sustitution : Array de objetos con los datos a sustituir
   * en el HTML obtenido del template.
   */
  export function get_body_from_file(template: string, 
    data_sustitution?: {}[], baseTemplate?: string): string {
      let html_body = HtmlService
        .createHtmlOutputFromFile(template)
        .getContent();
      if(data_sustitution && data_sustitution.length > 0){
        for (const data of data_sustitution) {
          for (const key in data) {
            html_body = html_body.replace(
              new RegExp(`##${key}##`, 'g'), data[key]
            );
          }
        }
      }
      if(baseTemplate){
        const baseTemplate = HtmlService
          .createHtmlOutputFromFile("Templates/Emails/base.html")
          .getContent();
        return baseTemplate.replace("##msg##", html_body);
      }

      return html_body;
    }
}
