import dayjs from 'dayjs'

export default class Month {
  constructor (month, year, locale) {
    this.start = dayjs(`${year}-${month}-01`)
    this.end = this.start.endOf('month')
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
    return Array.from({ length: this.start.daysInMonth() })
      .map((x, i) => this.start.startOf('month').add(i, 'day'))
  }
}

export const getWeekDays = (locale, firstDay) => {
  const firstDayNumber = firstDay === 0
    ? 7
    : firstDay || dayjs.localeData(locale).firstDayOfWeek()
  let days = [...dayjs.weekdaysShort()]
  const keep = days.splice(firstDayNumber)
  const stay = days
  days = keep.concat(stay)
  return days
}

export const getMonthsShort = (locale) => {
  return Array.apply(0, Array(12)).map((_, i) => dayjs().locale(locale).month(i).format('MMM'))
}
