/// <reference path="../Settings.ts" />


namespace FIREBASE {

    /**
     * Se conecta a Firebase.
     */
    function conn() {
        let baseUrl = SETTINGS.FIREBASE_URL;
        let secret = SETTINGS.FIREBASE_SECRET;
        let database = FirebaseApp.getDatabaseByUrl(baseUrl, secret);
        return database
    }


    /**
     * Escribir datos, debe ser un Objeto.
     * @param datas : Datos a escribir en Firebase.
     */
    function write(datas: {}, path: string = '/') {
        let db = conn();
        db.setData(path, datas)
    }




}