function GuestMessages({
  panelBoxStyle,
  guestMessages,
  clearGuestMessages,
  dangerButtonStyle,
  premiumListCardStyle,
  formatDateHu,
}) {
  return (
    <div style={panelBoxStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <h4 style={{ marginTop: 0, marginBottom: "8px" }}>Üzenetek</h4>
        {guestMessages.length > 0 && (
          <button onClick={clearGuestMessages} style={{ ...dangerButtonStyle, padding: "9px 12px", fontSize: "13px" }}>
            Üzenetek törlése
          </button>
        )}
      </div>
      {guestMessages.length === 0 && <p>Még nincs valódi üzeneted.</p>}
      {guestMessages.map((message) => (
        <div key={message.id} style={premiumListCardStyle}>
          <b>{message.from === "provider" ? `Szolgáltatótól: ${message.fromName}` : `Tőled: ${message.toName} részére`}</b>
          {message.date && message.time && (
            <>
              <br />
              Időpont: {formatDateHu(message.date)} {message.time}
            </>
          )}
          <br />
          Üzenet: {message.text}
        </div>
      ))}
    </div>
  );
}

export default GuestMessages;
