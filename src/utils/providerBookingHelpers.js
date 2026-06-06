export function getProviderActiveBookingsFromList(guestBookings, idsEqual, providerId) {
  if (!providerId) return [];

  return (guestBookings || []).filter(
    (booking) => booking && booking.active && idsEqual(booking.providerId, providerId)
  );
}

export function getProviderActiveBookingsSortedFromList(guestBookings, idsEqual, providerId) {
  return getProviderActiveBookingsFromList(guestBookings, idsEqual, providerId).sort((a, b) =>
    `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`)
  );
}

export function getProviderTodayBookingsFromList(guestBookings, idsEqual, providerId, todayText) {
  if (!todayText) return [];

  return getProviderActiveBookingsFromList(guestBookings, idsEqual, providerId).filter(
    (booking) => booking.date === todayText
  );
}

export function getProviderFreeSlotsFromProvider(provider) {
  const providerSlots = Array.isArray(provider?.slots) ? provider.slots : [];

  return providerSlots
    .filter((slot) => slot && !slot.booked)
    .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
}

export function getRegisteredGuestsForProviderFromList(guests, idsEqual, providerId) {
  if (!providerId) return [];

  return (guests || [])
    .filter(
      (guest) =>
        Array.isArray(guest.providerIds) &&
        guest.providerIds.some((guestProviderId) => idsEqual(guestProviderId, providerId))
    )
    .sort((a, b) => (a.name || "").localeCompare(b.name || "", "hu"));
}

export function getProviderStatsFromData({
  provider,
  guestBookings,
  guests,
  idsEqual,
  todayText,
  providerMessages = [],
  visibleProviderGuestMessages = [],
  visibleProviderNotifications = [],
}) {
  if (!provider) {
    return {
      registeredGuests: 0,
      activeBookings: 0,
      todayBookings: 0,
      upcomingBookings: 0,
      freeSlots: 0,
      bookedSlots: 0,
      blockedGuests: 0,
      unreadLikeMessages: 0,
      nextBooking: null,
    };
  }

  const providerBookings = getProviderActiveBookingsFromList(guestBookings, idsEqual, provider.id);
  const providerSlots = Array.isArray(provider.slots) ? provider.slots : [];
  const registeredGuests = getRegisteredGuestsForProviderFromList(guests, idsEqual, provider.id);

  const upcomingBookings = providerBookings.filter(
    (booking) => booking.date && booking.date >= todayText
  );

  const sortedUpcomingBookings = [...upcomingBookings].sort((a, b) => {
    const aValue = `${a.date || ""} ${a.time || ""}`;
    const bValue = `${b.date || ""} ${b.time || ""}`;
    return aValue.localeCompare(bValue);
  });

  return {
    registeredGuests: registeredGuests.length,
    activeBookings: providerBookings.length,
    todayBookings: providerBookings.filter((booking) => booking.date === todayText).length,
    upcomingBookings: upcomingBookings.length,
    freeSlots: providerSlots.filter((slot) => slot && !slot.booked).length,
    bookedSlots: providerBookings.length,
    blockedGuests: Array.isArray(provider.blockedEmails) ? provider.blockedEmails.length : 0,
    unreadLikeMessages: visibleProviderGuestMessages.length,
    providerNotifications: visibleProviderNotifications.length,
    nextBooking: sortedUpcomingBookings[0] || null,
    providerMessagesCount: providerMessages.length,
  };
}