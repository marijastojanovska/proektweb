import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Products from './pages/Products.jsx'
import News from './pages/News.jsx'
import LoginModal from './components/LoginModal.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import Footer from './components/Footer.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './store/authSlice.js'

function Header({ onOpenLogin }) {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setMobileOpen(false)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="header">
      <div className="inner container header-inner">
        <Link className="brand" to="/" onClick={closeMobile}>
          <span>Tee</span>Shop Pro
        </Link>

        {/* Hamburger за mobile/tablet */}
        <button
          type="button"
          className={`header-burger ${mobileOpen ? 'is-open' : ''}`}
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* NAV – mobile (slide-down) + desktop базно */}
        <nav className={`nav ${mobileOpen ? 'nav-open' : ''}`}>
          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMobile}
            >
              Почетна
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMobile}
            >
              За нас
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMobile}
            >
              Контакт
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMobile}
            >
              Производи
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMobile}
            >
              Новости
            </NavLink>
          </div>

          {/* Акции (login/profile/cart) во mobile view */}
          <div className="nav-actions">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    className="btn secondary"
                    to="/admin/orders"
                    onClick={closeMobile}
                  >
                    Админ
                  </Link>
                )}
                <Link
                  className="btn secondary"
                  to="/profile"
                  onClick={closeMobile}
                >
                  Нарачки
                </Link>
                <button
                  className="btn outline"
                  type="button"
                  onClick={handleLogout}
                >
                  Одјава
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    if (onOpenLogin) onOpenLogin()
                    setMobileOpen(false)
                  }}
                >
                  Најава
                </button>
                <Link
                  className="btn"
                  to="/register"
                  onClick={closeMobile}
                >
                  Регистрација
                </Link>
              </>
            )}
            <Link
              className="btn"
              to="/cart"
              onClick={closeMobile}
            >
              Кошничка
            </Link>
          </div>
        </nav>

        <div className="grow" />

        {/* Desktop actions (се гледаат само на поголеми екрани преку CSS) */}
        <div className="actions header-actions-desktop">
          {user ? (
            <>
              {user.isAdmin && (
                <Link className="btn secondary" to="/admin/orders">
                  Админ
                </Link>
              )}
              <Link className="btn secondary" to="/profile">
                Нарачки
              </Link>
              <button
                className="btn outline"
                type="button"
                onClick={handleLogout}
              >
                Одјава
              </button>
            </>
          ) : (
            <>
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  if (onOpenLogin) onOpenLogin()
                }}
              >
                Најава
              </button>
              <Link className="btn" to="/register">
                Регистрација
              </Link>
            </>
          )}
          <Link className="btn" to="/cart">
            Кошничка
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div>
      <Header onOpenLogin={() => setLoginOpen(true)} />
      <div className="container">
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/news" element={<News />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Footer />
    </div>
  )
}
