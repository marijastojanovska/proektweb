import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { removeFromCart, clearCart } from '../store/cartSlice'

export default function Cart() {
  const { items } = useSelector((s) => s.cart)
  const { token } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const total = items.reduce((sum, it) => sum + it.product.price * it.qty, 0)

  async function checkout() {
    if (!token) {
      navigate('/login')
      return
    }
    const payload = {
      items: items.map((it) => ({
        product: it.product._id,
        qty: it.qty,
        size: it.size,
        color: it.color,
        number: it.number,
      })),
      shippingAddress: {
        fullName: 'Customer',
        address: 'Street 1',
        city: 'City',
        postalCode: '0000',
        country: 'MK',
      },
    }
    const res = await api.post('/orders', payload)
    alert('Нарачката е креирана: ' + res.data._id)
    dispatch(clearCart())
    navigate('/profile')
  }

  return (
    <div className="page">
      <h2>Кошничка</h2>
      {items.length === 0 ? (
        <div>Кошничката е празна.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Производ</th>
                <th>Количина</th>
                <th>Големина / Број / Боја</th>
                <th>Цена</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.product.name}</td>
                  <td>{it.qty}</td>
                  <td>
                    {[it.size, it.number, it.color].filter(Boolean).join(' / ')}
                  </td>
                  <td>€{(it.product.price * it.qty).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn outline"
                      onClick={() => dispatch(removeFromCart(idx))}
                    >
                      Отстрани
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Вкупно</td>
                <td>€{total.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button className="btn" disabled={items.length === 0} onClick={checkout}>
          Купи (COD демо)
        </button>
      </div>
    </div>
  )
}
