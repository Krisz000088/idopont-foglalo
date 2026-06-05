function RegisteredGuestsPanel({
  provider,
  selectedProviderGuestId,
  setSelectedProviderGuestId,
  providerMessageTexts,
  setProviderMessageTexts,
  getRegisteredGuestsForProvider,
  getProviderGuestBookingSummary,
  isGuestBlockedByProvider,
  renderPhoneCallLink,
  sendProviderDirectMessageToGuest,
  blockGuestEmail,
  unblockGuestEmail,
  formatDateHu,
  premiumPanelStyle,
  premiumInlineInputStyle,
  providerSmallButtonStyle,
}) {
  const registeredGuests = getRegisteredGuestsForProvider(provider.id);
  const selectedGuest = registeredGuests.find((guest) => guest.id === selectedProviderGuestId);
  const selectedGuestBlocked = selectedGuest
    ? isGuestBlockedByProvider(provider, selectedGuest.email)
    : false;
  const selectedGuestBookingSummary = selectedGuest
    ? getProviderGuestBookingSummary(provider.id, selectedGuest)
    : { lastBooking: null, futureBookings: [] };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "12px", marginTop: "16px", marginBottom: "16px" }}>
      <h3>Regisztrált vendégeim</h3>
      <p>Ennyi vendég adta hozzá a vendégkódodat: <b>{registeredGuests.length}</b></p>

      {registeredGuests.length === 0 && <p>Még nincs olyan vendég, aki hozzáadta volna a vendégkódodat.</p>}

      {registeredGuests.map((guest) => {
        const guestBlocked = isGuestBlockedByProvider(provider, guest.email);

        return (
          <button
            key={guest.id}
            onClick={() => setSelectedProviderGuestId(selectedProviderGuestId === guest.id ? null : guest.id)}
            style={{
              display: "block",
              width: "100%",
              maxWidth: "420px",
              margin: "6px auto",
              padding: "8px",
              borderRadius: "8px",
              border: selectedProviderGuestId === guest.id
                ? guestBlocked ? "2px solid #b00020" : "2px solid #75b82a"
                : guestBlocked ? "1px solid #d00000" : "1px solid #ccc",
              backgroundColor: selectedProviderGuestId === guest.id
                ? guestBlocked ? "#fff0f0" : "#f2ffe9"
                : guestBlocked ? "#fff7f7" : "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {guest.name || "Névtelen vendég"}
            {guestBlocked && <span style={{ color: "#b00020", marginLeft: "10px" }}>tiltva</span>}
          </button>
        );
      })}

      {selectedGuest && (
        <div
          style={{
            border: selectedGuestBlocked ? "1px solid #d00000" : "1px solid #75b82a",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "10px",
            backgroundColor: selectedGuestBlocked ? "#fff7f7" : "#f8fff3",
          }}
        >
          <h4>{selectedGuest.name || "Vendég adatai"}</h4>
          <p>Állapot: <b style={{ color: selectedGuestBlocked ? "#b00020" : "#1b5e20" }}>{selectedGuestBlocked ? "tiltott" : "aktív"}</b></p>
          <p>Email: <b>{selectedGuest.email || "nincs megadva"}</b></p>
          <p>Telefon: <b>{selectedGuest.phone || "nincs megadva"}</b>{selectedGuest.phone && renderPhoneCallLink(selectedGuest.phone)}</p>

          <div style={{ ...premiumPanelStyle, marginTop: "12px", background: "white" }}>
            <h4 style={{ marginTop: 0 }}>Üzenet írása {selectedGuest.name || "vendég"}nak</h4>
            <textarea
              placeholder="Írd ide az üzenetet..."
              value={providerMessageTexts[`registered-${selectedGuest.id}`] || ""}
              onChange={(e) => setProviderMessageTexts({ ...providerMessageTexts, [`registered-${selectedGuest.id}`]: e.target.value })}
              style={{ ...premiumInlineInputStyle, width: "100%", minHeight: "80px", resize: "vertical" }}
            />
            <br />
            <button onClick={() => sendProviderDirectMessageToGuest(selectedGuest, `registered-${selectedGuest.id}`)} style={providerSmallButtonStyle}>
              Üzenet küldése {selectedGuest.name || "vendég"}nak
            </button>
          </div>

          <div
            style={{
              border: "1px solid #d6eac8",
              borderRadius: "10px",
              padding: "10px",
              marginTop: "12px",
              backgroundColor: "white",
              textAlign: "left",
              maxWidth: "520px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: "8px", textAlign: "center" }}>Foglalási előzmények</h4>

            {selectedGuestBookingSummary.lastBooking ? (
              <p style={{ margin: "6px 0" }}>
                Legutolsó foglalás: <b>{formatDateHu(selectedGuestBookingSummary.lastBooking.date)} {selectedGuestBookingSummary.lastBooking.time}</b>
                {selectedGuestBookingSummary.lastBooking.service && (
                  <span> — {selectedGuestBookingSummary.lastBooking.service}</span>
                )}
              </p>
            ) : (
              <p style={{ margin: "6px 0", color: "#777" }}>Még nincs korábbi foglalása ennél a szolgáltatónál.</p>
            )}

            {selectedGuestBookingSummary.futureBookings.length > 0 ? (
              <div style={{ marginTop: "10px" }}>
                <p style={{ margin: "6px 0", fontWeight: "bold", color: "#1b5e20" }}>Aktív jövőbeli foglalás:</p>
                {selectedGuestBookingSummary.futureBookings.map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      border: "1px solid #75b82a",
                      borderRadius: "8px",
                      padding: "8px",
                      marginTop: "6px",
                      backgroundColor: "#f2ffe9",
                      color: "#1b5e20",
                      fontWeight: "bold",
                    }}
                  >
                    {formatDateHu(booking.date)} {booking.time}
                    {booking.service && <span> — {booking.service}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: "10px 0 0", color: "#777" }}>Nincs előre aktív foglalása.</p>
            )}
          </div>

          {selectedGuest.email && !selectedGuestBlocked && (
            <button
              onClick={() => blockGuestEmail(selectedGuest.email)}
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #b00020",
                backgroundColor: "#d00000",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {selectedGuest.name || "Vendég"} tiltása
            </button>
          )}

          {selectedGuest.email && selectedGuestBlocked && (
            <button
              onClick={() => unblockGuestEmail(selectedGuest.email)}
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #2e7d32",
                backgroundColor: "#75b82a",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {selectedGuest.name || "Vendég"} tiltásának feloldása
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default RegisteredGuestsPanel;
