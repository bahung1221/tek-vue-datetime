import { getDefaultLocale } from './utils'

export default {
  value: { type: [String, Object], default: null },
  label: { type: String, default: 'Select date & time' },
  noLabel: { type: Boolean, default: false },
  hint: { type: String, default: null },
  error: { type: Boolean, default: null },
  color: { type: String, default: 'dodgerblue' },
  monthYearColor: { type: String, default: '#454350' },
  buttonColor: { type: String, default: null },
  dark: { type: Boolean, default: false },
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
  noButton: { type: Boolean, default: false },
  disabledDates: { type: Array, default: () => ([]) },
  disabledHours: { type: Array, default: () => ([]) },
  enabledDates: { type: Array, default: () => ([]) },
  open: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  inputSize: { type: String, default: null },
  buttonNowTranslation: { type: String, default: null },
  noButtonNow: { type: Boolean, default: false },
  noButtonValidate: { type: Boolean, default: false },
  firstDayOfWeek: { type: Number, default: null },
  noValueToCustomElem: { type: Boolean, default: false },
  behaviour: { type: Object, default: () => ({}) },
  noKeyboard: { type: Boolean, default: false },
  right: { type: Boolean, default: false },
  noClearButton: { type: Boolean, default: false }
}
