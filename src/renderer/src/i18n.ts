import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import { LanguageI18nMap, useSettingStore } from './store/settingStore'

const store = useSettingStore.getState()
const language = LanguageI18nMap[store.language]

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    lng: language,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    interpolation: {
      escapeValue: false
    }
  })

useSettingStore.subscribe((state) => {
  i18n.changeLanguage(LanguageI18nMap[state.language])
})

export default i18n
