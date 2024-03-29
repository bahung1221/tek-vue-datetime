<template>
  <div
    ref="time-picker"
    :class="{'inline': inline, 'with-border': !onlyTime }"
    :style="[{height: `${height}px`}]"
    class="time-picker flex flex-fixed flex-1"
  >
    <div
      v-for="column in columns"
      :key="column.type"
      :ref="column.type"
      :class="[`time-picker-column-${column.type}`]"
      class="time-picker-column flex-1 flex flex-direction-column text-center"
      @scroll="noScrollEvent
        ? null
        : column.type === 'hours' ? onScrollHours($event) : column.type === 'minutes' ? onScrollMinutes($event) : onScrollApms($event)
      "
    >
      <div>
        <div
          class="before"
          :style="[columnPadding]"
        />
        <button
          v-for="item in column.items"
          :key="item.item"
          type="button"
          tabindex="-1"
          class="time-picker-column-item flex align-center justify-content-center"
          :class="{
            active: isActive(column.type, item.value),
            disabled: item.disabled
          }"
          @click="item.disabled ? null : setTime(item.value, column.type)"
        >
          <span
            class="time-picker-column-item-effect"
          />
          <span class="time-picker-column-item-text flex-1">
            {{ item.item }}
          </span>
        </button>
        <div
          class="after"
          :style="[columnPadding]"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import dayjs from 'dayjs'

  const ArrayHourRange = (start, end, twoDigit, isAfternoon, disabledHours) => {
    return Array(end - start + 1).fill().map((_, idx) => {
      const n = start + idx
      const number = n
      const numberToTest = (number < 10 ? '0' : '') + number
      return {
        value: number,
        item: (twoDigit && (n < 10) ? '0' : '') + n,
        disabled: disabledHours.includes(numberToTest)
      }
    })
  }
  const ArrayMinuteRange = (start, end, twoDigit, step = 1, disabledMinutes) => {
    step = Math.trunc(step)
    end = Math.min(end, 59)
    const len = Math.ceil((end - start + 1) / step)

    return Array(len).fill().map((_, idx) => {
      const number = start + idx * step
      const txtMinute = (twoDigit && (number < 10) ? '0' : '') + number
      return {
        value: number,
        item: txtMinute,
        disabled: disabledMinutes.includes(txtMinute)
      }
    })
  }

  const debounce = (fn, time) => {
    let timeout

    return function () {
      const functionCall = () => fn.apply(this, arguments)
      clearTimeout(timeout)
      timeout = setTimeout(functionCall, time)
    }
  }

  export default {
    name: 'TimePicker',
    props: {
      value: { type: String, default: null },
      format: { type: String, default: null },
      minuteInterval: { type: [String, Number], default: 1 },
      startMinute: { type: Number, default: 0 },
      endMinute: { type: Number, default: 60 },
      height: { type: Number, required: true },
      inline: { type: Boolean, default: null },
      visible: { type: Boolean, default: null },
      onlyTime: { type: Boolean, default: null },
      disabledHours: { type: Array, default: () => ([]) },
      minTime: { type: String, default: null },
      behaviour: { type: Object, default: () => ({}) },
      maxTime: { type: String, default: null }
    },
    data () {
      return {
        hour: null,
        minute: null,
        apm: null,
        oldvalue: this.value,
        columnPadding: {},
        noScrollEvent: !!(this.value && !this.inline),
        delay: 0
      }
    },
    computed: {
      isTwelveFormat () {
        return this.format.includes('A') || this.format.includes('a')
      },
      hours () {
        const twoDigit = this.format.includes('hh') || this.format.includes('HH')
        const isAfternoon = this.apm ? this.apm === 'pm' || this.apm === 'PM' : false
        const minH = this.isTwelveFormat ? 1 : 0
        const maxH = this.isTwelveFormat ? 12 : 23

        return ArrayHourRange(
          minH,
          maxH,
          twoDigit,
          isAfternoon,
          this._disabledHours,
          this.isTwelveFormat
        )
      },
      minutes () {
        const twoDigit = this.format.includes('mm') || this.format.includes('MM')
        return ArrayMinuteRange(this.startMinute, this.endMinute, twoDigit, this.minuteInterval, this._disabledMinutes)
      },
      apms () {
        return this.isTwelveFormat
          ? this.format.includes('A')
            ? [{ value: 'AM', item: 'AM' }, { value: 'PM', item: 'PM' }]
            : [{ value: 'am', item: 'am' }, { value: 'pm', item: 'pm' }]
          : null
      },
      columns () {
        return [
          { type: 'hours', items: this.hours },
          { type: 'minutes', items: this.minutes },
          ...(this.apms ? [{ type: 'apms', items: this.apms }] : [])
        ]
      },
      _disabledHours () {
        let minEnabledHour = 0
        let maxEnabledHour = 23
        if (this.minTime) {
          minEnabledHour = this.isTwelveFormat
            ? this.minTime.toUpperCase().includes('AM')
              ? dayjs(this.minTime, 'h:mm a').format('h')
              : parseInt(dayjs(this.minTime, 'h:mm a').format('h')) + 12
            : dayjs(this.minTime, 'HH:mm').format('HH')
        }
        if (this.maxTime) {
          maxEnabledHour = this.isTwelveFormat
            ? this.maxTime.toUpperCase().includes('AM')
              ? dayjs(this.maxTime, 'h:mm a').format('h')
              : parseInt(dayjs(this.maxTime, 'h:mm a').format('h'), 10) + 12
            : dayjs(this.maxTime, 'HH:mm').format('HH')
        }

        // In case if hour present as 08, 09, etc
        minEnabledHour = parseInt(minEnabledHour, 10)
        maxEnabledHour = parseInt(maxEnabledHour, 10)

        if (minEnabledHour !== 0 || maxEnabledHour !== 23) {
          const enabledHours = [...Array(24)]
            .map((_, i) => i)
            .filter(h => h >= minEnabledHour && h <= maxEnabledHour)

          if (!enabledHours.includes(this.hour) && this.behaviour && this.behaviour.time && this.behaviour.time.nearestIfDisabled) {
            this.hour = enabledHours[0] // eslint-disable-line
            this.emitValue()
          }

          const _disabledHours = [...Array(24)]
            .map((_, i) => i)
            .filter(h => !enabledHours.includes(h))
            .map(h => h < 10 ? '0' + h : '' + h)
          this.disabledHours.forEach(h => _disabledHours.push(h))

          return _disabledHours
        } else {
          return this.disabledHours
        }
      },
      _disabledMinutes () {
        let minEnabledMinute = 0
        let maxEnabledMinute = 60
        if (this.isTwelveFormat) {
          if (this.minTime && this.apm) {
            const minTime = dayjs(this.minTime, 'h:mm a')
            const minTimeHour = parseInt(minTime.format('h'), 10) + (this.apm.toUpperCase() === 'PM' ? 12 : 0)
            minEnabledMinute = minTimeHour === this.hour ? parseInt(minTime.format('mm'), 10) : minEnabledMinute
          } else if (this.maxTime) {
            const maxTime = dayjs(this.maxTime, 'h:mm a')
            const maxTimeHour = parseInt(maxTime.format('h'), 10) + (this.apm.toUpperCase() === 'PM' ? 12 : 0)
            maxEnabledMinute = maxTimeHour === this.hour ? parseInt(maxTime.format('mm'), 10) : maxEnabledMinute
          }
        } else {
          if (this.minTime) {
            const minTime = dayjs(this.minTime, 'HH:mm')
            const minTimeHour = parseInt(dayjs(this.minTime, 'HH:mm').format('HH'), 10)
            minEnabledMinute = minTimeHour === this.hour ? parseInt(minTime.format('mm'), 10) : minEnabledMinute
          } else if (this.maxTime) {
            const maxTime = dayjs(this.maxTime, 'HH:mm')
            const maxTimeHour = parseInt(dayjs(this.maxTime, 'HH:mm').format('HH'), 10)
            maxEnabledMinute = maxTimeHour === this.hour ? parseInt(maxTime.format('mm'), 10) : maxEnabledMinute
          }
        }

        if (minEnabledMinute !== 0 || maxEnabledMinute !== 60) {
          const enabledMinutes = [...Array(60)]
            .map((_, i) => i)
            .filter(m => m >= minEnabledMinute && m <= maxEnabledMinute)

          if (!enabledMinutes.includes(this.minute) && this.behaviour && this.behaviour.time && this.behaviour.time.nearestIfDisabled) {
            this.minute = enabledMinutes[0] // eslint-disable-line
            this.emitValue()
          }

          return [...Array(60)]
            .map((_, i) => i)
            .filter(m => !enabledMinutes.includes(m))
            .map(m => m < 10 ? '0' + m : '' + m)
        } else {
          return []
        }
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.columnPad()
          this.initPositionView()
        }
      },
      value (value) {
        if (value) {
          this.buildComponent()
          this.initPositionView()
        }
      },
      height (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.initPositionView()
        }
      }
    },
    mounted () {
      this.buildComponent()
      this.initPositionView()
    },
    methods: {
      getValue (scroll) {
        const itemHeight = 28
        const scrollTop = scroll.target.scrollTop
        return Math.round(scrollTop / itemHeight)
      },
      onScrollHours: debounce(function (scroll) {
        const value = this.getValue(scroll)
        const hour = this.isTwelveFormat ? value + 1 : value

        if (this.isHoursDisabled(hour)) return
        this.hour = hour === 24 && !this.isTwelveFormat ? 23 : hour
        this.emitValue()
      }, 100),
      onScrollMinutes: debounce(function (scroll) {
        const value = this.getValue(scroll)
        const minute = value * this.minuteInterval
        if (this.isMinutesDisabled(minute)) return
        this.minute = minute === 60 ? 59 : minute
        this.emitValue()
      }, 100),
      onScrollApms: debounce(function (scroll) {
        const value = this.getValue(scroll)
        this.apm = this.apms[value].value
        this.emitValue()
      }, 100),
      isActive (type, value) {
        const activeValue = (
          type === 'hours'
            ? this.hour
            : type === 'minutes'
              ? this.minute
              : this.apm ? this.apm : null
        )

        return activeValue === value
      },
      isHoursDisabled (h) {
        const hourToTest = this.apmType
          ? dayjs(`${h} ${this.apm}`, [`${this.hourType} ${this.apmType}`]).format('HH')
          : h < 10 ? '0' + h : '' + h
        return this._disabledHours.includes(hourToTest)
      },
      isMinutesDisabled (m) {
        m = m < 10 ? '0' + m : '' + m
        return this._disabledMinutes.includes(m)
      },
      buildComponent () {
        if (this.isTwelveFormat && !this.apms) window.console.error(`VueDateTimePicker - Format Error : To have the twelve hours format, the format must have "A" or "a" (Ex : ${this.format} a)`)
        const hourFormat = this.isTwelveFormat ? 'hh' : 'HH'
        const hourToSet = parseInt(dayjs(this.value, this.format).format(hourFormat))

        /**
         * Here we have two different behaviours. If the behaviour `nearestIfDisabled` is enabled
         * and the selected hour is disabled, we set the hour to the nearest hour available.
         * Otherwise just set the hour to the current value.
         */
        this.hour = this.behaviour && this.behaviour.time && this.behaviour.time.nearestIfDisabled && this.isHoursDisabled(hourToSet)
          ? this.getAvailableHour()
          : hourToSet

        const dayObj = dayjs(this.value, this.format)

        this.minute = parseInt(dayObj.format('mm'))
        this.apm = dayObj.format('a')

        this.columnPad()
      },
      columnPad () {
        if (this.$refs['time-picker'] && (this.visible || this.inline)) {
          const run = (pad) => {
            this.columnPadding = {
              height: `${pad}px`
            }
          }
          this.$nextTick(() => {
            const pad = this.$refs['time-picker'].clientHeight / 2 - 28 / 2
            run(pad)
          })
        } else {
          return null
        }
      },
      async initPositionView () {
        this.noScrollEvent = true
        const containers = ['hours', 'minutes']
        if (this.apms) containers.push('apms')

        await this.$nextTick()
        containers.forEach((container) => {
          const elem = this.$refs[container][0]
          if (!elem) return false

          elem.scrollTop = 0
          const selected = elem.querySelector(`.time-picker-column-item.active`)
          if (selected) {
            const boundsSelected = selected.getBoundingClientRect()
            const boundsElem = elem.getBoundingClientRect()
            const timePickerHeight = this.$refs['time-picker'].clientHeight
            if (boundsSelected && boundsElem) {
              elem.scrollTop = (28 / 2) + boundsSelected.top - boundsElem.top - timePickerHeight / 2
            }
          }
          setTimeout(() => {
            this.noScrollEvent = false
          }, 500)
        })
      },
      getAvailableHour () {
        const availableHours = this.hours.find((element) => {
          return element.disabled === false
        })
        return availableHours ? availableHours.value : null
      },
      setTime (item, type) {
        if (type === 'hours') {
          this.hour = item
        } else if (type === 'minutes') {
          this.minute = item
        } else if (type === 'apms' && this.apm !== item) {
          this.apm = item
        }
        this.emitValue()
      },
      emitValue () {
        const tmpHour = this.hour ? this.hour : this.getAvailableHour()
        const hour = (tmpHour < 10 ? '0' : '') + tmpHour
        const minute = this.minute ? (this.minute < 10 ? '0' : '') + this.minute : '00'

        let time = `${hour}:${minute}`
        if (this.isTwelveFormat) {
          time += ` ${this.apm}`
        }

        this.$emit('input', time)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-picker-column::-webkit-scrollbar {
    display: none;
  }
  .time-picker {
    width: 160px;
    max-width: 160px;
    position: relative;
    z-index: 1;
    &.inline {
      width: 100%;
      max-width: 100%;
    }
    &::after, &::before {
      content: "";
      top: 50%;
      position: absolute;
      margin: 0 auto;
      margin-top: -15px;
      height: 30px;
      z-index: -1;
      width: 85%;
      left: 0;
      right: 0;
      box-sizing: border-box;
      text-align: left;
      border-top: 1px solid #CCC;
      border-bottom: 1px solid #CCC;
    }
    &-column {
      position: relative;
      overflow-y: auto;
      &-item {
        height: 28px;
        min-height: 28px;
        padding: 0;
        color: var(--tvd-text-color);
        cursor: pointer;
        position: relative;
        border: none;
        background: transparent;
        font-size: 13px;
        width: 100%;
        outline: none;
        &-effect {
          position: absolute;
          background: var(--tvd-primary-variant-color);
          height: 24px;
          width: 70%;
          top: 2px;
          left: 15%;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transform: scale(0);
          border-radius: 4px;
          &:hover {
            transform: scale(1);
          }
        }
        &-text {
          position: relative;
        }
        &:hover {
          .time-picker-column-item-text {
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          }
          .time-picker-column-item-effect {
            transform: scale(1);
          }
        }
        &.active {
          color: var(--tvd-light-text-color);
          font-weight: bold;
          .time-picker-column-item-effect {
            background-color: var(--tvd-primary-color);
            transform: scale(1);
            opacity: 1;
          }
        }
        &.disabled {
          .time-picker-column-item-text {
            color: var(--tvd-text-color);
            opacity: 0.5;
            &:hover {
              color: var(--tvd-text-color) !important;
              opacity: 0.5 !important;
            }
          }
          .time-picker-column-item-effect {
            transform: scale(0) !important;
            opacity: 0 !important;
          }

          &.active {
            .time-picker-column-item-effect {
              background-color: var(--tvd-border-color) !important;
              transform: scale(1) !important;
              opacity: 1 !important;
            }
          }
        }
      }
    }
    &.with-border {
      border-left: 1px solid var(--tvd-border-color);
    }
  }
  @media screen and (max-width: 415px) {
    .time-picker.inline {
      flex: auto;
      border-left: none;
    }

    .time-picker:not(.inline) {
      border: 0;
      border-top: 1px solid var(--tvd-border-color);
      width: 100%;
      max-width: 100%;
      height: unset !important;
      overflow: hidden;
    }
  }
</style>
