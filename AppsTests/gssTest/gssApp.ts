import Test from '../Tests/testModel';
import GssCreator from '../gss/gssCreator';
import GssClient from '../gss/gssClient';
import GssColumn from '../gss/gssColumnFactory';

const gssTest = () => {
  new GssTest().run();
};

class GssTest extends Test {
  private app: GssCreator;
  private app2: GssCreator;

  constructor() {
    super();
    this.app = GssClient.create({
      urlOrId: urlBook,
      sheetName: sheetDataSet,
    });

    this.app2 = GssClient.create({
      urlOrId: urlBook,
      sheetName: sheetDataSet,
      table: [
        GssColumn.datetime({
          name: 'dateTime',
          verboseName: 'Marca temporal',
          defaultValue: Date(),
          required: true,
        }),
        GssColumn.str({
          name: 'firstName',
          verboseName: 'Nombre',
          required: true,
        }),
        GssColumn.str({
          name: 'lastName',
          verboseName: 'Apellidos',
          required: true,
        }),
        GssColumn.num({
          name: 'age',
          verboseName: 'Edad',
          required: true,
        }),
        GssColumn.str({
          name: 'phone',
          verboseName: 'Tu celular/Whatsapp',
        }),
        GssColumn.str({
          name: 'email',
          verboseName: 'Tu correo electrónico',
        }),
      ],
    });
  }

  test_range() {
    const range = this.app.sheet.getRange(1, 1, 1, 1);
    this.assertIsEqual(String(range), 'Range');
  }

  test_object_getByNumber() {
    const datas = this.app?.Objects().getRowByNumber(2);
    Logger.log(datas);
    this.assertIsEqual('Balderas', datas.getVal('cell3'));
  }

  test_columnsPredefined() {
    const obj = this.app2.Objects()
    const datas = obj.getAll({
      generator: true,
      slice: [0, 10],
    });
    const item1 = datas.next().value;
    const firstName = item1.getVal('firstName');
    const lastName = item1.getVal('lastName');
    const age = item1.getVal('age');
    const phone = item1.getVal('phone');
    const email = item1.getVal('email');

    Logger.log(`${firstName} ${lastName} ${age} ${phone} ${email}`);

    try {
      item1.setVal('firstName', 28);
      obj.saveRow(item1);
    } catch (error) {
      item1.setVal('firstName', 'Rebeca');
      obj.saveRow(item1);
    }
  }

  test_getAll() {
    const datas = this.app.Objects().getAll().Rows;
    this.assertIsEqual('Dulce ', datas[50].getVal('cell2'));
    this.assertIsEqual('Milton eduardo', datas[49].getVal('cell2'));
    this.assertIsEqual('Marbelia', datas[48].getVal('cell2'));
    this.assertIsEqual('Jaime', datas[47].getVal('cell2'));
    this.assertIsEqual('Eduardo', datas[46].getVal('cell2'));
  }

  test_filter() {
    const datas = this.app2.Objects().filter({
      search: {
        age: 43,
      },
    });

    this.assertIsEqual(
      'Fernando',
      datas.Rows[0].getVal('firstName'),
    );

    const phone = '8776643754';
    const adrian = datas.filter({
      search: {
        phone,
      },
    });

    this.assertIsEqual(
      'adrian',
      adrian.Rows[0].getVal('firstName'),
    );
    this.assertIsEqual(
      phone,
      adrian.Rows[0].getVal('phone'),
    );
  }

  test_filterSliceReverse() {
    const datas = this.app2.Objects().filter({
      slice: [-10, -1],
      reverse: true,
      search: {
        phone: '8553997117',
      },
    });

    this.assertIsEqual(
      'M.Lopez_Lopez@udes.edu.mx',
      datas.Rows[0].getVal('email'),
    );
  }

  test_GetBySheetRange() {
    const datas = this.app2.Objects().GetBySheetRange({
      range: [
        this.app2.sheet.getLastRow() - 10, 1,
        11, this.app2.sheet.getLastColumn(),
      ],
      search: {
        age: '',
      },
      reverse: true,
    });
    Logger.log(datas.Rows.map((row) => row.getVal('firstName')));
    this.assertIsEqual(2, datas.Rows.length);
  }
}
