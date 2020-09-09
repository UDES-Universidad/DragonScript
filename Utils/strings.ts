/**
* Limpia un texto de acentos y espacios
* y lo devuelve en minúsculas.
* @param txt : text
*/
function clean_str(txt: string) {
    return txt.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(new RegExp(' ', 'gi'), '')
        .toLowerCase();
}