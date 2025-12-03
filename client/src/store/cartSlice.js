import { createSlice } from '@reduxjs/toolkit'

const saved = localStorage.getItem('cart')
const initial = saved ? JSON.parse(saved) : { items: [] }

const slice = createSlice({
  name: 'cart',
  initialState: initial,
  reducers: {
    addToCart(state, action) {
      const { product, qty = 1, size, color, number } = action.payload
      const existing = state.items.find(
        (i) =>
          i.product._id === product._id &&
          i.size === size &&
          i.color === color &&
          i.number === number
      )
      if (existing) existing.qty += qty
      else state.items.push({ product, qty, size, color, number })
      localStorage.setItem('cart', JSON.stringify(state))
    },
    removeFromCart(state, action) {
      const idx = action.payload
      state.items.splice(idx, 1)
      localStorage.setItem('cart', JSON.stringify(state))
    },
    clearCart(state) {
      state.items = []
      localStorage.setItem('cart', JSON.stringify(state))
    },
  },
})

export const { addToCart, removeFromCart, clearCart } = slice.actions
export default slice.reducer
