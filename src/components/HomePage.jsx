export default function HomePage({ setMode, styles }) {
  const {
    providerHomeButtonStyle,
    guestHomeButtonStyle,
    forgotPasswordLinkStyle,
    premiumLandingHintStyle,
  } = styles;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", marginTop: "18px" }}>
        <button onClick={() => setMode("providerLogin")} style={providerHomeButtonStyle}>
          Szolgáltató belépés
        </button>

        <button onClick={() => setMode("createProvider")} style={providerHomeButtonStyle}>
          Szolgáltató regisztráció
        </button>

        <div style={{ height: "8px" }} />

        <button onClick={() => setMode("guestLogin")} style={guestHomeButtonStyle}>
          Vendég belépés
        </button>

        <button onClick={() => setMode("createGuest")} style={guestHomeButtonStyle}>
          Vendég regisztráció
        </button>

        <button onClick={() => setMode("forgotLogin")} style={forgotPasswordLinkStyle}>
          Elfelejtett jelszó
        </button>
      </div>

      <div style={premiumLandingHintStyle}>
        Gyors, letisztult időpontfoglalás szolgáltatóknak és vendégeknek.
        <br />
        Regisztrálj, adj meg szabad időpontokat, a vendégek pedig pár kattintással foglalhatnak.
      </div>
    </>
  );
}
