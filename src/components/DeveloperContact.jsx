function DeveloperContact({
  senderType,
  senderName,
  senderEmail,
  showDeveloperContact,
  setShowDeveloperContact,
  developerMessageText,
  setDeveloperMessageText,
  sendDeveloperMessage,
  buttonStyle,
  inputStyle,
}) {
  return (
    <>
      <button
        onClick={() => setShowDeveloperContact(!showDeveloperContact)}
        style={{ ...buttonStyle, marginTop: "12px" }}
      >
        Üzenet a fejlesztőnek
      </button>

      {showDeveloperContact && (
        <div style={{ marginTop: "12px" }}>
          <textarea
            placeholder="Írd le, mit szeretnél jelezni..."
            value={developerMessageText}
            onChange={(e) => setDeveloperMessageText(e.target.value)}
            style={{ ...inputStyle, minHeight: "90px" }}
          />
          <button onClick={() => sendDeveloperMessage(senderType, senderName, senderEmail)} style={buttonStyle}>
            Üzenet elküldése
          </button>
        </div>
      )}
    </>
  );
}

export default DeveloperContact;
