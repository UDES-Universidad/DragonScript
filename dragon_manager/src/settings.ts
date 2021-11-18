export default class Settings {
  public static dsModulesDir = 'ds_modules';

  /** DS Modules */
  public static dsModules = [
    'adminSDK',
    'gdocs',
    'gmail',
    'gslides',
    'gss',
    'scriptprops',
    'tests',
    'ui',
    'utils',
    'webapp',
  ];

  public static gasDir = 'gas';

  public static nodePackages_dev = [
    '@types/google-apps-script',
    '@typescript-eslint/eslint-plugin',
    'eslint',
    'eslint-config-airbnb-typescript',
    'eslint-plugin-import',
    'typescript',
  ];

  public static nodePackages_prod = [];

  public static gasTypes = [
    'standalone',
    'docs',
    'sheets',
    'slides',
    'forms',
    'webapp',
    'api',
  ];
}
