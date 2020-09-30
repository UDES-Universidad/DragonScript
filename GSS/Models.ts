/// <reference path="./Tables.ts" />


/**
 * Descripción de las columnas de cada
 * hoja dentro del libro a usar.
 */
namespace Models {

    /**
     * Datos que debe contener una columna.
     */
    type col = {
        name: string,
        data_type: string,
        col?: string,
        verbose_name?: string,
        default?: any,
        choices?: {},
        max?: number,
        min?: number,
        auto_add?: any,
    }


    /* Generic Model */
    export function GenericModel() {
        class Generic_Model extends SHEET.ModelSheet {
            sheet_name = SETTINGS.CHANGE_THIS;
            cols = TABLES.CHANGE_THIS;

            constructor() {
                super();
                this.make();
            }
        }

        return new Generic_Model();
    }


}
