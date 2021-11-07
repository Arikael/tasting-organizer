import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import i18n from './i18n'
import router from './router'

createApp(App).use(router).use(i18n).use(Quasar, quasarUserOptions).mount('#app')
