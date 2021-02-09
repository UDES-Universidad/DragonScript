/**
 * EMAIL
 * */

class GmailBuilder {
  private msgAreaTemplateMark: string = '##msg##';

  private htmlBaseTemplate?: string;

  private message?: string;

  private subject?: string;

  /**
   * Extracts html as string from a file.
   * @param (string): path to file, in Google
   * Apps Script the paths are really names,
   * so is not necessary start by './'.
   * */
  private extractHtmlFromFile(filePath: string): string {
    let fileHTML = HtmlService
      .createHtmlOutputFromFile(filePath)
      .getContent()
      .replace(new RegExp(/\n/, 'g'), '')
      .replace(new RegExp(/\t/, 'g'), '');
    return fileHTML;
  }

  /**
   * Replace marks (##key##) in a text by a value, 
   * where the keys and values are part of an object.
   * @param txt (string): text with marks.
   * @param datas (object): key/values to be replaced in a text.
   * */
  private replaceMarks(txt: string, datas: {}): string {
    let txtWithReplaces = txt.substr(0);
    Object.entries(datas).forEach(el => {
      txtWithReplaces = txtWithReplaces.replace(
        new RegExp(`##${el[0]}##`, 'g'),
        String(el[1]),
      );
    });
    return txtWithReplaces;
  }

  /**
   * Sets a base template.
   * */
  public baseTemplate(templatePath: string): GmailBuilder {
    this.htmlBaseTemplate = this.extractHtmlFromFile(templatePath);
    return this;
  }

  /**
   * Sets a subject.
   * */
  public setSubject(subject: string): GmailBuilder {
    this.subject = subject
      .replace(new RegExp(/\n/, 'g'), '')
      .replace(new RegExp(/\t/, 'g'), '');
    return this;
  }

  /**
   *  Sets a message from string.
   * */
  public setMessage(msg: string): GmailBuilder {
    this.message = this.htmlBaseTemplate
      ? this.htmlBaseTemplate.replace(this.msgAreaTemplateMark, msg)
      : msg;
    this.message = this.message
      .replace(new RegExp(/\n/, 'g'), '')
      .replace(new RegExp(/\t/, 'g'), '');
    return this;
  }

  /**
   * Sets a message from file.
   * */
  public setMessageFromFile(msgPath: string) {
    const msg = this.extractHtmlFromFile(msgPath);
    this.message = this.htmlBaseTemplate
      ? this.htmlBaseTemplate.replace(this.msgAreaTemplateMark, msg)
      : msg;
    return this;
  }

  /**
   * Send a message.
   * */
  public send(to: string, datas = {}): void {
    let subject: string = '';
    const htmlBody = Object.keys(datas).length > 0
      ? this.replaceMarks(<string> this.message, datas)
      : this.message?.substr(0);
    subject = this.replaceMarks(<string> this.subject, datas);
    const payload = {
      to,
      subject,
      htmlBody,
    };
    MailApp.sendEmail(payload);
  }
}
