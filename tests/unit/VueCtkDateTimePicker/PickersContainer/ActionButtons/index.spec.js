import { shallowMount } from '@vue/test-utils'

import ActionButtons from '@/VueDateTimePicker/_subs/PickersContainer/_subs/ActionButtons'

describe('VueDateTimePicker/PickersContainer/ActionButtons', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(ActionButtons, {
      propsData: {
        visible: true
      }
    })
  ))

  it('should be defined', () => {
    expect(wrapper.exists()).toBeTruthy()
    const classes = ['flex', 'justify-content-right']
    classes.forEach(C => expect(wrapper.classes()).toContain(C))
  })

  describe('now button', () => {
    it('should be defined if not time only, nor the "noButtonNow" prop is defined nor range mode', () => {
      wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: false
      })
      const button = wrapper.find('.now')
      expect(button.exists()).toBeTruthy()
      expect(button.is('button')).toBeTruthy()
      const { tabindex, type } = button.attributes()
      expect(tabindex).toEqual('-1')
      expect(type).toEqual('button')

      const classes = ['flex', 'align-center', 'justify-content-center']
      classes.forEach(C => expect(button.classes()).toContain(C))

      const buttonContent = button.find('.datepicker-button-content')
      expect(buttonContent.exists()).toBeTruthy()
      expect(buttonContent.text()).toEqual('Now')
    })

    it('should have a custom text if "buttonNowTranslation" prop is defined', () => {
      wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: false,
        buttonNowTranslation: 'My button content'
      })
      const buttonContent = wrapper.find('.now .datepicker-button-content')
      expect(buttonContent.text()).toEqual('My button content')
    })

    it('should emit a now event on click', () => {
      wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: false
      })
      const button = wrapper.find('.now')
      button.trigger('click')
      expect(wrapper.emitted().now).toBeTruthy()
    })

    it('should be undefined if time only, or the "noButtonNow" prop is defined or range mode', () => {
      wrapper.setProps({
        noButtonNow: true,
        range: false,
        onlyTime: false
      })
      let button = wrapper.find('.now')
      expect(button.exists()).toBeFalsy()

      wrapper.setProps({
        noButtonNow: false,
        range: true,
        onlyTime: false
      })
      button = wrapper.find('.now')
      expect(button.exists()).toBeFalsy()

      wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: true
      })
      button = wrapper.find('.now')
      expect(button.exists()).toBeFalsy()
    })

    describe('right margin', () => {
      it('should have the class if there is a submit button', () => {
        wrapper.setProps({
          noButtonNow: false,
          range: false,
          onlyTime: false
        })
        const button = wrapper.find('.now')
        expect(button.classes()).toContain('right-margin')
      })

      it('should not have the class if submit button not present', () => {
        wrapper.setProps({
          noButtonNow: false,
          range: false,
          onlyTime: false
        })
        const button = wrapper.find('.now')
        expect(button.classes()).not.toContain('right-margin')
      })
    })
  })

  describe('submit button', () => {
    it('should be defined if the "hasButtonSubmit" is true', () => {
      wrapper.setProps({
        hasButtonSubmit: true
      })
      const button = wrapper.find('.submit')
      expect(button.exists()).toBeTruthy()
      expect(button.is('button')).toBeTruthy()
      expect(button.attributes().tabindex).toEqual('-1')

      const classes = ['flex', 'align-center', 'justify-content-center']
      classes.forEach(C => expect(button.classes()).toContain(C))
    })

    it('should emit a submit event on click', () => {
      wrapper.setProps({
        hasButtonSubmit: true
      })
      const button = wrapper.find('.submit')
      button.trigger('click')
      expect(wrapper.emitted().submit).toBeTruthy()
    })

    it('should be undefined if the "hasButtonSubmit" is false', () => {
      wrapper.setProps({
        hasButtonSubmit: false
      })
      const button = wrapper.find('.submit')
      expect(button.exists()).toBeFalsy()
    })

    /**
     * TODO: Test the button content.
     * See if we don't want to change the submit content value.
     */
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
