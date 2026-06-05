function ProviderRegister({
  providerName,
  setProviderName,
  providerEmail,
  setProviderEmail,
  providerPhone,
  setProviderPhone,
  providerPin,
  setProviderPin,
  guestCode,
  setGuestCode,
  providerEmailNotifications,
  setProviderEmailNotifications,
  createProvider,
  normalizeGuestCode,
  setMode,
  providerFormCardStyle,
  premiumFormHeaderLineStyle,
  premiumFieldGroupStyle,
  premiumLabelStyle,
  premiumInputStyle,
  premiumToggleRowStyle,
  providerPrimaryActionStyle,
  secondaryGhostButtonStyle,
}) {
  return (
    <div style={providerFormCardStyle}>
      <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#243b55" }}>Szolgáltató regisztráció</h2>
      <div style={premiumFormHeaderLineStyle}></div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>Név</label>
        <input
          style={premiumInputStyle}
          placeholder="Móni Körmös"
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
        />
      </div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>Email</label>
        <input
          style={premiumInputStyle}
          placeholder="moni@email.com"
          value={providerEmail}
          onChange={(e) => setProviderEmail(e.target.value)}
        />
      </div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>Telefonszám <span style={{ fontWeight: 400, color: "#82758d" }}>(nem kötelező)</span></label>
        <input
          style={premiumInputStyle}
          placeholder="+43..."
          value={providerPhone}
          onChange={(e) => setProviderPhone(e.target.value)}
        />
      </div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>PIN</label>
        <input
          style={premiumInputStyle}
          placeholder="4 számjegy"
          value={providerPin}
          onChange={(e) => setProviderPin(e.target.value)}
          maxLength="4"
        />
      </div>

      <div style={premiumFieldGroupStyle}>
        <label style={premiumLabelStyle}>Vendégkód</label>
        <input
          style={premiumInputStyle}
          placeholder="MONI-2026"
          value={guestCode}
          onChange={(e) => setGuestCode(normalizeGuestCode(e.target.value))}
        />
      </div>

      <label style={{ ...premiumToggleRowStyle, borderBottom: "none", justifyContent: "center", marginBottom: "10px" }}>
        <input type="checkbox" checked={providerEmailNotifications} onChange={(e) => setProviderEmailNotifications(e.target.checked)} />
        <span>Kérek email értesítést foglalásokról</span>
      </label>

      <button onClick={createProvider} style={providerPrimaryActionStyle}>
        Regisztráció
      </button>

      <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>
        Vissza
      </button>
    </div>
  );
}

export default ProviderRegister;
