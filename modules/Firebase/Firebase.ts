/// <reference path="../Settings.ts" />


namespace FIREBASE {

    export class Fire {
        baseUrl;
        secret;
        db: any;

        constructor(baseUrl: string, secret: string) {
            this.baseUrl = baseUrl;
            this.secret = secret;
            this.conn();
        }

        /**
         * Se conecta a Firebase.
         */
        conn() {
            let baseUrl = SETTINGS.FIREBASE_URL;
            let secret = SETTINGS.FIREBASE_SECRET;
            let database = FirebaseApp.getDatabaseByUrl(baseUrl, secret);
            this.db = database
            return database
        }

        /**
        * Escribir datos, debe ser un Objeto.
        * @param datas : Datos a escribir en Firebase.
        */
        set_data(path: string = '/', datas = {}) {
            if (Object.entries(datas).length > 0) {
                return this.db.setData(path, datas)
            } else {
                throw 'data parameter must not be empty.';
            }
        }

        get_data(path: string = '/') {
            return this.db.getData(path)
        }

        remove_data(path: string) {
            if (path) {
                return this.db.removeData(path)
            } else {
                throw 'path parameter must not be empty.';
            }
        }

    }








}