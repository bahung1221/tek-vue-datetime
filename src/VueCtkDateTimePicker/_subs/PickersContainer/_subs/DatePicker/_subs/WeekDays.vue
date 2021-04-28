<template>
  <div
    :class="{'is-dark': dark}"
    class="week-days flex"
  >
    <div
      v-for="(weekDay, index) in weekDays"
      :key="index"
      class="flex-1 text-muted lm-fs-15 flex justify-content-center align-center week-days-container"
    >
      {{ weekDay }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WeekDays',
    props: {
      weekDays: { type: Array, default: () => ([]), required: true },
      dark: { type: Boolean, default: null }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/helpers/variables/index.scss";
  .week-days {
    height: 41px;
    > div {
      text-transform: capitalize;
      font-weight: 700;
      color: $color-text;
    }
    &.is-dark .week-days-container > div {
      color: #a8a8a8 !important;
    }
  }
  @media screen and (max-width: 415px) {
    &:not(.inline) {
      .datepicker-week {
        height: 21px !important;
      }
    }
  }
</style>
