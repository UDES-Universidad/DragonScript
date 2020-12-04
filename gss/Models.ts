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


    interface confGenericModel {
        sheetName: string
        table: col[]
    }


    export function GenericModel(conf: confGenericModel) {
        class Example_Model extends SHEET.ModelSheet {
            sheet_name = conf.sheetName;
            cols = conf.table;

            constructor() {
                super();
                this.make();
            }
        }
        return new Example_Model();
    }

}
