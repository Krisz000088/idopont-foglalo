export function getProviderNotificationKeyValue(normalizeId, providerId, notification) {
  return [
    normalizeId(providerId),
    normalizeId(notification?.id),
    String(notification?.type || "").trim(),
    String(notification?.text || "").trim(),
    String(notification?.note || "").trim(),
    String(notification?.message || "").trim(),
  ].join("|");
}

export function getVisibleProviderNotificationsFromList(provider, hiddenProviderNotificationKeys, normalizeId) {
  if (!provider) return [];

  return (provider.notifications || []).filter(
    (notification) => !hiddenProviderNotificationKeys.includes(getProviderNotificationKeyValue(normalizeId, provider.id, notification))
  );
}

export function getProviderMessageKeyValue(normalizeId, providerId, message) {
  return [
    normalizeId(providerId),
    normalizeId(message?.id),
    String(message?.type || "").trim(),
    String(message?.createdAt || "").trim(),
    String(message?.text || "").trim(),
  ].join("|");
}

export function isRealGuestMessage(message) {
  return message?.from === "guest" && (message?.type || "message") === "message";
}

export function getVisibleProviderGuestMessagesFromList(messagesForProvider, hiddenProviderMessageKeys, normalizeId, providerId) {
  if (!providerId) return [];

  return (messagesForProvider || []).filter(
    (message) => isRealGuestMessage(message) && !hiddenProviderMessageKeys.includes(getProviderMessageKeyValue(normalizeId, providerId, message))
  );
}

export function getGuestMessageKeyValue(normalizeId, guestId, message) {
  return [
    normalizeId(guestId),
    normalizeId(message?.id),
    String(message?.type || "").trim(),
    String(message?.createdAt || "").trim(),
    String(message?.text || "").trim(),
  ].join("|");
}

export function getGuestNotificationKeyValue(normalizeId, guestId, notification) {
  return [
    normalizeId(guestId),
    normalizeId(notification?.id),
    String(notification?.type || "").trim(),
    String(notification?.text || "").trim(),
    String(notification?.message || "").trim(),
    String(notification?.note || "").trim(),
  ].join("|");
}

export function getVisibleGuestNotificationsFromList(guest, hiddenGuestNotificationKeys, normalizeId) {
  if (!guest) return [];

  return (guest.notifications || []).filter(
    (notification) => !hiddenGuestNotificationKeys.includes(getGuestNotificationKeyValue(normalizeId, guest.id, notification))
  );
}

export function getOverviewSeenKeyValue(normalizeId, ownerId, panelKey) {
  return `${normalizeId(ownerId)}|${panelKey}`;
}

export function getSeenCountFromMap(seenCounts, normalizeId, ownerId, panelKey) {
  return Number(seenCounts?.[getOverviewSeenKeyValue(normalizeId, ownerId, panelKey)] || 0);
}

export function hasUnseenOverviewItemValue(seenCounts, normalizeId, ownerId, panelKey, currentValue) {
  return Number(currentValue || 0) > 0 && Number(currentValue || 0) > getSeenCountFromMap(seenCounts, normalizeId, ownerId, panelKey);
}