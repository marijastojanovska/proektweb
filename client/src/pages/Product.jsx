import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import Modal from '../components/Modal'

export default function Product() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [number, setNumber] = useState('') // број (за обувки)
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(true)
  const [addedOpen, setAddedOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    let ignore = false
    setLoading(true)
    api
      .get(`/products/${id}`)
      .then((res) => {
        if (!ignore) setP(res.data)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) return <div className="page">Се вчитува...</div>
  if (!p) return <div className="page">Производот не е пронајден.</div>

  // ⬇️ Ново: флег за патики
  const isSneakers = p.category === 'sneakers'

  // ⬇️ Ако е категорија sneakers, НЕ користиме size ни во UI ни во валидација
  const hasSizes = !isSneakers && Array.isArray(p.sizes) && p.sizes.length > 0
  const hasColors = Array.isArray(p.colors) && p.colors.length > 0
  const showNumber = isSneakers // број само за патики

  const numbers = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
  const inStock = (p.countInStock || 0) > 0

  const handleAddToCart = () => {
    // ⬇️ Ова сега се активира САМО ако hasSizes е true (а за sneakers е false)
    if (hasSizes && !size) {
      alert('Изберете големина.')
      return
    }
    if (showNumber && !number) {
      alert('Изберете број.')
      return
    }

    dispatch(
      addToCart({
        product: p,
        qty,
        size: hasSizes ? size || null : null, // за sneakers ќе испратиме null
        color: color || null,
        number: showNumber ? number || null : null,
      }),
    )
    setAddedOpen(true)
  }

  return (
    <div className="page product-page">
      <div className="product">
        <div className="product-left">
          <div className="product-image-wrap">
            <img src={p.image} alt={p.name} className="product-image" />
          </div>
        </div>

        <div className="product-right">
          <h2 className="product-title">{p.name}</h2>
          <p className="muted product-description">{p.description}</p>

          <div className="product-price-row">
            <div className="product-price">
              {p.price != null ? `€${p.price.toFixed(2)}` : ''}
            </div>
            <div className="product-stock">
              {inStock ? 'На залиха' : 'Нема залиха'}
            </div>
          </div>

          <div className="product-options">
            {/* ⬇️ За sneakers hasSizes ќе биде false, па ова воопшто нема да се прикаже */}
            {hasSizes && (
              <div className="field">
                <div className="field-label">Големина</div>
                <div className="chip-row">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={'chip' + (size === s ? ' chip-active' : '')}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showNumber && (
              <div className="field">
                <div className="field-label">Број (обувки)</div>
                <select
                  className="select"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                >
                  <option value="">Одбери број</option>
                  {numbers.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {hasColors && (
              <div className="field">
                <div className="field-label">Боја</div>
                <div className="chip-row">
                  {p.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={'chip' + (color === c ? ' chip-active' : '')}
                      onClick={() => setColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="field">
              <div className="field-label">Количина</div>
              <select
                className="select"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 1)}
              >
                {Array.from({
                  length: Math.min(10, p.countInStock || 10),
                }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              className="btn"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              {inStock ? 'Додади во кошничка' : 'Нема залиха'}
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={addedOpen}
        onClose={() => setAddedOpen(false)}
        title="Успешно!"
      >
        <p>Производот е додаден во кошничката.</p>
      </Modal>
    </div>
  )
}
