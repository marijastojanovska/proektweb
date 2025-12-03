import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import Modal from './Modal';

export default function LoginModal({ open, onClose }){
  const [email,setEmail] = useState('admin@example.com');
  const [password,setPassword] = useState('Admin123!');
  const dispatch = useDispatch();
  const { status, error } = useSelector(s=>s.auth);

  async function submit(e){
    e.preventDefault();
    const res = await dispatch(login({ email, password }));
    if (res.type.endsWith('fulfilled')) onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Најава" width={420}>
      <form onSubmit={submit} className="wrap" style={{flexDirection:'column', gap:12}}>
        <input required placeholder="Е-маил" value={email} onChange={e=>setEmail(e.target.value)} />
        <input required type="password" placeholder="Лозинка" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" disabled={status==='loading'}>Најави се</button>
        {error && <div style={{color:'#ff6b6b'}}>{error}</div>}
      </form>
    </Modal>
  )
}
