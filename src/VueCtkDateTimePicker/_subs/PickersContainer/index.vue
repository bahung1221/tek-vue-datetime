<template>
  <Portal :disabled="!isMobile">
    <!-- Add root prefix to apply `tek-vue-datetime` styles when model was portal to body - only mobile -->
    <div :class="{'date-time-picker': isMobile}">
      <Transition
        :name="position === 'bottom' ? 'slide' : 'slideinvert'"
      >
        <div
          v-show="visible || inline"
          :class="{'inline': inline, 'is-dark': dark, 'visible': visible}"
          :style="responsivePosition"
          class="datetimepicker flex"
          @click.stop
        >
          <div
            :style="[responsivePosition, width]"
            class="datepicker flex flex-direction-column"
            :class="{ 'right': right }"
          >
            <HeaderPicker
              v-if="!noHeader"
              :key="componentKey"
              v-model="value"
              :color="color"
              :only-time="onlyTime"
              :format="format"
              :time-format="timeFormat"
              :transition-name="transitionName"
              :no-time="onlyDate"
              :dark="dark"
              :range="range"
            />
            <div class="pickers-container flex">
              <!-- NEED 'YYYY-MM-DD' format -->
              <div v-if="!onlyTime" class="pickers-container-month">
                <DatePicker
                  v-for="(num, index) in months"
                  :key="`date-${num}`"
                  v-model="date"
                  :dark="dark"
                  :month="
                    months === 1
                      ? month
                      : index === 0
                        ? month
                        : monthEnd
                  "
                  :is-start="index === 0"
                  :is-end="index === 1"
                  :inline="inline"
                  :no-weekends-days="noWeekendsDays"
                  :disabled-weekly="disabledWeekly"
                  :color="color"
                  :month-year-color="monthYearColor"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :disabled-dates="disabledDates"
                  :enabled-dates="enabledDates"
                  :range="range"
                  :height="height"
                  :first-day-of-week="firstDayOfWeek"
                  :visible="visible"
                  :no-keyboard="noKeyboard"
                  :locale="locale"
                  @change-month="changeMonth"
                  @change-year-month="changeYearMonth"
                  @close="$emit('close')"
                />
              </div>
              <!-- NEED 'HH:mm' format -->
              <TimePicker
                v-if="!onlyDate"
                ref="TimePicker"
                v-model="time"
                :dark="dark"
                :color="color"
                :inline="inline"
                :format="timeFormat"
                :only-time="onlyTime"
                :minute-interval="minuteInterval"
                :start-minute="startMinute"
                :end-minute="endMinute"
                :visible="visible"
                :height="height"
                :disabled-hours="disabledHours"
                :min-time="minTime"
                :max-time="maxTime"
                :behaviour="behaviour"
              />
            </div>
            <ButtonValidate
              v-if="!hasNoButton && !(inline && range)"
              class="button-validate flex-fixed"
              :dark="dark"
              :button-color="buttonColor"
              :button-now-translation="buttonNowTranslation"
              :only-time="onlyTime"
              :no-button-now="noButtonNow"
              :range="range"
              :has-button-validate="hasButtonValidate"
              @validate="$emit('validate')"
              @now="setNow"
            />
          </div>
        </div>
      </Transition>
    </div>
  </Portal>
</template>

<script>
  import dayjs from 'dayjs'
  import { Portal } from '@linusborg/vue-simple-portal'

  import DatePicker from './_subs/DatePicker'
  import TimePicker from './_subs/TimePicker'
  import HeaderPicker from './_subs/HeaderPicker'
  import ButtonValidate from './_subs/ButtonValidate'

  import Month from '@/VueCtkDateTimePicker/modules/month'

  export default {
    name: 'PickersContainer',
    components: {
      DatePicker, TimePicker, HeaderPicker, ButtonValidate, Portal
    },
    inheritAttrs: false,
    props: {
      value: { type: [String, Object], default: null },
      visible: { type: Boolean, required: true, default: false },
      position: { type: String, default: 'bottom' },
      inline: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: null },
      color: { type: String, default: null },
      monthYearColor: { type: String, default: null },
      onlyDate: { type: Boolean, default: false },
      onlyTime: { type: Boolean, default: null },
      minuteInterval: { type: [String, Number], default: 1 },
      startMinute: { type: Number, default: 0 },
      endMinute: { type: Number, default: 60 },
      format: { type: String, default: 'YYYY-MM-DD hh:mm a' },
      locale: { type: String, default: null },
      maxDate: { type: String, default: null },
      minDate: { type: String, default: null },
      hasButtonValidate: { type: Boolean, default: null },
      hasNoButton: { type: Boolean, default: null },
      noWeekendsDays: { type: Boolean, default: null },
      disabledWeekly: { type: Array, default: null },
      disabledDates: { type: Array, default: null },
      disabledHours: { type: Array, default: null },
      enabledDates: { type: Array, default: null },
      range: { type: Boolean, default: null },
      buttonColor: { type: String, default: null },
      buttonNowTranslation: { type: String, default: null },
      noButtonNow: { type: Boolean, default: false },
      firstDayOfWeek: { type: Number, default: null },
      noKeyboard: { type: Boolean, default: false },
      right: { type: Boolean, default: false },
      behaviour: { type: Object, default: () => ({}) }
    },
    data () {
      const months = this.range ? 2 : 1

      return {
        months,
        month: this.getMonth(),
        monthEnd: months > 1 ? this.getMonthEnd() : null,
        transitionName: 'slidevnext',
        componentKey: 0
      }
    },
    computed: {
      width () {
        let size = 320

        if (this.inline) {
          size = '100%'
        } else if (this.onlyTime) {
          size = 160
        } else if (!this.range && this.onlyDate) {
          size = 320
        } else if (!this.range && !this.onlyDate) {
          size = 440
        }

        if (typeof size === 'number') {
          size = (size * this.months) + 'px'
        }

        return {
          width: size,
          maxWidth: size,
          minWidth: size
        }
      },
      isMobile () {
        if (typeof window === 'undefined') return null

        return window.innerWidth < 412
      },
      responsivePosition () {
        if (typeof window === 'undefined') return null

        return !this.inline
          ? window.innerWidth < 412
            ? null
            : this.position === 'bottom'
              ? { top: '100%', marginBottom: '10px' }
              : { bottom: '100%', marginTop: '10px' }
          : null
      },
      timeFormat () {
        return this.onlyTime
          ? this.format
          : this.onlyDate ? null : this.getTimeFormat()
      },
      dateFormat () {
        return this.onlyTime
          ? null
          : this.getDateFormat()
      },
      height () {
        return !this.onlyTime
          ? this.month
            ? (this.month.getMonthDays().length + this.month.getWeekStart()) > 35 ? 347 : 307
            : 180
          : 200
      },
      time: {
        set (value) {
          this.emitValue({
            value: value,
            type: 'time'
          })
        },
        get () {
          return this.value
            ? dayjs(this.value, 'YYYY-MM-DD HH:mm').format('HH:mm')
            : null
        }
      },
      date: {
        set (value) {
          this.emitValue({
            value: value,
            type: 'date'
          })
        },
        get () {
          const date = this.value
            ? this.onlyTime
              ? null
              : this.range
                ? { start: this.value.start ? dayjs(this.value.start).format('YYYY-MM-DD') : null,
                    end: this.value.end ? dayjs(this.value.end).format('YYYY-MM-DD') : null }
                : dayjs(this.value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
            : this.range
              ? { start: null, end: null }
              : null
          return date
        }
      },
      minTime () {
        const time = dayjs(this.minDate).format(this.timeFormat)
        if (
          this.minDate &&
          time !== '00:00' &&
          dayjs(this.date).isSame(dayjs(this.minDate, 'YYYY-MM-DD'))
        ) {
          return time
        }
        return ''
      },
      maxTime () {
        const time = dayjs(this.maxDate).format(this.timeFormat)
        if (this.maxDate &&
          time !== '00:00' &&
          dayjs(this.date).isSame(dayjs(this.maxDate, 'YYYY-MM-DD'))) {
          return time
        }
        return ''
      }
    },
    watch: {
      value (value) {
        this.month = this.getMonth(value)
      },
      locale () {
        this.month = this.getMonth()
        this.componentKey += 1
      }
    },
    methods: {
      setNow (event) {
        this.$emit('input', event)
        this.$emit('close')
      },
      emitValue (payload) {
        const dateTime = this.range ? payload.value : this.getDateTime(payload)
        this.$emit('input', dateTime)
        if (!this.range) {
          this.getTransitionName(dateTime)
        }
      },
      getDateTime ({ value, type }) {
        return this.onlyTime
          ? `${dayjs().format('YYYY-MM-DD')} ${value}`
          : type === 'date'
            ? this.time ? `${value} ${this.time}` : `${value} ${dayjs().format('HH:mm')}`
            : this.date ? `${this.date} ${value}` : `${dayjs().format('YYYY-MM-DD')} ${value}`
      },
      getTransitionName (date) {
        const isBigger = dayjs(date).isAfter(
          dayjs(`${this.date || dayjs().format('YYYY-MM-DD')} ${this.time || dayjs().format('HH:mm')}`)
        )
        this.transitionName = isBigger ? 'slidevnext' : 'slidevprev'
      },
      getDateFormat () {
        const hasTime = this.format.includes('T')
        return hasTime ? this.format.split('T')[0] : this.format.split(' ')[0]
      },
      getTimeFormat () {
        const formatLower = this.format.toLowerCase()
        const hasTimeFormat = formatLower.includes('h')
        if (hasTimeFormat) {
          const hasTime = this.format.includes('T')
          return hasTime ? this.format.split('T')[1] : this.format.split(' ').slice(1).join(' ')
        } else {
          window.console.warn('A time format must be indicated')
        }
      },
      getMonth (payload) {
        if (this.range) {
          const rangeVal = payload || this.value
          const date = rangeVal && (rangeVal.end || rangeVal.start) ? dayjs(rangeVal.end || rangeVal.start) : dayjs()
          const step = !rangeVal.end ? 1 : 0
          return new Month(date.month() + step, date.year())
        } else if (this.value) {
          return new Month(dayjs(this.value, 'YYYY-MM-DD').month() + 1, dayjs(this.value, 'YYYY-MM-DD').year(), this.locale)
        } else {
          return new Month(dayjs().month(), dayjs().year(), this.locale)
        }
      },
      getMonthEnd (payload) {
        const rangeVal = payload || this.value
        const date = rangeVal && (rangeVal.end || rangeVal.start) ? dayjs(rangeVal.end ? rangeVal.end : rangeVal.start) : dayjs()
        return new Month(date.month() + 1, date.year())
      },
      changeMonth (val) {
        let month = this.month.month + (val === 'prev' ? -1 : +1)
        let year = this.month.year
        if (month > 11 || month < 0) {
          year += (val === 'prev' ? -1 : +1)
          month = (val === 'prev' ? 11 : 0)
        }
        this.month = new Month(month, year, this.locale)
        if (this.months > 1) {
          this.monthEnd = new Month(month + 1, year, this.locale)
        }
        if (this.$refs.TimePicker) {
          this.$refs.TimePicker.initPositionView()
        }
      },
      changeYearMonth ({ month, year }) {
        this.month = new Month(month, year, this.locale)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datetimepicker {
    position: absolute;
    z-index: 9;
    width: 100%;
    &.visible {
      z-index: 999;
    }
    .datepicker {
      position: absolute;
      z-index: 5;
      border-radius: 4px;
      overflow: hidden;
      background: #FFF;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      max-width: 400px;
      .pickers-container {
        background: #FFF;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        .pickers-container-month {
          display: flex;
        }
      }
      &.right {
        right: 0;
      }
    }
    &.is-dark {
      .datepicker, .pickers-container {
        background: #424242;
        border: 0;
      }
    }
  }
  .inline {
    &.datetimepicker, .datepicker {
      position: relative;
    }
    .datepicker {
      margin-bottom: 0 !important;
      box-shadow: none;
      -webkit-box-shadow: none;
      width: 100%;
      max-width: 100%;
      background-color: white;
    }
  }
  @media screen and (max-width: 415px) {
    $header-size: 58px;
    $footer-size: 41px;

    .pickers-container {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      flex-flow: column;
      -moz-flex-direction: column;
      height: 100%;
    }

    .datepicker-container {
      width: 100%;
    }

    .datetimepicker:not(.inline) {
      margin: 0 !important;
      position: absolute;
      top: 0 !important;
      bottom: 0;
      right: 0;
      left: 0;

      .pickers-container {
        height: calc(100% - #{$header-size} - #{$footer-size});
      }

      .datepicker {
        border-radius: 0 !important;
        bottom: 0 !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        max-width: inherit !important;
        min-width: inherit !important;
        position: fixed;
        height: 100%;
        margin: 0 !important;
      }
    }
  }
</style>
