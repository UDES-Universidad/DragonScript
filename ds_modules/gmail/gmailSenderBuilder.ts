/**
 * EMAIL
 * */

interface attachmentsDataInterface {
  id: string;
  mimeType: any;
}

export default class GmailSenderBuilder {
  // Attachments data: {id, mimeType}
  public attachmentsData?: attachmentsDataInterface[];

  // Attachments blob
  private _attachments: GoogleAppsScript.Drive.File[] = [];

  // Chars to create marks.
  public defaultMark = '##';

  // Base template joined to message.
  public fullMessage?: string;

  // GAS HTML template to be evaluated.
  public htmlTemplate?: GoogleAppsScript.HTML.HtmlTemplate;

  // HTML in string, this is de base template
  // for join to the message.
  public htmlStringTemplate?: string;

  // Message
  public message?: string;

  // Message from file template.
  public messageFileTemplate?: string;

  // String to be replaced in the htmlStringTemplate to create
  // a  fullMessage.
  public msgAreaTemplateMark: string = 'msg';

  // Name and path to template file.
  public templateFile?: string;

  // Subject
  public subject?: string;

  // If true use _evaluateTemplate else user _replaceMarks.
  public evaluateMode: boolean = true;

  /**
   * Create a html template if fileName is not passed,
   * else save result in htmlTemplate property.
   * */
  public createTemplateFromFile() {
    try {
      this.htmlTemplate = HtmlService.createTemplateFromFile(this.templateFile);
    } catch (error) {
      throw new Error('There is not template file');
    }
  }

  /**
   * Evaluate a template.
   * */
  private _evaluateTemplate(context: {}) {
    const template = this.htmlTemplate;
    for (const key in context) {
      if (context.hasOwnProperty(key)) {
        template[key] = context[key];
      }
    }
    return template.evaluate().getContent()
      .replace(new RegExp(/\n/, 'g'), '')
      .replace(new RegExp(/\t/, 'g'), '');
  }

  /**
   * Creates a full message adding to base template
   * the message.
   * */
  public createFullMessage() {
    const messageArea = `${this.defaultMark}${this.msgAreaTemplateMark}${this.defaultMark}`;
    let baseTemplate;
    let message;
    // Creates a baseTemplate.
    try {
      if (this.htmlStringTemplate) {
        baseTemplate = this.htmlStringTemplate.substr(0);
      } else {
        this.createTemplateFromFile();
        baseTemplate = this.htmlTemplate?.evaluate().getContent();
      }
    } catch (error) {
      baseTemplate = messageArea.substr(0);
    }
    // Creates a body message.
    if (this.message) {
      message = this.message;
    } else if (this.messageFileTemplate) {
      message = HtmlService
        .createHtmlOutputFromFile(this.messageFileTemplate)
        .getContent();
    }
    this.fullMessage = baseTemplate?.replace(
      messageArea, message
    );
  }

  /**
   * Creates attachments.
   * */
  public createAttachments() {
    if (this.attachmentsData?.length > 0) {
      this._attachments = this.attachmentsData?.map(
        (a: attachmentsDataInterface) => (DriveApp.getFileById(a.id)
          .getAs(a.mimeType)),
      );
    }
  }

  /**
   * Replace marks (##key##) in a text by a value, 
   * where the keys and values are part of an object.
   * @param txt (string): text with marks.
   * @param datas (object): key/values to be replaced in a text.
   * */
  public _replaceMarks(txt: string, context: {}): string {
    let txtWithReplaces = txt.substr(0);
    for (const key in context) {
      if (context.hasOwnProperty(key)) {
        const mark = new RegExp(
          `${this.defaultMark}${key}${this.defaultMark}`, 'g'
        );
        txtWithReplaces = txtWithReplaces.replace(
          mark, String(context[key]),
        );
      }
    }
    return txtWithReplaces;
  }

  /**
   * Send a message.
   * */
  public send(to: string, context:{}) {
    let htmlBody;
    const subject = this._replaceMarks(this.subject, context);
    if (this.evaluateMode) {
      htmlBody = this._evaluateTemplate(context);
    } else {
      htmlBody = this._replaceMarks(this.fullMessage, context);
    }
    const payload = {
      to,
      subject,
      htmlBody,
    };
    if (this._attachments.length > 0) {
      payload.attachments = this._attachments;
    }
    MailApp.sendEmail(payload);
  }
}
