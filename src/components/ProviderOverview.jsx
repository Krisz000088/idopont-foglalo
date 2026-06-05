export default function ProviderOverview({
  provider,
  stats,
  providerOverviewPanel,
  providerSeenOverviewCounts,
  setProviderOverviewPanel,
  markProviderOverviewPanelSeen,
  hasUnseenOverviewItem,
  renderProviderOverviewPanel,
  formatDateHu,
  overviewNewBadgeStyle,
}) {
  const statCards = [
    { key: "todayBookings", label: "Mai foglalások", value: stats.todayBookings },
    { key: "bookedSlots", label: "Foglalt időpontok", value: stats.bookedSlots },
    { key: "freeSlots", label: "Szabad időpontok", value: stats.freeSlots },
    { key: "guestMessages", label: "Üzenetek", value: stats.unreadLikeMessages },
    { key: "providerNotifications", label: "Értesítések", value: stats.providerNotifications },
    { key: "registeredGuests", label: "Regisztrált vendégek", value: stats.registeredGuests },
    { key: "blockedGuests", label: "Tiltott vendégek", value: stats.blockedGuests },
  ];

  return (
    <div style={{ border: "1px solid rgba(117,184,42,0.45)", borderRadius: "22px", padding: "14px", marginTop: "16px", marginBottom: "16px", background: "linear-gradient(180deg, rgba(248,255,243,0.96) 0%, rgba(255,255,255,0.94) 100%)", boxShadow: "0 12px 30px rgba(36,59,85,0.10)" }}>
      <h3 style={{ marginTop: 0, color: "#62546f" }}>Áttekintés</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        {statCards.map((card) => {
          const active = providerOverviewPanel === card.key;
          const hasUnseen = hasUnseenOverviewItem(providerSeenOverviewCounts, provider.id, card.key, card.value);

          return (
            <div
              key={card.key}
              style={{
                border: active ? "2px solid #1b5e20" : hasUnseen ? "2px solid #9b1c31" : "1px solid rgba(117,184,42,0.28)",
                borderRadius: "18px",
                background: active
                  ? "linear-gradient(180deg, #f2ffe9 0%, #ffffff 100%)"
                  : hasUnseen
                    ? "linear-gradient(180deg, #fff6f8 0%, #ffffff 100%)"
                    : "rgba(255,255,255,0.88)",
                boxShadow: active
                  ? "0 12px 28px rgba(27,94,32,0.14)"
                  : hasUnseen
                    ? "0 12px 28px rgba(155,28,49,0.16)"
                    : "0 8px 18px rgba(36,59,85,0.07)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => {
                  if (active) {
                    setProviderOverviewPanel("");
                    return;
                  }

                  markProviderOverviewPanelSeen(provider, card.key, card.value);
                  setProviderOverviewPanel(card.key);
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
                title={active ? "Részletek bezárása" : "Részletek megnyitása"}
              >
                <span>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: hasUnseen ? "#9b1c31" : "#555", fontWeight: "800" }}>
                    {card.label}
                    {hasUnseen && <span style={overviewNewBadgeStyle}>Új</span>}
                  </span>
                  <span style={{ display: "block", fontSize: "24px", fontWeight: "800", color: hasUnseen ? "#9b1c31" : "#1b5e20", lineHeight: 1.1 }}>{card.value}</span>
                </span>
                <span style={{ color: active ? "#1b5e20" : hasUnseen ? "#9b1c31" : "#777", fontSize: "18px", fontWeight: "800" }}>
                  {active ? "−" : "+"}
                </span>
              </button>

              {active && (
                <div style={{ padding: "0 12px 12px" }}>
                  {renderProviderOverviewPanel(provider, card.key)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {stats.nextBooking ? (
        <p style={{ marginBottom: 0 }}>
          Következő foglalás: <b>{stats.nextBooking.guestName || "Vendég"}</b> — {formatDateHu(stats.nextBooking.date)} {stats.nextBooking.time}
        </p>
      ) : (
        <p style={{ marginBottom: 0 }}>Nincs közelgő foglalás.</p>
      )}
    </div>
  );
}
