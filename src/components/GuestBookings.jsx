function GuestBookings({
  panel,
  panelBoxStyle,
  activeBookings = [],
  todayBookings = [],
  cancelledBookings = [],
  renderGuestBookingCard,
  clearGuestCancelledBookings,
  dangerButtonStyle,
  premiumListCardStyle,
  formatDateHu,
}) {
  if (panel === "todayGuestBookings") {
    return (
      <div style={panelBoxStyle}>
        <h4 style={{ marginTop: 0 }}>Mai foglalásaim</h4>
        {todayBookings.length === 0 && <p>Mára nincs aktív foglalásod.</p>}
        {todayBookings.map((booking) => renderGuestBookingCard(booking))}
      </div>
    );
  }

  if (panel === "guestBookings") {
    return (
      <div style={panelBoxStyle}>
        <h4 style={{ marginTop: 0 }}>Foglalásaim</h4>
        {activeBookings.length === 0 && <p>Nincs aktív foglalásod.</p>}
        {activeBookings.map((booking) => renderGuestBookingCard(booking))}
      </div>
    );
  }

  if (panel === "guestCancelledBookings") {
    return (
      <div style={panelBoxStyle}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "4px" }}>Lemondott időpontok</h4>
          {cancelledBookings.length > 0 && (
            <button
              onClick={clearGuestCancelledBookings}
              style={{ ...dangerButtonStyle, width: "100%", maxWidth: "320px", alignSelf: "center", padding: "10px 14px", fontSize: "13px" }}
            >
              Lemondott időpontok törlése
            </button>
          )}
        </div>
        {cancelledBookings.length === 0 && <p>Nincs lemondott időpont.</p>}
        {cancelledBookings.map((booking) => (
          <div key={`${booking.id || booking.slotId}-${booking.date || ""}-${booking.time || ""}`} style={premiumListCardStyle}>
            <b>{booking.providerName}</b>
            <br />
            Lemondott időpont: {formatDateHu(booking.date)} — {booking.day || ""} — {booking.time}
            <br />
            {booking.cancelledByGuest && "Vendég által lemondva."}
            {booking.cancelledByProvider && "Szolgáltató által lemondva."}
            {!booking.cancelledByGuest && !booking.cancelledByProvider && "Lemondott időpont."}
            {booking.providerCancelMessage && (
              <>
                <br />
                Üzenet: {booking.providerCancelMessage}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default GuestBookings;
