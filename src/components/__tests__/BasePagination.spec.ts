import { fireEvent, screen, render } from '../../test-util'
import BasePagination from '../BasePagination.vue'

const setUp = () => {
  return render(BasePagination, {
    props: {
      total: 32
    }
  })
}


test('emits events correctly when click the pager number', async () => {
  const page = 2
  const { emitted } = setUp()
  const numberBtn = screen.getByText(page, { selector: '.number' })
  // click page 2 button
  await fireEvent.click(numberBtn)
  expect(emitted()['update:page'][0]).toEqual([page])
  expect(emitted()['pagination'][0]).toEqual([page])
})