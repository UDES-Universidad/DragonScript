/**
 * This module handles errors.
 */

type errorType = 'required' | 'wrongType' | 'validationFail';

interface ConfError {
  errorType: errorType;
  columnName: string;
  dataType?: string;
  wrongType?: string;
}

class MessageError {
  public static create(typeError: errorType) {
    if (typeError === 'required') {
      return MessageError.required;
    }
  }

  private static required(conf: ConfError) {
    return `Value required in ${conf.columnName}.`;
  }

  private static wrongType(conf: ConfError) {
    return `Column ${conf.columnName} must be a ${conf.dataType} but it received a ${conf.wrongType}`;
  }

  private static validationFail(msg: string) {
    return msg;
  }
}

/**
 * Validation Column Error.
 */
export class ValidationColumnError extends Error {
  constructor(msg: string) {
    super(msg);
    // Object.setPrototypeOf(this, ValidationColumnError.prototype);
    this.name = 'ValidationError';
  }
}

/**
 * Column extra validation error.
 */
export class ColumnExtraValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ColumnExtraValidationError';
  }
}

/**
 * Generic column error.
 */
export class GenericColumnError extends Error {
  constructor(conf: ConfError) {
    const fn = MessageError.create(conf.errorType);
    const msg = fn(conf);
    super(msg);
    this.name = 'GenericColumnError';
  }
}

/**
 * String column validation error.
 */
export class StringColumnError extends Error {
  constructor(conf: ConfError) {
    const fn = MessageError.create(conf.errorType);
    const msg = fn(conf);

    super(msg);
    this.name = 'StringColumnError';
  }
}

/**
 * String column validation error.
 */
export class NumberColumnError extends Error {
  constructor(conf: ConfError) {
    const fn = MessageError.create(conf.errorType);
    const msg = fn(conf);

    super(msg);
    this.name = 'NumberColumnError';
  }
}
