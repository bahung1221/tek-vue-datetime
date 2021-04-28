<template>
  <div
    class="year-month-selector flex flex-direction-column"
    :class="{'dark': dark}"
  >
    <div class="year-month-selector-header flex justify-content-between align-center h-100">
      <button
        type="button"
        tabindex="-1"
        class="navigate-button prev text-center h-100 flex align-center"
        @click="navigate('prev')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 512"
        ><path
          fill="currentColor"
          d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"
        /></svg>
      </button>
      <div
        class="navigate-button-label flex-1 flex justify-content-center"
      >
        <button
          class="h-100 lm-fs-14"
          :style="{
            color: color,
            cursor: isMonthMode ? 'pointer' : '',
          }"
          @click="changeMode"
        >
          {{ label }}
        </button>
      </div>
      <button
        type="button"
        tabindex="-1"
        class="navigate-button next text-center h-100 flex align-center"
        @click="navigate('next')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 512"
        ><path
          fill="currentColor"
          d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"
        /></svg>
      </button>
    </div>

    <div class="button-containers flex flex-1">
      <TransitionGroup :name="transitionName">
        <div
          v-for="k in [label]"
          :key="`button-group-${k}`"
          class="flex-1 flex flex-wrap h-100"
        >
          <CustomButton
            v-for="(m, index) in months"
            :key="`${year}-${index}`"
            :color="color"
            :selected="currentYear === year && currentMonth === index + 1"
            :dark="dark"
            class="month-button"
            @click="selectMonth(index + 1)"
          >
            {{ m }}
          </CustomButton>
          <CustomButton
            v-for="y in years"
            :key="y"
            :color="color"
            :dark="dark"
            class="year-button"
            :selected="currentYear === y"
            @click="selectYear(y)"
          >
            {{ y }}
          </CustomButton>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { getMonthsShort } from '@/VueCtkDateTimePicker/modules/month'
  import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'

  const ArrayRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => {
      const n = start + idx
      return n
    })
  }

  export default {
    name: 'YearMonthSelector',
    components: {
      CustomButton
    },
    props: {
      locale: { type: String, default: null },
      dark: { type: Boolean, default: null },
      color: { type: String, default: null },
      monthYearColor: { type: String, default: null },
      mode: { type: String, default: null },
      month: { type: Object, default: null }
    },
    data () {
      return {
        months: null,
        year: null,
        years: null,
        transitionName: ''
      }
    },
    computed: {
      currentMonth () {
        return this.month.month
      },
      currentYear () {
        return this.month.year
      },
      isMonthMode () {
        return this.mode === 'month'
      },
      label () {
        if (this.isMonthMode || !this.years) {
          return this.year
        }

        return this.years[0] + ' - ' + this.years[this.years.length - 1]
      }
    },
    watch: {
      isMonthMode (val) {
        if (val) {
          this.getMonths()
        } else {
          this.getYears()
        }
      }
    },
    mounted () {
      if (this.isMonthMode) {
        this.getMonths()
      } else {
        this.getYears()
      }
    },
    methods: {
      changeYears (mode) {
        const years = [...this.years]
        const length = this.years.length

        for (let i = 0; i < length; i++) {
          if (mode === 'prev') {
            years[i] = this.years[i] - 16
          } else {
            years[i] = this.years[i] + 16
          }
        }

        Vue.set(this, 'years', years)
      },
      changeYear (mode) {
        if (mode === 'prev') {
          this.year = this.year - 1
          return
        }

        this.year = this.year + 1
      },
      getMonths () {
        this.years = null
        this.year = this.month.year
        this.months = getMonthsShort(this.locale)
      },
      getYears () {
        this.months = null
        this.year = null
        this.years = ArrayRange(this.month.year - 7, this.month.year + 8)
      },
      selectMonth (monthNumber) {
        this.$emit('input', { month: monthNumber, year: this.year })
      },
      selectYear (year) {
        this.$emit('input', { month: this.currentMonth, year: year })

        // TODO
        // this.$emit('change-mode', 'month')
      },
      navigate (mode) {
        this.transitionName = `slide${mode}`
        if (this.isMonthMode) {
          this.changeYear(mode)
          return
        }

        this.changeYears(mode)
      },
      changeMode () {
        // Only month mode can change to year mode
        if (!this.isMonthMode) {
          return
        }

        this.$emit('change-mode', 'year')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/helpers/variables/index.scss";
  .year-month-selector{
    position: absolute;
    background-color: white;
    overflow: hidden;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: #424242;
    padding: 10px;
    &.dark {
      color: white;
      background-color: #424242;
    }
    .h-100 {
      height: 100%;
    }
    .year-month-selector-header {
      height: 45px;
    }
    .navigate-button {
      background: transparent;
      cursor: pointer;
      border: none;
      outline: none;
      svg {
        height: 15px;
        width: 15px;
        fill: $color-text;
      }
      &.prev {
        padding: 0 10px;
        text-align: left !important;
      }
      &.next {
        padding: 0 10px 0;
        text-align: right !important;
      }
    }
    .navigate-button-label {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 30px;
      button {
        width: 100%;
        border: none;
        text-transform: capitalize;
        text-align: center;
        background-color: #dde0f4;
        border-radius: 3px;
        font-weight: 600;
        outline: none;
      }
    }
    .button-containers {
      margin-top: 20px;
      position: relative;
      .month-button {
        font-size: 15px;
        text-transform: capitalize;
        height: 42px;
        width: calc(100% / 4);
        /deep/ .custom-button-effect {
          height: 42px;
          width: calc(100% - 20px);
          left: 10px;
        }
      }
      .year-button {
        font-size: 15px;
        text-transform: capitalize;
        height: 35px;
        width: calc(100% / 4);
        /deep/ .custom-button-effect {
          height: 35px;
          width: calc(100% - 20px);
          left: 10px;
        }
      }
    }
  }
</style>
