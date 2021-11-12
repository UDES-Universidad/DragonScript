"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Settings {
}
exports.default = Settings;
Settings.dsModulesDir = 'ds_modules';
Settings.dsModules = [
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
Settings.gastDir = 'gas';
Settings.gasFiles = [
    '.clasp.json',
    '.claspignore',
    '.eslintrc,js',
    '.gitignore',
    '.prettierrc.json',
    'appsscript.json',
    'init_node.bash',
    'tsconfig.json',
];
Settings.nodePackages_dev = [
    'eslint',
    'eslint-config-airbnb-typescript',
    'eslint-plugin-import',
    '@typescript-eslint/eslint-plugin',
];
Settings.nodePackages_prod = ['@types/google-apps-script'];
