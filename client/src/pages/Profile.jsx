import { useEffect, useState } from 'react'
import api from '../api'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Profile(){
  const { token } = useSelector(s => s.auth)
  const [orders, setOrders] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    if (!token) { nav('/login'); return }
    api.get('/orders/mine').then(res => setOrders(res.data))
  }, [token])

  return (
    <div className="page">
      <h2>Мои нарачки</h2>
      {orders.length===0 ? <div>Немате нарачки.</div> : (
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Датум</th><th>Вкупно</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>${o.total.toFixed(2)}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
