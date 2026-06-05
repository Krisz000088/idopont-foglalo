function ProviderNotifications({
  provider,
  providerNotifications,
  clearProviderNotifications,
  getProviderNotificationKey,
  panelBoxStyle,
  smallCardStyle,
  dangerButtonStyle,
}) {
  return (
    <div style={panelBoxStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
        <h4 style={{ margin: 0 }}>Értesítések</h4>
        {providerNotifications.length > 0 && (
          <button
            onClick={clearProviderNotifications}
            style={{
              ...dangerButtonStyle,
              width: "100%",
              maxWidth: "320px",
              alignSelf: "center",
              padding: "10px 14px",
              fontSize: "13px",
            }}
          >
            Értesítések törlése
          </button>
        )}
      </div>
      <p style={{ marginTop: "8px", color: "#6b5d72", fontSize: "13px" }}>
        Itt látszanak a foglalások, módosítások és lemondások.
      </p>
      {providerNotifications.length === 0 && <p>Nincs új értesítés.</p>}
      {providerNotifications.map((notification) => (
        <div key={getProviderNotificationKey(provider.id, notification)} style={smallCardStyle}>
          <b>{notification.text}</b>
          {notification.service && (
            <>
              <br />
              Szolgáltatás: {notification.service}
            </>
          )}
          {notification.note && (
            <>
              <br />
              Megjegyzés / üzenet: {notification.note}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProviderNotifications;
