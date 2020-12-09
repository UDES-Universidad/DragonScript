import {
  ConfAbstractColumn, GenericColumn, StringColumn, NumberColumn, DateTimeColumn,
} from './gssColumnCreator';

/*
 * Columns factory.
 * */
export default class GssColumn {
  static generic(values: ConfAbstractColumn) {
    return GenericColumn.create(values);
  }

  static str(values: {}) {
    return StringColumn.create(values);
  }

  static num(values: {}) {
    return NumberColumn.create(values);
  }

  static datetime(values: {}) {
    return DateTimeColumn.create(values);
  }
}
