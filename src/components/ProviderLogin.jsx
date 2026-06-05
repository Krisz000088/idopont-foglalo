function ProviderLogin({
  loginUsername,
  setLoginUsername,
  loginPin,
  setLoginPin,
  providerLogin,
  onBack,
  styles,
}) {
  const {
    providerFormCardStyle,
    premiumFormHeaderLineStyle,
    premiumFieldGroupStyle,
    premiumLabelStyle,
    premiumInputStyle,
    providerPrimaryActionStyle,
    secondaryGhostButtonStyle,
  } = styles;

  return (
    <div style={providerFormCardStyle}>
      <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#243b55" }}>Szolgáltató belépés</h2>
      <div style={premiumFormHeaderLineStyle}></div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>Email</label>
        <input
          style={premiumInputStyle}
          placeholder="Email cím"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
      </div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>
          PIN <span style={{ fontWeight: 400, color: "#82758d" }}>(ha a fiók kéri)</span>
        </label>
        <input
          style={premiumInputStyle}
          placeholder="4 jegyű PIN vagy üresen, ha kikapcsoltad"
          value={loginPin}
          onChange={(e) => setLoginPin(e.target.value)}
          maxLength="4"
        />
      </div>

      <button onClick={providerLogin} style={providerPrimaryActionStyle}>
        Belépés
      </button>
      <button onClick={onBack} style={secondaryGhostButtonStyle}>
        Vissza
      </button>
    </div>
  );
}

export default ProviderLogin;
