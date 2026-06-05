import GuestBookings from "./GuestBookings";
import GuestMessages from "./GuestMessages";

function GuestOverview({
  guest,
  guestOverviewPanel,
  setGuestOverviewPanel,
  guestSeenOverviewCounts,
  getGuestStats,
  hasUnseenOverviewItem,
  markGuestOverviewPanelSeen,
  getGuestActiveBookings,
  getVisibleGuestCancelledBookings,
  getVisibleGuestMessages,
  getVisibleGuestNotifications,
  clearGuestMessages,
  clearGuestNotifications,
  clearGuestCancelledBookings,
  renderGuestBookingCard,
  formatDate,
  formatDateHu,
  premiumPanelStyle,
  premiumListCardStyle,
  dangerButtonStyle,
  overviewNewBadgeStyle,
}) {
  if (!guest) return null;

  function renderGuestOverviewPanel(panel) {
    if (!panel) return null;

    const todayText = formatDate(new Date());
    const activeBookings = getGuestActiveBookings(guest);
    const todayBookings = activeBookings.filter((booking) => booking.date === todayText);
    const cancelledBookings = getVisibleGuestCancelledBookings(guest);
    const guestMessages = getVisibleGuestMessages(guest.id);
    const guestNotifications = getVisibleGuestNotifications(guest);

    const panelBoxStyle = {
      ...premiumPanelStyle,
      marginTop: "14px",
      textAlign: "left",
    };

    const importantNoticeStyle = {
      ...premiumListCardStyle,
      border: "2px solid #9b1c31",
      background: "linear-gradient(180deg, #fff5f6 0%, #ffffff 100%)",
      boxShadow: "0 10px 26px rgba(155,28,49,0.13)",
    };

    if (panel === "todayGuestBookings" || panel === "guestBookings") {
      return (
        <GuestBookings
          panel={panel}
          panelBoxStyle={panelBoxStyle}
          activeBookings={activeBookings}
          todayBookings={todayBookings}
          renderGuestBookingCard={renderGuestBookingCard}
        />
      );
    }

    if (panel === "guestMessages") {
      return (
        <GuestMessages
          panelBoxStyle={panelBoxStyle}
          guestMessages={guestMessages}
          clearGuestMessages={clearGuestMessages}
          dangerButtonStyle={dangerButtonStyle}
          premiumListCardStyle={premiumListCardStyle}
          formatDateHu={formatDateHu}
        />
      );
    }

    if (panel === "guestNotifications") {
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

    if (panel === "guestCancelledBookings") {
      return (
        <GuestBookings
          panel={panel}
          panelBoxStyle={panelBoxStyle}
          cancelledBookings={cancelledBookings}
          clearGuestCancelledBookings={clearGuestCancelledBookings}
          dangerButtonStyle={dangerButtonStyle}
          premiumListCardStyle={premiumListCardStyle}
          formatDateHu={formatDateHu}
        />
      );
    }

    return null;
  }

  const stats = getGuestStats(guest);
  const statCards = [
    { key: "todayGuestBookings", label: "Mai foglalásaim", value: stats.todayBookings },
    { key: "guestBookings", label: "Foglalásaim", value: stats.activeBookings },
    { key: "guestMessages", label: "Üzenetek", value: stats.guestMessages },
    { key: "guestNotifications", label: "Értesítések", value: stats.guestNotifications },
    { key: "guestCancelledBookings", label: "Lemondott időpontok", value: stats.cancelledBookings },
  ];

  return (
    <div style={{ border: "1px solid rgba(127,90,131,0.36)", borderRadius: "22px", padding: "14px", marginTop: "16px", marginBottom: "16px", background: "linear-gradient(180deg, rgba(251,247,252,0.96) 0%, rgba(255,255,255,0.94) 100%)", boxShadow: "0 12px 30px rgba(36,59,85,0.10)" }}>
      <h3 style={{ marginTop: 0, color: "#5b4164" }}>Áttekintés</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
        {statCards.map((card) => {
          const active = guestOverviewPanel === card.key;
          const hasUnseen = hasUnseenOverviewItem(guestSeenOverviewCounts, guest.id, card.key, card.value);

          return (
            <div
              key={card.key}
              style={{
                border: active ? "2px solid #7f5a83" : hasUnseen ? "2px solid #9b1c31" : "1px solid rgba(127,90,131,0.24)",
                borderRadius: "18px",
                background: active
                  ? "linear-gradient(180deg, #fbf2ff 0%, #ffffff 100%)"
                  : hasUnseen
                    ? "linear-gradient(180deg, #fff6f8 0%, #ffffff 100%)"
                    : "rgba(255,255,255,0.88)",
                boxShadow: active
                  ? "0 12px 28px rgba(127,90,131,0.14)"
                  : hasUnseen
                    ? "0 12px 28px rgba(155,28,49,0.16)"
                    : "0 8px 18px rgba(36,59,85,0.07)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => {
                  if (active) {
                    setGuestOverviewPanel("");
                    return;
                  }

                  markGuestOverviewPanelSeen(guest, card.key, card.value);
                  setGuestOverviewPanel(card.key);
                }}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "13px 14px",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <span>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: hasUnseen ? "#9b1c31" : "#555", fontWeight: "800" }}>
                    {card.label}
                    {hasUnseen && <span style={overviewNewBadgeStyle}>Új</span>}
                  </span>
                  <span style={{ display: "block", fontSize: "24px", fontWeight: "800", color: hasUnseen ? "#9b1c31" : "#7f5a83", lineHeight: 1.1 }}>{card.value}</span>
                </span>
                <span style={{ color: active ? "#7f5a83" : hasUnseen ? "#9b1c31" : "#777", fontSize: "18px", fontWeight: "800" }}>
                  {active ? "−" : "+"}
                </span>
              </button>

              {active && (
                <div style={{ padding: "0 12px 12px" }}>
                  {renderGuestOverviewPanel(card.key)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GuestOverview;
