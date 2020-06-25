namespace TABLES {

    type col = {
        name: string,
        data_type: string,
        col: string,
        verbose_name?: string,
        default?: any,
        // Choices [any, any ...]
        choices?: {},
        max?: number,
        min?: number,
        auto_add?: any,
    }


}
