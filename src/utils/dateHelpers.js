export function getHungarianDayName(date) {
  const index = date.getDay();

  const map = {
    1: "Hétfő",
    2: "Kedd",
    3: "Szerda",
    4: "Csütörtök",
    5: "Péntek",
    6: "Szombat",
    0: "Vasárnap",
  };

  return map[index];
}

export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export function formatDateHu(dateText) {
  if (!dateText) return "-";

  const [year, month, day] = dateText.split("-");
  return `${year}.${month}.${day}.`;
}

export function getSlotDateTime(slot) {
  if (!slot || !slot.date || !slot.time) return null;

  const normalizedTime = String(slot.time).slice(0, 5);
  const dateTime = new Date(`${slot.date}T${normalizedTime}:00`);

  if (Number.isNaN(dateTime.getTime())) return null;

  return dateTime;
}

export function isSlotInPast(slot) {
  const slotDateTime = getSlotDateTime(slot);

  if (!slotDateTime) return true;

  return slotDateTime.getTime() <= Date.now();
}

export function isSlotBookable(slot) {
  return Boolean(
    slot &&
      slot.date &&
      slot.time &&
      !slot.booked &&
      !isSlotInPast(slot)
  );
}