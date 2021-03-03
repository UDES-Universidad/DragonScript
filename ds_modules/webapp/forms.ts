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

// Form builder.
// ------------------------------------------------------------
class FormBuilder {
  public fields: BaseFormField[] = [];

  public html: { [key: string]: Elements } = {};

  public fieldsClass: string[] = [];

  public labelsClass: string[] = [];

  public wraperTag: string = 'p';

  public wraperTagClasses: string[] = [];

  public showLabels: boolean = true;

  private _classesConstructor(classes: string[] = []) {
    let classesStr = ' class="';
    if (classes.length > 0) {
      classes.forEach((c) => {
        classesStr += `${c} `;
      });
      classesStr = `${classesStr.trim()}"`;
      return classesStr;
    }
    return '';
  }

  public setClasses() {
    const labelsClass = this.labelsClass.length > 0 
      ? this.labelsClass 
      : [];
    const fieldsClass = this.fieldsClass.length > 0 
      ? this.fieldsClass 
      : [];
    for (const field of this.fields) {
      if (!('classes' in field._label)) {
        field._label.classes = labelsClass;
      } else {
        field._label.classes = [
          ...<string[]>field._label.classes,
          ...labelsClass,
        ];
      }
      if (!field._classes.length) {
        field._classes = fieldsClass;
      } else if (field._classes.length) {
        field._classes = [...field._classes, ...fieldsClass];
      }
    }
  }

  public form(values?: { [key: string]: any; }) {
    const tag = this.wraperTag;
    const classes = this.wraperTagClasses;
    const classesStr = this._classesConstructor(classes);
    let form = '';
    this.fields.forEach((el) => {
      const label = this.showLabels === false ? '' : el.label();
      const field = el.field();
      this.html[el.name] = { label, field };
      form += `<${tag}${classesStr || ''}>${label} ${field}</${tag}>`;
    });
    return form;
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
