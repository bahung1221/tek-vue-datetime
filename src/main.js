import Vue from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(customParseFormat)
dayjs.extend(updateLocale)
dayjs.extend(localeData)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
