<template>
  <div
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
  }
  @media screen and (max-width: 415px) {
    &:not(.inline) {
      .datepicker-week {
        height: 21px !important;
      }
    }
  }
</style>
