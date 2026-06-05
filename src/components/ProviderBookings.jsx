function ProviderBookings({
  activeProvider,
  providerCalendarDate,
  getSlotsForDate,
  formatDateHu,
  renderPhoneCallLink,
  providerMessageTexts,
  setProviderMessageTexts,
  sendProviderMessageToGuest,
  providerCancelMessages,
  setProviderCancelMessages,
  cancelBookingByProvider,
  premiumListCardStyle,
  premiumInlineInputStyle,
  providerSmallButtonStyle,
  dangerButtonStyle,
}) {
  if (!providerCalendarDate) return null;

  return (
    <>
      <h4>Időpontok ezen a napon: {formatDateHu(providerCalendarDate)}</h4>

      {getSlotsForDate(activeProvider, providerCalendarDate).map((slot) => (
        <div key={slot.id} style={premiumListCardStyle}>
          <b>{slot.time}</b>
          <br />

          {slot.booked ? (
            <>
              Foglalt: {slot.bookedBy}
              {slot.guestEmail && (
                <>
                  <br />
                  Email: {slot.guestEmail}
                </>
              )}
              {slot.guestPhone && (
                <>
                  <br />
                  Telefon: {slot.guestPhone}
                  {renderPhoneCallLink(slot.guestPhone)}
                </>
              )}
              {slot.service && (
                <>
                  <br />
                  Szolgáltatás: {slot.service}
                </>
              )}
              {slot.note && (
                <>
                  <br />
                  Megjegyzés: {slot.note}
                </>
              )}

              <br /><br />

              <input
                placeholder="Üzenet a vendégnek"
                value={providerMessageTexts[slot.id] || ""}
                onChange={(e) =>
                  setProviderMessageTexts({
                    ...providerMessageTexts,
                    [slot.id]: e.target.value,
                  })
                }
                style={{ ...premiumInlineInputStyle, width: "100%" }}
              />

              <br /><br />

              <button onClick={() => sendProviderMessageToGuest(slot)} style={providerSmallButtonStyle}>
                Üzenet küldése a vendégnek
              </button>

              <br /><br />

              <input
                placeholder="Lemondás oka / üzenet a vendégnek - kötelező"
                value={providerCancelMessages[slot.id] || ""}
                onChange={(e) =>
                  setProviderCancelMessages({
                    ...providerCancelMessages,
                    [slot.id]: e.target.value,
                  })
                }
                style={{ ...premiumInlineInputStyle, width: "100%" }}
              />

              <br /><br />

              <button onClick={() => cancelBookingByProvider(slot)} style={dangerButtonStyle}>
                Időpont lemondása szolgáltatóként
              </button>
            </>
          ) : (
            "Szabad"
          )}
        </div>
      ))}
    </>
  );
}

export default ProviderBookings;
