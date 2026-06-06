import GuestSettings from "./GuestSettings";

function GuestDashboard({
  activeGuest,
  showGuestSettings,
  setShowGuestSettings,
  premiumPageStyle,
  premiumHeaderTextStyle,
  guestSmallButtonStyle,
  guestEmailNotifications,
  updateGuestPreference,
  saveActiveGuestSettings,
  showDeveloperContact,
  setShowDeveloperContact,
  developerMessageText,
  setDeveloperMessageText,
  sendDeveloperMessage,
  showGuestPhoneEdit,
  setShowGuestPhoneEdit,
  editableGuestPhone,
  setEditableGuestPhone,
  updateActiveGuestPhone,
  showGuestPinEdit,
  setShowGuestPinEdit,
  guestCurrentPin,
  setGuestCurrentPin,
  guestNewPin,
  setGuestNewPin,
  guestNewPinAgain,
  setGuestNewPinAgain,
  changeGuestPin,
  premiumPanelStyle,
  premiumToggleRowStyle,
  premiumInputStyle,
  premiumActionButtonRowStyle,
  premiumNeutralButtonStyle,
  premiumInlineInputStyle,
  showGuestProviderAdd,
  setShowGuestProviderAdd,
  guestProviderCode,
  setGuestProviderCode,
  addProviderToGuest,
  activeGuestProviders,
  providers,
  isGuestBlockedByProvider,
  setSelectedProvider,
  setSelectedSlot,
  setSelectedCalendarDate,
  setSelectedService,
  selectedProvider,
  selectedService,
  setSelectedService,
  premiumSelectStyle,
  renderCalendar,
  selectedCalendarDate,
  formatDateHu,
  getAvailableSlotsForDate,
  selectedSlot,
  guestNote,
  setGuestNote,
  bookSlot,
  selectedExistingBooking,
  renderGuestStats,
  secondaryGhostButtonStyle,
  deleteGuestAccount,
  dangerButtonStyle
}) {
  return (
    <div style={premiumPageStyle}>
      <h2 style={{ marginTop: 0, color: "#5b4164" }}>Belépve: {activeGuest.name}</h2>
      {activeGuest.email && <p style={premiumHeaderTextStyle}>Email: <b>{activeGuest.email}</b></p>}
      {activeGuest.phone && <p style={premiumHeaderTextStyle}>Telefonszám: <b>{activeGuest.phone}</b></p>}

      <button onClick={() => setShowGuestSettings(!showGuestSettings)} style={{ ...guestSmallButtonStyle, margin: "12px 0" }}>
        {showGuestSettings ? "Beállítások bezárása" : "Beállítások"}
      </button>

      <GuestSettings
        activeGuest={activeGuest}
        showGuestSettings={showGuestSettings}
        guestEmailNotifications={guestEmailNotifications}
        updateGuestPreference={updateGuestPreference}
        saveActiveGuestSettings={saveActiveGuestSettings}
        showDeveloperContact={showDeveloperContact}
        setShowDeveloperContact={setShowDeveloperContact}
        developerMessageText={developerMessageText}
        setDeveloperMessageText={setDeveloperMessageText}
        sendDeveloperMessage={sendDeveloperMessage}
        showGuestPhoneEdit={showGuestPhoneEdit}
        setShowGuestPhoneEdit={setShowGuestPhoneEdit}
        editableGuestPhone={editableGuestPhone}
        setEditableGuestPhone={setEditableGuestPhone}
        updateActiveGuestPhone={updateActiveGuestPhone}
        showGuestPinEdit={showGuestPinEdit}
        setShowGuestPinEdit={setShowGuestPinEdit}
        guestCurrentPin={guestCurrentPin}
        setGuestCurrentPin={setGuestCurrentPin}
        guestNewPin={guestNewPin}
        setGuestNewPin={setGuestNewPin}
        guestNewPinAgain={guestNewPinAgain}
        setGuestNewPinAgain={setGuestNewPinAgain}
        changeGuestPin={changeGuestPin}
        premiumPanelStyle={premiumPanelStyle}
        premiumToggleRowStyle={premiumToggleRowStyle}
        guestSmallButtonStyle={guestSmallButtonStyle}
        premiumInputStyle={premiumInputStyle}
        premiumActionButtonRowStyle={premiumActionButtonRowStyle}
        premiumNeutralButtonStyle={premiumNeutralButtonStyle}
        premiumInlineInputStyle={premiumInlineInputStyle}
      />

      <div style={premiumPanelStyle}>
        <button
          onClick={() => setShowGuestProviderAdd(!showGuestProviderAdd)}
          style={premiumNeutralButtonStyle}
        >
          {showGuestProviderAdd ? "Szolgáltató hozzáadás bezárása" : "Szolgáltató hozzáadása vendégkóddal"}
        </button>

        {showGuestProviderAdd && (
          <div style={{ marginTop: "12px" }}>
            <input
              placeholder="Szolgáltató vendégkódja"
              value={guestProviderCode}
              onChange={(e) => setGuestProviderCode(e.target.value.toUpperCase())}
              style={premiumInlineInputStyle}
            />

            <button onClick={addProviderToGuest} style={{ ...guestSmallButtonStyle, marginLeft: "10px" }}>
              Hozzáadás
            </button>
          </div>
        )}
      </div>

      <h3>Szolgáltatóim</h3>

      {activeGuestProviders.map((provider) => (
        <button
          key={provider.id}
          onClick={() => {
            const fresh = providers.find((p) => p.id === provider.id);

            if (isGuestBlockedByProvider(fresh, activeGuest.email)) {
              alert("Ez a szolgáltató letiltott téged, ezért nem tudod megnyitni az időpontjait.");
              setSelectedProvider(null);
              setSelectedSlot(null);
              setSelectedCalendarDate("");
              setSelectedService("");
              return;
            }

            setSelectedProvider(fresh);
            setSelectedSlot(null);
            setSelectedCalendarDate("");
            setSelectedService("");
          }}
          style={{ ...guestSmallButtonStyle, display: "block", margin: "8px auto" }}
        >
          {provider.name}
        </button>
      ))}

      {selectedProvider && (
        <>
          <h3>{selectedProvider.name} szabad időpontjai</h3>

          {(selectedProvider.services || []).length > 0 && (
            <>
              <p>Válassz szolgáltatást:</p>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} style={premiumSelectStyle}>
                <option value="">Válassz szolgáltatást</option>
                {(selectedProvider.services || []).map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </>
          )}

          <h4>Válassz napot</h4>
          {renderCalendar(selectedProvider, selectedCalendarDate, (date) => {
            setSelectedCalendarDate(date);
            setSelectedSlot(null);
          })}

          {selectedCalendarDate && (
            <>
              <h4>Szabad időpontok ezen a napon: {formatDateHu(selectedCalendarDate)}</h4>

              {getAvailableSlotsForDate(selectedProvider, selectedCalendarDate).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    ...guestSmallButtonStyle,
                    display: "block",
                    margin: "8px auto",
                    opacity: selectedSlot?.id === slot.id ? 1 : 0.86,
                    transform: selectedSlot?.id === slot.id ? "scale(1.08)" : "none",
                    background: selectedSlot?.id === slot.id
                      ? "linear-gradient(135deg, #b8860b 0%, #ffcf5c 45%, #7f5a83 100%)"
                      : guestSmallButtonStyle.background,
                    color: selectedSlot?.id === slot.id ? "#ffffff" : guestSmallButtonStyle.color,
                    border: selectedSlot?.id === slot.id ? "3px solid #ffe29a" : guestSmallButtonStyle.border,
                    boxShadow: selectedSlot?.id === slot.id
                      ? "0 10px 24px rgba(184, 134, 11, 0.34)"
                      : guestSmallButtonStyle.boxShadow,
                  }}
                >
                  {selectedSlot?.id === slot.id ? `✓ ${slot.time}` : slot.time}
                </button>
              ))}
            </>
          )}

          <h3>
            Kiválasztott időpont:{" "}
            {selectedSlot ? `${formatDateHu(selectedSlot.date)} ${selectedSlot.time}` : "-"}
          </h3>

          {selectedSlot && (
            <>
              <textarea
                placeholder="Megjegyzés a szolgáltatónak. Nem kötelező."
                value={guestNote}
                onChange={(e) => setGuestNote(e.target.value)}
                style={{ ...premiumInputStyle, minHeight: "90px" }}
              />
              <br /><br />
            </>
          )}

          <button onClick={bookSlot} style={guestSmallButtonStyle}>
            {selectedExistingBooking ? "Időpont módosítása" : "Időpont lefoglalása"}
          </button>
        </>
      )}

      {renderGuestStats(activeGuest)}


      <br />
      <button onClick={() => setActiveGuest(null)} style={secondaryGhostButtonStyle}>Vendég kijelentkezés</button>

      <br /><br />

      <button onClick={deleteGuestAccount} style={{ ...dangerButtonStyle, display: showGuestSettings ? "inline-block" : "none" }}>
        Vendég fiók törlése
      </button>
    </div>
  );
}

export default GuestDashboard;
