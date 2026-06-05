function GuestNotifications({
  panelBoxStyle,
  guestNotifications,
  clearGuestNotifications,
  dangerButtonStyle,
  premiumListCardStyle,
}) {
  const importantNoticeStyle = {
    ...premiumListCardStyle,
    border: "2px solid #9b1c31",
    background: "linear-gradient(180deg, #fff5f6 0%, #ffffff 100%)",
    boxShadow: "0 10px 26px rgba(155,28,49,0.13)",
  };

  return (
    <div style={panelBoxStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
        <h4 style={{ marginTop: 0, marginBottom: "4px" }}>Értesítések</h4>
        {guestNotifications.length > 0 && (
          <button
            onClick={clearGuestNotifications}
            style={{ ...dangerButtonStyle, width: "100%", maxWidth: "320px", alignSelf: "center", padding: "10px 14px", fontSize: "13px" }}
          >
            Értesítések törlése
          </button>
        )}
      </div>

      {guestNotifications.length === 0 && <p>Nincs új értesítésed.</p>}

      {guestNotifications.map((notification) => {
        const important = ["cancel", "provider_cancel"].includes(notification.type);

        return (
          <div key={notification.id} style={important ? importantNoticeStyle : premiumListCardStyle}>
            {important && <b>Fontos lemondási értesítés</b>}
            {important && <br />}
            <b>{notification.text}</b>
            {notification.message && (
              <>
                <br />
                Üzenet: {notification.message}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GuestNotifications;
