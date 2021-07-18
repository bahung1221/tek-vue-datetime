<template>
  <div
    id="app"
  >
    <div
      id="tekVueDateTimePicker"
      class="tek-vue-date-time-picker"
    >
      <header>
        <h1>TekVueDateTime</h1>
        <h3>A VueJs component for select date, date time and date range</h3>
        <div
          class="container lm-mt-4"
        >
          <a
            class="lm-btn lm-btn-dark lm-mr-2"
            target="_blank"
            href="https://github.com/bahung1221/tek-vue-datetime"
          >
            Github
          </a>
          <a
            class="lm-btn lm-btn-dark lm-mr-2"
            target="_blank"
            href="https://github.com/bahung1221/tek-vue-datetime/releases"
          >
            Changelog
          </a>
          <a
            class="lm-btn lm-btn-danger"
            target="_blank"
            href="https://www.npmjs.com/package/tek-vue-datetime"
          >
            Npm
          </a>
        </div>
      </header>
      <div
        v-if="devMode"
        class="container"
      >
        <div class="flex flex-wrap align-center justify-content-center">
          <div
            class="component-container"
          >
            <p>Inititale value : '2021-04-05T04:26'</p>
            <p>v-model = {{ value2 || 'null' }}</p>
            <br>
            <div class="flex">
              <VueDateTimePicker
                v-model="value2"
                locale="vi"
                no-label
                :format="'YYYY-MM-DD HH:mm'"
                :min-date="'2021-04-05 12:15'"
                :max-date="'2021-04-24 18:45'"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="container"
      >
        <div class="components-container flex flex-wrap">
          <div
            v-for="demo in demoComponents"
            :key="demo.title"
            class="component-container"
          >
            <h3>{{ demo.title }}</h3>
            <h4>{{ demo.description }}</h4>
            <hr>
            <div class="flex flex-wrap justify-content-between">
              <p><b>Inititale value</b> : {{ demo.initial }}</p>
              <p><b>v-model</b> = {{ demo.value || 'null' }}</p>
            </div>
            <hr>
            <button
              class="lm-btn option"
              @click="demo.editOption = !demo.editOption"
            >
              Edit options
            </button>
            <div
              v-show="demo.editOption"
              class="flex flex-wrap component options"
            >
              <div class="flex-1">
                <h4 style="margin-bottom: 10px;">
                  String options
                </h4>
                <div
                  v-for="str in stringOptions"
                  :key="str"
                  class="flex"
                  style="margin-bottom: 10px;"
                >
                  <input
                    v-model="demo.options[str]"
                    type="text"
                  >
                  <span style="margin-left: 15px;">
                    {{ str }}
                  </span>
                </div>
                <h4 style="margin-bottom: 10px;">
                  Integer options
                </h4>
                <div
                  v-for="int in intOptions"
                  :key="int"
                  class="flex"
                  style="margin-bottom: 10px;"
                >
                  <input
                    v-model="demo.options[int]"
                    type="number"
                  >
                  <span style="margin-left: 15px;">
                    {{ int }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h4 style="margin-bottom: 10px;">
                  Boolean options
                </h4>
                <div
                  v-for="opt in booleanOptions"
                  :key="opt"
                  class="flex"
                  style="margin-bottom: 10px;"
                >
                  <CheckboxInput
                    :id="`${demo.id}${opt}`"
                    v-model="demo.options[opt]"
                    :disabled="opt === 'onlyDate' || opt === 'onlyTime' || opt === 'range'"
                  />
                  <span style="margin-left: 15px;">
                    {{ opt }} {{ opt === 'onlyDate' || opt === 'onlyTime' || opt === 'range' ? '(disabled)' : '' }}
                  </span>
                </div>
              </div>
              <div>
                <h4 style="margin-bottom: 10px;">
                  Options not editable (is Array)
                </h4>
                <span
                  v-for="opt in optionsNotEditable"
                  :key="opt"
                >
                  {{ opt + ', ' }}
                </span>
              </div>
            </div>
            <div class="component">
              <VueDateTimePicker
                :id="demo.options.id"
                v-model="demo.value"
                :only-date="demo.options.onlyDate"
                :only-time="demo.options.onlyTime"
                :range="demo.options.range"
                :format="demo.options.format"
                :formatted="demo.options.formatted"
                :output-format="demo.options.outputFormat"
                :inline="demo.options.inline"
                :primary-color="demo.options.primaryColor"
                :primary-variant-color="demo.options.primaryVariantColor"
                :secondary-color="demo.options.secondaryColor"
                :text-color="demo.options.textColor"
                :background-color="demo.options.backgroundColor"
                :border-color="demo.options.borderColor"
                :light-text-color="demo.options.lightTextColor"
                :no-header="demo.options.noHeader"
                :label="demo.options.label"
                :no-label="demo.options.noLabel"
                :auto-close="demo.options.autoClose"
                :error="demo.options.error"
                :hint="demo.options.hint"
                :open="demo.options.open"
                :overlay="demo.options.overlay"
                :position="demo.options.position"
                :disabled="demo.options.disabled"
                :disabled-dates="demo.options.disabledDates"
                :disabled-hours="demo.options.disabledHours"
                :enabled-dates="demo.options.enabledDates"
                :minute-interval="demo.options.minuteInterval"
                :start-minute="demo.options.startMinute"
                :end-minute="demo.options.endMinute"
                :first-day-of-week="demo.options.firstDayOfWeek"
                :min-date="demo.options.minDate"
                :max-date="demo.options.maxDate"
                :no-weekends-days="demo.options.noWeekendDays"
                :no-button="demo.options.noButton"
                :button-submit-translation="demo.options.buttonSubmitTranslation"
                :button-cancel-translation="demo.options.buttonCancelTranslation"
                :locale="demo.options.locale"
                :input-size="demo.options.inputSize"
                :persistent="demo.options.persistent"
                :no-keyboard="demo.options.noKeyboard"
                :no-value-to-custom-elem="demo.options.noValueToCustomElem"
                :disabled-weekly="demo.options.disabledWeekly"
                :right="demo.options.right"
                :no-clear-button="demo.options.noClearButton"
                :no-month-year-select="demo.options.noMonthYearSelect"
                :no-transition="demo.options.noTransition"
                :behaviour="demo.options.behaviour"
              >
                <input
                  v-if="demo.options && demo.options.slot && demo.options.slot.type === 'input'"
                  type="text"
                >
                <button
                  v-else-if="demo.options && demo.options.slot && demo.options.slot.type === 'button'"
                  type="button"
                  class="lm-btn"
                  style="margin: 0;"
                />
              </VueDateTimePicker>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueDateTimePicker from './VueDateTimePicker'
  import CheckboxInput from './CheckboxInput'
  // import dayjs from 'dayjs'
  // import 'dayjs/locale/vi'
  //
  // dayjs.locale('vi')

  export default {
    name: 'App',
    components: {
      VueDateTimePicker,
      CheckboxInput
    },
    data () {
      return {
        devMode: false,
        booleanOptions: [
          'noHeader', 'autoClose', 'error', 'overlay', 'noWeekendDays',
          'noButton', 'onlyDate', 'range', 'onlyTime', 'inline', 'persistent', 'disabled',
          'noValueToCustomElem', 'noKeyboard', 'right',
          'noClearButton', 'noLabel', 'noMonthYearSelect', 'noTransition'
        ],
        stringOptions: [
          'id', 'label', 'hint', 'buttonColor', 'position', 'format', 'formatted', 'outputFormat',
          'minDate', 'maxDate', 'inputSize', 'buttonSubmitTranslation', 'buttonCancelTranslation', 'disabledWeekly',
          'primaryColor', 'primaryVariantColor', 'secondaryColor', 'textColor', 'backgroundColor', 'borderColor', 'lightTextColor'
        ],
        optionsNotEditable: [
          'disabledDates', 'disabledHours'
        ],
        intOptions: [
          'minuteInterval', 'firstDayOfWeek'
        ],
        demoComponents: [
          {
            id: '1',
            title: 'Date Picker',
            description: 'noLabel true - format: "MM-DD-YYYY" - formatted: "ll"',
            editOption: false,
            initial: '14-01-2019',
            value: '14-01-2019',
            options: {
              onlyDate: true,
              id: 'DatePicker',
              format: 'DD-MM-YYYY',
              formatted: 'll',
              noLabel: true,
              autoClose: true
            }
          },
          {
            id: '2',
            title: 'Date Time Picker',
            description: 'Date & Time selector',
            initial: '2020-04-07 20:26',
            value: '2020-04-07 20:26',
            editOption: false,
            options: {
              format: 'YYYY-MM-DD HH:mm',
              id: 'DateTimePicker',
              minDate: '2020-04-05',
              maxDate: '2020-04-24'
            }
          },
          {
            id: '3',
            title: 'Date Range Picker',
            description: 'Date Range selector',
            editOption: false,
            initial: {
              start: '2021-04-05',
              end: '2021-04-20'
            },
            value: {
              start: '2021-04-05',
              end: '2021-05-20'
            },
            options: {
              range: true,
              formatted: 'll',
              format: 'YYYY-MM-DD',
              label: 'Select date range',
              id: 'RangeDatePicker',
              noHeader: true,
              noMonthYearSelect: true
            }
          },
          {
            id: '4',
            title: 'Time Picker - With minute-interval="15" & start-minute="0" & end-minute="59"',
            description: 'Time selector',
            editOption: false,
            initial: '11:00 am',
            value: '11:00 am',
            options: {
              format: 'hh:mm a',
              formatted: 'hh:mm a',
              onlyTime: true,
              minuteInterval: '10',
              startMinute: 0,
              endMinute: 59,
              label: 'Select time',
              inputSize: 'sm',
              id: 'TimePicker',
              noLabel: true
            }
          },
          {
            id: '4',
            title: 'Custom theme colors',
            description: 'Date Range Picker with custom theme colors',
            editOption: false,
            initial: {
              start: '2021-04-05',
              end: '2021-04-20'
            },
            value: {
              start: '2021-04-05',
              end: '2021-05-20'
            },
            options: {
              range: true,
              formatted: 'll',
              format: 'YYYY-MM-DD',
              label: 'Select date range',
              id: 'RangeDatePicker',
              noHeader: true,
              noMonthYearSelect: true,
              buttonSubmitTranslation: 'Apply',
              buttonCancelTranslation: 'Cancel',
              noTransition: true,
              behaviour: {
                range: {
                  reverse: true
                }
              },

              primaryColor: '#503ef5',
              primaryVariantColor: '#d8defc',
              secondaryColor: '#dde0f4',
              textColor: '#454350',
              textColorDimmer: '#565460',
              backgroundColor: '#e9e7f8',
              borderColor: '#bcbcbc',
              lightTextColor: '#fff'
            }
          },
          {
            id: '6',
            title: 'Time Picker - 24 Hours Mode',
            description: 'Time selector',
            editOption: false,
            initial: '11:00',
            value: '11:00',
            options: {
              format: 'HH:mm',
              formatted: 'HH:mm',
              onlyTime: true,
              minuteInterval: '15',
              startMinute: 0,
              endMinute: 59,
              label: 'Select time',
              inputSize: 'sm',
              id: 'TimePicker',
              noLabel: true
            }
          },
          {
            id: '7',
            title: 'Inline Picker',
            description: 'Inline selector with keyboard accessibility disabled & disabled weekly dates (available for all pickers)',
            editOption: false,
            initial: '2019-01-14 00:00',
            value: '2019-01-14 00:00',
            options: {
              inline: true,
              format: 'YYYY-MM-DD HH:mm',
              formatted: 'll',
              id: 'InlinePicker',
              disabledWeekly: [0, 4, 6],
              noKeyboard: true
            }
          },
          {
            id: '8',
            title: 'Enabled/Disabled dates Picker',
            description: '',
            editOption: false,
            initial: { 'disabledDates': ['2021-02-22'], 'enabledDates': ['2021-02-21', '2021-02-22', '2021-02-23'] },
            value: '2021-02-22 00:00',
            options: {
              id: 'EnabledDisabledDatesPicker',
              disabledDates: ['2021-02-22'],
              enabledDates: ['2021-02-21', '2021-02-22', '2021-02-23'],
              inline: true,
              format: 'YYYY-MM-DD HH:mm'
            }
          }
        ],
        value: '06-01-2014 05:00',
        value2: null,
        value3: '2021-04-05T14:26',
        rangeValues: {
          start: '2021-04-04',
          end: '2021-04-20'
        },
        rangeValues2: {
          start: null,
          end: null
        },
        timePickerValue: '11:26',
        minuteInterval: 5,
        minuteInterval2: 10,
        hint: 'Error message',
        errorHint: true,
        timeFormat: 'HH:mm a',
        minDate: '2021-04-03',
        maxDate: '2021-04-12',
        disabledDates: ['2021-04-03', '2021-04-07', '2021-04-09', '2021-04-11', '2021-04-13', '2021-04-15', '2021-04-17', '2021-04-19'],
        disabledHours: Array.from(new Array(8), (x, i) => `0${i}`).concat(
          Array.from(new Array(23), (x, i) => {
            if (i + 1 > 18) {
              return `${i + 1}`
            } else {
              return null
            }
          })
        )
      }
    }
  }
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap&subset=vietnamese');
$font-family: 'Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Helvetica Neue', 'Arial', 'sans-serif';

body, html {
  font-family: $font-family;
}
button, input, textarea, label {
  font-family: $font-family;
}
</style>

<style lang="scss">
  @import "./assets/scss/main.scss";
  html, body, #app, #VueDateTimePicker {
    margin: 0;
    min-height: 100%;
    min-width: 100%;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  header {
    text-align: center;
    margin-top: 30px;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  img {
    height: 140px;
  }
  h3, h4, h1, p {
    margin: 0;
  }
  h3 {
    margin-bottom: 10px;
  }
  hr {
    border-top: 1px solid #ebebeb;
    border-bottom: 0;
    margin: 20px 0;
  }
</style>
