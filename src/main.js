import Vue from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(customParseFormat)
dayjs.extend(updateLocale)
dayjs.extend(localeData)
dayjs.extend(weekday)
dayjs.extend(isBetween)
dayjs.extend(localizedFormat)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
