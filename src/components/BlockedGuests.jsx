function BlockedGuests({
  provider,
  guests,
  normalizeEmail,
  unblockGuestEmail,
  panelBoxStyle,
  smallCardStyle,
  providerSmallButtonStyle,
}) {
  const blockedEmails = provider?.blockedEmails || [];

  return (
    <div style={panelBoxStyle}>
      <h4 style={{ marginTop: 0 }}>Tiltott vendégek</h4>

      {blockedEmails.length === 0 && <p>Nincs letiltott vendég.</p>}

      {blockedEmails.map((email) => {
        const blockedGuest = guests.find((guest) => normalizeEmail(guest.email) === normalizeEmail(email));

        return (
          <div key={email} style={smallCardStyle}>
            <b>{blockedGuest?.name || email}</b>

            {blockedGuest?.email && (
              <>
                <br />
                Email: {blockedGuest.email}
              </>
            )}

            {blockedGuest?.phone && (
              <>
                <br />
                Telefon: {blockedGuest.phone}
              </>
            )}

            <br />

            <button onClick={() => unblockGuestEmail(email)} style={{ ...providerSmallButtonStyle, marginTop: "8px" }}>
              Tiltás feloldása
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default BlockedGuests;
