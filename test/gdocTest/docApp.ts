/// <reference path="../gdocs/gdocClient.ts" />
/// <reference path="./settings.ts" />

const conn_test = () => {
  const gdocModel = GdocClient.create(GDocsSettings.urlDoc);
  Logger.log(gdocModel.body.getText());
};
