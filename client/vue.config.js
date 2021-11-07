module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/tasting-organizer/'
        : '/',
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
