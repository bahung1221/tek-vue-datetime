<template>
  <div
    :id="`${id}-DatePicker`"
    :class="{'flex-1 inline': inline, 'p-0 range flex-1': range}"
    class="datepicker-container flex flex-fixed"
  >
    <div class="calendar lm-w-100">
      <div class="datepicker-controls flex align-center justify-content-center">
        <div
          class="arrow-month h-100"
          :class="{ 'in-visible': isEnd }"
        >
          <button
            type="button"
            tabindex="-1"
            class="datepicker-button datepicker-prev text-center h-100 flex align-center"
            @click="changeMonth('prev')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 512"
              fill="currentColor"
            ><path
              d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"
            /></svg>
          </button>
        </div>
        <div
          class="datepicker-container-label flex-1 flex justify-content-center"
        >
          <TransitionGroup
            :name="transitionLabelName"
            class="h-100 flex align-center flex justify-content-right"
          >
            <CustomButton
              v-for="m in [month]"
              :key="m.month"
              :no-effect="noMonthYearSelect"
              class="date-buttons padding-button"
              @click="openSelectYearMonth('month')"
            >
              {{ monthFormatted }}
            </CustomButton>
          </TransitionGroup>
          <TransitionGroup
            :name="transitionLabelName"
            class="h-100 flex align-center flex"
          >
            <CustomButton
              v-for="y in [year]"
              :key="y"
              :no-effect="noMonthYearSelect"
              class="date-buttons padding-button"
              @click="openSelectYearMonth('year')"
            >
              {{ year }}
            </CustomButton>
          </TransitionGroup>
        </div>
        <div
          class="arrow-month h-100 text-right"
          :class="{ 'in-visible': range && isStart }"
        >
          <button
            type="button"
            tabindex="-1"
            class="datepicker-button datepicker-next text-center h-100 flex align-center justify-content-right"
            @click="changeMonth('next')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 512"
              fill="currentColor"
            ><path
              d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"
            /></svg>
          </button>
        </div>
      </div>
      <WeekDays
        :week-days="weekDays"
      />
      <div
        :style="{height: (range || (monthDays.length + weekStart) > 35) ? '210px' : '180px'}"
        class="month-container"
      >
        <TransitionGroup :name="transitionDaysName">
          <div
            v-for="m in [month]"
            :key="m.month"
            class="datepicker-days flex"
          >
            <div
              v-for="start in weekStart"
              :key="start + 'startEmptyDay'"
              class="datepicker-day align-center justify-content-center"
            />
            <button
              v-for="day in monthDays"
              :key="day.format('D')"
              :class="{
                selected: isSelected(day) && !isDisabled(day),
                disabled: (isDisabled(day) || isWeekEndDay(day)),
                enable: !(isDisabled(day) || isWeekEndDay(day)),
                between: isBetween(day) && range,
                'hover-between': isHoverBetween(day) && isRangeSelecting,
                first: firstInRange(day) && isRangeSelecting,
                last: lastInRange(day) && !!value.end && isRangeSelecting,
                today: isToday(day)
              }"
              :disabled="isDisabled(day) || isWeekEndDay(day)"
              type="button"
              tabindex="-1"
              class="datepicker-day flex align-center justify-content-center"
              @click="selectDate(day)"
              @mouseover="hoverDate(day)"
            >
              <span
                v-if="isToday(day)"
                class="datepicker-today"
              >
                <svg
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                ><path
                  d="M13.29.516v12.968H.71L13.29.516z"
                  fill-rule="evenodd"
                /></svg>
              </span>
              <span
                v-show="firstInRange(day)"
                class="datepicker-date-first-placeholder"
                :class="{
                  active: isRangeSelecting && selectedRange > 0,
                }"
              />
              <span
                v-show="lastInRange(day)"
                class="datepicker-date-last-placeholder"
                :class="{
                  active: isRangeSelecting && selectedRange > 0,
                }"
              />
              <span
                v-show="!isDisabled(day) || isSelected(day)"
                class="datepicker-day-effect"
              />
              <span
                v-if="isKeyboardSelected(day)"
                class="datepicker-day-keyboard-selected"
              />
              <span class="datepicker-day-text flex-1">
                {{ getDayText(day) }}
              </span>
            </button>
            <div
              v-for="end in endEmptyDays"
              :key="end + 'endEmptyDay'"
              class="datepicker-day flex align-center justify-content-center"
            />
          </div>
        </TransitionGroup>
      </div>
      <YearMonthSelector
        v-if="selectingYearMonth"
        :locale="locale"
        :mode="selectingYearMonth"
        :month="month"
        @input="selectYearMonth"
        @back="selectingYearMonth = null"
        @change-mode="mode => selectingYearMonth = mode"
      />
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { getWeekDays } from '@/VueDateTimePicker/modules/month'
  import YearMonthSelector from './_subs/YearMonthSelector'
  import WeekDays from './_subs/WeekDays'
  import CustomButton from '@/VueDateTimePicker/_subs/CustomButton'
  import KeyboardAccessibility from '@/VueDateTimePicker/mixins/keyboard-accessibility'

  export default {
    name: 'DatePicker',
    components: {
      YearMonthSelector, WeekDays, CustomButton
    },
    mixins: [KeyboardAccessibility],
    props: {
      id: { type: String, default: null },
      value: { type: [String, Object], default: null },
      hoverValue: { type: Object, default: null },
      minDate: { type: String, default: null },
      maxDate: { type: String, default: null },
      locale: { type: String, default: null },
      inline: { type: Boolean, default: null },
      noWeekendsDays: { type: Boolean, default: null },
      disabledWeekly: { type: Array, default: () => ([]) },
      range: { type: Boolean, default: false },
      isRangeSelecting: { type: Boolean, default: false },
      reverseRangeBehaviour: { type: Boolean, default: null },
      disabledDates: { type: Array, default: () => ([]) },
      enabledDates: { type: Array, default: () => ([]) },
      month: { type: Object, default: null },
      height: { type: Number, default: null },
      firstDayOfWeek: { type: Number, default: null },
      visible: { type: Boolean, default: false },
      isStart: { type: Boolean, default: false },
      isEnd: { type: Boolean, default: false },
      noMonthYearSelect: { type: Boolean, default: false }
    },
    data () {
      return {
        transitionDaysName: 'slidenext',
        transitionLabelName: 'slidevnext',
        selectingYearMonth: null,
        isKeyboardActive: true
      }
    },
    computed: {
      endEmptyDays () {
        const getDays = (this.monthDays.length + this.weekStart) > 35
        const number = getDays ? 42 : 35
        return number - this.monthDays.length - this.weekStart
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      weekStart () {
        return this.month.getWeekStart()
      },
      monthFormatted () {
        return `${this.month.getFormatted()}`
      },
      year () {
        return `${this.month.getYear()}`
      },
      weekDays () {
        return getWeekDays(this.locale, this.firstDayOfWeek)
      },
      selectedRange () {
        if (!this.range || !this.value || !this.value.start) {
          return 0
        }

        if (this.value.end) {
          return dayjs(this.value.end)
            .diff(
              dayjs(this.value.start),
              'days'
            )
        }

        if (!this.hoverValue) {
          return 0
        }

        return dayjs(this.hoverValue)
          .diff(
            dayjs(this.value.start),
            'days'
          )
      }
    },
    watch: {
      month (val, oldVal) {
        let mode = 'next'

        if (val && oldVal && (val.month < oldVal.month)) {
          mode = 'prev'
        }

        this.transitionDaysName = `slide${mode}`
        this.transitionLabelName = `slidev${mode}`
      }
    },
    methods: {
      isKeyboardSelected (day) {
        return day && this.newValue ? day.format('YYYY-MM-DD') === this.newValue.format('YYYY-MM-DD') : null
      },
      isToday (day) {
        return dayjs.isDayjs(day)
          ? day.isSame(dayjs(), 'day')
          : dayjs(day).isSame(dayjs(), 'day')
      },
      isDisabled (day) {
        return (
          this.isDateDisabled(day) ||
          !this.isDateEnabled(day) ||
          this.isBeforeMinDate(day) ||
          this.isAfterEndDate(day) ||
          this.isDayDisabledWeekly(day) ||
          (this.isWeekEndDay(day) && this.noWeekendsDays)
        )
      },
      isDateDisabled (day) {
        return this.disabledDates.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isDateEnabled (day) {
        return this.enabledDates.length === 0 || this.enabledDates.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBeforeMinDate (day) {
        return day.isBefore(dayjs(this.minDate, 'YYYY-MM-DD'))
      },
      isAfterEndDate (day) {
        return dayjs(day).isAfter(this.maxDate)
      },
      isSelected (day) {
        const start = this.value && this.value.start ? this.value.start : this.value
        const end = this.value && this.value.end ? this.value.end : this.value

        const date = [
          ...dayjs.isDayjs(start) ? [start.format('YYYY-MM-DD')] : [start],
          ...dayjs.isDayjs(end) ? [end.format('YYYY-MM-DD')] : [end]
        ]

        if (this.range && date[0] === date[1]) {
          return day.format('YYYY-MM-DD') === date[0]
        }

        return date.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBetween (day) {
        if (!this.range) {
          return false
        }

        return this.value && this.value.end
          ? dayjs(day).isBetween(dayjs(this.value.start), dayjs(this.value.end), 'days', '[]')
          : false
      },
      isHoverBetween (day) {
        if (!this.range || !this.value || !this.value.start || this.value.end) {
          return false
        }

        const start = dayjs(this.value.start)
        const hover = dayjs(this.hoverValue)
        if (hover.isBefore(start)) {
          return false
        }

        return this.value.start && this.hoverValue
          ? dayjs(day).isBetween(start, hover, 'days', '[]')
          : false
      },
      firstInRange (day) {
        return this.value && this.value.start ? dayjs(dayjs(this.value.start).format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      lastInRange (day) {
        return this.value && this.value.end ? dayjs(dayjs(this.value.end).format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      isDayDisabledWeekly (day) {
        const dayConst = dayjs(day).day()
        return this.disabledWeekly.indexOf(dayConst) > -1
      },
      isWeekEndDay (day) {
        const dayConst = dayjs(day).day()
        const weekendsDaysNumbers = [6, 0]
        return this.noWeekendsDays ? weekendsDaysNumbers.indexOf(dayConst) > -1 : false
      },
      selectDate (day) {
        if (this.reverseRangeBehaviour) {
          this.selectDateReverseBehavior(day)
          return
        }

        this.selectDateNormalBehavior(day)
      },

      selectDateNormalBehavior (day) {
        if (this.range) {
          if (!this.value.start || this.value.end || day.isBefore(dayjs(this.value.start))) {
            this.isRangeSelecting = true
            this.value.start = day.format('YYYY-MM-DD')
            this.value.end = null
          } else {
            this.value.end = day.format('YYYY-MM-DD')
          }
          this.$emit('input', this.value)
          this.$emit('hover-date', null)

          return
        }

        this.$emit('input', dayjs(day).format('YYYY-MM-DD'))
      },

      selectDateReverseBehavior (day) {
        const val = day.format('YYYY-MM-DD')

        if (this.range) {
          if (this.value.start && this.value.end && this.value.start !== this.value.end) {
            this.value.start = val
            this.value.end = val
            this.$emit('input', this.value)
            this.$emit('hover-date', null)
            this.$emit('change-range-selecting', false)
            return
          }

          if (val === this.value.start && !this.isRangeSelecting) {
            this.value.end = null

            this.$emit('input', this.value)
            this.$emit('hover-date', null)
            this.$emit('change-range-selecting', true)
            return
          }

          if (val === this.value.start && this.isRangeSelecting) {
            this.$emit('change-range-selecting', false)
            return
          }

          if (!this.isRangeSelecting) {
            this.value.start = val
            this.value.end = val
          } else if (day.isBefore(dayjs(this.value.start))) {
            this.value.start = val
          } else if (this.isRangeSelecting) {
            this.value.end = val
          }

          this.$emit('input', this.value)
          this.$emit('hover-date', null)
          return
        }

        this.$emit('input', dayjs(day).format('YYYY-MM-DD'))
      },

      hoverDate (day) {
        if (!this.range || !this.value || !this.value.start || this.value.end) {
          return
        }

        this.$emit('hover-date', day)
      },
      changeMonth (val) {
        this.transitionDaysName = `slide${val}`
        this.transitionLabelName = `slidev${val}`
        this.$emit('change-month', val)
      },
      openSelectYearMonth (mode) {
        if (this.noMonthYearSelect) {
          return
        }

        this.selectingYearMonth = mode
      },
      selectYearMonth (event) {
        const { month, year } = event

        const isBefore = year === this.month.year
          ? month < this.month.month
          : year < this.month.year
        this.transitionLabelName = isBefore ? `slidevprev` : `slidevnext`
        this.selectingYearMonth = null
        this.$emit('change-year-month', event)
      },
      getDayText (day) {
        return day.format('DD')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datepicker-container {
    width: 320px;
    position: relative;
    &.p-0 {
      padding: 0;
    }
    .padding-button {
      padding: 5px !important;
    }
    .calendar {
      padding: 10px 15px 0;
      position: relative;
    }
    .datepicker-controls {
      height: 45px;
      .arrow-month {
        flex: 0 0 40px;
        &.in-visible {
          visibility: hidden;
        }
      }
      .datepicker-button {
        background: transparent;
        cursor: pointer;
        border: none;
        outline: none;
        width: 100%;
        svg {
          height: 17px;
          width: 17px;
          fill: var(--tvd-text-color);
        }
        &.datepicker-prev {
          padding: 0 10px;
          text-align: left !important;
        }
        &.datepicker-next {
          padding: 0 10px 0;
          text-align: right !important;
        }
      }
      .datepicker-container-label {
        text-transform: capitalize;
        font-size: 16px;
        position: relative;
        height: 45px;
        overflow: hidden;
        width: 100%;
      }
      .date-buttons {
        background-color: transparent;
        text-transform: capitalize;
        color: var(--tvd-text-color);
        /deep/ span {
          font-size: 15px;
          font-weight: 600;
        }
      }
    }
    .month-container {
      position: relative;
      overflow: hidden;
      transition: height .2s ease;
    }
    .datepicker-days {
      display: flex;
      display: -ms-flexbox;
      overflow: hidden;
      flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      .datepicker-day {
        height: 33px;
        flex-grow: 1;
        width: calc(100% / 7);
        position: relative;
        border: none;
        background: transparent;
        font-size: 14px;
        outline: none;
        &.enable {
          cursor: pointer;
        }

        &-effect, .datepicker-today{
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          height: 30px;
          width: 35px;

          border-radius: 4px;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        }

        .datepicker-day-effect {
          margin: auto;
          background: var(--tvd-secondary-color);
          opacity: 0;
        }
        .datepicker-date-first-placeholder, .datepicker-date-last-placeholder {
          margin: auto;
          background: var(--tvd-secondary-color);
          opacity: 0;
          position: absolute;
          width: 50%;
          height: 30px;
          top: 0;
          bottom: 0;
          transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          &.active {
            opacity: 1;
          }
        }
        .datepicker-date-first-placeholder {
          right: 0;
        }
        .datepicker-date-last-placeholder {
          left: 0;
        }
        .datepicker-today {
          background-color: var(--tvd-secondary-color);
          svg {
            position: absolute;
            bottom: 3px;
            right: 3px;
            fill: var(--tvd-primary-color);
            width: 6px;
            height: 6px;
            z-index: 1;
          }
        }
        .datepicker-day-text {
          position: relative;
          color: var(--tvd-text-color);
        }
        .datepicker-day-keyboard-selected {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          height: 26px;
          width: 26px;
          opacity: (.7);
          border-radius: 50%;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          background-color: #afafaf;
        }
        &:hover {
          .datepicker-day-effect {
            opacity: 1;
          }
        }
        &.today {
          .datepicker-day-text {
            color: var(--tvd-primary-color);
            font-weight: 600;
          }
        }
        &.hover-between {
          .datepicker-day-effect {
            background: var(--tvd-secondary-color);
            opacity: 1;
            border-radius: 0;
            width: 100%;
          }
          .datepicker-day-keyboard-selected, &.first .datepicker-day-keyboard-selected, &.last .datepicker-day-keyboard-selected {
            background-color: rgba(0, 0, 0, 0.66);
          }
        }
        &.between:not(.selected) {
          .datepicker-day-effect {
            background: var(--tvd-secondary-color);
            opacity: 1;
            border-radius: 0;
            width: 100%;
          }
          .datepicker-day-keyboard-selected, &.first .datepicker-day-keyboard-selected, &.last .datepicker-day-keyboard-selected {
            background-color: rgba(0, 0, 0, 0.66);
          }
        }
        &.first {
          .datepicker-day-effect {
            width: 30px;
            height: 30px;
            opacity: 1;
            background-color: var(--tvd-primary-color);
            border-radius: 50%;
          }
          &.hover-between .datepicker-date-first-placeholder {
            background: var(--tvd-secondary-color);
          }
        }
        &.last {
          .datepicker-day-effect {
            width: 30px;
            height: 30px;
            opacity: 1;
            background-color: var(--tvd-primary-color);
            border-radius: 50%;
          }
          &.hover-between .datepicker-date-last-placeholder {
            background: var(--tvd-secondary-color);
          }
        }
        &.first.last .datepicker-day-effect {
          border-radius: 4px;
        }
        &.selected {
          .datepicker-day-text {
            color: var(--tvd-light-text-color);
          }
          .datepicker-day-effect {
            background-color: var(--tvd-primary-color);
            opacity: 1;
          }
          .datepicker-day-keyboard-selected {
            background-color: rgba(0, 0, 0, 0.66);
          }
          .datepicker-today {
            background-color: unset;
          }
        }
        &.disabled {
          cursor: default;
          .datepicker-day-text {
            color: var(--tvd-text-color);
            opacity: 0.5;
          }
          &.selected {
            color: var(--tvd-light-text-color);
          }
          .datepicker-day-effect {
            opacity: 0;
          }
        }
      }
    }
  }
  @media screen and (max-width: 415px) {
    .datepicker-container {
      width: 100%;
      &:not(.inline) {
        .datepicker-controls {
          height: 36px !important;
        }
      }
      flex-direction: column;
      flex-flow: column;
    }
  }
</style>
