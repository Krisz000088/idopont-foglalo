export default function TestAccessData({ testAccessData, copyToClipboard, premiumNeutralButtonStyle }) {
  if (!testAccessData) return null;

  function renderCopyField(label, value) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{label}</div>
        <input
          value={value || ""}
          readOnly
          onClick={(event) => event.target.select()}
          style={{ width: "280px", padding: "6px" }}
        />
        <button onClick={() => copyToClipboard(value)} style={{ ...premiumNeutralButtonStyle, marginLeft: "8px" }}>
          Másolás
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: "2px solid #75b82a", borderRadius: "10px", padding: "14px", marginTop: "18px", backgroundColor: "#f2ffe9" }}>
      <h3>Teszt belépési adatok</h3>
      <p style={{ marginTop: 0 }}>Kattints a mezőbe vagy a Másolás gombra.</p>

      <h4>Példa szolgáltató</h4>
      {renderCopyField("Email", testAccessData.providerEmail)}
      {renderCopyField("PIN", testAccessData.providerPin)}
      {renderCopyField("Vendégkód", testAccessData.providerGuestCode)}

      <h4>Példa vendég</h4>
      {renderCopyField("Email", testAccessData.guestEmail)}
      {renderCopyField("PIN", testAccessData.guestPin)}

      <h4>Ellenőrző adatok</h4>
      {renderCopyField("Letiltott vendég email", testAccessData.blockedEmail)}
      {renderCopyField("Betelt nap", testAccessData.fullDayDate)}
    </div>
  );
}
