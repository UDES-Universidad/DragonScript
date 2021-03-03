function webAppSettings_() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const props = scriptProperties.getProperties();
  const defaultVals = {
    debug: 0,
    argumentRoute: '',
    urlProd: '',
    urlDev: '',
    favicon: '',
    title: '',
    error404Template: '',
    metaViewPort: 'width=device-width, initial-scale=1.0',
  };
  for (const key of Object.keys(defaultVals)) {
    if (key in props) {
      props[key] = props[key] ? props[key] : defaultVals[key];
    } else {
      props[key] = defaultVals[key];
    }
  }

  return props;
}

export default webAppSettings_;
