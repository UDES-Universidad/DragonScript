import {
  ConfAbstractColumn, GenericColumn, StringColumn, NumberColumn, DateTimeColumn, BooleanColumn
} from './gssColumnCreator';

/*
 * Columns factory.
 * */
export default class GssColumn {
  static generic(values: ConfAbstractColumn) {
    return GenericColumn.create(values);
  }

  static bool(values: ConfAbstractColumn) {
    return BooleanColumn.create(values);
  }

  static datetime(values: ConfAbstractColumn) {
    return DateTimeColumn.create(values);
  }

  static num(values: ConfAbstractColumn) {
    return NumberColumn.create(values);
  }

  static str(values: ConfAbstractColumn) {
    return StringColumn.create(values);
  }
}
