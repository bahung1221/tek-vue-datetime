<template>
  <div
    v-if="hasButtonSubmit || hasButtonCancel"
    class="datepicker-buttons-container flex"
    :class="{
      'justify-content-right': !hasButtonCancel,
    }"
  >
    <button
      v-if="hasButtonCancel"
      type="button"
      tabindex="-1"
      class="datepicker-button cancel flex align-center justify-content-center"
      @click.stop="$emit('cancel')"
    >
      <span
        class="datepicker-button-effect"
        :style="[cancelBgStyle]"
      />
      <span
        class="datepicker-button-content"
        :style="[cancelColorStyle]"
      >
        {{ buttonCancelTranslation || 'Cancel' }}
      </span>
    </button>
    <button
      v-if="hasButtonSubmit"
      type="button"
      tabindex="-1"
      class="datepicker-button submit flex align-center justify-content-center"
      :class="{
        'has-border': !buttonSubmitTranslation
      }"
      @click.stop="$emit('submit')"
    >
      <span
        class="datepicker-button-effect"
        :style="[bgStyle]"
      />
      <span
        v-if="buttonSubmitTranslation"
        class="datepicker-button-content"
        :style="[colorStyle]"
      >
        {{ buttonSubmitTranslation }}
      </span>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        :style="[colorStyle]"
      >
        <path
          d="M0 0h24v24H0z"
          fill="none"
        />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'ActionButtons',
    props: {
      onlyTime: { type: Boolean, default: null },
      range: { type: Boolean, default: null },
      hasButtonSubmit: { type: Boolean, default: null },
      hasButtonCancel: { type: Boolean, default: null },
      buttonSubmitTranslation: { type: String, default: null },
      buttonCancelTranslation: { type: String, default: null }
    },
    computed: {
      colorStyle () {
        return {
          color: 'var(--tvd-primary-color)',
          fill: 'var(--tvd-primary-color)'
        }
      },
      cancelColorStyle () {
        return {
          color: 'var(--tvd-text-color-dimmer)'
        }
      },
      bgStyle () {
        return {
          backgroundColor: 'var(--tvd-primary-color)'
        }
      },
      cancelBgStyle () {
        return {
          backgroundColor: 'var(--tvd-primary-variant-color)'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datepicker-buttons-container {
    padding: 10px 5px 15px;
    background-color: var(--tvd-background-color);
    z-index: 1;
    display: flex !important;
    justify-content: space-between;
    .datepicker-button {
      padding: 0 20px;
      position: relative;
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      height: 30px;
      font-size: 16px;
      outline: none;
      cursor: pointer;
      -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-weight: 600;
      &-content {
        position: relative;
      }
      svg {
        position: relative;
        -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        fill: var(--tvd-primary-color);
      }
      .datepicker-button-effect {
        position: absolute;
        top: 0;
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
      &:hover {
        border: 1px solid transparent;
        .datepicker-button-effect {
          transform: scale(1);
        }
      }
      &.submit:hover {
        svg {
          fill: var(--tvd-light-text-color) !important;
        }
        .datepicker-button-content {
          color: var(--tvd-light-text-color) !important;
        }
      }
      &.has-border {
        border: 1px solid var(--tvd-border-color);
      }
    }
  }
</style>
