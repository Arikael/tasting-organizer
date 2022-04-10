module.exports = {
    publicPath: '/',
    pluginOptions: {
      quasar: {
        importStrategy: 'kebab',
        rtlSupport: false
      },
      i18n: {
        locale: 'en',
        fallbackLocale: 'de',
        localeDir: 'locales',
        enableLegacy: false,
        runtimeOnly: false,
        compositionOnly: false,
        fullInstall: true
      }
    },
    transpileDependencies: [
        'quasar'
    ]
}
