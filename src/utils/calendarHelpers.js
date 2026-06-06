import { getSlotDateTime, isSlotBookable } from "./dateHelpers";

export function getProviderLatestFutureSlotDate(provider) {
  if (!provider || !Array.isArray(provider.slots)) return null;

  const futureSlotDates = provider.slots
    .map((slot) => getSlotDateTime(slot))
    .filter((dateTime) => dateTime && dateTime.getTime() > Date.now())
    .sort((a, b) => b.getTime() - a.getTime());

  return futureSlotDates[0] || null;
}

export function getSlotGenerationWarning(provider) {
  if (!provider || provider.slotWarningEnabled !== true) return "";

  const warningWeeks = Math.max(1, Number(provider.slotWarningWeeks || 1));
  const latestFutureSlotDate = getProviderLatestFutureSlotDate(provider);

  if (!latestFutureSlotDate) {
    return "Nincs előre generált jövőbeli időpontod. Generálj előre időpontokat, hogy a vendégek időben tudjanak nálad helyet foglalni.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestDate = new Date(latestFutureSlotDate);
  latestDate.setHours(0, 0, 0, 0);

  const daysAhead = Math.ceil((latestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const weeksLeft = Math.max(0, Math.ceil(daysAhead / 7));

  if (daysAhead <= warningWeeks * 7) {
    const weekText = weeksLeft <= 1 ? "1 hétre" : `${weeksLeft} hétre`;
    return `Már csak ${weekText} van előre időpont generálva. Generálj előre időpontokat, hogy a vendégek időben tudjanak nálad helyet foglalni.`;
  }

  return "";
}

export function getUniqueAvailableDates(provider) {
  if (!provider || !Array.isArray(provider.slots)) return [];

  const dates = provider.slots
    .filter((slot) => isSlotBookable(slot))
    .map((slot) => slot.date);

  return [...new Set(dates)].sort();
}

export function getAvailableSlotsForDate(provider, date) {
  if (!provider || !date || !Array.isArray(provider.slots)) return [];

  return provider.slots.filter((slot) => slot && slot.date === date && isSlotBookable(slot));
}

export function getAllDates(provider) {
  if (!provider) return [];

  const slotDates = Array.isArray(provider.slots)
    ? provider.slots.filter((slot) => slot && slot.date).map((slot) => slot.date)
    : [];

  const exceptionDates = Array.isArray(provider.exceptionDates) ? provider.exceptionDates : [];

  return [...new Set([...slotDates, ...exceptionDates])].sort();
}

export function getSlotsForDate(provider, date) {
  if (!provider || !date || !Array.isArray(provider.slots)) return [];

  return provider.slots.filter((slot) => slot && slot.date === date);
}

export function dateHasBookedSlot(provider, date) {
  if (!provider || !date || !Array.isArray(provider.slots)) return false;

  return provider.slots.some((slot) => slot && slot.date === date && slot.booked);
}

export function groupDatesByMonth(dates) {
  const grouped = {};

  dates.filter(Boolean).forEach((date) => {
    const [year, month] = date.split("-");
    const key = `${year}-${month}`;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(date);
  });

  return grouped;
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  const monthNames = [
    "január", "február", "március", "április", "május", "június",
    "július", "augusztus", "szeptember", "október", "november", "december",
  ];

  return `${year}. ${monthNames[Number(month) - 1]}`;
}

export function getMondayBasedStartIndex(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();

  if (firstDay === 0) return 6;
  return firstDay - 1;
}

export function getDaysInMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

export function getDateTextFromMonthAndDay(monthKey, day) {
  return `${monthKey}-${String(day).padStart(2, "0")}`;
}

export function isExceptionDate(provider, date) {
  if (!provider || !Array.isArray(provider.exceptionDates)) return false;
  return provider.exceptionDates.includes(date);
}

export function hasAnySlotOnDate(provider, date) {
  if (!provider || !Array.isArray(provider.slots)) return false;
  return provider.slots.some((slot) => slot && slot.date === date);
}

export function hasAvailableSlotOnDate(provider, date) {
  if (!provider || !Array.isArray(provider.slots)) return false;
  return provider.slots.some((slot) => slot && slot.date === date && isSlotBookable(slot));
}

export function isFullyBookedDate(provider, date) {
  if (!hasAnySlotOnDate(provider, date)) return false;
  if (isExceptionDate(provider, date)) return false;
  return !hasAvailableSlotOnDate(provider, date);
}

export function dateHasAnyBooking(provider, date) {
  if (!provider || !Array.isArray(provider.slots)) return false;
  return provider.slots.some((slot) => slot && slot.date === date && slot.booked);
}