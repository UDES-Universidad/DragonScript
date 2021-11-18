"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Settings {
}
exports.default = Settings;
Settings.dsModulesDir = 'ds_modules';
/** DS Modules */
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
Settings.gasDir = 'gas';
Settings.nodePackages_dev = [
    '@types/google-apps-script',
    '@typescript-eslint/eslint-plugin',
    'eslint',
    'eslint-config-airbnb-typescript',
    'eslint-plugin-import',
    'typescript',
];
Settings.nodePackages_prod = [];
Settings.gasTypes = [
    'standalone',
    'docs',
    'sheets',
    'slides',
    'forms',
    'webapp',
    'api',
];
