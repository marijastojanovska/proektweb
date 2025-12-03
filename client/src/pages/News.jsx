import React, { useEffect, useState } from 'react';
import api from '../api';

export default function News(){
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    api.get('/posts', { params: { page, limit: 6 } })
      .then(res => { setItems(res.data.posts); setPages(res.data.pages); })
      .finally(()=>setLoading(false));
  }, [page]);

  return (
    <div className="page">
      <h2>Новости</h2>
      {loading ? <div>Вчитување...</div> : (
        <div className="news">
          {items.map(p => (
            <article key={p._id} className="news-card">
              <img src={p.image} alt={p.title} />
              <div className="news-body">
                <h3>{p.title}</h3>
                <p className="muted">{new Date(p.createdAt).toLocaleDateString()}</p>
                <p>{p.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="pagination">
        {Array.from({length: pages}, (_,i)=>(
          <button key={i} className={`pagebtn ${i+1===page?'active':''}`} onClick={()=>setPage(i+1)}>{i+1}</button>
        ))}
      </div>
    </div>
  );
}
