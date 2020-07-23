
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




}
