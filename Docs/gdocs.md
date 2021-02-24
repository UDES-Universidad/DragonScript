# gdocs module

This module handles Google Docs.

├──
└──
│

## Quick start

We will to construct a function that create a copy of template Google Doc and then it will replace some marks in the document and export it to PDF.

Project structure:

        gdoctest
        ├── test
        │   └── copyAndExport.ts
        ├── ds_modues
        │   ├── interfaces.ts
        │   └── gdocs
        │       ├── gdocClient.ts
        │       └── gdocCreator.ts
        └── Settings.ts

In our copyAndExport.ts file we write:

        import GdocClient from '../ds_modules/gdocs/gdocClient.ts'

        /**
         * Creates a document copy, reemplace marks.
         * and exports a PDF.
         * /
        const createAcopy = () => {
            // Google Doc template.
            const urlDoc = 'https://docs.google.com/document/d/thisis-id-document/edit';

            // Folder Drive where we will save our documents.
            const folderId = 'thisIs-our-folderId';

            // Folder for PDFs.
            const folderIdPDF = 'thisIs-other-folderId';

            // Data to fill our document.
            const data = {
                name: 'Marie',
                lastName: 'Curie',
                superPower: 'Radiactive blaster.'
            };

            // Template.
            const doc = GdocClient.create(urlDoc);

            // Template copy.
            // makeCopy acepts: documents name and folder id.
            const newDoc = doc.makeCopy('templateFilled', folderId);

            // Now we fill the template copy.
            // To replace text in a document we use this marks
            // by default ##, so the text to be replaced must
            // be wrapped between them, by example ##name##.
            // This method receives an object where keys will
            // be transformed to marks and replaced by its value.
            newDoc.replace(data);

            // Now we create a PDF.
            const pdfDoc = newDoc.export({
                name: 'PdfFile.pdf',
                folderId: folderIdPDF,
                mimeType: MimeType.PDF,
                accessType: DriveApp.Access.ANYONE,
                permissionType: DriveApp.Access.VIEW,
            });

            Logger.log(pdfDoc.getDownloadUrl());
        }

# Modules

## GdocClient

### create(urlOrId)

Creates a GdocCreator instance.

#### Parameters

| Name      | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `urlOrId` | string | URL or ID of Google Document |

#### Return

Return a GdocCreator instance.

## GdocCreator

### app

This is a getter that returns a GoogleAppsScript.Document.Document instance.

### id

Returns a id document (`string`).

### body

Returns a Google.document.body.

### url

Returns a url document (`string`).

### connect(urlOrId)

Open a document target.

| Name      | Type     | Description        |
| --------- | -------- | ------------------ |
| `urlOrId` | `string` | URL or ID document |

#### Return

Returns a `GoogleAppsScript.Document.Document` .

### export(conf)

Exports document to MIME type.

#### Parameters

| Name   | Type            | Description             |
| ------ | --------------- | ----------------------- |
| `conf` | `ConfExportDoc` | Configuration interface |

##### ConfExportDoc

| Name           | Type                              | Description                                 |
| -------------- | --------------------------------- | ------------------------------------------- |
| mimeType       | GoogleAppsScript.Drive.MimeType   | Type to export file.                        |
| name           | string                            | Name for file                               |
| folderId?      | string                            | Folder ID where file exported will be save. |
| onlyBlob?      | boolean                           | Returns only Blob                           |
| accessType     | GoogleAppsScript.Drive.Access     | Access type for user.                       |
| permissionType | GoogleAppsScript.Drive.Permission | Permission type for user.                   |

##### Return

`blob || GoogleAppsScript.Drive.File`

### makeCopy(name, folderId)

Creates a document copy.

#### Parameters

| Name       | Type     | Description                               |
| ---------- | -------- | ----------------------------------------- |
| `name`     | `string` | Name of the new document. No required.    |
| `folderId` | `string` | Folder to save new document. No required. |

#### Return

`GoogleAppsScript.Document.Document`.

### replace(datas, forceWrite)

Replaces a text marks in the text body.

#### Parameters

| Name         | Type      | Description                                                                                                                                                  |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data`       | `object`  | Data to be replaced. Keys must be the same as marks in the text, keys will be automatically wrapped between '##' and replaced in the body text by its value. |
| `forceWrite` | `boolean` | Allows or avoids async document write changes                                                                                                                |

### setPermissions(access, permission)

Handles about access and permission.

#### Parameters

| Name         | Type                                | Description                                                                                      |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `access`     | `GoogleAppsScript.Drive.Access`     | [See Google Documentation](https://developers.google.com/apps-script/reference/drive/access)     |
| `permission` | `GoogleAppsScript.Drive.Permission` | [See Google Documentation](https://developers.google.com/apps-script/reference/drive/permission) |

#### Return

`Void`

### setTrashed(trashed)

Send file to trash.

#### Parameters

| Name      | Type      | Description                                            |
| --------- | --------- | ------------------------------------------------------ |
| `trashed` | `boolean` | true for send file to trash, false, to bring back file |
