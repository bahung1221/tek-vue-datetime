<template>
  <div
    :id="`${id}-DatePicker`"
    :class="{'flex-1 inline': inline, 'p-0 range flex-1': range, 'is-dark': dark}"
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
              class="date-buttons lm-fs-14 padding-button"
              :color="color"
              text-color="#454350"
              :dark="dark"
              @click="selectingYearMonth = 'month'"
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
              class="date-buttons lm-fs-14 padding-button"
              :color="color"
              text-color="#454350"
              :dark="dark"
              @click="selectingYearMonth = 'year'"
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
        :dark="dark"
      />
      <div
        :style="{height: (monthDays.length + weekStart) > 35 ? '210px' : '210px'}"
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
                first: firstInRange(day) && range,
                last: lastInRange(day) && !!value.end && range
              }"
              :disabled="isDisabled(day) || isWeekEndDay(day)"
              type="button"
              tabindex="-1"
              class="datepicker-day flex align-center justify-content-center"
              @click="selectDate(day)"
            >
              <span
                v-if="isToday(day)"
                class="datepicker-today"
              />
              <span
                v-show="!isDisabled(day) || isSelected(day)"
                :style="bgStyle"
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
        :color="color"
        :dark="dark"
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
  import { getWeekDays } from '@/VueCtkDateTimePicker/modules/month'
  import YearMonthSelector from './_subs/YearMonthSelector'
  import WeekDays from './_subs/WeekDays'
  import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'
  import KeyboardAccessibility from '@/VueCtkDateTimePicker/mixins/keyboard-accessibility'

  export default {
    name: 'DatePicker',
    components: {
      YearMonthSelector, WeekDays, CustomButton
    },
    mixins: [KeyboardAccessibility],
    props: {
      id: { type: String, default: null },
      value: { type: [String, Object], default: null },
      color: { type: String, default: null },
      minDate: { type: String, default: null },
      maxDate: { type: String, default: null },
      locale: { type: String, default: null },
      inline: { type: Boolean, default: null },
      noWeekendsDays: { type: Boolean, default: null },
      disabledWeekly: { type: Array, default: () => ([]) },
      range: { type: Boolean, default: false },
      disabledDates: { type: Array, default: () => ([]) },
      enabledDates: { type: Array, default: () => ([]) },
      dark: { type: Boolean, default: false },
      month: { type: Object, default: null },
      height: { type: Number, default: null },
      firstDayOfWeek: { type: Number, default: null },
      visible: { type: Boolean, default: false },
      isStart: { type: Boolean, default: false },
      isEnd: { type: Boolean, default: false }
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
      bgStyle () {
        return {
          backgroundColor: this.color
        }
      },
      endEmptyDays () {
        const getDays = (this.monthDays.length + this.weekStart) > 35
        const number = getDays ? 42 : 35
        return number - this.monthDays.length - this.weekStart
      },
      monthDays () {
        const monthDays = this.month.getMonthDays()
        return monthDays
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
        return date.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBetween (day) {
        return this.value && this.value.end
          ? dayjs(day).isBetween(dayjs(this.value.start), dayjs(this.value.end), 'days', '[]')
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
        if (this.range) {
          if (!this.value.start || this.value.end || day.isBefore(dayjs(this.value.start))) {
            this.value.start = day.format('YYYY-MM-DD')
            this.value.end = null
          } else {
            this.value.end = day.format('YYYY-MM-DD')
          }
          this.$emit('input', this.value)
        } else {
          this.$emit('input', dayjs(day).format('YYYY-MM-DD'))
        }
      },
      changeMonth (val) {
        this.transitionDaysName = `slide${val}`
        this.transitionLabelName = `slidev${val}`
        this.$emit('change-month', val)
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
  @import "~@/assets/scss/helpers/variables/index.scss";
  .datepicker-container {
    width: 320px;
    padding: 0 5px;
    position: relative;
    &.p-0 {
      padding: 0;
    }
    .padding-button {
      padding: 5px !important;
    }
    .calendar {
      padding: 10px 10px 0;
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
          height: 15px;
          width: 15px;
          fill: $color-text;
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
        text-transform: capitalize;
        font-weight: 600;
        color: $color-text;
      }
    }
    .month-container {
      position: relative;
      overflow: hidden;
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
          opacity: 0.6;
          background: dodgerblue;
          transform: scale(0);
        }
        .datepicker-today {
          background-color: #eaeaea;
        }
        .datepicker-day-text {
          position: relative;
          color: $color-text;
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
          .datepicker-day-text {
            color: #FFF;
          }
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 0.6;
          }
        }

        &.between {
          .datepicker-day-text {
            color: #FFF;
          }
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 0.5;
            border-radius: 0;
            width: 100%;
          }
          &.first .datepicker-day-effect {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          &.last .datepicker-day-effect {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          .datepicker-day-keyboard-selected, &.first .datepicker-day-keyboard-selected, &.last .datepicker-day-keyboard-selected {
            background-color: rgba(0, 0, 0, 0.66);
          }
        }
        &.selected {
          .datepicker-day-text {
            color: #FFF;
          }
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 1;
          }
          .datepicker-day-keyboard-selected {
            background-color: rgba(0, 0, 0, 0.66);
          }
        }
        &.disabled {
          .datepicker-day-text {
            color: #CCC;
          }
          &.selected {
            color: #fff;
          }
          .datepicker-day-effect {
            transform: scale(0);
            opacity: 0;
          }
        }
      }
    }
    &.is-dark {
      .datepicker-days .datepicker-day:not(.between):not(.selected) {
        .datepicker-day-text {
          color: #FFF;
        }
        &.disabled .datepicker-day-text {
          color: lighten(#424242, 20%);
        }
      }
      .datepicker-label {
        color: white;
      }
      .text-muted {
        color: lighten(#424242, 40%) !important;
      }
      .datepicker-button {
        svg {
          fill: #FFF;
        }
      }
      .datepicker-today {
        background-color: darken(#424242, 10%) !important;
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
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      flex-flow: column;
      -moz-flex-direction: column;
    }
  }
</style>
