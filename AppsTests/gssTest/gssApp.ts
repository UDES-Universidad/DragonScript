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
    this.assertIsEqual('Balderas', datas.getData('cell3'));
  }

  test_columnsPredefined() {
    const datas = this.app2.Objects().getAll();
    const item1 = datas[0];
    const firstName = item1.getData('firstName');
    const lastName = item1.getData('lastName');
    const age = item1.getData('age');
    const phone = item1.getData('phone');
    const email = item1.getData('email');

    Logger.log(`${firstName} ${lastName} ${age} ${phone} ${email}`);

    try {
      item1.setData('firstName', 28);
      item1.save();
    } catch (error) {
      item1.setData('firstName', 'John');
      item1.save();
    }
  }

  test_getAll() {
    const datas = this.app.Objects().getAll();
    this.assertIsEqual('Dulce ', datas[50].getData('cell2'));
    this.assertIsEqual('Milton eduardo', datas[49].getData('cell2'));
    this.assertIsEqual('Marbelia', datas[48].getData('cell2'));
    this.assertIsEqual('Jaime', datas[47].getData('cell2'));
    this.assertIsEqual('Eduardo', datas[46].getData('cell2'));
  }

  test_filter() {
    const datas = this.app2.Objects().filter({
      search: {
        age: 43,
      },
    })

    Logger.log(datas.Rows.length);
    Logger.log(datas.Rows[0].getData('firstName'));

    const adrian = datas.filter({
      search: {
        phone: '8776643754',
      },
    });

    Logger.log(adrian.Rows[0].getData('firstName'));
    Logger.log(adrian.Rows[0].getData('phone'));
  }
}
