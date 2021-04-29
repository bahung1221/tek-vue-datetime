import { shallowMount } from '@vue/test-utils'
import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'

describe('CustomButton.vue', () => {
  it('has round class when have round prop', () => {
    const wrapper = shallowMount(CustomButton)
    expect(wrapper.classes('round')).toBe(false)
    wrapper.setProps({ round: true })
    expect(wrapper.classes('round')).toBe(true)
  })
})
