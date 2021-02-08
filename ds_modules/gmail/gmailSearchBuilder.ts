/*
 * Mange some util functions.
 * */

// Interfaces

interface queryParameters {
  From?: string;
  to?: string;
  subject?: string;
  contains?: string;
  noContains?: string;
  date?: Date;
  // after?: Date;
  // before?: Date;
  has?: 'attachment';
  In?: 'chats';
  // Only for subQuery.
  subThreads?: boolean;
}

// from:(lfcruz@udes.edu.mx) 
// to:(lfcruz@udes.edu.mx) 
// subject:(Delivery Status Notification Failure) 
// lfcruzzz@udes.edu.mx 
// -hola 
// -in:chats 
// after:2021/2/3 
// before:2021/2/6
// has:attachment
//
export default class GmailSearchBuilder {
  public messages: GoogleAppsScript.Gmail.GmailMessage[];

  private _query?: string;

  private _subThread: boolean = false;

  public get queryStatement() {
    return this._query;
  }

  public constructor(messages?: GoogleAppsScript.Gmail.GmailMessage[]) {
    if (messages) {
      this.messages = messages;
    } else {
      this.messages = [];
    }
  }

  /**/
  public query(conf: queryParameters) {
    let query = '';
    if (this.messages.length < 1) {
      if ('From' in conf) query += `from:(${conf.From}) `;
      if ('to' in conf) query += `to:(${conf.to}) `;
      if ('subject' in conf) query += `subject:(${conf.subject}) `;
      if ('contains' in conf) query += `${conf.contains} `;
      if ('noContains' in conf) query += `${conf.noContains?.split(' ').join(' -')} `;
      if ('has' in conf) query += `has:${conf.has} `;
      if ('In' in conf) query += `-in:${conf.In} `;
      if ('date' in conf) {
        query += `after:${this._formatDate(conf.date, {sum: -1, target: "d"})} `;
        query += `before:${this._formatDate(conf.date, {sum: 2, target: "d"})} `;
      }
    } else {
      if ('subThreads' in conf) this._subThread = conf.subThreads;
      if ('From' in conf) query += `message.getFrom() === "${conf.From}" && `;
      if ('to' in conf) query += `message.getTo() === "${conf.to}" && `;
      if ('subject' in conf) query += `message.getSubject().includes("${conf.subject}") && `;
      if ('contains' in conf) query += `body.includes("${conf.contains}") && `;
      if ('noContains' in conf) query += `"!body.includes(${conf.noContains}") && `;
      if ('has' in conf) query += `message.getAttachments().length > 0 && `;
      if ('In' in conf) {
        query += 'message.isInChats() && ';
      } else {
        query += '!message.isInChats() && ';
      }
      if ('date' in conf) {
        const after = this._formatDate(conf.date, {sum: -1, target: "d"});
        const before = this._formatDate(conf.date, {sum: 2, target: "d"})
        const target = this._formatDate(conf.date);
        query += `${target} > ${after} && ${target} < ${before}`;
      }

      query = query.substr(-3) === '&& '
        ? query.substr(0, query.length - 3)
        : query;
    }
    this._query = query.trim();
    return this;
  }

  /*
   * Split date.
   * */
  private _splitDate(date: Date): [number, number, number] {
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ]
  }

  private _formatDate(date: Date, options?: {sum: number, target: "y" | "m" | "d"}): string {
    let [year, month, day] = this._splitDate(date);
    if (options && options.sum) {
      if (options.target === 'y') year += options.sum;
      if (options.target === 'm') month += options.sum;
      if (options.target === 'd') day += options.sum;
    }

    return `${year}/${month}/${day}`;
  }

  /*
   * Search messages.
   * */
  public search(start?: number, max?: number): GmailSearchBuilder {
    let messages: GoogleAppsScript.Gmail.GmailMessage[] = [];
    if (this.messages.length < 1 && !this._subQuery) {
      let threads;
      if (start && max) {
        threads = GmailApp.search(this._query, start, max);
      } else {
        threads = GmailApp.search(this._query);
      }
      threads.forEach((i: GoogleAppsScript.Gmail.GmailThread) => {
        messages = [...messages, ...i.getMessages()];
      });
    } else {
      for (const message of this.messages) {
        if (this._subThread) {
          const subMessages = message.getThread().getMessages();
          for (const subMessage of subMessages) {
            let message = subMessage;
            const body = message.getPlainBody();
            if (eval(this._query)) {
              messages.push(message);
            }
          }
        } else if (eval(this._query)) {
          messages.push(message);
        }
      }
    }

    return new GmailSearchBuilder(messages);
  }
}
