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

Import a **gssClient** and **gssColumnFactory** in myModule/tables.ts to create a table. I recomend have a unique file for tables. **gssClient** represents a one Sheet and **gssColumnFactory** represents a column in your sheet.

    import GssColumn from '../ds_modules/gss/gssColumnFactory';
    import GssClient from '../ds_modules/gss/gssClient';

    const mytableZombie = () => {
      return gssClient.create({
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
      const table = mytableZombie();
      objects = table.Objects();
      const rows = objects.rowGenerator();
      while(true) {
        row = rows.next();
        const {done, value} = row;
        if (done) break;
        if (value.getVal('age') > 25) {
          value.setVal('isZombie', true)
          objects.save(value);
        }
      }
    }

# Modules

## class gssClient

## Handles GssCreator.

### static create(conf)

Configures a GssCreator instance and return it.

#### Parameters

| Name   | Type               | Description            |
| ------ | ------------------ | ---------------------- |
| `conf` | `ConfParamsClient` | Configuration instance |

##### ConfParamsClient

| Name        | Type               | Description                        |
| ----------- | ------------------ | ---------------------------------- |
| `urlOrId`   | `string`           | URL or ID Spreadsheet.             |
| `sheetName` | `string`           | Sheet with which you work.         |
| `table`     | `AbstractColumn[]` | Array of AbstractColumn instances. |

##### Return

`GssCreator`

---

## class gssCreator

This class is in charge all about the handling of the sheet itself. It is returned by gssClient.create method.

### columnsVerboseNames

Array of verbose names of columns.

---

### id

Spreadsheet ID.

---

### url

Spreadsheet URL.

---

### sheet

`GoogleAppsScript.Spreadsheet.Sheet`

---

### connect(urlOrId)

Connects to Spreadsheet, if are not passed any parameter the function will try to connect with the current Spreadsheet, in this case, it is assumed that the script is embedded.

#### Parameters

| Name      | Type     | Description            |
| --------- | -------- | ---------------------- |
| `urlOrId` | `string` | URL or ID Spreadsheet. |

#### Return

`GssCreator`

---

### makeCopy(name, folderId)

Creates a spreadsheet copy.

#### Parameters

| Name       | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| `name`     | `string` | New spreadsheet name.                  |
| `folderId` | `string` | Folder where de new file will be saved |

#### Return

`GssCreator`

---

### Objects()

Returns a `GssObjectsCreator` that handles iterators and data in the sheet.

#### Return

`GssObjectsCreator`

---

### setPermissions(access, permission)

Sets permissions to file.

#### Parameters

| Name         | Type                                | Description                                                                                      |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `access`     | `GoogleAppsScript.Drive.Access`     | [See Google Documentation](https://developers.google.com/apps-script/reference/drive/access)     |
| `permission` | `GoogleAppsScript.Drive.Permission` | [See Google Documentation](https://developers.google.com/apps-script/reference/drive/permission) |

---

### setSheet(sheetName)

Sets a sheet to work with it. If that sheet not exists the function will try to add it.

#### Parameters

| Name        | Type     | Description |
| ----------- | -------- | ----------- |
| `sheetName` | `string` | Sheet name  |

#### Return

`GssCreator`

---

### setTable(columns)

Checks that the amount o columns in the sheet and in the columns passed as parameter matches. If not, throw an error. If all is well, creates a columns map. If none columns are passed as parameter, then it creates generic columns that are called cell + index (cell1, cell2, cell3, etc.).

#### Parameters

| Name      | Type             | Description      |
| --------- | ---------------- | ---------------- |
| `columns` | `AbstractColumn` | Column interface |

##### AbstractColumn

| Name                  | Type                       | Description                                       |
| --------------------- | -------------------------- | ------------------------------------------------- |
| `name`                | ` string`                  | Column name                                       |
| `verboseName?`        | ` string`                  | Verbose columna name                              |
| `forceConvertion?`    | ` boolean`                 | Try to convert data type to the data type column  |
| `required?`           | ` boolean`                 | If is required                                    |
| `defaultValue?`       | ` any`                     | Value by default on save is none value is passed. |
| `functionValidators?` | ` ((value: any) => any)[]` | Custom validators, must return `true`.            |

#### Return

`GssCreator`

---

### sheetNames()

Returns a array with the names of all sheets in the spreadsheet.

#### Return

`string[]`

---

# gssObjects Mudule

## class GssObjectsCreator

This class is in charge of data sheet.

**rowGenerator**: retrieve row by row and return it as a GssRow instance. This method can receive a configuration object, that has this attributes:

- startAtRow (number): row number where the generator start its cycle.
- rowsNumber (number): how many rows will be iterate.
- reverse (number): if the iteration will be in reverse.

Example: `rowGenerator({ startAtRow: 20, rowsNumber: 15, reverse: true, });`

If none configuration object is passed the method iterate over all rows in the sheet.

**getRowByNumber**: retrieve a row by his row number, and return it as a GssRow instance.

**saveRow**: Saves a row in its sheet, this method must receive a GssRow instance.

## GssRow

This class is in charge to retrieve data from row and change its value.

**data**: is an set/get method that returns a array with a values of row, and allows receive a new array of data that must have the same length of column sheet.

**dataAsObj**: is and attributes that returns a object where the keys are a column names and values a column values.

**getVal('columName')**: return a value of a cell by its column name.

**setVal('columName', newValue)**: change value in a row by its columName.

To **save** a row in a sheet use a method **saveRow** in Objects.
