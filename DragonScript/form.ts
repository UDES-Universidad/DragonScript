
namespace Forms {

    type inputText_type = {
        label?: string,
        value?: string | number,
        placeholder?: string,
        attrs?: {},
    }

    type select_type = {
        label?: string,
        value?: string | number,
        options: [],
        attrs?: {},
    }

    interface Form_interface {
        model?: object,
        fields: object,
        template: string,
        element_constructor: (params: {}, type: string) => string,
        inputText: (params: inputText_type) => {},
        select: (params: select_type) => {},
    }


    export abstract class Model implements Form_interface {
        model?: object;
        fields: object = {};
        template: string = 'html/form_template.html'

        constructor() {
        }

        element_constructor(params: {}, type: string) {
            let element = ''
            if (type === 'inputText') {
                element += `<input type="text"`;
            } else if (type === 'select') {
                element += `<select`;
            } else if (type === 'select') {
                element += `<option`;
            }

            for (let key in params) {
                element += `${key}="${params[key]}"`;
            }



            return element;
        }

        inputText(params: inputText_type) {
            let element = {
                label: '',
                element: `<input type="text"`,
            }

            if (params.hasOwnProperty('label')) {
                element.label = `<label for="">${<string>params.label}</label>`;
            }

            if (params.hasOwnProperty('value')) {
                element.element += ` value="${params.value}"`;
            }

            if (params.hasOwnProperty('attrs')) {
                for (let key in params.attrs) {
                    element.element += ` ${key}="${params.attrs[key]}"`;
                }
            }

            if (params.hasOwnProperty('placeholder')) {
                element.element += ` placeholder="${params.placeholder}"`;
            }

            element.element += '/>';
            return element;
        }

        select({ }) {
            return {}
        }
    }


}
