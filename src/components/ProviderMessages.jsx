function ProviderMessages({
  provider,
  guestMessages,
  guests,
  providerMessageTexts,
  setProviderMessageTexts,
  clearProviderGuestMessages,
  sendProviderDirectMessageToGuest,
  getProviderMessageKey,
  idsEqual,
  formatDateHu,
  panelBoxStyle,
  smallCardStyle,
  dangerButtonStyle,
  providerSmallButtonStyle,
  premiumInlineInputStyle,
}) {
  return (
    <div style={panelBoxStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
        <h4 style={{ margin: 0 }}>Üzenetek</h4>
        {guestMessages.length > 0 && (
          <button onClick={clearProviderGuestMessages} style={{ ...dangerButtonStyle, padding: "9px 12px", fontSize: "13px" }}>
            Üzenetek törlése
          </button>
        )}
      </div>
      <p style={{ marginTop: "8px", color: "#6b5d72", fontSize: "13px" }}>
        Itt csak a vendégek valódi, kézzel írt üzenetei jelennek meg. Lemondás és módosítás az Értesítések alatt lesz.
      </p>
      {guestMessages.length === 0 && <p>Nincs vendégtől érkezett üzenet.</p>}
      {guestMessages.map((message) => {
        const replyGuest = guests.find((guest) => idsEqual(guest.id, message.guestId)) || {
          id: message.guestId,
          name: message.guestName || message.fromName || "Vendég",
          email: message.guestEmail || "",
        };
        const replyKey = `reply-${message.id}`;

        return (
          <div key={getProviderMessageKey(provider.id, message)} style={smallCardStyle}>
            <b>{message.fromName || "Vendég"}</b>
            {message.date && message.time && <> — {formatDateHu(message.date)} {message.time}</>}
            <br />
            Üzenet: {message.text}

            <div style={{ marginTop: "10px" }}>
              <textarea
                placeholder={`Válasz ${replyGuest.name || "vendég"}nak...`}
                value={providerMessageTexts[replyKey] || ""}
                onChange={(e) => setProviderMessageTexts({ ...providerMessageTexts, [replyKey]: e.target.value })}
                style={{ ...premiumInlineInputStyle, width: "100%", minHeight: "70px", resize: "vertical" }}
              />
              <br />
              <button onClick={() => sendProviderDirectMessageToGuest(replyGuest, replyKey, message)} style={providerSmallButtonStyle}>
                Válasz küldése
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProviderMessages;
