/**
 * Auto generate forms.
 * */

// Fields
// ------------------------------------------------------------

// ------------------------------------------------------------
// ---------- Base field. -------------------------------------
// ------------------------------------------------------------

interface ValidatorItem {
  fn: (value: any) => boolean;
  msgSucess?: string;
  msgError?: string;
}

interface FieldConfig {
  attrs?: { [key: string]: string };
  classes?: string[];
  label?: { name: string; classes?: string[] } | string;
  name: string;
  helpText?: string;
  required?: boolean;
  disable?: boolean;
  validators?: ValidatorItem[];
}

/**
 * Base field.
 * */
export class BaseFormField {
  protected _attrs: { [key: string]: string } = {};

  public _isvalid: boolean = true;

  public _classes: string[] = [];

  public _label: { name: string; classes?: string[] } = {};

  public _name: string = '';

  protected _required: boolean = false;

  protected _disabled: boolean = false;

  protected _id: string = '';

  public _helpText: string = '';

  public _errors: string[] = [];

  public _success: string[] = [];

  public _value: any = '';

  protected _validators: ValidatorItem[] = [];

  protected _regExpDefault: [string, string] | RegExp = '';

  protected _FieldRegExpValidatorConf: RegExpFieldValidatorConf = {
    regExp: '',
    msgError: '',
    msgSucess: '',
  };

  constructor(config: FieldConfig) {
    if ('attrs' in config) {
      this._attrs =
        typeof config.attrs === 'string'
          ? { name: config.attrs, classes: [] }
          : config.attrs;
    }
    if ('label' in config) this._label = config.label;
    if ('classes' in config) this._classes = config.classes;
    if ('required' in config) this._required = config.required;
    if ('disabled' in config) this._disabled = config.disabled;
    if ('helpText' in config) this._helpText = config.helpText;
    if ('validators' in config) this._validators = config.validators;
    this._name = config.name;
    this._id = this._name;
  }

  /**
   * Validate a Regular Expression.
   * */
  protected _regExpValidator(value: string, _regexp?: RegExp, errMsg?: string) {
    const data = String(value);
    let regExp: RegExp;
    if (_regexp) {
      regExp = _regexp;
    } else if (Array.isArray(this._regExpDefault)) {
      regExp =
        this._FieldRegExpValidatorConf.regExp ||
        new RegExp(...this._regExpDefault);
    } else {
      regExp = this._FieldRegExpValidatorConf.regExp || this._regExpDefault;
    }
    if (!regExp.test(data)) {
      this._isvalid = false;
      this._errors.push(
        errMsg || this._FieldRegExpValidatorConf.msgError || 'Error'
      );
    } else if (this._FieldRegExpValidatorConf.msgSucess) {
      this._success.push(this._FieldRegExpValidatorConf.msgSucess);
    }
  }

  /**
   * Returns a class attribute.
   * @param classes (string[]): array of strings that
   * represents a CSS class.
   * Returns string.
   * */
  protected _classesConstructor(classes: string[] = []): string {
    if (!Array.isArray(classes)) {
      throw new Error('Classes of label or field must be a string array.');
    }
    if (classes.length > 0) {
      return `class="${classes.join(' ').trim()}"`;
    }
    return '';
  }

  /**
   * Execute custom validators.
   * @param data (any): data to be validated.
   * */
  protected _execValidators(data: any) {
    if (this._validators.length > 0) {
      this._validators.forEach((item: ValidatorItem) => {
        const isValid = item.fn(data);
        if (isValid) {
          const msg =
            'msgSucess' in item && item.msgSucess ? item.msgSucess : 'Success';
          this._success.push(msg);
        } else {
          this._isvalid = false;
          const msg =
            'msgError' in item && item.msgError ? item.msgError : 'Error';
          this._errors.push(msg);
        }
      });
    }
  }

  /**
   * Creates a label tag and return it as a string.
   * If there _label is empty, it uses a _name for
   * label name.
   * */
  public label(): string {
    let labelStr = `<label for="${this._name}"`;
    let labelName;
    if ('name' in this._label) {
      labelName = this._label.name;
    } else {
      this._label.name = this._name;
      labelName = this._name;
    }
    const classes =
      'classes' in this._label ? Object.keys(this._label.classes) : [];
    if (classes.length > 0) {
      labelStr += ` ${this._classesConstructor(this._label.classes)}`;
    }
    labelName = labelName.replace(RegExp('_', 'g'), ' ');
    labelName = labelName.charAt(0).toUpperCase() + labelName.substr(1);
    labelStr += `>${this._required ? '* ' : ''}${labelName}:</label>`;
    return labelStr;
  }

  /**
   * Creates a element field, this function must be rewrote
   * in every child class.
   * */
  public field(): string {
    return '';
  }

  /**
   * Validates data.
   * */
  public validate(data: any) {
    return data;
  }
}

// ------------------------------------------------------------
// ---------- TextInput ---------------------------------------
// ------------------------------------------------------------

interface TextFieldValidatorConf {
  length: number;
  msgError?: string;
  msgSucess?: string;
}

interface TextInputFieldInter extends FieldConfig {
  minlength?: TextFieldValidatorConf;
  maxlength?: TextFieldValidatorConf;
  validators?: {
    [key: string]: (value: string) => [boolean, string];
  };
}

/**
 * Text input.
 * */
class TextInput extends BaseFormField {
  public _value: string = '';

  protected _fieldType = 'text';

  private _minlength?: TextFieldValidatorConf;

  private _maxlength?: TextFieldValidatorConf;

  protected _validators: {
    [keys: string]: (value: string) => [boolean, string];
  } = {};

  constructor(config: TextInputFieldInter) {
    super(config);
    if ('minlength' in config) this._minlength = config.minlength;
    if ('maxlength' in config) this._maxlength = config.maxlength;
    if ('validators' in config) this._validators = config.validators;
  }

  /**
   * Return a HTML input text field.
   * */
  public field(value?: string): string {
    const valueAttr = value ? `value="${value}"` : '';
    let input = `<input type="${this._fieldType}" name="${this._name}" id="${this._name}" ${valueAttr}`;
    if (this._classes.length > 0) {
      input += ` ${this._classesConstructor(this._classes)}`;
    }
    const attrsNames = this._attrs ? Object.keys(this._attrs) : [];
    if (attrsNames.length > 0) {
      attrsNames.forEach((attr) => {
        input += ` ${attr}="${this._attrs[attr]}"`;
      });
    }
    if (this._required) input += ' required';
    if (this._disabled) input += ' disabled';
    return `${input}>`;
  }

  /**
   * validate
   */
  public validate(value: any) {
    const data = String(value);
    if (this._required && !data) {
      this._isvalid = false;
      this._errors.push('Required field.');
    }
    if (this._maxlength && data.length > this._maxlength.length) {
      this._isvalid = false;
      this._errors.push(
        this._maxlength.msgError
          ? this._maxlength.msgError
          : `${this._maxlength.length} are the max length of characters allowed.`
      );
    } else if (this._maxlength?.msgSucess) {
      this._success.push(this._maxlength.msgSucess);
    }
    if (this._minlength && data.length < this._minlength.length) {
      this._isvalid = false;
      this._errors.push(
        this._minlength.msgError
          ? this._minlength.msgError
          : `${this._minlength.length} are the max length of characters allowed.`
      );
    } else if (this._minlength?.msgSucess) {
      this._success.push(this._minlength.msgSucess);
    }

    this._execValidators(data);
    return data;
  }
}

// ------------------------------------------------------------
// ---------- EmailInput --------------------------------------
// ------------------------------------------------------------

interface RegExpFieldValidatorConf {
  regExp?: RegExp;
  msgError?: string;
  msgSucess?: string;
}

interface EmailInputFieldInter extends TextInputFieldInter {
  regExpValidator?: RegExpFieldValidatorConf;
}

/**
 * TODO: change regExp validators to BaseFormField.
 * */
class EmailInput extends TextInput {
  protected _fieldType = 'email';

  protected _regExpDefault:
    | [string, string]
    | RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  protected _FieldRegExpValidatorConf: RegExpFieldValidatorConf = {
    regExp: '',
    msgError: 'Please enter a valid email address.',
    msgSucess: '',
  };

  constructor(config: EmailInputFieldInter) {
    super(config);
    if ('regExpValidator' in config) {
      this._FieldRegExpValidatorConf = {
        ...this._FieldRegExpValidatorConf,
        ...config.regExpValidator,
      };
    }
  }

  public validate(value: string) {
    const data = String(value).toLowerCase();
    if (this._required && !data) {
      this._isvalid = false;
      this._errors.push('Required field.');
    }
    this._regExpValidator(value);
    this._execValidators(data);
    return data;
  }
}

// ------------------------------------------------------------
// ---------- PhoneInput ---------------------------------------
// ------------------------------------------------------------

class PhoneInput extends EmailInput {
  protected _fieldType = 'tel';

  protected _regExpDefault: [string, string] = [
    '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
    'im',
  ];

  protected _FieldRegExpValidatorConf: RegExpFieldValidatorConf = {
    regExp: '',
    msgError: 'Please enter a valid phone',
    msgSucess: '',
  };

  constructor(config: EmailInputFieldInter) {
    super(config);
    this._attrs.pattern = Array.isArray(this._regExpDefault)
      ? this._regExpDefault[0]
      : this._regExpDefault;
    if ('regExpValidator' in config) {
      this._FieldRegExpValidatorConf = {
        ...this._FieldRegExpValidatorConf,
        ...config.regExpValidator,
      };
    }
  }
}

// ------------------------------------------------------------
// ---------- Export Fields -----------------------------------
// ------------------------------------------------------------

export class Fields {
  public static textInput(config: TextInputFieldInter) {
    return new TextInput(config);
  }

  public static emailInput(config: EmailInputFieldInter) {
    return new EmailInput(config);
  }

  public static phoneInput(config: EmailInputFieldInter) {
    return new PhoneInput(config);
  }
}
