/// <reference path="framework/gss.ts" />
/// <reference path="framework/orm.ts" />

function test1_getSS() {
    class SS extends ORM.Model {
        id = '1AtjudmxnObWps0UU4wkJnAE9ycwWXSpsl7ag1mzMN0Q';
        sheet_name = 'Datos'
        columns = [
            { name: 'name', data_type: 'string', verbose_name: 'Nombre' },
            { name: 'grade', data_type: 'number', verbose_name: 'Grado' },
            { name: 'group', data_type: 'string', verbose_name: 'Grupo' },
            { name: 'status', data_type: 'boolean', verbose_name: 'Status' },
        ]

        constructor() {
            super();
            this.table_constructor();
        }
    }

    let sss = new SS();
    let name: object = sss.get('Fernando', "name");
    let group = sss.filter('A', "group");
    let allValues = sss.all()
    Logger.log(name);
    // Logger.log(group);
    // Logger.log(allValues);

    name['name'] = 'Emiliano';
    // name['status'] = true;
    // Logger.log(name);
    sss.save(name);

}
