import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice'
import { Link, useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { status, error } = useSelector(s=>s.auth)

  async function submit(e){
    e.preventDefault()
    const res = await dispatch(login({ email, password }))
    if (res.type.endsWith('fulfilled')) nav('/')
  }

  return (
    <div className="page" style={{maxWidth:480}}>
      <h2>Најава</h2>
      <form onSubmit={submit} className="wrap" style={{flexDirection:'column', gap:12}}>
        <input required placeholder="Е-маил" value={email} onChange={e=>setEmail(e.target.value)} />
        <input required type="password" placeholder="Лозинка" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" disabled={status==='loading'}>Најави се</button>
        <div><Link to="/forgot-password" className="muted">Ја заборавив лозинката</Link></div>
        {error && <div style={{color:'#ff6b6b'}}>{error}</div>}
      </form>
    </div>
  )
}
