export function formatTimeFromSupabase(timeValue) {
  if (!timeValue) return "";
  return String(timeValue).slice(0, 5);
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function normalizeId(value) {
  return String(value ?? "").trim();
}

export function idsEqual(firstValue, secondValue) {
  return normalizeId(firstValue) !== "" && normalizeId(firstValue) === normalizeId(secondValue);
}

export function isMissingSupabaseTableError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.code === "42P01" ||
    error?.code === "PGRST205" ||
    message.includes("could not find the table") ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  );
}

export function filterExistingProviderIds(providerIds, providerList) {
  if (!Array.isArray(providerIds)) return [];
  const existingProviderIds = new Set((providerList || []).map((provider) => normalizeId(provider.id)));

  return [...new Set(providerIds.filter((providerId) => existingProviderIds.has(normalizeId(providerId))))];
}

export function normalizeGuestCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9_-]/g, "");
}

export function isValidGuestCode(code) {
  const normalizedCode = normalizeGuestCode(code);
  const visibleLength = normalizedCode.replace(/[-_]/g, "").length;

  return normalizedCode.length >= 6 && visibleLength >= 3 && /^[A-Z0-9_-]+$/.test(normalizedCode);
}

export function timeToMinutes(time) {
  const [hour = 0, minute = 0] = String(time || "00:00").split(":").map(Number);
  return hour * 60 + minute;
}

export function slotOverlapsBreak(slotStartMinute, slotLengthMinutes, breakItem) {
  const breakStartMinute = timeToMinutes(breakItem.start);
  const breakEndMinute = timeToMinutes(breakItem.end);
  const slotEndMinute = slotStartMinute + Number(slotLengthMinutes);
  return slotStartMinute < breakEndMinute && slotEndMinute > breakStartMinute;
}