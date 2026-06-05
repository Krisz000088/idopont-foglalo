function ForgotPassword({
  mode,
  setMode,
  forgotLoginEmail,
  setForgotLoginEmail,
  forgotProviderEmail,
  setForgotProviderEmail,
  forgotGuestEmail,
  setForgotGuestEmail,
  recoverAnyLogin,
  recoverProviderLogin,
  recoverGuestLogin,
  premiumPageStyle,
  guestFormCardStyle,
  providerFormCardStyle,
  premiumFormHeaderLineStyle,
  premiumHintStyle,
  premiumFieldGroupStyle,
  premiumLabelStyle,
  premiumInputStyle,
  guestPrimaryActionStyle,
  providerPrimaryActionStyle,
  secondaryGhostButtonStyle,
}) {
  if (mode === "forgotLogin") {
    return (
      <div style={premiumPageStyle}>
        <div style={guestFormCardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#243b55" }}>Elfelejtett jelszó</h2>
          <div style={premiumFormHeaderLineStyle}></div>
          <p style={premiumHintStyle}>
            Add meg a regisztrált email címed. Ha van hozzá szolgáltatói vagy vendég fiók, emailben elküldjük a belépési adatokat.
          </p>

          <div style={premiumFieldGroupStyle}>
            <label style={premiumLabelStyle}>Email cím</label>
            <input
              placeholder="pelda@email.com"
              value={forgotLoginEmail}
              onChange={(e) => setForgotLoginEmail(e.target.value)}
              style={premiumInputStyle}
            />
          </div>

          <button onClick={recoverAnyLogin} style={guestPrimaryActionStyle}>
            Belépési adatok küldése
          </button>

          <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>
            Vissza
          </button>
        </div>
      </div>
    );
  }

  if (mode === "forgotProvider") {
    return (
      <div style={premiumPageStyle}>
        <div style={providerFormCardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#243b55" }}>Elfelejtett szolgáltatói belépés</h2>
          <div style={premiumFormHeaderLineStyle}></div>
          <p style={premiumHintStyle}>Add meg a regisztrált szolgáltatói email címed. A belépési adatokat emailben küldjük ki.</p>

          <div style={premiumFieldGroupStyle}>
            <label style={premiumLabelStyle}>Szolgáltatói email cím</label>
            <input
              placeholder="szolgaltato@email.com"
              value={forgotProviderEmail}
              onChange={(e) => setForgotProviderEmail(e.target.value)}
              style={premiumInputStyle}
            />
          </div>

          <button onClick={recoverProviderLogin} style={providerPrimaryActionStyle}>
            Belépési adatok küldése
          </button>
          <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>
            Vissza
          </button>
        </div>
      </div>
    );
  }

  if (mode === "forgotGuest") {
    return (
      <div style={premiumPageStyle}>
        <div style={guestFormCardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#5b4164" }}>Elfelejtett vendég belépés</h2>
          <div style={premiumFormHeaderLineStyle}></div>
          <p style={premiumHintStyle}>Add meg a regisztrált vendég email címed. A belépési adatokat emailben küldjük ki.</p>

          <div style={premiumFieldGroupStyle}>
            <label style={premiumLabelStyle}>Vendég email cím</label>
            <input
              placeholder="vendeg@email.com"
              value={forgotGuestEmail}
              onChange={(e) => setForgotGuestEmail(e.target.value)}
              style={premiumInputStyle}
            />
          </div>

          <button onClick={recoverGuestLogin} style={guestPrimaryActionStyle}>
            Belépési adatok küldése
          </button>
          <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>
            Vissza
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default ForgotPassword;
