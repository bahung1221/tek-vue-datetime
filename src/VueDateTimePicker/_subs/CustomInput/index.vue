<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus,
      'has-value': value,
      'has-error': errorHint,
      'is-disabled': isDisabled,
      'no-label': noLabel
    }, inputSize]"
    class="field flex align-center"
    @click="focusInput"
  >
    <input
      :id="$attrs.id"
      ref="CustomInput"
      v-bind="$attrs"
      :value="value"
      :placeholder="label"
      :style="[borderStyle]"
      type="text"
      class="field-input"
      :class="{ 'no-clear-button': noClearButton }"
      readonly
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @click="$emit('click')"
    >
    <label
      v-if="!noLabel"
      ref="label"
      :for="$attrs.id"
      :class="errorHint ? 'text-danger' : null"
      :style="[colorStyle]"
      class="field-label"
      @click="focusInput"
    >
      {{ hint || label }}
    </label>
    <CustomButton
      v-if="hasClearButton"
      color="rgba(0, 0, 0, 0.54)"
      class="field-clear-button"
      round
      @click="$emit('clear')"
    >
      <span class="fs-16">
        ✕
      </span>
    </CustomButton>
  </div>
</template>

<script>
  import CustomButton from './../CustomButton'

  export default {
    name: 'CustomInput',
    components: {
      CustomButton
    },
    inheritAttrs: false,
    props: {
      isFocus: { type: Boolean, default: false },
      value: { type: [String, Object], required: false, default: null },
      label: { type: String, default: 'Select date & time' },
      noLabel: { type: Boolean, default: false },
      hint: { type: String, default: null },
      errorHint: { type: Boolean, default: null },
      inputSize: { type: String, default: null },
      noClearButton: { type: Boolean, default: false }
    },
    computed: {
      borderStyle () {
        const cond = (this.isFocus && !this.errorHint)
        return cond
          ? { border: '1px solid var(--tvd-primary-color)' }
          : null
      },
      colorStyle () {
        const cond = this.isFocus
        return cond
          ? { color: 'var(--tvd-primary-color)' }
          : null
      },
      hasClearButton () {
        return !this.noClearButton && !this.isDisabled && this.value
      },
      /**
       * Returns true if the field is disabled
       * @function isDisabled
       * @returns {boolean}
       */
      isDisabled () {
        return typeof this.$attrs.disabled !== 'undefined' && this.$attrs.disabled !== false
      }
    },
    methods: {
      focusInput () {
        this.$refs.CustomInput.focus()
        this.$emit('focus')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .field{
    position: relative;
    &-label{
      position: absolute;
      top: 5px;
      cursor: pointer;
      left: 13px;
      -webkit-transform: translateY(25%);
      transform: translateY(25%);
      opacity: 0;
      -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: rgba(0, 0, 0, 0.54);
    }
    &-input{
      cursor: pointer;
      background-color: #fff;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
      position: relative;
      width: 100%;
      height: 42px;
      min-height: 42px;
      padding-left: 12px;
      padding-right: 44px;
      font-weight: 400;
      -webkit-appearance: none;
      outline: none;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      font-size: 14px;
      z-index: 0;
      &.no-clear-button {
        padding: 0 12px;
      }
    }
    &-clear-button {
      position: absolute;
      right: 12px;
      top: 0px;
      bottom: 0px;
      margin: auto 0;
    }
    &.has-error {
      .field-input {
        border-color: orangered;
      }
      .field-label{
        opacity: 1;
        -webkit-transform: translateY(0);
        transform: translateY(0);
        font-size: 11px;
      }
      .field-input {
        padding-top: 14px;
      }
    }
    &.has-value {
      .field-label {
        opacity: 1;
        -webkit-transform: translateY(0);
        transform: translateY(0);
        font-size: 11px;
      }
      &:not(.no-label) {
        .field-input {
          padding-top: 14px;
        }
      }
    }
    &.is-focused {
      .field-input {
        border-color: var(--tvd-primary-color);
      }
      .field-label {
        color: var(--tvd-primary-color);
      }
    }
    &.is-disabled {
      .field-input {
        border-color: #CCC;
        background: #F2F2F2;
      }
      .field-label, .field-input {
        cursor: default;
      }
    }
    .text-danger {
      color: orangered;
    }
    &.sm {
      .field-input {
        height: 36px;
        min-height: 36px;
        font-size: 12px;
      }
      .field-label {
        font-size: 10px;
      }
      &.has-value:not(.no-label) {
        .field-input {
          padding-top: 12px;
        }
      }
    }
    &.lg {
      .field-input {
        height: 48px;
        min-height: 48px;
        font-size: 16px;
      }
      .field-label {
        font-size: 14px;
      }
      &.has-value:not(.no-label) {
        .field-input {
          padding-top: 16px;
        }
      }
    }
  }
</style>
