<template>
  <button
    class="custom-button flex align-center justify-content-center"
    :class="{
      'with-border': withBorder,
      'is-hover': hover,
      'is-selected': selected,
      'round': round
    }"
    tabindex="-1"
    type="button"
    @click.stop="$emit('click')"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @mouseover="$emit('mouseover')"
    @mouseleave="$emit('mouseleave')"
  >
    <span class="custom-button-effect" />
    <span
      class="custom-button-content flex align-center justify-content-center"
    >
      <slot :style="[colorStyle]" />
    </span>
  </button>
</template>

<script>
  export default {
    name: 'CustomButton',
    props: {
      textColor: { type: String, default: '#454350' },
      withBorder: { type: Boolean, default: false },
      hover: { type: Boolean, default: false },
      selected: { type: Boolean, default: false },
      round: { type: Boolean, default: false }
    },
    computed: {
      colorStyle () {
        const color = 'var(--tvd-text-color)'
        return {
          color: color,
          fill: color
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-button {
    padding: 0 20px;
    position: relative;
    background-color: white;
    border: 1px solid transparent;
    border-radius: 4px;
    height: 30px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-weight: 500;
    &-content {
      position: relative;
    }
    svg {
      position: relative;
      -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
      transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
      fill: var(--tvd-text-color);
    }
    .custom-button-effect {
      position: absolute;
      background: var(--tvd-secondary-color);
      top: -1px;
      left: 0;
      bottom: 0;
      right: 0;
      height: 30px;
      border-radius: 4px;
      width: 100%;
      -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
      transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
      transform: scale(0);
    }
    .custom-button-content {
      color: var(--tvd-text-color);
    }
    &.with-border {
      border: 1px solid var(--tvd-border-color);;
    }
    &:hover, &.is-hover {
      border: 1px solid transparent !important;
      .custom-button-effect {
        transform: scale(1);
      }
    }
    &.is-selected {
      border: 1px solid transparent !important;
      .custom-button-effect {
        background: var(--tvd-primary-color);
        transform: scale(1);
        opacity: (1);
      }
      svg {
        fill: var(--tvd-light-text-color) !important;
      }
      .custom-button-content {
        color: var(--tvd-light-text-color) !important;
      }
    }
    &.round {
      padding: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      .custom-button-effect {
        border-radius: 50%;
        height: 24px;
      }
    }
  }
</style>
