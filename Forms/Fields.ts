
namespace FIELDS {

    // TYPES >>>

    type col = {
        name: string,
        data_type: string,
        col: string,
        verbose_name?: string,
        default?: any,
        // Choices [any, any ...]
        choices?: any[],
        max?: number,
        min?: number,
        auto_add?: any,
    }

    type field_data_content = {
        name: string,
        label_text: string,
        attrs: {},
        choices?: {},
        make: any,
        required: boolean,
        hidden: boolean,
        use: boolean
    }

    // TYPES <<<

    /**
     * Agrega los datos de las columnas al campo,
     * si es que estos datos sirven para validar algo.
     * @param col_data
     */
    function add_col_attr(col_data: col) {
        let input_field = '';
        if (col_data.hasOwnProperty('min')) {
            input_field += ` min="${col_data['min']}"`;
        }
        if (col_data.hasOwnProperty('max')) {
            input_field += ` max="${col_data['max']}"`;
        }

        return input_field;
    }


    /**
     * Crea las opciones para el SelectField
     * @param choices : Opciones en la forma {key: value, ...}
     */
    function add_choices_selecto_options(choices: {}, value: string) {
        let options = '';
        for (const choice in choices) {
            options += `<option value="${choices[choice]}" ${value === choices[choice] ? 'selected' : ''}>${choice}</option>`
        }
        return options;
    }


    /**
     * Crea la etiqueta del campo HTML
     * @param label_text : Texto para la etiqueta
     * @param col_data : Si la etiqueta está vacía se una verbose_name o name del col_data
     */
    // function create_label(label_text: string, col_data: col, col?: string): string {
    function create_label(label_text: string, col_data: col): string {
        if (col_data.verbose_name && !label_text) {
            label_text = col_data.verbose_name;
        } else if (col_data.name && !label_text) {
            label_text = col_data.name;
        }

        return `<label for="${col_data?.name + '_' + (col_data.col ? col_data.col : '')}">${label_text}:</label>`;
    }


    /**
     * Crea un Input de texto
     * @param data_field : datos del campo.
     * @param col_data : datos de la columna.
     */
    export function InputField(data_field: field_data_content, col_data: col): { label: string, field: string } {
        let label: string = create_label(data_field.label_text, col_data);
        let type = 'text';
        if (data_field.attrs.hasOwnProperty('type')) {
            type = data_field.attrs.type;
        }

        let input_field = `<input type="${type}" name="${col_data?.name}" id="${col_data?.name + '_' + (col_data.col ? col_data.col : '')}"`;


        input_field += add_col_attr(col_data);

        for (const attr in data_field.attrs) {
            if (attr !== 'type') {
                input_field += ` ${attr}="${data_field.attrs[attr]}"`;
            }
        }

        input_field += `${data_field.hidden ? 'hidden' : ''}`
        input_field += `${data_field.required ? 'required' : ''}>`

        return {
            label: label,
            field: input_field
        }
    }

    /**
     * Crea un Textarea.
     * @param data_field : datos del campo.
     * @param col_data : datos de la columna.
     */
    export function TextareaField(data_field: field_data_content, col_data: col): { label: string, field: string } {
        let label: string = create_label(data_field.label_text, col_data);
        let input_field = `<textarea name="${col_data?.name}" id="${col_data?.name + '_' + (col_data.col ? col_data.col : '')}"`;


        input_field += add_col_attr(col_data);

        for (const attr in data_field.attrs) {
            if (attr !== 'value') {
                input_field += ` ${attr}="${data_field.attrs[attr]}"`;
            }
        }

        input_field += `${data_field.hidden ? 'hidden' : ''}`;
        input_field += `${data_field.required ? 'required' : ''}>`;
        try {
            input_field += data_field.attrs.value;
        } catch (error) {
            input_field += '';
        }
        input_field += '</textarea>'
        return {
            label: label,
            field: input_field
        }
    }

    /**
     * Crea un Select
     * @param data_field : datos del campo.
     * @param col_data : datos de la columna.
     */
    export function SelectField(data_field: field_data_content, col_data: col) {
        let label: string = create_label(data_field.label_text, col_data);
        let input_field = `<select name="${col_data?.name}" id="${col_data?.name + '_' + col_data.col}"`;


        input_field += add_col_attr(col_data);

        for (const attr in data_field.attrs) {
            input_field += ` ${attr}="${data_field.attrs[attr]}"`;
        }

        input_field += `${data_field.hidden ? 'hidden' : ''}`
        input_field += `${data_field.required ? 'required' : ''}>`

        let value;
        try {
            value = data_field.attrs.value;
        } catch (error) {
            value = '';
        }

        if (data_field.choices) {
            input_field += add_choices_selecto_options(data_field.choices, value);
        } else if (!data_field.choices && col_data.choices) {
            input_field += add_choices_selecto_options(col_data.choices, value);
        }

        input_field += '</select>';

        return {
            label: label,
            field: input_field
        }
    }

}