import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import Modal from './Modal'

export default function ProductModal({ open, onClose, product }) {
  const dispatch = useDispatch()
  const [addedOpen, setAddedOpen] = useState(false)

  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [number, setNumber] = useState('')
  const [color, setColor] = useState('')

  if (!open || !product) return null

  // истата логика како во Product.jsx
  const isSneakers = product.category === 'sneakers'

  const hasSizes =
    !isSneakers &&
    Array.isArray(product.sizes) &&
    product.sizes.length > 0

  const hasColors =
    Array.isArray(product.colors) && product.colors.length > 0

  const showNumber = isSneakers

  const numbers = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
  const inStock = (product.countInStock || 0) > 0

  const handleAddToCart = () => {
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
        product,
        qty,
        size: hasSizes ? size || null : null,
        color: color || null,
        number: showNumber ? number || null : null,
      }),
    )
    setAddedOpen(true)
  }

  const handleCloseAdded = () => {
    setAddedOpen(false)
    if (onClose) onClose()
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={product.name} width={720}>
        <div className="product-modal">
          <img
            src={product.image}
            alt={product.name}
            className="pm-image"
          />

          <div className="pm-info">
            <div className="pm-price">
              €{(product.price || 0).toFixed(2)}
            </div>
            <p className="pm-desc">{product.description}</p>

            <div className="product-price-row">
              <div className="product-stock">
                {inStock ? 'На залиха' : 'Нема залиха'}
              </div>
            </div>

            <div className="product-options">
              {/* исто како во Product.jsx – големина, но НЕ за sneakers */}
              {hasSizes && (
                <div className="field">
                  <div className="field-label">Големина</div>
                  <div className="chip-row">
                    {product.sizes.map((s) => (
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
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={
                          'chip' + (color === c ? ' chip-active' : '')
                        }
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
                  onChange={(e) =>
                    setQty(Number(e.target.value) || 1)
                  }
                >
                  {Array.from({
                    length: Math.min(10, product.countInStock || 10),
                  }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="btn"
              disabled={!inStock}
              onClick={handleAddToCart}
              style={{ marginTop: 16 }}
            >
              {inStock ? 'Додај во кошничка' : 'Нема залиха'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={addedOpen}
        onClose={handleCloseAdded}
        title="Успешно!"
      >
        <p>Производот е додаден во кошничката.</p>
      </Modal>
    </>
  )
}
