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

  public static gastDir = 'gas';

  public static gasFiles = [
    '.clasp.json',
    '.claspignore',
    '.eslintrc,js',
    '.gitignore',
    '.prettierrc.json',
    'appsscript.json',
    'init_node.bash',
    'tsconfig.json',
  ];

  public static nodePackages_dev = [
    'eslint',
    'eslint-config-airbnb-typescript',
    'eslint-plugin-import',
    '@typescript-eslint/eslint-plugin',
  ];

  public static nodePackages_prod = ['@types/google-apps-script'];
}
