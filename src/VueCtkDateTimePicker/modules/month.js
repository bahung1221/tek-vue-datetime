import Dayjs from 'dayjs'
import { extendMoment } from 'moment-range'
const dayjs = extendMoment(Dayjs)

export default class Month {
  constructor (month, year, locale) {
    dayjs.locale(locale)
    this.start = dayjs([year, month])
    this.end = this.start.clone().endOf('month')
    this.month = month
    this.year = year
  }

  getWeekStart () {
    return this.start.weekday()
  }

  getFormatted () {
    return this.start.format('MMMM')
  }

  getYear () {
    return this.start.format('YYYY')
  }

  getWeeks () {
    return this.end.week() - this.start.week() + 1
  }

  getMonthDays () {
    const r1 = dayjs.range(this.start, this.end).by('days')
    return Array.from(r1)
  }
}

export const getWeekDays = (locale, firstDay) => {
  const firstDayNumber = firstDay === 0
    ? 7
    : firstDay || dayjs.localeData(locale).firstDayOfWeek()
  let days = dayjs.weekdaysShort()
  const keep = days.splice(firstDayNumber)
  const stay = days
  days = keep.concat(stay)
  return days
}

export const getMonthsShort = (locale) => {
  return Array.apply(0, Array(12)).map((_, i) => dayjs().locale(locale).month(i).format('MMM'))
}
