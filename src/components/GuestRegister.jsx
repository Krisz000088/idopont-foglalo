export default function GuestRegister({
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  guestPin,
  setGuestPin,
  guestEmailNotifications,
  setGuestEmailNotifications,
  createGuest,
  setMode,
  guestFormCardStyle,
  premiumFormHeaderLineStyle,
  premiumFieldGroupStyle,
  premiumLabelStyle,
  premiumInputStyle,
  premiumToggleRowStyle,
  guestPrimaryActionStyle,
  secondaryGhostButtonStyle
}) {
  return (
    <div style={guestFormCardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#5b4164" }}>Vendég regisztráció</h2>
              <div style={premiumFormHeaderLineStyle}></div>
    
              <div style={premiumFieldGroupStyle}>
                <label style={premiumLabelStyle}>Név</label>
                <input
                  style={premiumInputStyle}
                  placeholder="Kovács Anna"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
    
              <div style={premiumFieldGroupStyle}>
                <label style={premiumLabelStyle}>Email</label>
                <input
                  style={premiumInputStyle}
                  placeholder="anna@email.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
    
              <div style={premiumFieldGroupStyle}>
                <label style={premiumLabelStyle}>Telefon <span style={{ fontWeight: 400, color: "#82758d" }}>(nem kötelező)</span></label>
                <input
                  style={premiumInputStyle}
                  placeholder="+36..."
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>
    
              <div style={premiumFieldGroupStyle}>
                <label style={premiumLabelStyle}>PIN</label>
                <input
                  style={premiumInputStyle}
                  placeholder="4 számjegy"
                  value={guestPin}
                  onChange={(e) => setGuestPin(e.target.value)}
                  maxLength="4"
                />
              </div>
    
              <label style={{ ...premiumToggleRowStyle, borderBottom: "none", justifyContent: "center", marginBottom: "10px" }}>
                <input type="checkbox" checked={guestEmailNotifications} onChange={(e) => setGuestEmailNotifications(e.target.checked)} />
                <span>Kérek email értesítést a foglalásaimról</span>
              </label>
    
              <button onClick={createGuest} style={guestPrimaryActionStyle}>
                Vendég létrehozása
              </button>
    
              <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>
                Vissza
              </button>
            </div>
  );
}
