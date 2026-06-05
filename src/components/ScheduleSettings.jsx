function ScheduleSettings({
  activeProvider,
  days,
  showProviderScheduleSettings,
  setShowProviderScheduleSettings,
  workDays,
  toggleWorkDay,
  workStart,
  setWorkStart,
  workEnd,
  setWorkEnd,
  slotLength,
  setSlotLength,
  weeksAhead,
  setWeeksAhead,
  exceptionDate,
  setExceptionDate,
  addExceptionDate,
  removeExceptionDate,
  breakType,
  setBreakType,
  breakDay,
  setBreakDay,
  breakDate,
  setBreakDate,
  breakStart,
  setBreakStart,
  breakEnd,
  setBreakEnd,
  addProviderBreak,
  removeProviderBreak,
  generateSlots,
  formatDateHu,
  premiumPanelStyle,
  premiumNeutralButtonStyle,
  premiumInlineInputStyle,
  premiumSelectStyle,
  premiumHintStyle,
  premiumListCardStyle,
  providerSmallButtonStyle,
  dangerButtonStyle,
}) {
  return (
    <div style={premiumPanelStyle}>
      <button
        onClick={() => setShowProviderScheduleSettings(!showProviderScheduleSettings)}
        style={premiumNeutralButtonStyle}
      >
        {showProviderScheduleSettings ? "Munkaidő és időpontok elrejtése" : "Munkaidő és időpontok kezelése"}
      </button>

      {showProviderScheduleSettings && (
        <>
          <h3>Mely napokon dolgozol?</h3>

          {days.map((day) => (
            <label key={day} style={{ display: "block", margin: "6px" }}>
              <input type="checkbox" checked={workDays.includes(day)} onChange={() => toggleWorkDay(day)} />
              {" "}{day}
            </label>
          ))}

          <p>Munkaidő kezdete:</p>
          <input type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} style={premiumInlineInputStyle} />

          <p>Munkaidő vége:</p>
          <input type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} style={premiumInlineInputStyle} />

          <p>Időpont hossza:</p>
          <select value={slotLength} onChange={(e) => setSlotLength(e.target.value)} style={premiumSelectStyle}>
            <option value="15">15 perc</option>
            <option value="30">30 perc</option>
            <option value="45">45 perc</option>
            <option value="60">60 perc</option>
            <option value="90">90 perc</option>
          </select>

          <p>Hány hétre előre generáljon időpontokat?</p>
          <select value={weeksAhead} onChange={(e) => setWeeksAhead(e.target.value)} style={premiumSelectStyle}>
            <option value="1">1 hét</option>
            <option value="2">2 hét</option>
            <option value="4">4 hét</option>
            <option value="8">8 hét</option>
            <option value="12">12 hét</option>
          </select>

          <h3>Kivétel napok / szabadnapok</h3>

          <input type="date" value={exceptionDate} onChange={(e) => setExceptionDate(e.target.value)} style={premiumInlineInputStyle} />
          <button onClick={addExceptionDate} style={{ ...providerSmallButtonStyle, marginLeft: "10px" }}>Kivétel nap hozzáadása</button>

          {(activeProvider.exceptionDates || []).length === 0 && <p>Nincs kivétel nap megadva.</p>}

          {(activeProvider.exceptionDates || []).map((date) => (
            <div key={date} style={{ margin: "6px 0" }}>
              <b>{date}</b>
              <button onClick={() => removeExceptionDate(date)} style={{ ...premiumNeutralButtonStyle, marginLeft: "10px" }}>
                Törlés
              </button>
            </div>
          ))}

          <h3>Napközbeni szünetek</h3>
          <p style={premiumHintStyle}>Állíts be ismétlődő vagy egyszeri szünetet, például ebédidőt. Az időpont generálás ezeket kihagyja.</p>

          <select value={breakType} onChange={(e) => setBreakType(e.target.value)} style={premiumSelectStyle}>
            <option value="weekly">Ismétlődő heti szünet</option>
            <option value="single">Egyszeri szünet</option>
          </select>

          {breakType === "weekly" ? (
            <select value={breakDay} onChange={(e) => setBreakDay(e.target.value)} style={premiumSelectStyle}>
              {days.map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
          ) : (
            <input type="date" value={breakDate} onChange={(e) => setBreakDate(e.target.value)} style={premiumInlineInputStyle} />
          )}

          <input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} style={premiumInlineInputStyle} />
          <input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} style={premiumInlineInputStyle} />
          <button onClick={addProviderBreak} style={{ ...providerSmallButtonStyle, marginLeft: "10px" }}>Szünet hozzáadása</button>

          {(activeProvider.breaks || []).length === 0 && <p>Nincs napközbeni szünet megadva.</p>}
          {(activeProvider.breaks || []).map((item) => (
            <div key={item.id} style={premiumListCardStyle}>
              <b>{item.type === "single" ? formatDateHu(item.date) : item.day}</b> — {item.start}–{item.end}
              <button onClick={() => removeProviderBreak(item.id)} style={{ ...dangerButtonStyle, marginLeft: "10px" }}>Törlés</button>
            </div>
          ))}

          <br /><br />
          <button onClick={generateSlots} style={providerSmallButtonStyle}>Időpontok generálása</button>
        </>
      )}
    </div>
  );
}

export default ScheduleSettings;
