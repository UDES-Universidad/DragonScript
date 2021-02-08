import GmailSenderBuilder from './gmailSenderBuilder';
import GmailSearchBuilder from './gmailSearchBuilder';

/**
 * Interfaces.
 * */
interface baseConf {
  attachments?: [string, any][];
  htmlTemplateBase?: string;
  message?: string;
  messageFileTemplate?: string;
  templateFile?: string;
  stringTemplate?: string;
  subject: string;
}

/**
 * Client method.
 * */
export default class GmailClient {
  /**
   * Send email using evaluate mode, that is, 
   * replace variables (<?= var ?>) in the html file.
   * */
  public static sendFromTemplate(conf: baseConf) {
    const gmail = new GmailSenderBuilder();
    gmail.templateFile = conf.templateFile;
    gmail.subject = conf.subject;
    gmail.createTemplateFromFile();
    return gmail;
  }

  /**
   * Can get the base template from string (stringTemplate)
   * or from template (templateFile).
   * */
  public static sendAndReplaceMarks(conf: baseConf) {
    const gmail = new GmailSenderBuilder();
    gmail.evaluateMode = false;
    if (conf.hasOwnProperty('templateFile')) gmail.templateFile = conf.templateFile;
    if (conf.hasOwnProperty('stringTemplate')) gmail.htmlStringTemplate = conf.stringTemplate;
    gmail.subject = conf.subject;
    if ('message' in conf) gmail.message = conf.message;
    if ('messageFileTemplate' in conf) gmail.messageFileTemplate = conf.messageFileTemplate;
    gmail.createFullMessage();
    return gmail;
  }

  /*
   * Return a GmailSenderBuilder.
   * */
  public static searcher() {
    return new GmailSearchBuilder();
  }
}
