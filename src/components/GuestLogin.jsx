function GuestLogin({
  guestLoginEmail,
  setGuestLoginEmail,
  guestLoginPin,
  setGuestLoginPin,
  guestLogin,
  setMode,
  guestFormCardStyle,
  premiumFormHeaderLineStyle,
  premiumFieldGroupStyle,
  premiumLabelStyle,
  premiumInputStyle,
  guestPrimaryActionStyle,
  secondaryGhostButtonStyle,
}) {
  return (
    <div style={guestFormCardStyle}>
      <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#5b4164" }}>Vendég belépés</h2>
      <div style={premiumFormHeaderLineStyle}></div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>Email</label>
        <input
          style={premiumInputStyle}
          placeholder="Email cím"
          value={guestLoginEmail}
          onChange={(e) => setGuestLoginEmail(e.target.value)}
        />
      </div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>PIN <span style={{ fontWeight: 400, color: "#82758d" }}>(ha a fiók kéri)</span></label>
        <input
          style={premiumInputStyle}
          placeholder="4 jegyű PIN vagy üresen, ha kikapcsoltad"
          value={guestLoginPin}
          onChange={(e) => setGuestLoginPin(e.target.value)}
          maxLength="4"
        />
      </div>

      <button onClick={guestLogin} style={guestPrimaryActionStyle}>Belépés</button>
      <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>Vissza</button>
    </div>
  );
}

export default GuestLogin;
