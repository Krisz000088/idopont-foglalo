function ProviderCalendarView({
  provider,
  selectedDate,
  onSelectDate,
  getAllDates,
  groupDatesByMonth,
  getDaysInMonth,
  getMondayBasedStartIndex,
  getMonthLabel,
  getDateTextFromMonthAndDay,
  isExceptionDate,
  hasAnySlotOnDate,
  isFullyBookedDate,
  premiumCalendarCardStyle,
  premiumCalendarGridStyle,
  premiumCalendarDayBaseStyle,
}) {
  const dates = getAllDates(provider);
  const groupedDates = groupDatesByMonth(dates);

  if (dates.length === 0) {
    return <p>Még nincs időpont generálva.</p>;
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
                const hasSlots = hasAnySlotOnDate(provider, date);
                const fullyBooked = isFullyBookedDate(provider, date);

                if (exception) {
                  return (
                    <button
                      key={date}
                      onClick={() => onSelectDate(date)}
                      style={{
                        ...premiumCalendarDayBaseStyle,
                        border: selectedDate === date ? "2px solid #8a6d00" : "1px solid #d6a700",
                        backgroundColor: selectedDate === date ? "#ffd84d" : "#fff36d",
                        color: "#6b5200",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                      title="Kivétel nap / nem dolgozik"
                    >
                      <div>{dayNumber}</div>
                      <small>Nem dolgozom</small>
                    </button>
                  );
                }

                if (!hasSlots) {
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

                const providerDayStyle = fullyBooked
                  ? {
                      backgroundColor: selectedDate === date ? "#d00000" : "#ffb3b3",
                      border: selectedDate === date ? "2px solid #8a0000" : "1px solid #d00000",
                      color: "#8a0000",
                    }
                  : {
                      backgroundColor: selectedDate === date ? "#2e7d32" : "#b7f08a",
                      border: selectedDate === date ? "2px solid #0b3d12" : "2px solid #2e7d32",
                      color: "#1b5e20",
                    };

                return (
                  <button
                    key={date}
                    onClick={() => onSelectDate(date)}
                    style={{
                      ...premiumCalendarDayBaseStyle,
                      cursor: "pointer",
                      fontWeight: "bold",
                      ...providerDayStyle,
                    }}
                    title={fullyBooked ? "Teljesen betelt nap" : "Van szabad időpont"}
                  >
                    <div>{dayNumber}</div>
                    {fullyBooked && <small>Betelt</small>}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: "12px", lineHeight: "1.45" }}>
              Zöld: van szabad időpont / piros: betelt / halvány szürke: nincs időpont / citromsárga: nem dolgozik
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ProviderCalendarView;
