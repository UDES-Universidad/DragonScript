import { ConfAbstractColumn } from './columns/abstract_column';
import BooleanColumn from './columns/boolean_column';
import DateTimeColumn from './columns/datetime_column';
import GenericColumn from './columns/generic_column';
import NumberColumn from './columns/number_column';
import StringColumn from './columns/string_column';

/*
 * Columns factory.
 * */
export default class GssColumn {
  static generic(values: ConfAbstractColumn) {
    return GenericColumn.create(values);
  }

  static str(values: ConfAbstractColumn) {
    return StringColumn.create(values);
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
}
