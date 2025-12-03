export default function Footer(){
  return (
    <div className="footer">
      <div className="inner container">
        <div>
          <h3 style={{marginTop:0}}>TeeShop Pro</h3>
          <p className="muted">Квалитетни маици со модерен дизајн. Изработено со љубов, испорачано со стил.</p>
        </div>
        <div>
          <h4>Навигација</h4>
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            <li><a href="/">Почетна</a></li>
            <li><a href="/about">За нас</a></li>
            <li><a href="/contact">Контакт</a></li>
          </ul>
        </div>
        <div>
          <h4>Контакт</h4>
          <div className="muted">info@teeshoppro.com</div>
          <div className="muted">+389 70 000 000</div>
        </div>
      </div>
    </div>
  )
}
