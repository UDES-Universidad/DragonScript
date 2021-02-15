# GssClient

This module manage data from a Sheet of Spreadsheet.

## Quick start

### Application Structure

    myApp
    ├── myModule
    │   ├── tables.ts
    │   └── test.ts
    └── ds_modules
        ├── interfaces.ts
        └── gss
            ├── gssClient.ts
            ├── gssColumnCreator.ts
            ├── gssColumnFactory.ts
            ├── gssCreator.ts
            ├── gssObjects.ts
            └── gssRowBuilder.ts


Import a __gssClient__ and __gssColumnFactory__ in myModule/tables.ts to create a table. I recomend have a unique file for tables. __gssClient__ represents a one Sheet and __gssColumnFactory__ represents a column in your sheet.

    import GssColumn from '../ds_modules/gss/gssColumnFactory';
    import GssClient from '../ds_modules/gss/gssClient';

    const mytableZombie = () => {
      gssClient.create({
        // URL or id of your Spreadsheet, nothing if you are using
        // a app script embebed in a Spreadsheet.
        urlOrId: '',
        // If it not exists, it will be created.
        sheetName: 'mySheetName',
        // Table abstraction.
        table: [
          GssColumn.str({
            name: 'userName',
            verboseName: 'User Name',
            required: true,
          }),
          GssColumn.number({
            name: 'age',
            verboseName: 'Years Old',
          }),
          GssColumn.bool({
            name: 'isZombie',
            verboseName: 'Is a zombie?',
            defaultValue: false,
          }),
        ],
      });
    }

Now, lets fun. We will search all users with more than 25 years and convert them to zombies. We create the myModule/zombies.ts file.
    
    import mytableZombie from './tables'

    const createZombies = () => {
      const table = mytableZombie.Objects();
      const rows = table.rowGenerator({
        
      });
      while(true) {
        const [done, value] = rows.next();
        if (done) break;
        if (value.getVal('age') > 25) {
          value.setVal('isZombie', true)
          table.save(value);
        }
      }
    }













