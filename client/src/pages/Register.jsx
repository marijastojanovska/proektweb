import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { status, error } = useSelector(s=>s.auth)

  async function submit(e){
    e.preventDefault()
    const res = await dispatch(register({ name, email, password }))
    if (res.type.endsWith('fulfilled')) nav('/')
  }

  return (
    <div className="page" style={{maxWidth:480}}>
      <h2>Регистрација</h2>
      <form onSubmit={submit} className="wrap" style={{flexDirection:'column', gap:12}}>
        <input required placeholder="Име и презиме" value={name} onChange={e=>setName(e.target.value)} />
        <input required placeholder="Е-маил" value={email} onChange={e=>setEmail(e.target.value)} />
        <input required type="password" placeholder="Лозинка" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" disabled={status==='loading'}>Креирај профил</button>
        {error && <div style={{color:'#ff6b6b'}}>{error}</div>}
      </form>
    </div>
  )
}
