const webAppSettings = () => {
  const scriptProperties = PropertiesService.getUserProperties();
  return {
    debug: scriptProperties.getProperty('debug') || 0,
    argumentRoute: scriptProperties.getProperty('argumentRoute') || 'path',
    urlProd: scriptProperties.getProperty('urlProd') || '',
    urlDev: scriptProperties.getProperty('urlDev') || '',
    favicon: scriptProperties.getProperty('favicon') || '',
    title: scriptProperties.getProperty('title') || '',
  };
}

export default webAppSettings;
