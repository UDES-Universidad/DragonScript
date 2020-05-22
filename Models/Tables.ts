namespace TABLES {

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

    export const GENERAL: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'EMAIL', default: Session.getActiveUser().getEmail() },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'fistname', col: '3', data_type: 'string', verbose_name: 'NOMBRE' },
        { name: 'lastname', col: '4', data_type: 'string', verbose_name: 'APELLIDO PATERNO' },
        { name: 'secondlastname', col: '5', data_type: 'string', verbose_name: 'APELLIDO MATERNO' },
        { name: 'age', col: '6', data_type: 'number', min: 15, verbose_name: 'EDAD' },
        { name: 'gender', col: '7', data_type: 'string', choices: ['HOMBRE', 'MUJER'], verbose_name: 'SEXO' },
        { name: 'curp', col: '8', data_type: 'string', verbose_name: 'CURP' },
        { name: 'street', col: '9', data_type: 'string', verbose_name: 'CALLE' },
        { name: 'num_ext', col: '10', data_type: 'string', default: 'S/N', verbose_name: 'NÚMERO EXTERIOR' },
        { name: 'num_int', col: '11', data_type: 'string', default: 'S/N', verbose_name: 'NÚMERO INTERIOR' },
        { name: 'suburb', col: '12', data_type: 'string', verbose_name: 'COLONIA' },
        { name: 'postal_code', col: '13', data_type: 'string', verbose_name: 'CÓDIGO POSTAL' },
        { name: 'tel', col: '14', data_type: 'string', min: 10, verbose_name: 'TELÉFONO' },
        { name: 'cel', col: '15', data_type: 'string', min: 10, verbose_name: 'CELULAR' },
        { name: 'email_personal', col: '16', data_type: 'string', verbose_name: 'EMAIL PERSONAL' },
        { name: 'location', col: '17', data_type: 'string', verbose_name: 'LOCALIDAD' },
        { name: 'municipality', col: '17', data_type: 'string', verbose_name: 'MUNICIPIO' },
        { name: 'state_residence', col: '19', data_type: 'string', verbose_name: 'ESTADO DE RESIDENCIA' },
        { name: 'state_provenance', col: '20', data_type: 'string', verbose_name: 'ESTADO DE PROCEDENCIA' },
        { name: 'sketch', col: '21', data_type: 'string', verbose_name: 'CROQUIS' },
    ];


    export const SCHOLARSHIP: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'grade', default: 1, data_type: 'number', col: '1', min: 1, verbose_name: 'GRADO' },
        { name: 'averange_last_year', data_type: 'number', col: '2', verbose_name: 'PROMEDIO DEL PERIODO ANTERIOR(SEMESTRE O CUATRIMESTRE)' },
        { name: 'new_scholarship', default: 'NO', data_type: 'boolean', col: '3', choices: ['SÍ', 'NO'], verbose_name: '¿NUEVA BECA?' },
        { name: 'renovation', default: 'SÍ', data_type: 'boolean', col: '4', choices: ['SÍ', 'NO'], verbose_name: 'RENOVACIÓN' },
        { name: 'renovation_percentage', default: 25, data_type: 'number', col: '5', min: 15, verbose_name: 'SI ES RENOVACIÓN DE BECA(INDICAR PORCENTAJE ANTES ASIGNADO)' },
        { name: 'new_renovation_percentage', data_type: 'string', col: '6', min: 15, max: 25, verbose_name: 'NUEVO PORCENTAJE DE BECA SOLICITADO' },
        { name: 'grade_scholarship_requested', data_type: 'string', col: '7', min: 1, verbose_name: 'GRADO PARA EL QUE SOLICITA LA BECA' },
        { name: 'previusly_applied', data_type: 'boolean', col: '8', choices: ['SÍ', 'NO'], default: 'NO', verbose_name: '¿HA SOLICITADO ANTERIORMENTE LA BECA?' },
        { name: 'when', data_type: 'number', col: '10', verbose_name: '¿CUÁNDO?' },
        { name: 'year_entered_shool', data_type: 'number', col: '9', min: 2011, max: new Date().getFullYear(), verbose_name: 'AÑO EN QUE INGRESÓ A LA INSTITUCIÓN EDUCATIVA' },
        { name: 'reasons', data_type: 'string', col: '11', verbose_name: 'EXPONGA LOS MOTIVOS PRINCIPALES POR LOS QUE SOLICITA LA BECA' },
    ];


    export const ECONOMIC_DEPENDENCE: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'EMAIL' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'parents_dependency', default: 'SÍ', data_type: 'boolean', col: '1', choices: ['SÍ', 'NO'], verbose_name: 'DEPENDE ECONÓMICAMENTE DE SUS PADRES' },
        { name: 'father_lives', default: 'SÍ', data_type: 'boolean', col: '2', choices: ['SÍ', 'NO'], verbose_name: 'VIVE SU PADRE' },
        { name: 'mother_lives', default: 'SÍ', data_type: 'boolean', col: '3', choices: ['SÍ', 'NO'], verbose_name: 'VIVE SU MADRE' },
        { name: 'parents_live_together', default: 'SÍ', data_type: 'string', col: '4', verbose_name: 'SUS PADRES VIVEN' },
    ];


    export const DISABILITY: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'disability', col: '1', data_type: 'boolean', default: 'NO', choices: ['SÍ', 'NO'], verbose_name: 'SUFRE DE ALGUNA DISCAPACIDAD' },
        { name: 'which', col: '2', data_type: 'string', choices: ['AUDITIVA', 'LENGUAJE', 'MENTAL', 'MOTRIZ', 'VISUAL'], verbose_name: '¿CUÁL?' },
    ];


    export const PARENTS: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'same_hause', col: '1', data_type: 'boolean', default: 'NO', choices: ['SÍ', 'NO'], verbose_name: 'VIVE EN LA MISMA CASA' },
        { name: 'relationship', col: '2', data_type: 'string', choices: ['PADRE', 'MADRE', 'CONYUGUE', 'HIJO', 'OTRO'], verbose_name: 'PARENTESCO' },
        { name: 'firstname', col: '3', data_type: 'string', verbose_name: 'NOMBRE' },
        { name: 'lastname', col: '4', data_type: 'string', verbose_name: 'APELLIDO PATERNO' },
        { name: 'secondlastname', col: '5', data_type: 'string', verbose_name: 'APELLIDO MATERNO' },
        { name: 'age', col: '6', data_type: 'string', min: 18, verbose_name: 'EDAD' },
        { name: 'studies_level', col: '7', data_type: 'string', choices: ['NINGUNO', 'PRIMARIA', 'SECUNDARIA', 'PREPARATORIA', 'LICENCIATURA', 'POSTGRADO'], verbose_name: 'NIVEL DE ESTUDIOS' },
        { name: 'scholarship', col: '8', data_type: 'boolean', choices: ['SÍ', 'NO'], default: 'NO', verbose_name: 'TIENE ALGUNA BECA?' },
        { name: 'ocupation', col: '9', data_type: 'string', verbose_name: 'OCUPACIÓN' },
        { name: 'monthly_income', col: '10', data_type: 'string', min: 0, verbose_name: 'INGRESO NETO MENSUAL' },
    ];


    export const FAMILY_INCOME: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'monthly_net_income', col: '1', data_type: 'number', min: 0, verbose_name: 'INGRESO NETO MENSUAL DE LA FAMILIA' },
        { name: 'other_incomes', col: '2', data_type: 'string', min: 0, verbose_name: 'OTROS INGRESOS' },
        { name: 'total_net_income', col: '3', data_type: 'string', min: 0, verbose_name: 'INGRESO NETO TOTAL' },
        { name: 'bonus', col: '4', data_type: 'string', min: 0, verbose_name: 'AGUINALDO' },
        { name: 'profit_sharing', col: '5', data_type: 'string', min: 0, verbose_name: 'REPARTO DE UTILIDADES' },
        { name: 'social_benefits', col: '6', data_type: 'string', verbose_name: 'PRESTACIONES SOCIALES' },
        { name: 'live_at_hause', col: '7', data_type: 'string', choices: ['PROPIA', 'RENTADA', 'PRESTADA', 'OTRO'], verbose_name: 'VIVE EN CASA' },
        { name: 'specify', col: '8', data_type: 'string', verbose_name: 'SI HA ELEGIDO LA OPCIÓN OTRO, ESPECIFÍQUE' },
    ];


    export const PROPERTIES: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'good_type', col: '1', data_type: 'string', verbose_name: 'TIPO DE BIEN' },
        { name: 'good_location', col: '2', data_type: 'string', verbose_name: 'UBICACIÓN DEL BIEN' },
        { name: 'good_value', col: '3', data_type: 'string', min: 0, verbose_name: 'VALOR APROXIMADO DEL BIEN' },
    ];


    export const VEHICLES: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'brand', col: '1', data_type: 'string', verbose_name: 'MARCA' },
        { name: 'market_value', col: '2', data_type: 'string', min: 0, verbose_name: 'VALOR COMERCIAL' },
        { name: 'ower', col: '3', data_type: 'string', verbose_name: 'PROPIO/EMPRESA/FAMILIAR', choices: ['PROPIO', 'EMPRESA', 'FAMILIAR'] },
        { name: 'monthly_payment', col: '4', data_type: 'string', verbose_name: 'PAGO MENSUAL' },
    ];


    export const BANCS: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'banc', col: '1', data_type: 'string', verbose_name: 'BANCO', min: 3 },
    ];


    export const CREDIT_CARDS: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'credit_card', col: '1', data_type: 'string', verbose_name: 'TARJETA DE CRÉDITO', min: 3 },
    ];

    export const FAMILY_EXPENSE: col[] = [
        { name: 'email', col: '0', data_type: 'string', verbose_name: 'Email' },
        { name: 'datetime', col: '1', data_type: 'string', verbose_name: 'MARCATEMPORAL', auto_add: new Date() },
        { name: 'living_place', col: '1', data_type: 'number', verbose_name: 'VIVIENDA', min: 0 },
        { name: 'food', col: '2', data_type: 'number', verbose_name: 'COMIDA', min: 0 },
        { name: 'laundry', col: '3', data_type: 'number', verbose_name: 'LAVANDERÍA', min: 0 },
        { name: 'gasoline', col: '4', data_type: 'number', verbose_name: 'GASOLINA', min: 0 },
        { name: 'light', col: '5', data_type: 'number', verbose_name: 'LUZ', min: 0 },
        { name: 'servitude', col: '6', data_type: 'number', verbose_name: 'SERVIDUMBRE', min: 0 },
        { name: 'transport', col: '7', data_type: 'number', verbose_name: 'TRANSPORTE', min: 0 },
        { name: 'clubs', col: '8', data_type: 'number', verbose_name: 'CLUBES', min: 0 },
        { name: 'tel_expense', col: '9', data_type: 'number', verbose_name: 'TELÉFONO', min: 0 },
        { name: 'schools', col: '10', data_type: 'number', verbose_name: 'COLEGIATURAS', min: 0 },
        { name: 'medical_expense', col: '11', data_type: 'number', verbose_name: 'GASTOS MÉDICOS', min: 0 },
        { name: 'gas_water', col: '12', data_type: 'number', verbose_name: 'GAS Y AGUA', min: 0 },
        { name: 'cable_internet', col: '13', data_type: 'number', verbose_name: 'CABLE/INTERNET', min: 0 },
        { name: 'other', col: '14', data_type: 'number', verbose_name: 'OTROS', min: 0 },
        { name: 'total_monthly_expenditure', col: '15', data_type: 'number', verbose_name: 'TOTAL GASTO MENSUAL' },
    ];

}
