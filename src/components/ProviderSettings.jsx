import DeveloperContact from "./DeveloperContact";

export default function ProviderSettings({
  showProviderSettings,
  premiumPanelStyle,
  premiumToggleRowStyle,
  activeProvider,
  providerEmailNotifications,
  updateProviderPreference,
  premiumLabelStyle,
  premiumSelectStyle,
  premiumHintStyle,
  saveActiveProviderSettings,
  providerSmallButtonStyle,
  showDeveloperContact,
  setShowDeveloperContact,
  developerMessageText,
  setDeveloperMessageText,
  sendDeveloperMessage,
  premiumInputStyle,
  deleteProviderAccount,
  dangerButtonStyle,
  premiumSettingsPanelStyle,
  showProviderGuestCodeEdit,
  setShowProviderGuestCodeEdit,
  premiumNeutralButtonStyle,
  newGuestCode,
  setNewGuestCode,
  normalizeGuestCode,
  premiumInlineInputStyle,
  changeProviderGuestCode,
  showProviderPinEdit,
  setShowProviderPinEdit,
  providerCurrentPin,
  setProviderCurrentPin,
  providerNewPin,
  setProviderNewPin,
  providerNewPinAgain,
  setProviderNewPinAgain,
  changeProviderPin,
}) {
  return (
    <>
{showProviderSettings && (
                <div style={premiumPanelStyle}>
                  <h3 style={{ marginTop: 0 }}>Szolgáltatói beállítások</h3>
                  <div style={premiumToggleRowStyle}>
                    <span>Email értesítés foglalásokról</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={(activeProvider.emailNotifications ?? providerEmailNotifications) !== false}
                        onChange={(e) => updateProviderPreference("emailNotifications", e.target.checked)}
                      />
                      {" "}{(activeProvider.emailNotifications ?? providerEmailNotifications) !== false ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  <div style={premiumToggleRowStyle}>
                    <span>PIN kérése belépéskor</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={activeProvider.pinLoginEnabled !== false}
                        onChange={(e) => updateProviderPreference("pinLoginEnabled", e.target.checked)}
                      />
                      {" "}{activeProvider.pinLoginEnabled !== false ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  <div style={premiumToggleRowStyle}>
                    <span>Időpont-generálási figyelmeztetés</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={activeProvider.slotWarningEnabled === true}
                        onChange={(e) => updateProviderPreference("slotWarningEnabled", e.target.checked)}
                      />
                      {" "}{activeProvider.slotWarningEnabled === true ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  {activeProvider.slotWarningEnabled === true && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={premiumLabelStyle}>Hány hétnél figyelmeztessen?</label>
                      <select
                        value={String(activeProvider.slotWarningWeeks || 1)}
                        onChange={(e) => updateProviderPreference("slotWarningWeeks", Number(e.target.value))}
                        style={premiumSelectStyle}
                      >
                        <option value="1">1 hét</option>
                        <option value="2">2 hét</option>
                        <option value="3">3 hét</option>
                        <option value="4">4 hét</option>
                      </select>
                      <p style={premiumHintStyle}>
                        Példa: ha 1 hét van beállítva, akkor figyelmeztet, amikor már csak legfeljebb 1 hétre van előre időpont generálva.
                      </p>
                    </div>
                  )}

                  <button onClick={saveActiveProviderSettings} style={{ ...providerSmallButtonStyle, marginTop: "12px" }}>
                    Beállítások mentése
                  </button>

                  <DeveloperContact
                    senderType="provider"
                    senderName={activeProvider.name}
                    senderEmail={activeProvider.email}
                    showDeveloperContact={showDeveloperContact}
                    setShowDeveloperContact={setShowDeveloperContact}
                    developerMessageText={developerMessageText}
                    setDeveloperMessageText={setDeveloperMessageText}
                    sendDeveloperMessage={sendDeveloperMessage}
                    buttonStyle={providerSmallButtonStyle}
                    inputStyle={premiumInputStyle}
                  />

                  <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(98, 84, 111, 0.12)" }}>
                    <button onClick={deleteProviderAccount} style={dangerButtonStyle}>
                      Szolgáltatói fiók törlése
                    </button>
                  </div>
                </div>
              )}

              <div style={premiumSettingsPanelStyle}>
                <button
                  onClick={() => setShowProviderGuestCodeEdit(!showProviderGuestCodeEdit)}
                  style={premiumNeutralButtonStyle}
                >
                  {showProviderGuestCodeEdit ? "Vendégkód módosítás bezárása" : "Vendégkód módosítása"}
                </button>

                {showProviderGuestCodeEdit && (
                  <div style={{ marginTop: "12px" }}>
                    <input
                      placeholder="Új vendégkód, pl. MONI-2026"
                      value={newGuestCode}
                      onChange={(e) => setNewGuestCode(normalizeGuestCode(e.target.value))}
                      style={premiumInlineInputStyle}
                    />
                    <p>Legalább 6 karakter. A már csatlakozott vendégek megmaradnak.</p>
                    <button onClick={changeProviderGuestCode} style={providerSmallButtonStyle}>
                      Vendégkód mentése
                    </button>
                  </div>
                )}
              </div>

              <div style={premiumSettingsPanelStyle}>
                <button
                  onClick={() => setShowProviderPinEdit(!showProviderPinEdit)}
                  style={premiumNeutralButtonStyle}
                >
                  {showProviderPinEdit ? "PIN módosítás bezárása" : "Saját PIN módosítása"}
                </button>

                {showProviderPinEdit && (
                  <div style={premiumPanelStyle}>
                    <h3>Saját PIN módosítása</h3>
                    <p style={{ marginTop: 0 }}>Itt tudod módosítani a szolgáltatói belépési PIN-kódodat.</p>
                    <input
                      placeholder="Jelenlegi PIN"
                      value={providerCurrentPin}
                      onChange={(e) => setProviderCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={premiumInlineInputStyle}
                    />
                    <input
                      placeholder="Új PIN"
                      value={providerNewPin}
                      onChange={(e) => setProviderNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={premiumInlineInputStyle}
                    />
                    <input
                      placeholder="Új PIN még egyszer"
                      value={providerNewPinAgain}
                      onChange={(e) => setProviderNewPinAgain(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={premiumInlineInputStyle}
                    />
                    <button onClick={changeProviderPin} style={providerSmallButtonStyle}>PIN módosítása</button>
                  </div>
                )}
              </div>

              
    </>
  );
}
