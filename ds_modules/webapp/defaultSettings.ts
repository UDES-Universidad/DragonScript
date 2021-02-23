const webAppSettings = () => {
  const scriptProperties = PropertiesService.getUserProperties();
  return {
    debug: scriptProperties.getProperty('debug') || 0,
    argumentRoute: scriptProperties.getProperty('argumentRoute') || 'path',
    urlProd: scriptProperties.getProperty('urlProd') || '',
    urlDev: scriptProperties.getProperty('urlDev') || '',
  };
}

export default webAppSettings;
