import React, { useEffect, useState } from 'react';
import api from '../api';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';

export default function Products(){
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const limit = 10

  useEffect(()=>{
    setLoading(true);
    api.get('/products', { params: { category, page, limit }})
      .then(res => {
        setItems(res.data.products || res.data);
        setPages(res.data.pages || 1);
      })
      .finally(()=>setLoading(false));
  }, [category, page]);

  return (
    <div className="page">
      <h2>Производи</h2>
      <Filters value={category} onChange={(v)=>{ setCategory(v); setPage(1); }} />
      {loading ? <div>Вчитување...</div> : (
        <>
          <div className="grid">
            {items.map(p => (
              <div key={p._id} className="card" onClick={()=>setSelected(p)}>
                <img src={p.image} alt={p.name} />
                <div className="body">
                  <div className="name">{p.name}</div>
                  <div className="price">${p.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}
      <ProductModal open={!!selected} onClose={()=>setSelected(null)} product={selected} />
    </div>
  );
}
