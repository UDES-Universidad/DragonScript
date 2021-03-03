/**
 * Auto generate forms.
 * */

// Fields
// ------------------------------------------------------------

interface FieldConfig {
  attrs?: { [key: string]: string };
  classes?: string[];
  label?: {
    name: string;
    classes?: string[];
  };
  name: string;
  required: boolean;
}

/**
 * Base field.
 * */
export class BaseFormField {
  protected _attrs: { [key: string]: string } = {};

  public _classes: string[] = [];

  public _label: { name: string; classes?: string[] } = {};

  protected _name: string = '';

  protected _required: boolean = false;

  protected _id: string = '';

  constructor(config: FieldConfig) {
    this._attrs = 'attrs' in config ? config.attrs : {};
    this._label = 'label' in config ? config.label : {};
    this._classes = 'classes' in config ? config.classes : [];
    this._name = config.name;
    this._id = this._name;
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
      let classesStr = 'class="';
      classes.forEach((c) => {
        classesStr += `${c} `;
      });
      return `${classesStr.trim()}"`;
    }
    return '';
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
    const classes = 'classes' in this._label ? Object.keys(this._label.classes) : [];
    if (classes.length > 0) {
      labelStr += ` ${this._classesConstructor(this._label.classes)}`;
    }
    labelName = labelName.split('_')
      .map((ch: string) => ch.charAt(0).toUpperCase() + ch.substr(1))
      .join(' ');
    labelStr += `>${labelName}:</label>`;
    return labelStr;
  }

  /**
   * Creates a element field, this function must be rewrote
   * in every child class.
   * */
  public field(): string {
    return '';
  }
}

/**
 * Text input.
 * */
class TextInput extends BaseFormField {
  /**
   * Return a HTML input text field.
   * */
  public field(): string {
    let input = `<input type="text" name="${this._name}" id="${this._name}"`;
    if (this._classes.length > 0) {
      input += ` ${this._classesConstructor(this._classes)}`;
    }
    const attrsNames = this._attrs ? Object.keys(this._attrs) : [];
    if (attrsNames.length > 0) {
      attrsNames.forEach((attr) => {
        input += ` ${attr}="${this._attrs[attr]}"`;
      });
    }
    if (this._required) {
      input += ' required';
    }
    return `${input}>`;
  }
}

export class Fields {
  public static textInput(config: FieldConfig) {
    return new TextInput(config);
  }
}
