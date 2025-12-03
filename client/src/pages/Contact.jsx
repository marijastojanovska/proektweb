import { useState } from 'react'
import api from '../api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await api.post('/contact', form)
      setStatus({
        type: 'success',
        text: res.data.message || 'Пораката е испратена. Ви благодариме.',
      })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Настана грешка. Обидете се повторно.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page contact-page">
      <div className="contact-wrapper">
        {/* Лева страна – текст / инфо */}
        <div className="contact-info">
          <h2>Контакт</h2>
          <p className="muted">
            Испратете ни порака, ќе ви одговориме на вашата e-mail адреса.
          </p>

          <div className="contact-highlights">
            <div>
              <div className="contact-label">E-mail</div>
              <div className="contact-value">teeshop@gmail.com</div>
            </div>
            <div>
              <div className="contact-label">Работно време</div>
              <div className="contact-value">Пон – Пет • 09:00 – 17:00</div>
            </div>
          </div>

          <p className="muted small">
            Обично одговараме во рок од 24 часа. За итни прашања користете
            телефон или Viber.
          </p>
        </div>

        {/* Десна страна – форма */}
        <div className="contact-card">
          <h3>Испрати порака</h3>

          {status && (
            <div
              className={
                status.type === 'error'
                  ? 'alert alert-error'
                  : 'alert alert-success'
              }
            >
              {status.text}
            </div>
          )}

          <form onSubmit={onSubmit} className="form contact-form">
            <div className="form-row">
              <label>
                Име
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Вашето име"
                  required
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="email@example.com"
                  required
                />
              </label>
            </div>

            <label>
              Порака
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={onChange}
                placeholder="Како можеме да помогнеме?"
                required
                style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #222', background:'#0f0f10', color:'var(--text)'}}
              />
              <span className="textarea-hint">
                Максимум ~500 карактери. Напиши ни што ти е најважно.
              </span>
            </label>

            <div className="contact-actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Се испраќа…' : 'Испрати'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
