import { useEffect, useState, useRef } from 'react'

export default function Slider({ items = [], intervalMs = 4000 }){
  const [idx, setIdx] = useState(0)
  const timer = useRef(null)

  useEffect(()=>{
    if (!items.length) return
    timer.current = setInterval(()=> setIdx(i => (i+1) % items.length), intervalMs)
    return ()=> clearInterval(timer.current)
  }, [items.length, intervalMs])

  if (!items.length) return null
  const prev = () => setIdx(i => (i-1+items.length)%items.length)
  const next = () => setIdx(i => (i+1)%items.length)

  return (
    <div className="slider">
      {items.map((p,i)=>(
        <div className={`slide ${i===idx?'active':''}`} key={p._id || i} style={{position:i===idx?'relative':'absolute'}}>
          <img src={p.image} alt={p.name} />
          <div className="info">
            <h2>{p.name}</h2>
            <p className="muted" style={{maxWidth:520}}>{p.description}</p>
            <div className="wrap">
              <div className="price" style={{fontSize:24}}>${p.price.toFixed(2)}</div>
              <a className="btn" href={`/product/${p._id}`}>Купи сега</a>
            </div>
          </div>
        </div>
      ))}
      <div className="controls">
        <button className="ctrl" onClick={prev}>‹</button>
        <button className="ctrl" onClick={next}>›</button>
      </div>
      <div className="dots">
        {items.map((_,i)=>(<div key={i} className={`dot ${i===idx?'active':''}`} onClick={()=>setIdx(i)} />))}
      </div>
    </div>
  )
}
