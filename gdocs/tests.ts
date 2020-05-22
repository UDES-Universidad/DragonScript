/// <reference path="./docs.ts" />
/// <reference path="../Settings.ts" />


function updateDoc() {

    let doc = DOCS.conn(SETTINGS.DOC);

    let body = doc.getBody();
    body.clear();
    let title = body.getParagraphs()[0];
    title.setText('Los Uruk-hai');
    title.setHeading(DocumentApp.ParagraphHeading.HEADING1)
    body.appendHorizontalRule();
    body.appendParagraph('');
    body.appendParagraph('Su primera gran aparición militar fue en los vados del Isen, donde derrotaron al ejército de Rohirrim y dieron muerte a Théodred, el hijo de Théoden. Más tarde una pequeña hueste de Uruk-hai liderada por Uglúk (o Lurtz en la trilogía cinematográfica) atacó a la Comunidad del Anillo en la colina de Amon Hen, donde capturaron a los hobbits Merry y Pippin y dieron muerte a Boromir de Gondor. Sin embargo, esta pequeña hueste fue aniquilada en las lindes de Fangorn por los Rohirrim al mando de Éomer. En esta ocasión los uruks llevaban un equipo más ligero, tal vez para movilizarse con más agilidad por el bosque de Amon-Hen o para recorrer con más rapidez los kilómetros que separaban Isengard y Amon-Hen, sustituyendo sus armaduras de placas por otras más ligeras de pieles y cuero.')
}


function seeDoc() {

    let doc = DOCS.conn(SETTINGS.DOC);
    let body = doc.getBody();

    let selection = body.getText();
    Logger.log(selection);

    let paragraphs = body.getParagraphs();
    for (const paragraph of paragraphs) {

        if (paragraph.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
            let txt = paragraph.getText();
            if (txt) {
                body.appendHorizontalRule();
                let traduction = LanguageApp.translate(txt, 'es', 'fr');
                body.appendParagraph(traduction);
            }
        }
    }
}


function style() {

    /*
    {INDENT_START=0.0, SPACING_BEFORE=0.0, HEADING=Normal, ITALIC=null, FONT_FAMILY=null, INDENT_FIRST_LINE=0.0, UNDERLINE=null, LINK_URL=null, STRIKETHROUGH=null, FOREGROUND_COLOR=null, HORIZONTAL_ALIGNMENT=Left, BOLD=null, FONT_SIZE=null, SPACING_AFTER=0.0, LINE_SPACING=1.15, BACKGROUND_COLOR=null, LEFT_TO_RIGHT=true, INDENT_END=0.0}
    */

    let doc = DOCS.conn(SETTINGS.DOC);
    let body = doc.getBody();

    let p1 = body.getChild(3);
    Logger.log(p1.getAttributes());
    Logger.log(p1.asText().getText());
    p1.asText().appendText('También formaron parte de la gran hueste que fue enviada a la Puerta Negra para repeler al rey Elessar y sus huestes, la batalla acabó en tragedia y los escasos Uruk-hai supervivientes se reagruparon y se escondieron junto con otros en las laderas de las cercanas montañas de Mordor, donde jamás volvieron a ser vistos y tampoco supusieron ningún peligro a los pueblos libres de los hombres.')

    let style = {};
    style[DocumentApp.Attribute.BOLD] = true;
    style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#6495ed';

    p1.setAttributes(style);
}

function elementsLoop() {

    let doc = DOCS.conn(SETTINGS.DOC);
    let body = doc.getBody();

    let children = body.getNumChildren();

    for (let i = 0; i < children; i++) {
        let child = body.getChild(i);
        if (child.asText().getText().length && child.getType() === DocumentApp.ElementType.PARAGRAPH) {
            Logger.log(child.asText().getText());
        }
    }

    body.replaceText('uruk', 'URUK');

}

function table() {
    let doc = DOCS.conn(SETTINGS.DOC);
    let body = doc.getBody();

    let table = body.appendTable();
    let row1 = table.appendTableRow();
    let cell1 = row1.appendTableCell();
    let cell2 = row1.appendTableCell();
    cell1.setText('Luis');
    cell2.setText('Fernando');
}


function selection_doc() {

    let doc = DOCS.conn(SETTINGS.DOC);
    let body = doc.getBody();

    let selection = doc.getSelection();
    Logger.log(selection);

    let rangeElements = selection.getRangeElements();
    for (const re of rangeElements) {
        let el = re.getElement();
        if (el.asText) {
            Logger.log(el.asText());
        }
    }

}