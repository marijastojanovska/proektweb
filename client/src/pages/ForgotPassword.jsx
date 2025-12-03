import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../store/authSlice'

export default function ForgotPassword(){
  const [email,setEmail] = useState('')
  const dispatch = useDispatch()
  const { message } = useSelector(s=>s.auth)

  async function submit(e){
    e.preventDefault()
    await dispatch(forgotPassword(email))
    setEmail('')
  }

  return (
    <div className="page" style={{maxWidth:520}}>
      <h2>Ресетирање лозинка</h2>
      <p className="muted">Внесете го вашиот е-маил. Ќе добиете линк за ресетирање (важи 30 минути). На продукција се праќа преку Resend API.</p>
      <form onSubmit={submit} className="wrap" style={{flexDirection:'column', gap:12}}>
        <input required placeholder="Е-маил" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn">Испрати линк</button>
      </form>
      {message && <p className="muted" style={{marginTop:12}}>{message}</p>}
    </div>
  )
}
