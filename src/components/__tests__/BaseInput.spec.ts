import { fireEvent, screen, render } from '../../test-util'

import BaseInput from '../BaseInput.vue'

test('changes props correctly', () => {
  const modelValue = 'hello'
  const placeholder = 'Search...'
  render(BaseInput, {
    props: {
      modelValue,
      placeholder
    }
  })
  screen.getByPlaceholderText(placeholder)
  screen.getByDisplayValue(modelValue)
})

test('emits input event correctly', async () => {
  const { emitted } = render(BaseInput)
  const value = 'world'
  const input = screen.getByRole('textbox')
  await fireEvent.update(input, value)
  expect(emitted()['update:modelValue']).toEqual([[value]])
})
