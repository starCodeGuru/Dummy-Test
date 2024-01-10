import {
  fireEvent,
  screen,
  render,
  waitForElementToBeRemoved,
  within,
  sleep
} from '../../test-util'
import rules from '../../utils/rules'
import SaveForm from '../SaveForm.vue'

const { title, category, brand, price, stock, rating } = rules

const initForm = {
  title: 'iPhone9',
  category: 'smartphones',
  brand: 'Apple',
  price: '549',
  stock: '94',
  rating: '4.69'
}

const newForm = {
  title: 'iPhone10',
  category: 'smartphones',
  brand: 'Apple',
  price: '549',
  stock: '93',
  rating: '4.6'
}

const setUp = () =>
  render(SaveForm, {
    props: {
      value: {}
    }
  })

test('fills and changes form fields correctly', async () => {
  const { emitted, getByDisplayValue, getByTitle } = render(SaveForm, {
    props: {
      value: initForm
    }
  })

  const titleInput = getByDisplayValue(initForm.title)
  await fireEvent.update(titleInput, newForm.title)

  const categoryInput = getByDisplayValue(initForm.category)
  await fireEvent.update(categoryInput, newForm.category)

  const brandInput = getByDisplayValue(initForm.brand)
  await fireEvent.update(brandInput, newForm.brand)

  const priceInput = getByDisplayValue(initForm.price)
  await fireEvent.update(priceInput, newForm.price)
  
  const stockInput = getByDisplayValue(initForm.stock)
  await fireEvent.update(stockInput, newForm.stock)
  
  const ratingInput = getByDisplayValue(initForm.rating)
  await fireEvent.update(ratingInput, newForm.rating)

  const submitBtn = getByTitle("submit")
  // Click submit button
  await fireEvent.click(submitBtn)
  await sleep(200)
  // Assert the right event has been emitted.
  expect(emitted().submit[0]).toEqual([newForm])
})

test('clear form fields before add', async () => {
  setUp()
  screen.getAllByRole('textbox').forEach((item) => {
    expect(item).toHaveDisplayValue('')
  })

  for (const key in rules) {
    rules[key].forEach((item: Rule) => {
      const errorMeg = screen.queryByText(item.message as string)
      expect(errorMeg).not.toBeInTheDocument()
    })
  }
})

describe('validation', () => {
  test('validates Title', async () => {
    setUp()
    const item = screen.getByLabelText(/Title/)
    const input = within(item).getByRole('textbox')
    const errMsg = title[0].message
    // required
    await fireEvent.touch(input)
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.title)
    waitForElementToBeRemoved(() => screen.queryByText(errMsg))
  })

  test('validates Category', async () => {
    setUp()
    const item = screen.getByLabelText(/Category/)
    const input = within(item).getByRole('textbox')
    const errMsg = category[0].message
    // required
    await fireEvent.touch(input)
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.category)
    waitForElementToBeRemoved(() => screen.queryByText(errMsg))
  })
  
  test('validates Brand', async () => {
    setUp()
    const item = screen.getByLabelText(/Brand/)
    const input = within(item).getByRole('textbox')
    const errMsg = brand[0].message
    // required
    await fireEvent.touch(input)
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.brand)
    waitForElementToBeRemoved(() => screen.queryByText(errMsg))
  })
  
  test('validates Price', async () => {
    setUp()
    const item = screen.getByLabelText(/Price/)
    const input = within(item).getByRole('textbox')
    const errMsg = price[0].message
    // required
    await fireEvent.touch(input)
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.price)
    waitForElementToBeRemoved(() => screen.queryByText(errMsg))
  })
  
  test('validates Rating', async () => {
    setUp()
    const item = screen.getByLabelText(/Rating/)
    const input = within(item).getByRole('textbox')
    const errMsg = rating[0].message
    // required
    await fireEvent.touch(input)
    expect(await screen.findByText(errMsg)).toBeInTheDocument()
    // valid
    await fireEvent.update(input, newForm.rating)
    waitForElementToBeRemoved(() => screen.queryByText(errMsg))
  })
})
