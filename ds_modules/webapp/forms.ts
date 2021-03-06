/**
 * Auto generate forms.
 * */

import { BaseFormField } from './fields';

// Interfaces
// ------------------------------------------------------------
interface Elements {
  label: string;
  field: string;
}

interface FieldsConfInter {
  fieldsClass: string[];
  labelsClass: string[];
  wraperTag: string;
  wraperTagClasses: string[];
}

interface HelpTextConfInter {
  tag: string;
  tagClasses: string[];
  wraperTag: string;
  wraperTagClasses: string[];
}

// Form builder.
// ------------------------------------------------------------
class FormBuilder {
  public fields: BaseFormField[] = [];

  public html: { [key: string]: Elements } = {};

  public showLabels: boolean = true;

  public values: { [key: string]: any; } = {};

  public fieldsConf: FieldsConfInter = {
    fieldsClass: [],
    labelsClass: [],
    wraperTag: 'p',
    wraperTagClasses: [],
  };

  public helpTextConf: HelpTextConfInter = {
    tag: 'li',
    tagClasses: [],
    wraperTag: 'ul',
    wraperTagClasses: [],
  };

  public errorConf: HelpTextConfInter = {
    tag: 'li',
    tagClasses: [],
    wraperTag: 'ul',
    wraperTagClasses: [],
  }

  public successConf: HelpTextConfInter = {
    tag: 'li',
    tagClasses: [],
    wraperTag: 'ul',
    wraperTagClasses: [],
  }

  private _classesConstructor(classes: string[] = []) {
    if (classes.length > 0) {
      return `class="${classes.join(' ').trim()}"`
    }
    return '';
  }

  private _helpTextBuilder(config: HelpTextConfInter, content: string[]) {
    let html = '';
    if (config.wraperTag) html += `<${config.wraperTag} ${this._classesConstructor(config.wraperTagClasses)}>`;
    content.forEach((c: string) => {
      html += `<${config.tag} ${this._classesConstructor(config.tagClasses)}>${c}</${config.tag}>`
    });
    if (config.wraperTag) html += `</${config.wraperTag}>`;
    return html;
  }

  /**
   * Set classes to labels and fields.
   * */
  public setClasses() {
    for (const field of this.fields) {
      // Label
      if (typeof field._label !== 'string' 
        && !('classes' in field._label)) {
        field._label.classes = this.fieldsConf.labelsClass;
      } else if (typeof field._label === 'string') {
        field._label = {
          name: field._label,
          classes: [...this.fieldsConf.labelsClass],
        };
      } else {
        field._label.classes = [
          ...(<string[]>field._label.classes),
          ...this.fieldsConf.labelsClass,
        ];
      }
      
      // Field
      if (!field._classes.length) {
        field._classes = this.fieldsConf.fieldsClass;
      } else if (field._classes.length) {
        field._classes = [
          ...field._classes,
          ...this.fieldsConf.fieldsClass,
        ];
      }
    }
  }
  
  /**
   * Creates HTML form.
   * */
  public form(values?: { [key: string]: any }) {
    this.setClasses();
    const tag = this.fieldsConf.wraperTag;
    const classes = this.fieldsConf.wraperTagClasses;
    const classesStr = this._classesConstructor(classes);
    let form = '';
    for (const field of this.fields) {
      // Value
      let value = '';
      if (values && field._name in values) {
        value = values[field._name];
      } else if (field._value) {
        value = field._value;
      }
      // Label
      const labelHtml = this.showLabels === false 
        ? '' 
        : field.label();
      const fieldHtml = field.field(value);
      this.html[field._name] = { label: labelHtml, field: fieldHtml };
      // Input
      form += `<${tag} ${classesStr || ''}>${labelHtml} ${fieldHtml}`;
      // Help text
      const areTherehelpTexts = field._helpText || field._errors || field._success;
      if (areTherehelpTexts) {
        if (field._helpText) {
          form += this._helpTextBuilder(
            this.helpTextConf, 
            [field._helpText],
          );
        }
        if (field._errors.length > 0) {
          Logger.log(field._errors);
          form += this._helpTextBuilder(
            this.errorConf,
            field._errors,
          );
        }
        if (field._success.length > 0) {
          form += this._helpTextBuilder(
            this.successConf,
            field._success,
          );
        }
      }

      form += `</${tag}>`;
    }
    return form;
  }
  
  /**
   * Validates form
   * */
  public validate(formData: { [key: string]: string }) {
    const validateFields: boolean[] = []
    const data: { [key: string]: string } = {};
    this.fields.forEach((field) => {
      const name = field._name;
      const value = formData && name in formData 
        ? formData[name] 
        : '';
      data[name] = field.validate(value);
      validateFields.push(field._isvalid);
    });
    return [
      validateFields.every((v) => v === true),
      formData
    ];
  }
}

/**
 * Form client.
 * */
class FormClient {
  public static create() {
    return new FormBuilder();
  }
}

export default FormClient;
