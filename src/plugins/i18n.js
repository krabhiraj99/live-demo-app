const localeMessages = require('../locales/en.json');
const packageJson = require('../../package.json');
export default ({ app }) => {
    if (app.i18n) {
        const namespace = `${packageJson.vinceLiveApp.basePath}:${packageJson.vinceLiveApp.name}`;
        app.i18n.mergeLocaleMessage('en', { [namespace]: localeMessages });
    }
};