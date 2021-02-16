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
            └── GssRowBuilder.ts


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
      const rows = table.rowGenerator();
      while(true) {
        const [done, value] = rows.next();
        if (done) break;
        if (value.getVal('age') > 25) {
          value.setVal('isZombie', true)
          table.save(value);
        }
      }
    }

## gssCreator

This class is in charge all about the handling of the sheet itself. It is returned by gssClient.create method.

__Objects__: handle data sheet, see more below.

__sheetNames__: get the names of the others sheets in the same Spreadsheet.

__makeCopy__: Creates a copy of document and return a GssCreator instance.
  
  Params:

  - access (GoogleAppsScript.Drive.Access)
  - permission (GoogleAppsScript.Drive.Permission)

__setPermissions__: Sets permissions to file.

Params:

  - name (string): name to new document.
  - folderId: (string): folder id to save new document.

## Objects

Objects is a instance of GssObjectsCreator returned by gssClient.create method. Objects is in charge of all methods about data in a sheet, or table. 

Objects has the next methods:

__rowGenerator__: retrieve row by row and return it as a GssRow instance. This method can receive a configuration object, that has this attributes:
  - startAtRow (number): row number where the generator start its cycle.
  - rowsNumber (number): how many rows will be iterate.
  - reverse (number): if the iteration will be in reverse.

Example: `rowGenerator({
    startAtRow: 20,
    rowsNumber: 15,
    reverse: true,
  });`

If none configuration object is passed the method iterate over all rows in the sheet.

__getRowByNumber__: retrieve a row by his row number, and return it as a GssRow instance.

__saveRow__: Saves a row in its sheet, this method must receive a GssRow instance. 

## GssRow

This class is in charge to retrieve data from row and change its value.

__data__: is an set/get method that returns a array with a values of row, and allows receive a new array of data that must have the same length of column sheet. 

__dataAsObj__: is and attributes that returns a object where the keys are a column names and values a column values.

__getVal('columName')__: return a value of a cell by its column name.

__setVal('columName', newValue)__: change value in a row by its columName.

To __save__ a row in a sheet use a method __saveRow__ in Objects.
