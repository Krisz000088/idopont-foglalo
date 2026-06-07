export function getBookingsForProviderDateFromList(guestBookings, idsEqual, provider, date) {
  if (!provider || !date) return [];

  return (guestBookings || []).filter(
    (booking) => booking.active && idsEqual(booking.providerId, provider.id) && booking.date === date
  );
}

export function guestAlreadyHasBookingOnDateFromList(guestBookings, idsEqual, providerId, guestEmail, date) {
  if (!guestEmail || !date) return false;

  return (guestBookings || []).some(
    (booking) =>
      booking.active &&
      idsEqual(booking.providerId, providerId) &&
      booking.date === date &&
      (booking.guestEmail || "").toLowerCase() === guestEmail.toLowerCase()
  );
}

export function getGuestActiveBookingsFromList(guestBookings, idsEqual, guest) {
  if (!guest) return [];

  return (guestBookings || [])
    .filter((booking) => booking && booking.active && idsEqual(booking.guestId, guest.id))
    .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
}

export function getGuestCancelledBookingKeyValue(normalizeId, guestId, booking) {
  return [
    normalizeId(guestId),
    normalizeId(booking?.id),
    normalizeId(booking?.slotId),
    String(booking?.date || "").trim(),
    String(booking?.time || "").trim(),
    booking?.cancelledByProvider ? "provider" : "",
    booking?.cancelledByGuest ? "guest" : "",
    String(booking?.providerCancelMessage || "").trim(),
  ].join("|");
}

export function getGuestCancelledBookingsFromList(guestBookings, idsEqual, guest) {
  if (!guest) return [];

  return (guestBookings || [])
    .filter((booking) => booking && idsEqual(booking.guestId, guest.id) && !booking.active && (booking.cancelledByGuest || booking.cancelledByProvider))
    .sort((a, b) => `${b.date || ""} ${b.time || ""}`.localeCompare(`${a.date || ""} ${a.time || ""}`));
}

export function getGuestBookingsForProviderFromList(guestBookings, idsEqual, normalizeEmail, providerId, guest) {
  if (!providerId || !guest) return [];

  const guestEmailValue = normalizeEmail(guest.email);

  return (guestBookings || [])
    .filter((booking) => {
      if (!booking || !idsEqual(booking.providerId, providerId) || !booking.active) return false;
      if (booking.guestId && idsEqual(booking.guestId, guest.id)) return true;
      return guestEmailValue && normalizeEmail(booking.guestEmail) === guestEmailValue;
    })
    .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
}

export function getProviderGuestBookingSummaryFromList(guestBookings, idsEqual, normalizeEmail, providerId, guest) {
  const relatedBookings = getGuestBookingsForProviderFromList(guestBookings, idsEqual, normalizeEmail, providerId, guest);
  const now = new Date();

  const pastBookings = relatedBookings
    .filter((booking) => new Date(`${booking.date}T${booking.time || "00:00"}`).getTime() < now.getTime())
    .sort((a, b) => `${b.date || ""} ${b.time || ""}`.localeCompare(`${a.date || ""} ${a.time || ""}`));

  const futureBookings = relatedBookings
    .filter((booking) => new Date(`${booking.date}T${booking.time || "00:00"}`).getTime() >= now.getTime())
    .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));

  return {
    lastBooking: pastBookings[0] || null,
    futureBookings,
  };
}