export default function CalendarView({
  provider,
  selectedDate,
  onSelectDate,
  groupDatesByMonth,
  getDaysInMonth,
  getMondayBasedStartIndex,
  getMonthLabel,
  getDateTextFromMonthAndDay,
  isExceptionDate,
  hasAvailableSlotOnDate,
  isFullyBookedDate,
  premiumCalendarCardStyle,
  premiumCalendarGridStyle,
  premiumCalendarDayBaseStyle,
}) {
const slotDates = provider && Array.isArray(provider.slots)
    ? provider.slots.filter((slot) => slot && slot.date).map((slot) => slot.date)
    : [];
  const exceptionDates = provider && Array.isArray(provider.exceptionDates) ? provider.exceptionDates : [];

  const allRelevantDates = [...new Set([...slotDates, ...exceptionDates])].sort();
  const groupedDates = groupDatesByMonth(allRelevantDates);

  if (allRelevantDates.length === 0) {
    return <p>Nincs megadott időpont.</p>;
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
      {Object.keys(groupedDates).map((monthKey) => {
        const daysInMonth = getDaysInMonth(monthKey);
        const startIndex = getMondayBasedStartIndex(monthKey);

        return (
          <div key={monthKey} style={premiumCalendarCardStyle} translate="no" className="notranslate">
            <h4>{getMonthLabel(monthKey)}</h4>

            <div style={premiumCalendarGridStyle} translate="no" className="notranslate">
              <b>H</b>
              <b>K</b>
              <b>SZ</b>
              <b>CS</b>
              <b>P</b>
              <b>SZ</b>
              <b>V</b>

              {Array.from({ length: startIndex }).map((_, index) => (
                <div key={`empty-${monthKey}-${index}`}></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const dayNumber = index + 1;
                const date = getDateTextFromMonthAndDay(monthKey, dayNumber);
                const exception = isExceptionDate(provider, date);
                const available = hasAvailableSlotOnDate(provider, date);
                const fullyBooked = isFullyBookedDate(provider, date);

                if (exception) {
                  return (
                    <div
                      key={date}
                      style={{
                        ...premiumCalendarDayBaseStyle,
                        border: "1px solid #d6a700",
                        backgroundColor: "#fff36d",
                        color: "#6b5200",
                      }}
                      title="A szolgáltató ezen a napon nem dolgozik"
                    >
                      <div>{dayNumber}</div>
                      <small>Nem dolgozik</small>
                    </div>
                  );
                }

                if (fullyBooked) {
                  return (
                    <div
                      key={date}
                      style={{
                        ...premiumCalendarDayBaseStyle,
                        border: "1px solid #d00000",
                        backgroundColor: "#ffb3b3",
                        color: "#8a0000",
                      }}
                      title="Nincs már szabad időpont"
                    >
                      <div>{dayNumber}</div>
                      <small>Betelt</small>
                    </div>
                  );
                }

                if (!available) {
                  return (
                    <div
                      key={date}
                      style={{
                        ...premiumCalendarDayBaseStyle,
                        border: "1px solid #ddd",
                        backgroundColor: "#f5f5f5",
                        color: "#aaa",
                      }}
                    >
                      {dayNumber}
                    </div>
                  );
                }

                return (
                  <button
                    key={date}
                    onClick={() => onSelectDate(date)}
                    style={{
                      ...premiumCalendarDayBaseStyle,
                      border: selectedDate === date ? "2px solid #1b5e20" : "1px solid #75b82a",
                      backgroundColor: selectedDate === date ? "#75b82a" : "#e9f7df",
                      color: "#1b5e20",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: "12px", lineHeight: "1.45" }}>
              Zöld: van szabad időpont / piros: betelt / szürke: nincs időpont / citromsárga: nem dolgozik
            </p>
          </div>
        );
      })}
    </div>
  );
}
