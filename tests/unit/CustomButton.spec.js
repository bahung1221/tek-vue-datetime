import { shallowMount } from '@vue/test-utils'
import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'

describe('CustomButton.vue', () => {
  it('check colorStyle computed data', () => {
    const wrapper = shallowMount(CustomButton, {
      propsData: { color: 'purple' }
    })
    expect(wrapper.vm.colorStyle.color).toContain('purple')
    expect(wrapper.vm.colorStyle.fill).toContain('purple')
    expect(wrapper.vm.bgStyle.backgroundColor).toContain('purple')
  })
  it('has round class when have round prop', () => {
    const wrapper = shallowMount(CustomButton)
    expect(wrapper.classes('round')).toBe(false)
    wrapper.setProps({ round: true })
    expect(wrapper.classes('round')).toBe(true)
  })
})
