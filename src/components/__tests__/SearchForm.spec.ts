import { fireEvent, render } from '../../test-util'
import SearchForm from '../SearchForm.vue'

// only changes the day
const today = new Date()
const y = today.getFullYear()
const m = (today.getMonth() + 1).toString().padStart(2, '0')
const fakeForm = {
  keyword: 'phone'
}

test('emits search event when click search button or press enter', async () => {
  const {
    emitted,
    getByPlaceholderText,
    getByTitle,
    getByTestId
  } = render(SearchForm)
  const keywordInput = getByPlaceholderText('Search...')
  await fireEvent.update(keywordInput, fakeForm.keyword)


  const searchBtn = getByTitle("Search")
  // Click search button
  await fireEvent.click(searchBtn)
  // Assert the right event has been emitted.
  expect(emitted().search[0]).toEqual([fakeForm])
  // Press enter
  await fireEvent.keyUp(getByTestId('search-form'), {
    key: 'Enter',
    code: 'Enter',
    charCode: 13
  })
  expect(emitted().search[1]).toEqual([fakeForm])
})
