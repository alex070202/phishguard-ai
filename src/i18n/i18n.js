import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import bg from './locales/bg.json'

export const LANGUAGE_STORAGE_KEY = 'phishguard_language'

const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
const initialLanguage = storedLanguage === 'bg' ? 'bg' : 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bg: { translation: bg },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (language) => {
  const supportedLanguage = language === 'bg' ? 'bg' : 'en'
  localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage)
  document.documentElement.lang = supportedLanguage
})

document.documentElement.lang = initialLanguage

export default i18n
