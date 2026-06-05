import DeveloperContact from "./DeveloperContact";

export default function GuestSettings({
  activeGuest,
  showGuestSettings,
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
  guestSmallButtonStyle,
  premiumInputStyle,
  premiumActionButtonRowStyle,
  premiumNeutralButtonStyle,
  premiumInlineInputStyle,
}) {
  return (
    <>
      {showGuestSettings && (
        <div style={premiumPanelStyle}>
          <h3 style={{ marginTop: 0 }}>Vendég beállítások</h3>
          <div style={premiumToggleRowStyle}>
            <span>Email értesítés foglalásokról</span>
            <label>
              <input
                type="checkbox"
                checked={(activeGuest.emailNotifications ?? guestEmailNotifications) !== false}
                onChange={(e) => updateGuestPreference("emailNotifications", e.target.checked)}
              />
              {" "}{(activeGuest.emailNotifications ?? guestEmailNotifications) !== false ? "Bekapcsolva" : "Kikapcsolva"}
            </label>
          </div>

          <div style={premiumToggleRowStyle}>
            <span>PIN kérése belépéskor</span>
            <label>
              <input
                type="checkbox"
                checked={activeGuest.pinLoginEnabled !== false}
                onChange={(e) => updateGuestPreference("pinLoginEnabled", e.target.checked)}
              />
              {" "}{activeGuest.pinLoginEnabled !== false ? "Bekapcsolva" : "Kikapcsolva"}
            </label>
          </div>

          <button onClick={saveActiveGuestSettings} style={{ ...guestSmallButtonStyle, marginTop: "12px" }}>
            Beállítások mentése
          </button>

          <DeveloperContact
            senderType="guest"
            senderName={activeGuest.name}
            senderEmail={activeGuest.email}
            showDeveloperContact={showDeveloperContact}
            setShowDeveloperContact={setShowDeveloperContact}
            developerMessageText={developerMessageText}
            setDeveloperMessageText={setDeveloperMessageText}
            sendDeveloperMessage={sendDeveloperMessage}
            buttonStyle={guestSmallButtonStyle}
            inputStyle={premiumInputStyle}
          />
        </div>
      )}

      <div style={{ ...premiumActionButtonRowStyle, display: showGuestSettings ? "flex" : "none" }}>
        <button
          onClick={() => setShowGuestPhoneEdit(!showGuestPhoneEdit)}
          style={premiumNeutralButtonStyle}
        >
          {showGuestPhoneEdit ? "Telefonszám módosítás bezárása" : "Telefonszám módosítása"}
        </button>

        <button
          onClick={() => setShowGuestPinEdit(!showGuestPinEdit)}
          style={premiumNeutralButtonStyle}
        >
          {showGuestPinEdit ? "PIN módosítás bezárása" : "Saját PIN módosítása"}
        </button>
      </div>

      {showGuestPhoneEdit && (
        <div style={premiumPanelStyle}>
          <h3>Telefonszám módosítása</h3>
          <p style={{ marginTop: 0 }}>Nem kötelező, de a szolgáltató így könnyebben elérhet.</p>
          <input
            placeholder="Telefonszám, pl. +36..."
            value={editableGuestPhone}
            onChange={(e) => setEditableGuestPhone(e.target.value)}
            style={{ ...premiumInlineInputStyle, width: "100%" }}
          />
          <button onClick={updateActiveGuestPhone} style={{ ...premiumNeutralButtonStyle, marginLeft: "8px" }}>
            Telefonszám mentése
          </button>
        </div>
      )}

      {showGuestPinEdit && (
        <div style={premiumPanelStyle}>
          <h3>Saját PIN módosítása</h3>
          <p style={{ marginTop: 0 }}>Itt tudod módosítani a vendég belépési PIN-kódodat.</p>
          <input
            placeholder="Jelenlegi PIN"
            value={guestCurrentPin}
            onChange={(e) => setGuestCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength="4"
            style={premiumInlineInputStyle}
          />
          <input
            placeholder="Új PIN"
            value={guestNewPin}
            onChange={(e) => setGuestNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength="4"
            style={premiumInlineInputStyle}
          />
          <input
            placeholder="Új PIN még egyszer"
            value={guestNewPinAgain}
            onChange={(e) => setGuestNewPinAgain(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength="4"
            style={premiumInlineInputStyle}
          />
          <button onClick={changeGuestPin} style={guestSmallButtonStyle}>PIN módosítása</button>
        </div>
      )}
    </>
  );
}
