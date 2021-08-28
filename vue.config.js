module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/tasting-organizer/'
        : '/',
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: false
        }
    },
    transpileDependencies: [
        'quasar'
    ]
}
