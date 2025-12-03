import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';

export default function AdminProducts(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);

  async function load(){
    setLoading(true);
    const res = await api.get('/products');
    setItems(Array.isArray(res.data) ? res.data : (res.data.products || []));
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  function emptyProduct(){
    return { name:'', description:'', image:'', price:0, countInStock:0, sizes:[], colors:[], brand:'TEEPRO', category:'t-shirt', featured:false };
  }

  async function save(p){
    if (p._id){
      await api.put(`/products/${p._id}`, p);
    } else {
      await api.post('/products', p);
    }
    setEdit(null);
    load();
  }

  async function remove(id){
    if (!confirm('Да се избрише производот?')) return;
    await api.delete(`/products/${id}`);
    load();
  }

  return (
    <div className="container">
      <h2>Админ — Производи</h2>
      <div style={{margin:'12px 0'}}>
        <button className="btn" onClick={()=> setEdit(emptyProduct())}>Нов производ</button>
      </div>

      {loading ? <p>Се вчитува...</p> : (
        <table className="table">
          <thead><tr><th>Слика</th><th>Име</th><th>Цена</th><th>Залиха</th><th>Категорија</th><th></th></tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id}>
                <td><img src={p.image} alt={p.name} style={{width:60,height:60,objectFit:'cover',borderRadius:8}}/></td>
                <td>{p.name}</td>
                <td>${(p.price||0).toFixed(2)}</td>
                <td>{p.countInStock}</td>
                <td>{p.category}</td>
                <td style={{textAlign:'right'}}>
                  <button className="btn outline" onClick={()=> setEdit(p)}>Уреди</button>
                  <button className="btn secondary" onClick={()=> remove(p._id)} style={{marginLeft:8}}>Избриши</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal open={!!edit} onClose={()=> setEdit(null)} title={edit && edit._id ? 'Уреди производ' : 'Нов производ'} width={800}>
        {edit && (
          <form onSubmit={e=>{ e.preventDefault(); save(edit); }} className="form">
            <label>Име<input value={edit.name} onChange={e=> setEdit({...edit, name:e.target.value})} required/></label>
            <label>Опис<textarea value={edit.description} onChange={e=> setEdit({...edit, description:e.target.value})} required/></label>
            <label>Слика URL<input value={edit.image} onChange={e=> setEdit({...edit, image:e.target.value})} required/></label>
            <div className="row">
              <label>Цена<input type="number" step="0.01" value={edit.price} onChange={e=> setEdit({...edit, price: parseFloat(e.target.value||0) })}/></label>
              <label>Залиха<input type="number" value={edit.countInStock} onChange={e=> setEdit({...edit, countInStock: parseInt(e.target.value||0) })}/></label>
            </div>
            <div className="row">
              <label>Големини (запирка)<input value={edit.sizes?.join(',')||''} onChange={e=> setEdit({...edit, sizes: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })}/></label>
              <label>Боја (запирка)<input value={edit.colors?.join(',')||''} onChange={e=> setEdit({...edit, colors: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })}/></label>
            </div>
            <div className="row">
              <label>Бренд<input value={edit.brand||''} onChange={e=> setEdit({...edit, brand: e.target.value })}/></label>
              <label>Категорија<select value={edit.category} onChange={e=> setEdit({...edit, category: e.target.value})}>
                <option value="t-shirt">Маици</option>
                <option value="sneakers">Патики</option>
                <option value="shorts">Шорцеви</option>
              </select></label>
            </div>
            <label style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={!!edit.featured} onChange={e=> setEdit({...edit, featured: e.target.checked})}/>
              Featured
            </label>
            <div style={{marginTop:12, display:'flex', gap:8, justifyContent:'flex-end'}}>
              <button type="button" className="btn secondary" onClick={()=> setEdit(null)}>Откажи</button>
              <button className="btn" type="submit">Сочувај</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
