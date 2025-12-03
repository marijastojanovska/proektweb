import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../store/authSlice'

export default function ResetPassword(){
  const params = new URLSearchParams(location.search)
  const token = params.get('token') || ''
  const email = params.get('email') || ''
  const dispatch = useDispatch()
  const { message } = useSelector(s=>s.auth)

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  async function submit(e){
    e.preventDefault()
    if (password !== password2) { alert('Лозинките не се совпаѓаат'); return }
    await dispatch(resetPassword({ email, token, newPassword: password }))
  }

  return (
    <div className="page" style={{maxWidth:520}}>
      <h2>Нова лозинка</h2>
      <form onSubmit={submit} className="wrap" style={{flexDirection:'column', gap:12}}>
        <input type="password" placeholder="Нова лозинка" value={password} onChange={e=>setPassword(e.target.value)} required />
        <input type="password" placeholder="Потврди лозинка" value={password2} onChange={e=>setPassword2(e.target.value)} required />
        <button className="btn">Зачувај</button>
      </form>
      {message && <p className="muted" style={{marginTop:12}}>{message}</p>}
    </div>
  )
}
