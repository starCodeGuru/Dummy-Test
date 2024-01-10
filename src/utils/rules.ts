interface Rules {
  [key: string]: Rule[]
}

const rules: Rules = {
  title: [{ required: true, message: 'Required field' }],
  category: [{ required: true, message: 'Required field' }],
  brand: [{ required: true, message: 'Required field' }],
  price: [{ required: true, message: 'Required field' }],
  rating: [{ required: true, message: 'Required field' }],
  
}

export default rules
