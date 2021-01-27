import GssCreator from './gssCreator';
import { AbstractColumn } from './gssColumnCreator';

interface ConfParamsClient {
  urlOrId: string;
  sheetName: string;
  table?: AbstractColumn[];
}

/*
 * Gss Client.
 * */
export default class GssClient {
  static create(conf: ConfParamsClient): GssCreator {
    return new GssCreator()
      .connect(conf.urlOrId)
      .setSheet(conf.sheetName)
      .setTable(conf.table);
  }
}
