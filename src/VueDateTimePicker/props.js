import { getDefaultLocale } from './utils'

export default {
  value: { type: [String, Object], default: null },
  label: { type: String, default: 'Select date & time' },
  noLabel: { type: Boolean, default: false },
  hint: { type: String, default: null },
  error: { type: Boolean, default: null },
  primaryColor: { type: String, default: '#1e90ff' },
  primaryVariantColor: { type: String, default: '#e4efff' },
  secondaryColor: { type: String, default: '#eaeaea' },
  textColor: { type: String, default: '#333333' },
  backgroundColor: { type: String, default: '#fff' },
  borderColor: { type: String, default: '#cecece' },
  lightTextColor: { type: String, default: '#fff' },
  overlay: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
  position: { type: String, default: null },
  locale: { type: String, default: getDefaultLocale() },
  formatted: { type: String, default: 'llll' },
  format: { type: String, default: 'YYYY-MM-DD hh:mm a' },
  outputFormat: { type: String, default: null },
  minuteInterval: { type: [String, Number], default: 1 },
  startMinute: { type: Number, default: 0 },
  endMinute: { type: Number, default: 60 },
  minDate: { type: String, default: null },
  maxDate: { type: String, default: null },
  autoClose: { type: Boolean, default: false },
  onlyTime: { type: Boolean, default: false },
  onlyDate: { type: Boolean, default: false },
  noHeader: { type: Boolean, default: false },
  range: { type: Boolean, default: false },
  noWeekendsDays: { type: Boolean, default: false },
  disabledWeekly: { type: Array, default: () => ([]) },
  disabledDates: { type: Array, default: () => ([]) },
  disabledHours: { type: Array, default: () => ([]) },
  enabledDates: { type: Array, default: () => ([]) },
  open: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  inputSize: { type: String, default: null },
  noButton: { type: Boolean, default: false },
  noButtonNow: { type: Boolean, default: false },
  noButtonSubmit: { type: Boolean, default: false },
  buttonNowTranslation: { type: String, default: null },
  buttonSubmitTranslation: { type: String, default: null },
  firstDayOfWeek: { type: Number, default: null },
  noValueToCustomElem: { type: Boolean, default: false },
  behaviour: { type: Object, default: () => ({}) },
  noKeyboard: { type: Boolean, default: false },
  right: { type: Boolean, default: false },
  noClearButton: { type: Boolean, default: false },
  noMonthYearSelect: { type: Boolean, default: false }
}
