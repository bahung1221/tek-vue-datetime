# TekVueDateTime

> A vue component for select date, date time and date range with elegant transition

TekVueDateTime is developed based on [VueCtkDateTimePicker](https://github.com/chronotruck/vue-ctk-date-time-picker).

VueCtkDateTimePicker is an awesome datetime picker. I love its styles, its UX behaviour especially its transitions.
Unfortunately, VueCtkDateTimePicker isn't maintained anymore by these authors, and it still have some issues (both logic & design issues) that I must resolve to make it work on my projects.

So I forked it with a huge re-write to improve the UX/UI and also replace `moment` by `dayjs`.

You can see the bundle size different of this package and the original one by below links:
- This folk: https://bundlephobia.com/result?p=tek-vue-datetime
- Original: https://bundlephobia.com/result?p=vue-ctk-date-time-picker

![tek-vue-datetime](./assets/illu-animated.gif)

# Installation

Yarn install:

```bash
# Add dayjs if your project doesn't have it yet
yarn add dayjs

# Add tek-vue-datetime
yarn add tek-vue-datetime
```

# Usage

## ES6 Modules / CommonJS

```js
import VueDateTimePicker from 'tek-vue-datetime';
import 'tek-vue-datetime/dist/tek-vue-datetime.css';

Vue.component('VueDateTimePicker', VueDateTimePicker);
```

```html
<VueDateTimePicker v-model="yourValue" />
```

## UMD

```html
<link
  rel="stylesheet"
  type="text/css"
  href="${YOUR_PATH}/tek-vue-datetime.css"
/>

<div id="app">
  <VueDateTimePicker v-model="yourValue"></VueDateTimePicker>
</div>

<script src="https://unpkg.com/vue" charset="utf-8"></script>
<script
  src="${YOUR_PATH}/tek-vue-datetime.umd.min.js"
  charset="utf-8"
></script>

<script type="text/javascript">
  Vue.component('tek-vue-datetime', window['tek-vue-datetime']);
  new Vue({
    el: '#app',
    data() {
      return {
        yourValue: null
      };
    }
  });
</script>
```

Here is an example of [UMD implementation](https://codepen.io/louismazel/pen/jQWNzQ).

## Use custom element to trigger the component

```html
<VueDateTimePicker :no-value-to-custom-elem="(true|false)" />
  ...
  <input type="text" />
  ... or
  <button type="button">Label</button>
  ...
</VueDateTimePicker>
```

# Props API

| Props                       | Type              | Required | Default                     |
| --------------------------- | ----------------- | -------- | --------------------------- |
| v-model                     | String            | yes      | -                           |
| format                      | String            | no       | 'YYYY-MM-DD hh:mm a'        |
| formatted                   | String            | no       | 'llll' (dayjs format)       |
| label                       | String            | no       | Select date & time          |
| hint (1)                    | String            | no       | -                           |
| error (2)                   | Boolean           | no       | false                       |
| primary-color (3)           | String (hex)      | no       | #1e90ff                     |
| primary-variant-color (3)   | String (hex)      | no       | #e4efff                     |
| secondary-color (3)         | String (hex)      | no       | #eaeaea                     |
| text-color (3)              | String (hex)      | no       | #333333                     |
| background-color (3)        | String (hex)      | no       | #ffffff                     |
| border-color (3)            | String (hex)      | no       | #cecece                     |
| light-text-color (3)        | String (hex)      | no       | #ffffff                     |
| position                    | String            | no       | null                        |
| locale (6)                  | String            | no       | Browser Locale              |
| persistent                  | Boolean           | no       | false                       |
| minute-interval             | Integer           | no       | 1                           |
| output-format               | String            | no       | null                        |
| minute-interval             | Integer           | no       | 1                           |
| only-time                   | Boolean           | no       | false                       |
| only-date                   | Boolean           | no       | false                       |
| no-label                    | Boolean           | no       | false                       |
| no-header                   | Boolean           | no       | false                       |
| no-value-to-custom-elem (7) | Boolean           | no       | false                       |
| min-date (8)                | String            | no       | -                           |
| max-date (8)                | String            | no       | -                           |
| no-weekends-days            | Boolean           | no       | false                       |
| auto-close                  | Boolean           | no       | false                       |
| inline                      | Boolean           | no       | false                       |
| overlay                     | Boolean           | no       | false                       |
| range                       | Boolean           | no       | false                       |
| no-button                   | Boolean           | no       | false                       |
| input-size                  | String (sm or lg) | no       | null                        |
| button-now-translation      | String            | no       | 'Now'                       |
| no-button-now               | Boolean           | no       | false                       |
| first-day-of-week           | Int (0 to 7)      | no       | -                           |
| disabled-dates (9)          | Array`<string>`   | no       | []                          |
| disabled-hours (10)          | Array`<string>`   | no       | -                           |
| disabled-weekly (11)        | Array`<integer>`  | no       | []                          |
| no-keyboard (12)            | Boolean           | no       | false                       |
| right (13)                  | Boolean           | no       | false                       |
| noClearButton               | Boolean           | no       | false                       |
| behaviour                   | Object            | no       | [See behaviour](#Behaviour) |
| id (14)                     | String            | no       | undefined                   |

(1) hint : Is a text that replaces the label/placeholder (Ex : Error designation)

(2) error : When is `true` --> Input border & label are red

(3) theme: Custom colors for the picker
  - primaryColor: The main color of the picker, using for selected background, header background
  - primaryVariantColor: The variant color of the picker, using for current day background and selected range background
  - secondaryColor: The neutral color, using for hover background
  - textColor: Text color of all the picker
  - lightTextColor: Text color in active state (selected)
  - backgroundColor: background color of the picker
  - borderColor: border-top color of bottom bar (contains submit button)

(6) locale:
- Default value is the locale of the browser - Ex : Set `locale="vi"` to force to Vietnamese language
- You must manual import `dayjs locale` to use this feature, `TekVueDateTime` doesn't import any locale to avoid redundant locales

```js
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')
```

(7) no-value-to-custom-elem : No value will set to your elem (you can get the formatted value with @formatted-value event)

(8) min-date && max-date should be in the same format as property format specified. If format not set - it is set to 'YYYY-MM-DD hh:mm a' by default

(9) Disabled-Dates is an Array of dates in 'YYYY-MM-DD' format (ex: `['2018-04-03', '2018-04-07', '2018-04-09']`)

(10) disabled-hours : Must be an Array of hours in 24h format ('00' to '23') : `['00','01','02','03','04','05','06','07','19','20','21','22','23']`

(11) disabled-weekly : Days of the week which are disabled every week, in Array format with day index, Sunday as 0 and Saturday as 6: `[0,4,6]`

(12) no-keyboard : Disable keyboard accessibility & navigation

(13) right : add this attribute to align the picker on right

(14) id : it assign id such as 'passedstring-input' to input help diffrentiate between two date-time-picker on same component.

> Any additionnal attribute passed to the component will be automatically be binded to the input component. (eg. if you passes a `type` attribute, the `<input>` will receive it).

## Behaviour

In order to avoid having too much properties in the component, We're adding a `behaviour` property that is an object including some annex behaviour values.

The default value for this object is:

```js
{
  time: {
    nearestIfDisabled: true;
  }
}
```

To override those values, pass a new object with the values you want to override:

```html
<ctk-date-time-picker
  :behaviour="{
    time: {
      nearestIfDisabled: false
    }
  }"
/>
```

| Behaviour              | Description                                                                                                                                                                                                                                                                                                                                                                       | Type    | Default |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- |
| time.nearestIfDisabled | If `true`, it will select the nearest available hour in the timepicker, if the current selected hour is disabled. Per example, if the hour is 12 but all the hours have been disabled until 14, then the 14 will be selected by default. Set `false` to disable this behaviour; the current hour will remain selected even if it has been disabled. The user cannot re-select it. | Boolean | true    |

# Events API

| Event           | Return                                            |
| --------------- | ------------------------------------------------- |
| input           | value (formatted with 'format' props)             |
| formatted-value | value (formatted with 'formatted' props)          |
| is-shown        | Component is shown                                |
| is-hidden       | Component is hidden                               |
| validate        | Click on validate button (so component is closed) |
| destroy         | Component is destroy                              |

# Keyboard Accessible

| Key            | Action                     |
| -------------- | -------------------------- |
| Arrow Right    | Next Day                   |
| Arrow Left     | Previous Day               |
| Arrow Down     | Same day on next week      |
| Arrow Up       | Same day on previous week  |
| Page Down      | Same day on previous month |
| Page Up        | Same day on next month     |
| Enter or Space | Select day                 |
| Escape         | Close component            |

# Custom theme

TekVueDateTime colors are easy to custom, just pass the below props to get whatever you want:

- `primaryColor`: The main color of the picker, using for selected background, header background
- `primaryVariantColor`: The variant color of the picker, using for current day background and selected range background
- `secondaryColor`: The neutral color, using for hover background
- `textColor`: Text color of all the picker
- `lightTextColor`: Text color in active state (selected)
- `backgroundColor`: background color of the picker
- `borderColor`: border-top color of bottom bar (contains submit button)

# Contribute

## Setting up development server

### Without Docker

Ensure you have Node and npm in your machine. Minimal config is:

- node >= 6.0
- npm >= 3.0

> This project is built with `node@10.x`.

Install the development dependencies by running:

```bash
npm install
```

or

```bash
npm ci # Recommanded if you have node > 10.x
```

Once your dependencies are installed, start the development server with:

```bash
npm run serve
```

This will start the development server available at `http://localhost:8080`.

### Docker

To easily set-up your development environment, you can spin up a container containing the development app.
For that, you need Docker with docker-compose in your machine.

Once you've everything running, you can simply run the following command to start the dev server:

```bash
docker-compose up -d
```

This will start the development server inside a container and accessible through `http://localhost:8080`.

## Compiles and hot-reloads for development

```bash
npm run serve
```

## Linter

```bash
npm run lint
```

## Tests

Work in progress

# License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)
