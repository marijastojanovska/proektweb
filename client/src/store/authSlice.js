import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

const savedUser = localStorage.getItem('user')
const savedToken = localStorage.getItem('token')

export const login = createAsyncThunk('auth/login', async (data) => {
  const res = await api.post('/auth/login', data)
  return res.data
})

export const register = createAsyncThunk('auth/register', async (data) => {
  const res = await api.post('/auth/register', data)
  return res.data
})

export const fetchMe = createAsyncThunk('auth/me', async () => {
  const res = await api.get('/auth/me')
  return { user: res.data }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email) => {
  const res = await api.post('/auth/forgot-password', { email })
  return res.data
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload) => {
  const res = await api.post('/auth/reset-password', payload)
  return res.data
})

const slice = createSlice({
  name: 'auth',
  initialState: {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    status: 'idle',
    error: null,
    message: null
  },
  reducers: {
    logout(state){
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, (s)=>{ s.status='loading'; s.error=null; s.message=null })
      .addCase(login.fulfilled, (s, a)=>{
        s.status='succeeded'; s.error=null
        s.token = a.payload.token; s.user = a.payload.user
        localStorage.setItem('token', s.token)
        localStorage.setItem('user', JSON.stringify(s.user))
      })
      .addCase(login.rejected, (s, a)=>{ s.status='failed'; s.error=a.error.message })
      .addCase(register.fulfilled, (s, a)=>{
        s.status='succeeded'; s.error=null
        s.token = a.payload.token; s.user = a.payload.user
        localStorage.setItem('token', s.token)
        localStorage.setItem('user', JSON.stringify(s.user))
      })
      .addCase(fetchMe.fulfilled, (s, a)=>{
        if (a.payload?.user) {
          s.user = a.payload.user
          localStorage.setItem('user', JSON.stringify(s.user))
        }
      })
      .addCase(forgotPassword.fulfilled, (s, a)=>{
        s.message = a.payload?.message || 'Проверете го вашиот е-маил.'
      })
      .addCase(resetPassword.fulfilled, (s, a)=>{
        s.message = a.payload?.message || 'Лозинката е ажурирана.'
      })
  }
})

export const { logout } = slice.actions
export default slice.reducer
