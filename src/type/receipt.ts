export interface Receipt {
  id?: number
  title?: string
  category?: string
  brand?: string
  price?: string
  stock?: string
  rating?: string
}

export interface ReceiptQuery {
  keyword?: string
}
