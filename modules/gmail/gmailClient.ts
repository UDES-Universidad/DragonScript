/**
 * Client method.
 * */
namespace GMail {

  // Interfaces
  // ------------------------------------------------------------
  interface Conf {
    templatePath: string;
    subject: string;
    msg: string;
  }

  // Creators
  // ------------------------------------------------------------
  /**
   * Creates a Gmail object from GmailBuilder
   * and return it without configuration.
   * */
  export const Base = (): GmailBuilder => new GmailBuilder();

  /**
   * Creates a Gmail object and return it with a pre configuration
   * where de msg is taken from a string.
   * */
  export const FromString = (conf: Conf): GmailBuilder => new GmailBuilder()
    .baseTemplate(conf.templatePath)
    .setSubject(conf.subject)
    .setMessage(conf.msg);

  /**
   * Creates a Gmail object and return it with a pre configuration
   * where de msg is taken from a template string.
   * */
  export const FromTemplateFile = (conf: Conf): GmailBuilder => new GmailBuilder()
    .baseTemplate(conf.templatePath)
    .setSubject(conf.subject)
    .setMessageFromFile(conf.msg);
}
