import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Slider from '../components/Slider'

export default function Home(){
  const [featured, setFeatured] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    Promise.all([
      api.get('/products/featured'),
      api.get('/products')
    ]).then(([f, p])=>{
      setFeatured(f.data)
      setProducts(p.data)
    }).finally(()=> setLoading(false))
  }, [])

  if (loading) return <div className="page">Вчитување...</div>

  return (
    <div className="page">
      <Slider items={featured.length ? featured : products.slice(0,3)} />

      <h2 style={{marginTop:24}}>Нови производи</h2>
      <div className="grid">
        {products.map(p => (
          <Link to={`/product/${p._id}`} key={p._id} className="card">
            <img src={p.image} alt={p.name} />
            <div className="body">
              <div>{p.name}</div>
              <div className="price">${p.price.toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
