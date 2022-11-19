import { createI18n } from 'vue-i18n'

import de from './locales/de.json'
import en from './locales/en.json'

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: navigator.language.split('-')[0] || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    de,
    en
  }
})
