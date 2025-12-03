import { useEffect, useState } from 'react'
import api from '../api'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// ⬇️ ново: Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

export default function AdminOrders() {
  const { user, token } = useSelector((s) => s.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  // ФИЛТРИ
  const [filterUser, setFilterUser] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  useEffect(() => {
    if (!token || !user?.isAdmin) {
      nav('/')
      return
    }
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [token, user, nav])

  async function updateStatus(id, status) {
    await api.patch(`/orders/${id}/status`, { status })
    const res = await api.get('/orders')
    setOrders(res.data)
  }

  if (loading) return <div className="page">Вчитување...</div>

  // 🧮 ФИЛТРИРАНА ЛИСТА
  const filteredOrders = orders.filter((o) => {
    const created = new Date(o.createdAt)

    // Филтер по корисник (име или email)
    if (filterUser.trim()) {
      const text = filterUser.trim().toLowerCase()
      const name = (o.user?.name || '').toLowerCase()
      const email = (o.user?.email || '').toLowerCase()
      if (!name.includes(text) && !email.includes(text)) return false
    }

    // Филтер по статус
    if (filterStatus !== 'all' && o.status !== filterStatus) {
      return false
    }

    // Филтер по датум од
    if (filterFrom) {
      const fromDate = new Date(filterFrom + 'T00:00:00')
      if (created < fromDate) return false
    }

    // Филтер по датум до
    if (filterTo) {
      const toDate = new Date(filterTo + 'T23:59:59')
      if (created > toDate) return false
    }

    return true
  })

  // 📊 ПОДАТОЦИ ЗА ГРАФИКОТ (по статус) – базирано на ФИЛТРИРАНИТЕ нарачки
  const statuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
  const statusChartData = statuses
    .map((status) => {
      const rows = filteredOrders.filter((o) => o.status === status)
      const totalAmount = rows.reduce((sum, o) => sum + o.total, 0)
      return {
        status,
        count: rows.length,
        total: totalAmount,
      }
    })
    .filter((row) => row.count > 0) // прикажи само статуси што реално постојат

  return (
    <div className="page">
      <h2>Админ — Сите нарачки</h2>

      {/* 🔍 Филтри над табелата */}
      <div className="table-filters">
        <div className="filter-field">
          <label>Корисник</label>
          <input
            type="text"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            placeholder="Име или e-mail"
          />
        </div>

        <div className="filter-field">
          <label>Статус</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Сите</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="shipped">shipped</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Од датум</label>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label>До датум</label>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
          />
        </div>
      </div>

      {/* 📊 ГРАФИКОН – Нарачки по статус (по филтри) */}
      <div className="orders-chart-card">
        <h3>Нарачки по статус</h3>
        {statusChartData.length === 0 ? (
          <p className="muted small">Нема податоци за прикажување.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={statusChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'count') return [`${value}`, 'Број нарачки']
                  if (name === 'total')
                    return [`€${value.toFixed(2)}`, 'Вкупен износ']
                  return value
                }}
              />
              <Bar dataKey="count" name="Број нарачки" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🧾 Табела со нарачки */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Корисник</th>
              <th>Датум</th>
              <th>Вкупно</th>
              <th>Статус</th>
              <th>Промени</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>
                  {o.user?.name} ({o.user?.email})
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>€{o.total.toFixed(2)}</td>
                <td>{o.status}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '12px' }}>
                  Нема нарачки според избраните филтри.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
