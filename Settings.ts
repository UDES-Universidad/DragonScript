/**
 * Settings
 * */

ScriptProperties.setProperties({
  bookUrl: '',
  sheetName: '',
  debug: '0',
  argumentRoute: 'path',
  appName: '',
  urlDev: '',
  urlProd: '',
  favicon: 'https://udes.edu.mx/wp-content/uploads/2016/08/favicon.png',
  notAuthPath: '',
  defaultPath: '',
  firebaseUrl: '',
  firebaseSecret: '',
});

const SETTINGS = PropertiesService.getScriptProperties();

export default SETTINGS;
