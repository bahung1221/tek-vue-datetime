<template>
  <div
    :id="`${$attrs.id}-wrapper`"
    ref="parent"
    v-click-outside="clickOutsidePicker"
    class="date-time-picker"
  >
    <!-- Input -->
    <CustomInput
      v-if="hasInput"
      :id="`${$attrs.id}-input`"
      ref="custom-input"
      v-model="dateFormatted"
      v-bind="$attrs"
      :hint="hint"
      :error-hint="error"
      :is-focus="hasPickerOpen"
      :label="label"
      :no-label="noLabel"
      :input-size="inputSize"
      :no-clear-button="noClearButton"
      @focus="toggleDatePicker(true)"
      @clear="$emit('input', null)"
    />
    <slot
      v-else
    />

    <div
      v-if="hasPickerOpen && overlay"
      class="time-picker-overlay"
      @click.stop="closePicker"
    />

    <!-- Date picker container -->
    <PickersContainer
      v-if="!isDisabled"
      :id="`${$attrs.id}-picker-container`"
      ref="agenda"
      :value="dateTime"
      :visible="hasPickerOpen"
      :position="pickerPosition"
      :inline="inline"
      :no-header="noHeader"
      :only-time="onlyTime"
      :only-date="hasOnlyDate"
      :minute-interval="minuteInterval"
      :start-minute="startMinute"
      :end-minute="endMinute"
      :locale="locale"
      :min-date="minDate"
      :max-date="maxDate"
      :format="format"
      :no-weekends-days="noWeekendsDays"
      :disabled-weekly="disabledWeekly"
      :has-button-submit="hasButtonSubmit"
      :has-button-cancel="hasButtonCancel"
      :has-no-button="hasNoButton"
      :range="range"
      :reverse-range-behavior="reverseRangeBehavior"
      :disabled-dates="disabledDates"
      :disabled-hours="disabledHours"
      :enabled-dates="enabledDates"
      :button-submit-translation="buttonSubmitTranslation"
      :button-cancel-translation="buttonCancelTranslation"
      :first-day-of-week="firstDayOfWeek"
      :no-keyboard="noKeyboard"
      :no-month-year-select="noMonthYearSelect"
      :right="right"
      :behaviour="_behaviour"
      @input="setDateTime"
      @submit="submit"
      @close="closePicker"
    />
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import vClickOutside from 'v-click-outside'

  import CustomInput from './_subs/CustomInput'
  import PickersContainer from './_subs/PickersContainer'

  import props from './props'

  // Import dayjs plugins if not exists
  if (!dayjs.p || !dayjs.p.customParseFormat) {
    const customParseFormat = require('dayjs/plugin/customParseFormat')

    dayjs.extend(customParseFormat)
  }

  if (!dayjs.updateLocale) {
    const updateLocale = require('dayjs/plugin/updateLocale')

    dayjs.extend(updateLocale)
  }

  if (!dayjs.localeData) {
    const localeData = require('dayjs/plugin/localeData')

    dayjs.extend(localeData)
  }

  if (!dayjs.weekday) {
    const weekday = require('dayjs/plugin/weekday')

    dayjs.extend(weekday)
  }

  if (!dayjs.isBetween) {
    const isBetween = require('dayjs/plugin/isBetween')

    dayjs.extend(isBetween)
  }

  if (!dayjs.isBetween) {
    const isBetween = require('dayjs/plugin/isBetween')

    dayjs.extend(isBetween)
  }

  if (!dayjs.en.formats) {
    const localizedFormat = require('dayjs/plugin/localizedFormat')

    dayjs.extend(localizedFormat)
  }

  const updateDayjsLocale = (locale, firstDayOfWeek) => {
    dayjs.locale(locale)
    if (firstDayOfWeek) {
      const firstDayNumber = Number.isInteger(firstDayOfWeek) && firstDayOfWeek === 0
        ? 7
        : firstDayOfWeek || dayjs.localeData(locale).firstDayOfWeek()
      dayjs.updateLocale(locale, {
        week: {
          dow: firstDayNumber
        }
      })
    }
  }

  const nearestMinutes = (startMinute, interval, date, format) => {
    const roundedMinutes = Math.ceil((date.minute() - startMinute) / interval) * interval + startMinute
    return dayjs(date.minute(roundedMinutes).second(0), format)
  }

  /**
   * Object containing the default behaviour values of the calendar.
   * Those values can be overrided by the `behaviour` property.
   * @const defaultBehaviour
   */
  const defaultBehaviour = {
    time: {
      nearestIfDisabled: true
    },
    range: {
      reverse: false
    }
  }

  export default {
    name: 'VueDateTimePicker',
    components: {
      CustomInput,
      PickersContainer
    },
    directives: {
      clickOutside: vClickOutside.directive
    },
    inheritAttrs: false,
    props,
    data () {
      const formatOutput = this.outputFormat || this.format
      let dateTime

      if (this.range) {
        dateTime = {
          start: this.value && this.value.start
            ? dayjs(this.value.start, formatOutput).format(this.dateFormat)
            : null,
          end: this.value && this.value.end
            ? dayjs(this.value.end, formatOutput).format(this.dateFormat)
            : null
        }
      } else {
        const date = this.value
          ? dayjs(this.value, formatOutput)
          : null
        dateTime = date ? nearestMinutes(this.startMinute, this.minuteInterval, date, formatOutput).format(this.dateTimeFormat) : null
      }

      return {
        dateTime,
        pickerOpen: false,
        pickerPosition: this.position
      }
    },
    computed: {
      isMobile () {
        if (typeof window === 'undefined') return null

        return window.innerWidth < 412
      },
      hasPickerOpen () {
        return this.persistent || this.pickerOpen
      },
      hasNoButton () {
        return this.noButton
      },
      hasButtonSubmit () {
        return !this.inline && !this.autoClose
      },
      hasButtonCancel () {
        return !this.inline && !this.autoClose && !!this.buttonCancelTranslation
      },
      hasOnlyDate () {
        return this.onlyDate || this.range
      },
      dateFormatted () {
        const dateFormatted = this.range
          ? this.getRangeDatesFormatted(this.locale)
          : this.getDateFormatted(this.locale)
        this.$emit('formatted-value', dateFormatted)
        return dateFormatted
      },
      hasCustomElem () {
        return this.$slots.default
      },
      hasInput () {
        return !this.inline && !this.$slots.default
      },
      formatOutput () {
        return this.outputFormat || this.format
      },
      isTwelveFormat () {
        return this.format.includes('A') || this.format.includes('a')
      },
      timeFormat () {
        return this.isTwelveFormat ? 'hh:mm a' : 'HH:mm'
      },
      dateFormat () {
        return 'YYYY-MM-DD'
      },
      dateTimeFormat () {
        return `${this.dateFormat} ${this.timeFormat}`
      },
      /**
       * Returns true if the field is disabled
       * @function isDisabled
       * @returns {boolean}
       */
      isDisabled () {
        return typeof this.$attrs.disabled !== 'undefined' && this.$attrs.disabled !== false
      },
      /**
       * Returns the behaviour object with the overrided values
       * @function _behaviour
       * @returns {Object}
       */
      _behaviour () {
        const { time, range } = defaultBehaviour

        return {
          time: {
            ...time,
            ...this.behaviour.time
          },
          range: {
            ...range,
            ...this.behaviour.range
          }
        }
      }
    },
    watch: {
      open (val) {
        if (this.isDisabled) return
        this.pickerOpen = val
      },
      pickerOpen (val) {
        if (!val) {
          // TODO: cheat
          setTimeout(() => {
            this.resetDateTime()
          }, 50)
        }
      },
      locale (value) {
        updateDayjsLocale(value, this.firstDayOfWeek)
      },
      value (value, oldValue) {
        if (this.range && value && oldValue && (value.start === oldValue.start) && (value.end === oldValue.end)) {
          return
        }
        if (value === oldValue) {
          return
        }

        this.resetDateTime()
        this.setDateTime(this.dateTime)
      }
    },
    created () {
      updateDayjsLocale(this.locale, this.firstDayOfWeek)
    },
    mounted () {
      this.setCssVariables(this.$refs.parent)

      this.pickerPosition = this.getPosition()
      this.pickerOpen = this.open
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
        if (!this.noValueToCustomElem) {
          this.setValueToCustomElem()
        }
      }
      if (this.format === this.dateTimeFormat && this.onlyTime) {
        console.warn(`A (time) format must be indicated/ (Ex : format="HH:mm")`)
      }
    },
    beforeDestroy () {
      this.$emit('destroy')
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
      }
    },
    methods: {
      resetDateTime () {
        if (this.range) {
          this.dateTime = {
            start: this.value && this.value.start
              ? dayjs(this.value.start, this.formatOutput).format(this.dateFormat)
              : null,
            end: this.value && this.value.end
              ? dayjs(this.value.end, this.formatOutput).format(this.dateFormat)
              : null
          }

          return
        }

        this.dateTime = this.getDateTime()
      },
      setDateTime (value) {
        const newValue = this.range ? this.getRangeDateToSend(value) : this.getDateTimeToSend(value)

        if (
          this.range && newValue &&
          this.value &&
          (newValue.start === this.value.start) &&
          (newValue.end === this.value.end)
        ) {
          return
        }
        if (newValue === this.value) {
          return
        }

        if (
          (this.autoClose && this.range && (value.end && value.start)) ||
          (this.autoClose && !this.range)
        ) {
          this.setValueAndClosePicker(newValue)
        }

        this.dateTime = value
      },
      setCssVariables (el) {
        el.style.setProperty('--tvd-primary-color', this.primaryColor)
        el.style.setProperty('--tvd-primary-variant-color', this.primaryVariantColor)
        el.style.setProperty('--tvd-secondary-color', this.secondaryColor)
        el.style.setProperty('--tvd-text-color', this.textColor)
        el.style.setProperty('--tvd-text-color-dimmer', this.textColorDimmer)
        el.style.setProperty('--tvd-light-text-color', this.lightTextColor)
        el.style.setProperty('--tvd-background-color', this.backgroundColor)
        el.style.setProperty('--tvd-border-color', this.borderColor)
      },
      setValueToCustomElem () {
        /**
         * TODO: Find a way (perhaps), to bind default attrs to custom element.
         */
        const target = this.$slots.default && this.$slots.default[0]
        if (target) {
          if (target.tag === 'input') {
            target.elm.value = this.dateFormatted
          } else {
            target.elm.innerHTML = this.dateFormatted ? this.dateFormatted : this.label
          }
        }
      },
      addEventToTriggerElement () {
        const target = this.$slots.default[0].elm
        if (target) {
          target.addEventListener('click', () => {
            this.toggleDatePicker()
          })
        } else {
          window.console.warn(`Impossible to find custom element`)
        }
      },
      getRangeDatesFormatted () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${dayjs(this.value.start, this.formatOutput).set({ hour: 0, minute: 0, second: 0 }).format(this.formatted)}` : '...'
          return hasEndValues ? `${datesFormatted} - ${dayjs(this.value.end, this.formatOutput).set({ hour: 23, minute: 59, second: 59 }).format(this.formatted)}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      },
      getDateFormatted () {
        const date = this.value
          ? dayjs(this.value, this.formatOutput).format(this.formatted)
          : null
        return date
      },
      getRangeDateToSend (payload) {
        const { start, end } = typeof payload !== 'undefined' ? payload : this.value
        return start || end
          ? {
            start: start
              ? dayjs(start, this.dateFormat).set({ hour: 0, minute: 0, second: 0 }).format(this.formatOutput)
              : null,
            end: end
              ? dayjs(end, this.dateFormat).set({ hour: 23, minute: 59, second: 59 }).format(this.formatOutput)
              : null
          }
          : {
            start: dayjs().format(this.formatOutput),
            end: dayjs().format(this.formatOutput)
          }
      },
      getDateTimeToSend (value) {
        const dateTime = typeof value !== 'undefined' ? value : this.value
        const dateToSend = dateTime
          ? dayjs(dateTime, this.dateTimeFormat)
          : null

        const dateTimeToSend = dateToSend
          ? nearestMinutes(this.startMinute, this.minuteInterval, dayjs(dateToSend), this.dateTimeFormat).format(this.formatOutput)
          : null
        return dateTimeToSend
      },
      getDateTime (value) {
        if (!value) {
          value = this.value
        }

        const date = value
          ? dayjs(value, this.formatOutput)
          : null
        return date ? nearestMinutes(this.startMinute, this.minuteInterval, date, this.formatOutput).format(this.dateTimeFormat) : null
      },
      clickOutsidePicker () {
        if (!this.isMobile && this.hasPickerOpen) {
          this.closePicker()
        }
      },
      /**
       * Closes the datepicker
       * @function closePicker
       */
      closePicker () {
        if (this.pickerOpen) {
          this.$emit('is-hidden')
          this.pickerOpen = false
          this.setBodyOverflow(false)
        }
      },
      setValueAndClosePicker (value) {
        this.closePicker()
        this.$emit('input', value)

        if (this.hasCustomElem && !this.noValueToCustomElem) {
          this.$nextTick(() => {
            this.setValueToCustomElem()
          })
        }
      },
      toggleDatePicker (val) {
        if (this.isDisabled) return
        const isOpen = (val === false || val === true) ? val : !this.pickerOpen
        this.setBodyOverflow(isOpen)
        this.pickerOpen = isOpen

        if (isOpen) {
          // re-set css variables on mobile because all contents was moved to outside by "vue-portal"
          if (this.isMobile) {
            this.setCssVariables(document.querySelector('div[id^=\'vue-portal-target\']'))
          }
          this.$emit('is-shown')
        }

        if (this.pickerOpen && !this.position) {
          this.pickerPosition = this.getPosition()
        }
      },
      setBodyOverflow (value) {
        if (window.innerWidth < 412) {
          const body = document.getElementsByTagName('body')[0]
          body.style.overflow = value ? 'hidden' : null
        }
      },
      getPosition () {
        if (this.position) {
          return this.position
        } else {
          const parentRect = this.$refs.parent.getBoundingClientRect()
          const windowHeight = window.innerHeight
          let datePickerHeight = 445

          datePickerHeight = this.noButton ? datePickerHeight - 41 : datePickerHeight
          datePickerHeight = this.noHeader ? datePickerHeight - 58 : datePickerHeight
          if (parentRect.top < datePickerHeight) {
            // No place on top --> bottom
            return 'bottom'
          } else if (windowHeight - (parentRect.height + datePickerHeight + parentRect.top) >= 0) {
            // Have place on bottom --> bottom
            return 'bottom'
          } else {
            // No place on bottom --> top
            return 'top'
          }
        }
      },
      submit () {
        const value = this.range ? this.getRangeDateToSend(this.dateTime) : this.getDateTimeToSend(this.dateTime)

        this.$emit('submit')
        this.setValueAndClosePicker(value)
      }
    }
  }
</script>

<style lang="scss">
  @import "./assets/main.scss";
  .date-time-picker {
    width: 100%;
    margin: 0 auto;
    text-align: left;
    font-size: 14px;
    border-radius: 4px;
    position: relative;
    .time-picker-overlay {
      z-index: 2;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
    }
  }

  @media screen and (max-width: 415px) {
    .time-picker-overlay {
      display: none;
    }
    .date-time-picker:not(.inline) {
      position: inherit !important;
    }
  }
</style>
