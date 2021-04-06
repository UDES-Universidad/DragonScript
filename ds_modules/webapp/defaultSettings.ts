interface webAppSettingsInter {
  debug: number;
  urlProd: string;
  urlDev: string;
  favicon: string;
  metaViewPort: string;
  appName: string;
  error404Template: string;
  redirectTemplate: string;
  componentPaths: string[];
}

function webAppSettings_() {
  const data: webAppSettingsInter = {
    debug: 0,
    urlProd: '',
    urlDev: '',
    favicon: '',
    appName: '',
    error404Template: '',
    metaViewPort: 'width=device-width, initial-scale=1.0',
    redirectTemplate: 'ds_modules/webapp/templates/redirect.html',
    componentPaths: ['src', 'src/components'],
  };
  try {
    const keys: { [keys: string]: any } = Object.keys(settings_());
    const customSettings: { [keys: string]: any } = settings_();
    keys.forEach((key: string) => {
      if (key in customSettings) data[key] = customSettings[key];
    });
  } catch (e) {}

  return data;
}

export default webAppSettings_;
