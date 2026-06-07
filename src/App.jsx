import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";
import { buildHtmlEmail, buildPlainTextEmail } from "./utils/emailHelpers";
import { formatDate, formatDateHu, getHungarianDayName, getSlotDateTime, isSlotBookable, isSlotInPast } from "./utils/dateHelpers";
import {
  dateHasAnyBooking,
  dateHasBookedSlot,
  getAllDates,
  getAvailableSlotsForDate,
  getDateTextFromMonthAndDay,
  getDaysInMonth,
  getMondayBasedStartIndex,
  getMonthLabel,
  getProviderLatestFutureSlotDate,
  getSlotGenerationWarning,
  getSlotsForDate,
  getUniqueAvailableDates,
  groupDatesByMonth,
  hasAnySlotOnDate,
  hasAvailableSlotOnDate,
  isExceptionDate,
  isFullyBookedDate,
} from "./utils/calendarHelpers";
import {
  getBookingsForProviderDateFromList,
  getGuestActiveBookingsFromList,
  getGuestBookingsForProviderFromList,
  getGuestCancelledBookingKeyValue,
  getGuestCancelledBookingsFromList,
  getProviderGuestBookingSummaryFromList,
  guestAlreadyHasBookingOnDateFromList,
} from "./utils/guestBookingHelpers";
import {
  getProviderActiveBookingsSortedFromList,
  getProviderFreeSlotsFromProvider,
  getProviderStatsFromData,
  getRegisteredGuestsForProviderFromList,
} from "./utils/providerBookingHelpers";
import {
  getGuestMessageKeyValue,
  getGuestNotificationKeyValue,
  getOverviewSeenKeyValue,
  getProviderMessageKeyValue,
  getProviderNotificationKeyValue,
  getSeenCountFromMap,
  getVisibleGuestNotificationsFromList,
  getVisibleProviderGuestMessagesFromList,
  getVisibleProviderNotificationsFromList,
  hasUnseenOverviewItemValue,
  isRealGuestMessage,
} from "./utils/messageHelpers";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import DeveloperContact from "./components/DeveloperContact";
import ProviderLogin from "./components/ProviderLogin";
import GuestLogin from "./components/GuestLogin";
import ProviderRegister from "./components/ProviderRegister";
import GuestRegister from "./components/GuestRegister";
import GuestSettings from "./components/GuestSettings";
import ProviderSettings from "./components/ProviderSettings";
import CalendarView from "./components/CalendarView";
import ProviderCalendarView from "./components/ProviderCalendarView";
import GuestMessages from "./components/GuestMessages";
import ProviderMessages from "./components/ProviderMessages";
import GuestBookings from "./components/GuestBookings";
import ProviderBookings from "./components/ProviderBookings";
import ProviderOverview from "./components/ProviderOverview";
import GuestOverview from "./components/GuestOverview";
import BlockedGuests from "./components/BlockedGuests";
import RegisteredGuestsPanel from "./components/RegisteredGuestsPanel";
import ProviderNotifications from "./components/ProviderNotifications";
import ScheduleSettings from "./components/ScheduleSettings";

const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

function App() {
  const [mode, setMode] = useState("");

  const [providers, setProviders] = useState(() => JSON.parse(localStorage.getItem("providers")) || []);
  const [guests, setGuests] = useState(() => JSON.parse(localStorage.getItem("guests")) || []);
  const [guestBookings, setGuestBookings] = useState(() => JSON.parse(localStorage.getItem("guestBookings")) || []);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem("messages")) || []);

  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerPhone, setProviderPhone] = useState("");
  const [providerPin, setProviderPin] = useState("");
  const [guestCode, setGuestCode] = useState("");
  const [newGuestCode, setNewGuestCode] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);
  const [forgotProviderEmail, setForgotProviderEmail] = useState("");
  const [forgotGuestEmail, setForgotGuestEmail] = useState("");
  const [forgotLoginEmail, setForgotLoginEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestPin, setGuestPin] = useState("");
  const [guestLoginEmail, setGuestLoginEmail] = useState("");
  const [guestLoginPin, setGuestLoginPin] = useState("");
  const [activeGuest, setActiveGuest] = useState(null);

  const [guestProviderCode, setGuestProviderCode] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestNote, setGuestNote] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("");
  const [changeCalendarDate, setChangeCalendarDate] = useState("");
  const [providerCalendarDate, setProviderCalendarDate] = useState("");

  const [workDays, setWorkDays] = useState([]);
  const [workStart, setWorkStart] = useState("08:00");
  const [workEnd, setWorkEnd] = useState("16:00");
  const [slotLength, setSlotLength] = useState(60);
  const [weeksAhead, setWeeksAhead] = useState(4);

  const [exceptionDate, setExceptionDate] = useState("");
  const [providerCancelMessages, setProviderCancelMessages] = useState({});
  const [providerMessageTexts, setProviderMessageTexts] = useState({});
  const [guestMessageTexts, setGuestMessageTexts] = useState({});
  const [newServiceName, setNewServiceName] = useState("");

  const [changeBookingId, setChangeBookingId] = useState(null);
  const [changeProvider, setChangeProvider] = useState(null);
  const [changeSlot, setChangeSlot] = useState(null);
  const [selectedProviderGuestId, setSelectedProviderGuestId] = useState(null);
  const [editableGuestPhone, setEditableGuestPhone] = useState("");
  const [showProviderNotifications, setShowProviderNotifications] = useState(false);
  const [hiddenProviderNotificationKeys, setHiddenProviderNotificationKeys] = useState(() => JSON.parse(localStorage.getItem("hiddenProviderNotificationKeys")) || []);
  const [hiddenProviderMessageKeys, setHiddenProviderMessageKeys] = useState(() => JSON.parse(localStorage.getItem("hiddenProviderMessageKeys")) || []);
  const [hiddenGuestNotificationKeys, setHiddenGuestNotificationKeys] = useState(() => JSON.parse(localStorage.getItem("hiddenGuestNotificationKeys")) || []);
  const [hiddenGuestMessageKeys, setHiddenGuestMessageKeys] = useState(() => JSON.parse(localStorage.getItem("hiddenGuestMessageKeys")) || []);
  const [hiddenGuestCancelledBookingKeys, setHiddenGuestCancelledBookingKeys] = useState(() => JSON.parse(localStorage.getItem("hiddenGuestCancelledBookingKeys")) || []);
  const [providerSeenOverviewCounts, setProviderSeenOverviewCounts] = useState(() => JSON.parse(localStorage.getItem("providerSeenOverviewCounts")) || {});
  const [guestSeenOverviewCounts, setGuestSeenOverviewCounts] = useState(() => JSON.parse(localStorage.getItem("guestSeenOverviewCounts")) || {});
  const [showProviderGuestCodeEdit, setShowProviderGuestCodeEdit] = useState(false);
  const [showProviderMessages, setShowProviderMessages] = useState(false);
  const [showProviderServices, setShowProviderServices] = useState(false);
  const [showProviderBlockedGuests, setShowProviderBlockedGuests] = useState(false);
  const [showProviderScheduleSettings, setShowProviderScheduleSettings] = useState(false);
  const [showProviderPinEdit, setShowProviderPinEdit] = useState(false);
  const [showGuestProviderAdd, setShowGuestProviderAdd] = useState(false);
  const [showGuestBookings, setShowGuestBookings] = useState(false);
  const [showGuestCancelledBookings, setShowGuestCancelledBookings] = useState(false);
  const [showGuestNotifications, setShowGuestNotifications] = useState(false);
  const [showGuestMessages, setShowGuestMessages] = useState(false);
  const [showGuestPhoneEdit, setShowGuestPhoneEdit] = useState(false);
  const [showGuestPinEdit, setShowGuestPinEdit] = useState(false);
  const [providerCurrentPin, setProviderCurrentPin] = useState("");
  const [providerNewPin, setProviderNewPin] = useState("");
  const [providerNewPinAgain, setProviderNewPinAgain] = useState("");
  const [guestCurrentPin, setGuestCurrentPin] = useState("");
  const [guestNewPin, setGuestNewPin] = useState("");
  const [guestNewPinAgain, setGuestNewPinAgain] = useState("");
  const [providerOverviewPanel, setProviderOverviewPanel] = useState("");
  const [guestOverviewPanel, setGuestOverviewPanel] = useState("");
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [showGuestSettings, setShowGuestSettings] = useState(false);
  const [providerEmailNotifications, setProviderEmailNotifications] = useState(true);
  const [guestEmailNotifications, setGuestEmailNotifications] = useState(true);
  const [developerMessageText, setDeveloperMessageText] = useState("");
  const [showDeveloperContact, setShowDeveloperContact] = useState(false);
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("13:00");
  const [breakDay, setBreakDay] = useState("Hétfő");
  const [breakDate, setBreakDate] = useState("");
  const [breakType, setBreakType] = useState("weekly");
  const lastHistoryKeyRef = useRef("");

  useEffect(() => localStorage.setItem("providers", JSON.stringify(providers)), [providers]);
  useEffect(() => localStorage.setItem("guests", JSON.stringify(guests)), [guests]);
  useEffect(() => localStorage.setItem("guestBookings", JSON.stringify(guestBookings)), [guestBookings]);
  useEffect(() => localStorage.setItem("messages", JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem("hiddenProviderNotificationKeys", JSON.stringify(hiddenProviderNotificationKeys)), [hiddenProviderNotificationKeys]);
  useEffect(() => localStorage.setItem("hiddenProviderMessageKeys", JSON.stringify(hiddenProviderMessageKeys)), [hiddenProviderMessageKeys]);
  useEffect(() => localStorage.setItem("hiddenGuestNotificationKeys", JSON.stringify(hiddenGuestNotificationKeys)), [hiddenGuestNotificationKeys]);
  useEffect(() => localStorage.setItem("hiddenGuestMessageKeys", JSON.stringify(hiddenGuestMessageKeys)), [hiddenGuestMessageKeys]);
  useEffect(() => localStorage.setItem("hiddenGuestCancelledBookingKeys", JSON.stringify(hiddenGuestCancelledBookingKeys)), [hiddenGuestCancelledBookingKeys]);
  useEffect(() => localStorage.setItem("providerSeenOverviewCounts", JSON.stringify(providerSeenOverviewCounts)), [providerSeenOverviewCounts]);
  useEffect(() => localStorage.setItem("guestSeenOverviewCounts", JSON.stringify(guestSeenOverviewCounts)), [guestSeenOverviewCounts]);


  useEffect(() => {
    loadSupabaseData();
  }, []);

  useEffect(() => {
    document.documentElement.lang = "hu";
    document.documentElement.setAttribute("translate", "no");
    document.body?.setAttribute("translate", "no");

    if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
      const meta = document.createElement("meta");
      meta.name = "google";
      meta.content = "notranslate";
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const key = `${mode || "home"}-${activeProvider ? "provider" : ""}-${activeGuest ? "guest" : ""}`;

    if (key !== "home--" && lastHistoryKeyRef.current !== key) {
      window.history.pushState({ appView: key }, "");
      lastHistoryKeyRef.current = key;
    }
  }, [mode, activeProvider, activeGuest]);

  useEffect(() => {
    const handlePopState = () => {
      if (activeProvider) {
        setActiveProvider(null);
        setShowProviderSettings(false);
        return;
      }

      if (activeGuest) {
        setActiveGuest(null);
        setShowGuestSettings(false);
        return;
      }

      if (mode) {
        setMode("");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [mode, activeProvider, activeGuest]);

  function formatTimeFromSupabase(timeValue) {
    if (!timeValue) return "";
    return String(timeValue).slice(0, 5);
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function normalizeId(value) {
    return String(value ?? "").trim();
  }

  function idsEqual(firstValue, secondValue) {
    return normalizeId(firstValue) !== "" && normalizeId(firstValue) === normalizeId(secondValue);
  }

  function getProviderNotificationKey(providerId, notification) {
    return getProviderNotificationKeyValue(normalizeId, providerId, notification);
  }

  function getVisibleProviderNotifications(provider) {
    return getVisibleProviderNotificationsFromList(provider, hiddenProviderNotificationKeys, normalizeId);
  }

  function getProviderMessageKey(providerId, message) {
    return getProviderMessageKeyValue(normalizeId, providerId, message);
  }


  function getVisibleProviderGuestMessages(providerId) {
    return getVisibleProviderGuestMessagesFromList(
      getMessagesForProvider(providerId),
      hiddenProviderMessageKeys,
      normalizeId,
      providerId
    );
  }

  function getGuestMessageKey(guestId, message) {
    return getGuestMessageKeyValue(normalizeId, guestId, message);
  }

  function getGuestNotificationKey(guestId, notification) {
    return getGuestNotificationKeyValue(normalizeId, guestId, notification);
  }

  function getVisibleGuestNotifications(guest) {
    return getVisibleGuestNotificationsFromList(guest, hiddenGuestNotificationKeys, normalizeId);
  }

  function getOverviewSeenKey(ownerId, panelKey) {
    return getOverviewSeenKeyValue(normalizeId, ownerId, panelKey);
  }

  function getSeenCount(seenCounts, ownerId, panelKey) {
    return getSeenCountFromMap(seenCounts, normalizeId, ownerId, panelKey);
  }

  function hasUnseenOverviewItem(seenCounts, ownerId, panelKey, currentValue) {
    return hasUnseenOverviewItemValue(seenCounts, normalizeId, ownerId, panelKey, currentValue);
  }

  function markProviderOverviewPanelSeen(provider, panelKey, value) {
    if (!provider || !panelKey) return;

    setProviderSeenOverviewCounts((currentCounts) => ({
      ...currentCounts,
      [getOverviewSeenKey(provider.id, panelKey)]: Number(value || 0),
    }));
  }

  function markGuestOverviewPanelSeen(guest, panelKey, value) {
    if (!guest || !panelKey) return;

    setGuestSeenOverviewCounts((currentCounts) => ({
      ...currentCounts,
      [getOverviewSeenKey(guest.id, panelKey)]: Number(value || 0),
    }));
  }

  function markProviderOverviewPanelUnread(providerId, panelKey, previousValue = -1) {
    if (!providerId || !panelKey) return;

    setProviderSeenOverviewCounts((currentCounts) => ({
      ...currentCounts,
      [getOverviewSeenKey(providerId, panelKey)]: Number(previousValue ?? -1),
    }));
  }

  function markGuestOverviewPanelUnread(guestId, panelKey, previousValue = -1) {
    if (!guestId || !panelKey) return;

    setGuestSeenOverviewCounts((currentCounts) => ({
      ...currentCounts,
      [getOverviewSeenKey(guestId, panelKey)]: Number(previousValue ?? -1),
    }));
  }

  function normalizePhoneForCall(phone) {
    const cleaned = String(phone || "").trim().replace(/[^+0-9]/g, "");

    if (!cleaned) return "";

    if (cleaned.startsWith("+")) return cleaned;
    if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
    return cleaned;
  }

  function renderPhoneCallLink(phone) {
    const callPhone = normalizePhoneForCall(phone);

    if (!callPhone) return null;

    return (
      <a
        href={`tel:${callPhone}`}
        title="Telefonhívás indítása"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          marginLeft: "8px",
          borderRadius: "999px",
          textDecoration: "none",
          background: "linear-gradient(135deg, #18324f, #0c1728)",
          color: "white",
          fontWeight: "800",
          boxShadow: "0 8px 20px rgba(24, 50, 79, 0.22)",
          verticalAlign: "middle",
        }}
      >
        ☎
      </a>
    );
  }

  function isMissingSupabaseTableError(error) {
    const message = String(error?.message || "").toLowerCase();
    return (
      error?.code === "42P01" ||
      error?.code === "PGRST205" ||
      message.includes("could not find the table") ||
      message.includes("schema cache") ||
      message.includes("does not exist")
    );
  }

  async function loadProviderGuestLinksFromSupabase() {
    const { data, error } = await supabase.from("vendeg_szolgaltatok").select("*");

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        console.warn("A vendeg_szolgaltatok tábla még nem létezik. A regisztrált vendégek listája csak a régi adatokból áll össze.");
        return [];
      }

      throw error;
    }

    return data || [];
  }

  async function cleanupOrphanProviderGuestLinks(linkRows, providerMap, guestMap) {
    if (!Array.isArray(linkRows) || linkRows.length === 0) return;

    const orphanLinks = linkRows.filter(
      (row) => !providerMap.has(row.szolgaltato_id) || !guestMap.has(row.vendeg_id)
    );

    if (orphanLinks.length === 0) return;

    for (const row of orphanLinks) {
      const { error } = await supabase
        .from("vendeg_szolgaltatok")
        .delete()
        .eq("szolgaltato_id", row.szolgaltato_id)
        .eq("vendeg_id", row.vendeg_id);

      if (error && !isMissingSupabaseTableError(error)) {
        console.warn("Régi vendég-szolgáltató kapcsolat törlése nem sikerült:", error);
      }
    }
  }

  function filterExistingProviderIds(providerIds, providerList) {
    if (!Array.isArray(providerIds)) return [];
    const existingProviderIds = new Set((providerList || []).map((provider) => normalizeId(provider.id)));

    return [...new Set(providerIds.filter((providerId) => existingProviderIds.has(normalizeId(providerId))))];
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      alert("Kimásolva.");
    } catch (error) {
      console.error(error);
      alert("Nem sikerült automatikusan másolni. Jelöld ki kézzel a mezőt és nyomj Ctrl+C-t.");
    }
  }

  async function sendEmailViaSupabase({ to, subject, text, html, type }) {
    const normalizedTo = String(to || "").trim();

    if (!normalizedTo) {
      return { ok: false, reason: "Hiányzik a címzett email címe." };
    }

    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: normalizedTo,
          subject: subject || "Időpontfoglaló értesítés",
          text: text || "",
          html: html || "",
          type: type || "notification",
        },
      });

      if (error) {
        console.error("Email küldési hiba:", error);
        return { ok: false, error };
      }

      return { ok: true, data };
    } catch (error) {
      console.error("Email küldési hiba:", error);
      return { ok: false, error };
    }
  }

async function sendBookingCreatedEmails({ booking, provider, guest }) {
    const guestEmailResult = await sendEmailViaSupabase({
      to: guest?.email || booking.guestEmail,
      subject: `Foglalás visszaigazolás - ${booking.date} ${booking.time}`,
      type: "booking_created_guest",
      text: buildPlainTextEmail([
        "Sikeres foglalás.",
        `Szolgáltató: ${provider?.name || booking.providerName}`,
        `Időpont: ${booking.date} ${booking.time}`,
        booking.service ? `Szolgáltatás: ${booking.service}` : "",
        booking.note ? `Megjegyzés: ${booking.note}` : "",
      ]),
      html: buildHtmlEmail("Sikeres foglalás", [
        `Szolgáltató: ${provider?.name || booking.providerName}`,
        `Időpont: ${booking.date} ${booking.time}`,
        booking.service ? `Szolgáltatás: ${booking.service}` : "",
        booking.note ? `Megjegyzés: ${booking.note}` : "",
      ]),
    });

    const providerEmailResult = await sendEmailViaSupabase({
      to: provider?.email,
      subject: `Új foglalás - ${booking.date} ${booking.time}`,
      type: "booking_created_provider",
      text: buildPlainTextEmail([
        "Új foglalás érkezett.",
        `Vendég: ${guest?.name || booking.guestName}`,
        `Email: ${guest?.email || booking.guestEmail || "-"}`,
        `Telefon: ${guest?.phone || booking.guestPhone || "-"}`,
        `Időpont: ${booking.date} ${booking.time}`,
        booking.service ? `Szolgáltatás: ${booking.service}` : "",
        booking.note ? `Megjegyzés: ${booking.note}` : "",
      ]),
      html: buildHtmlEmail("Új foglalás érkezett", [
        `Vendég: ${guest?.name || booking.guestName}`,
        `Email: ${guest?.email || booking.guestEmail || "-"}`,
        `Telefon: ${guest?.phone || booking.guestPhone || "-"}`,
        `Időpont: ${booking.date} ${booking.time}`,
        booking.service ? `Szolgáltatás: ${booking.service}` : "",
        booking.note ? `Megjegyzés: ${booking.note}` : "",
      ]),
    });

    return { guestEmailResult, providerEmailResult };
  }

  async function sendBookingChangedEmails({ booking, provider, guest, oldText, newText }) {
    const guestEmailResult = await sendEmailViaSupabase({
      to: guest?.email || booking.guestEmail,
      subject: `Időpont módosítva - ${newText}`,
      type: "booking_changed_guest",
      text: buildPlainTextEmail([
        "Az időpontod módosítva lett.",
        `Szolgáltató: ${provider?.name || booking.providerName}`,
        `Régi időpont: ${oldText}`,
        `Új időpont: ${newText}`,
      ]),
      html: buildHtmlEmail("Időpont módosítva", [
        `Szolgáltató: ${provider?.name || booking.providerName}`,
        `Régi időpont: ${oldText}`,
        `Új időpont: ${newText}`,
      ]),
    });

    const providerEmailResult = await sendEmailViaSupabase({
      to: provider?.email,
      subject: `Vendég időpontot módosított - ${newText}`,
      type: "booking_changed_provider",
      text: buildPlainTextEmail([
        "Egy vendég módosította az időpontját.",
        `Vendég: ${guest?.name || booking.guestName}`,
        `Régi időpont: ${oldText}`,
        `Új időpont: ${newText}`,
      ]),
      html: buildHtmlEmail("Vendég időpontot módosított", [
        `Vendég: ${guest?.name || booking.guestName}`,
        `Régi időpont: ${oldText}`,
        `Új időpont: ${newText}`,
      ]),
    });

    return { guestEmailResult, providerEmailResult };
  }

  async function sendBookingCancelledEmail({ booking, provider }) {
    return sendEmailViaSupabase({
      to: provider?.email,
      subject: `Lemondott időpont - ${booking.date} ${booking.time}`,
      type: "booking_cancelled_provider",
      text: buildPlainTextEmail([
        "A vendég lemondta az időpontot.",
        `Vendég: ${booking.guestName || "-"}`,
        `Email: ${booking.guestEmail || "-"}`,
        `Időpont: ${booking.date} ${booking.time}`,
      ]),
      html: buildHtmlEmail("Lemondott időpont", [
        `Vendég: ${booking.guestName || "-"}`,
        `Email: ${booking.guestEmail || "-"}`,
        `Időpont: ${booking.date} ${booking.time}`,
      ]),
    });
  }

  async function sendMessageNotificationEmail({ message, recipientEmail }) {
    return sendEmailViaSupabase({
      to: recipientEmail,
      subject: `Új üzenet - ${message.fromName || "Időpontfoglaló"}`,
      type: "message_notification",
      text: buildPlainTextEmail([
        "Új üzeneted érkezett.",
        `Feladó: ${message.fromName || "-"}`,
        message.date && message.time ? `Időpont: ${message.date} ${message.time}` : "",
        "",
        message.text || "",
      ]),
      html: buildHtmlEmail("Új üzeneted érkezett", [
        `Feladó: ${message.fromName || "-"}`,
        message.date && message.time ? `Időpont: ${message.date} ${message.time}` : "",
        message.text || "",
      ]),
    });
  }

  async function sendLoginRecoveryEmail({ to, subject, lines, type }) {
    return sendEmailViaSupabase({
      to,
      subject,
      type,
      text: buildPlainTextEmail(lines),
      html: buildHtmlEmail(subject, lines),
    });
  }

  async function sendDeveloperMessage(senderType, senderName, senderEmail) {
    const text = developerMessageText.trim();
    const developerEmail = "krisz000088@gmail.com";
    const senderTypeLabel = senderType === "provider" ? "Szolgáltató" : "Vendég";

    if (!text) {
      alert("Írj be egy üzenetet.");
      return;
    }

    const emailResult = await sendEmailViaSupabase({
      to: developerEmail,
      subject: `Üzenet a fejlesztőnek - ${senderTypeLabel}: ${senderName || "Ismeretlen feladó"}`,
      type: "developer_message",
      text: buildPlainTextEmail([
        "Új üzenet érkezett a fejlesztőnek.",
        `Feladó típusa: ${senderTypeLabel}`,
        `Feladó neve: ${senderName || "-"}`,
        `Feladó email címe: ${senderEmail || "-"}`,
        "",
        "Üzenet:",
        text,
      ]),
      html: buildHtmlEmail("Új üzenet a fejlesztőnek", [
        `Feladó típusa: ${senderTypeLabel}`,
        `Feladó neve: ${senderName || "-"}`,
        `Feladó email címe: ${senderEmail || "-"}`,
        "",
        "Üzenet:",
        text,
      ]),
    });

    if (!emailResult.ok) {
      console.error("Fejlesztői üzenet email küldési hiba:", emailResult);
      alert("Az üzenetet nem sikerült elküldeni emailben. Ellenőrizd a Supabase send-email function beállításait.");
      return;
    }

    alert("Az üzenet emailben elküldve a fejlesztőnek.");
    setDeveloperMessageText("");
    setShowDeveloperContact(false);
  }

  function getBookingsForProviderDate(provider, date) {
    return getBookingsForProviderDateFromList(guestBookings, idsEqual, provider, date);
  }

  

  async function loadSupabaseData() {
    const [
      providersResult,
      guestsResult,
      slotsResult,
      bookingsResult,
      exceptionDaysResult,
      blockedGuestsResult,
      messagesResult,
    ] = await Promise.all([
      supabase.from("szolgaltatok").select("*"),
      supabase.from("vendegek").select("*"),
      supabase.from("idopontok").select("*"),
      supabase.from("foglalasok").select("*"),
      supabase.from("kivetel_napok").select("*"),
      supabase.from("letiltott_vendegek").select("*"),
      supabase.from("uzenetek").select("*"),
    ]);

    const results = [
      providersResult,
      guestsResult,
      slotsResult,
      bookingsResult,
      exceptionDaysResult,
      blockedGuestsResult,
      messagesResult,
    ];

    const firstError = results.find((result) => result.error)?.error;

    if (firstError) {
      console.error("Supabase betöltési hiba:", firstError);
      return null;
    }

    const providerRows = providersResult.data || [];
    const guestRows = guestsResult.data || [];
    const slotRows = slotsResult.data || [];
    const bookingRows = bookingsResult.data || [];
    const exceptionRows = exceptionDaysResult.data || [];
    const blockedRows = blockedGuestsResult.data || [];
    const messageRows = messagesResult.data || [];
    let providerGuestLinkRows = [];
    let breakRows = [];

    try {
      const { data: loadedBreakRows, error: breakError } = await supabase.from("szunetek").select("*");
      if (breakError) {
        if (!isMissingSupabaseTableError(breakError)) console.error("Szünetek betöltési hiba:", breakError);
      } else {
        breakRows = loadedBreakRows || [];
      }
    } catch (error) {
      console.warn("A szunetek tábla még nincs bekötve.", error);
    }

    try {
      providerGuestLinkRows = await loadProviderGuestLinksFromSupabase();
    } catch (error) {
      console.error("Vendég-szolgáltató kapcsolatok betöltési hiba:", error);
    }

    const providerMap = new Map();
    const guestMap = new Map();
    const slotMap = new Map();

    providerRows.forEach((row) => {
      const provider = mapSupabaseProvider(row);
      providerMap.set(row.id, provider);
    });

    guestRows.forEach((row) => {
      const guest = mapSupabaseGuest(row);
      guestMap.set(row.id, guest);
    });

    await cleanupOrphanProviderGuestLinks(providerGuestLinkRows, providerMap, guestMap);

    exceptionRows.forEach((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      if (!provider || !row.datum) return;

      provider.exceptionDates = [...new Set([...(provider.exceptionDates || []), row.datum])].sort();
    });

    blockedRows.forEach((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      if (!provider || !row.vendeg_email) return;

      provider.blockedEmails = [
        ...new Set([...(provider.blockedEmails || []), normalizeEmail(row.vendeg_email)]),
      ];
    });

    providerGuestLinkRows.forEach((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      const guest = guestMap.get(row.vendeg_id);

      if (!provider || !guest) return;

      guest.providerIds = [...new Set([...(guest.providerIds || []), provider.id])];
    });

    breakRows.forEach((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      if (!provider) return;

      provider.breaks = [
        ...(provider.breaks || []),
        {
          id: row.id || `${row.tipus || "weekly"}-${row.nap || row.datum}-${row.kezdet}-${row.veg}`,
          type: row.tipus || (row.datum ? "single" : "weekly"),
          day: row.nap || "",
          date: row.datum || "",
          start: formatTimeFromSupabase(row.kezdet),
          end: formatTimeFromSupabase(row.veg),
        },
      ];
    });

    slotRows.forEach((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      if (!provider || !row.datum || !row.ido) return;

      const normalizedTime = formatTimeFromSupabase(row.ido);
      const slot = {
        id: row.id,
        date: row.datum,
        day: getHungarianDayName(new Date(`${row.datum}T00:00:00`)),
        time: normalizedTime,
        booked: Boolean(row.foglalt),
        bookedBy: "",
        guestId: null,
        guestEmail: "",
        guestPhone: "",
        service: "",
        note: "",
      };

      provider.slots = [...(provider.slots || []), slot];
      slotMap.set(row.id, slot);
      slotMap.set(`${row.szolgaltato_id}|${row.datum}|${normalizedTime}`, slot);
    });

    const localStoredBookings = (() => {
      try {
        return JSON.parse(localStorage.getItem("guestBookings")) || [];
      } catch (error) {
        console.warn("Helyi foglalás adatok olvasása nem sikerült:", error);
        return [];
      }
    })();

    const localBookingCandidates = [...(guestBookings || []), ...localStoredBookings];

    const localStoredProvidersForBookingFallback = (() => {
      try {
        return JSON.parse(localStorage.getItem("providers")) || [];
      } catch (error) {
        console.warn("Helyi szolgáltató adatok olvasása nem sikerült:", error);
        return [];
      }
    })();

    const localProviderCandidatesForBookingFallback = [...(providers || []), ...localStoredProvidersForBookingFallback];

    function findLocalSlotFallback(row, provider, guest) {
      const matchingProviders = localProviderCandidatesForBookingFallback.filter((localProvider) => {
        if (!localProvider) return false;
        if (provider && (idsEqual(localProvider.id, provider.id) || normalizeEmail(localProvider.email) === normalizeEmail(provider.email))) return true;
        return idsEqual(localProvider.id, row.szolgaltato_id);
      });

      for (const localProvider of matchingProviders) {
        const slots = Array.isArray(localProvider.slots) ? localProvider.slots : [];
        const foundSlot = slots.find((slot) => {
          if (!slot) return false;
          if (row.idopont_id && idsEqual(slot.id, row.idopont_id)) return true;
          if (guest && slot.guestId && idsEqual(slot.guestId, guest.id)) return true;
          if (guest && slot.guestEmail && normalizeEmail(slot.guestEmail) === normalizeEmail(guest.email)) return true;
          return false;
        });

        if (foundSlot) return foundSlot;
      }

      return null;
    }

    function findLocalBookingFallback(row, provider, guest, slot) {
      return localBookingCandidates.find((booking) => {
        if (!booking) return false;
        if (row.id && idsEqual(booking.id, row.id)) return true;
        if (slot?.id && idsEqual(booking.slotId, slot.id)) return true;
        if (row.idopont_id && idsEqual(booking.slotId, row.idopont_id)) return true;

        const sameProvider = provider
          ? idsEqual(booking.providerId, provider.id) || normalizeEmail(booking.providerName) === normalizeEmail(provider.name)
          : idsEqual(booking.providerId, row.szolgaltato_id);
        const sameGuest = guest
          ? idsEqual(booking.guestId, guest.id) || normalizeEmail(booking.guestEmail) === normalizeEmail(guest.email)
          : idsEqual(booking.guestId, row.vendeg_id);

        return Boolean(sameProvider && sameGuest && booking.date && booking.time);
      }) || null;
    }

    const loadedBookings = bookingRows.map((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      const guest = guestMap.get(row.vendeg_id);
      const slot =
        slotMap.get(row.idopont_id) ||
        (row.datum && row.ido ? slotMap.get(`${row.szolgaltato_id}|${row.datum}|${formatTimeFromSupabase(row.ido)}`) : null);
      const localSlotFallback = slot || findLocalSlotFallback(row, provider, guest);
      const localFallback = findLocalBookingFallback(row, provider, guest, localSlotFallback);

      const bookingDate = slot?.date || row.datum || localFallback?.date || localSlotFallback?.date || "";
      const bookingTime = slot?.time || formatTimeFromSupabase(row.ido) || localFallback?.time || localSlotFallback?.time || "";
      const bookingDay = slot?.day || localFallback?.day || localSlotFallback?.day || (bookingDate ? getHungarianDayName(new Date(`${bookingDate}T00:00:00`)) : "");
      const bookingService = row.szolgaltatas || localFallback?.service || "";
      const bookingNote = row.megjegyzes || localFallback?.note || "";

      if (slot && guest) {
        slot.booked = true;
        slot.bookedBy = guest.name || localFallback?.guestName || "";
        slot.guestId = guest.id;
        slot.guestEmail = guest.email || localFallback?.guestEmail || "";
        slot.guestPhone = guest.phone || localFallback?.guestPhone || "";
        slot.service = bookingService;
        slot.note = bookingNote;
      }

      if (guest && provider && !guest.providerIds.some((providerId) => idsEqual(providerId, provider.id))) {
        guest.providerIds = [...guest.providerIds, provider.id];
      }

      if (provider) {
        provider.notifications = [
          {
            id: row.id,
            text: `${guest?.name || localFallback?.guestName || "Vendég"} lefoglalta ezt az időpontot: ${bookingDate} ${bookingTime}`,
            note: bookingNote,
            service: bookingService,
          },
          ...(provider.notifications || []),
        ];
      }

      return {
        id: row.id || localFallback?.id || Date.now(),
        guestId: guest?.id || row.vendeg_id || localFallback?.guestId,
        guestName: guest?.name || localFallback?.guestName || "",
        guestEmail: guest?.email || localFallback?.guestEmail || "",
        guestPhone: guest?.phone || localFallback?.guestPhone || "",
        providerId: provider?.id || row.szolgaltato_id || localFallback?.providerId,
        providerName: provider?.name || localFallback?.providerName || "",
        slotId: slot?.id || row.idopont_id || localFallback?.slotId || localSlotFallback?.id,
        date: bookingDate,
        day: bookingDay,
        time: bookingTime,
        service: bookingService,
        note: bookingNote,
        active: true,
        cancelledByProvider: false,
        providerCancelMessage: "",
        changed: false,
        oldDate: "",
        oldTime: "",
      };
    });


    const localCancelledBookings = localBookingCandidates
      .filter((booking) => booking && !booking.active && (booking.cancelledByGuest || booking.cancelledByProvider))
      .map((booking) => ({
        ...booking,
        active: false,
        cancelledByGuest: booking.cancelledByGuest === true,
        cancelledByProvider: booking.cancelledByProvider === true,
        providerCancelMessage: booking.providerCancelMessage || "",
      }));

    const loadedBookingKeys = new Set(
      loadedBookings.map((booking) =>
        `${normalizeId(booking.id)}|${normalizeId(booking.slotId)}|${String(booking.date || "").trim()}|${String(booking.time || "").trim()}`
      )
    );

    localCancelledBookings.forEach((booking) => {
      const cancelledKey = `${normalizeId(booking.id)}|${normalizeId(booking.slotId)}|${String(booking.date || "").trim()}|${String(booking.time || "").trim()}`;
      if (!loadedBookingKeys.has(cancelledKey)) {
        loadedBookings.push(booking);
        loadedBookingKeys.add(cancelledKey);
      }
    });

    const loadedMessages = messageRows.map((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      const guest = guestMap.get(row.vendeg_id);
      const slot = slotMap.get(row.idopont_id);
      const sender = row.kuldo || row.felado || row.kuldo_tipus || "message";
      const text = row.uzenet || "";

      const message = {
        id: row.id,
        providerId: provider?.id || row.szolgaltato_id,
        providerName: provider?.name || "",
        guestId: guest?.id || row.vendeg_id,
        guestName: guest?.name || "",
        guestEmail: guest?.email || "",
        slotId: slot?.id || row.idopont_id || "",
        date: slot?.date || "",
        time: slot?.time || "",
        from: sender,
        fromName: sender === "provider" ? provider?.name || "Szolgáltató" : guest?.name || "Vendég",
        toName: sender === "provider" ? guest?.name || "Vendég" : provider?.name || "Szolgáltató",
        text,
        type: row.tipus || "message",
        createdAt: row.letrehozva || "",
      };

      const notificationDateText = slot?.date && slot?.time ? `${slot.date} ${slot.time}` : "";
      const messageType = row.tipus || "message";
      const providerNotificationText =
        messageType === "change"
          ? `${guest?.name || "Vendég"} módosította az időpontját${notificationDateText ? `: ${notificationDateText}` : ""}`
          : messageType === "cancel"
            ? `${guest?.name || "Vendég"} lemondta az időpontját${notificationDateText ? `: ${notificationDateText}` : ""}`
            : `${message.fromName} üzenetet küldött${notificationDateText ? `: ${notificationDateText}` : ""}`;
      const guestNotificationText =
        messageType === "provider_cancel"
          ? `${provider?.name || "Szolgáltató"} törölte az időpontodat${notificationDateText ? `: ${notificationDateText}` : ""}`
          : messageType === "change"
            ? `Az időpont módosítva lett${notificationDateText ? `: ${notificationDateText}` : ""}`
            : `${message.fromName} üzenetet küldött${notificationDateText ? `: ${notificationDateText}` : ""}`;

      if (provider) {
        provider.notifications = [
          {
            id: row.id,
            text: providerNotificationText,
            note: text,
            type: messageType,
          },
          ...(provider.notifications || []),
        ];
      }

      if (guest) {
        guest.notifications = [
          {
            id: row.id,
            text: guestNotificationText,
            message: text,
            type: messageType,
          },
          ...(guest.notifications || []),
        ];
      }

      return message;
    });

    const localStoredProviders = (() => {
      try {
        return JSON.parse(localStorage.getItem("providers")) || [];
      } catch (error) {
        console.warn("Helyi szolgáltató adatok olvasása nem sikerült:", error);
        return [];
      }
    })();

    const localProviderCandidates = [...(providers || []), ...localStoredProviders];

    function mergeLocalSlotsIntoProvider(provider) {
      const matchingLocalProvider = localProviderCandidates.find(
        (localProvider) =>
          localProvider &&
          (
            idsEqual(localProvider.id, provider.id) ||
            normalizeEmail(localProvider.email) === normalizeEmail(provider.email)
          )
      );

      const localSlots = Array.isArray(matchingLocalProvider?.slots) ? matchingLocalProvider.slots : [];
      const supabaseSlots = Array.isArray(provider.slots) ? provider.slots : [];

      if (localSlots.length === 0) {
        return supabaseSlots;
      }

      const slotMap = new Map();

      supabaseSlots.forEach((slot) => {
        if (!slot || !slot.date || !slot.time) return;
        const normalizedTime = String(slot.time).slice(0, 5);
        slotMap.set(`${slot.date}-${normalizedTime}`, {
          ...slot,
          time: normalizedTime,
        });
      });

      localSlots.forEach((slot) => {
        if (!slot || !slot.date || !slot.time) return;
        const normalizedTime = String(slot.time).slice(0, 5);
        const key = `${slot.date}-${normalizedTime}`;

        if (!slotMap.has(key)) {
          slotMap.set(key, {
            ...slot,
            time: normalizedTime,
          });
        }
      });

      return Array.from(slotMap.values()).sort((a, b) =>
        `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`)
      );
    }

    const loadedProviders = Array.from(providerMap.values()).map((provider) => ({
      ...provider,
      exceptionDates: [...new Set(provider.exceptionDates || [])].sort(),
      breaks: Array.isArray(provider.breaks) ? provider.breaks : [],
      blockedEmails: [...new Set(provider.blockedEmails || [])],
      slots: (provider.slots || []).sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`)),
      notifications: getVisibleProviderNotifications(provider),
    }));

    const loadedGuests = Array.from(guestMap.values()).map((guest) => ({
      ...guest,
      providerIds: filterExistingProviderIds(guest.providerIds || [], Array.from(providerMap.values())),
      notifications: guest.notifications || [],
    }));

    const sortedMessages = loadedMessages.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    setProviders(loadedProviders);
    setGuests(loadedGuests);
    setGuestBookings(loadedBookings);
    setMessages(sortedMessages);

    setActiveProvider((currentActiveProvider) => {
      if (!currentActiveProvider) return currentActiveProvider;
      return loadedProviders.find((provider) => idsEqual(provider.id, currentActiveProvider.id)) || currentActiveProvider;
    });

    setActiveGuest((currentActiveGuest) => {
      if (!currentActiveGuest) return currentActiveGuest;
      return loadedGuests.find((guest) => idsEqual(guest.id, currentActiveGuest.id)) || currentActiveGuest;
    });

    return {
      providers: loadedProviders,
      guests: loadedGuests,
      guestBookings: loadedBookings,
      messages: sortedMessages,
    };
  }

  function isGuestBlockedByProvider(provider, guestEmail) {
    if (!provider || !guestEmail || !Array.isArray(provider.blockedEmails)) return false;

    return provider.blockedEmails.some(
      (email) => email.toLowerCase() === guestEmail.toLowerCase()
    );
  }

  async function isGuestBlockedInSupabase(provider, guestEmail) {
    if (!provider || !guestEmail) return false;

    const providerDbId = await getSupabaseProviderId(provider);

    if (!providerDbId) return false;

    const { data, error } = await supabase
      .from("letiltott_vendegek")
      .select("id")
      .eq("szolgaltato_id", providerDbId)
      .ilike("vendeg_email", guestEmail.trim())
      .maybeSingle();

    if (error) {
      console.error(error);
      return false;
    }

    return Boolean(data);
  }

  function guestAlreadyHasBookingOnDate(providerId, guestEmail, date) {
    return guestAlreadyHasBookingOnDateFromList(guestBookings, idsEqual, providerId, guestEmail, date);
  }

  function renderCalendar(provider, selectedDate, onSelectDate) {
    return (
      <CalendarView
        provider={provider}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        groupDatesByMonth={groupDatesByMonth}
        getDaysInMonth={getDaysInMonth}
        getMondayBasedStartIndex={getMondayBasedStartIndex}
        getMonthLabel={getMonthLabel}
        getDateTextFromMonthAndDay={getDateTextFromMonthAndDay}
        isExceptionDate={isExceptionDate}
        hasAvailableSlotOnDate={hasAvailableSlotOnDate}
        isFullyBookedDate={isFullyBookedDate}
        premiumCalendarCardStyle={premiumCalendarCardStyle}
        premiumCalendarGridStyle={premiumCalendarGridStyle}
        premiumCalendarDayBaseStyle={premiumCalendarDayBaseStyle}
      />
    );
  }

  function refreshProviderViews(updatedProviders, providerId) {
    const freshProvider = updatedProviders.find((p) => idsEqual(p.id, providerId));

    if (activeProvider && idsEqual(activeProvider.id, providerId)) {
      setActiveProvider(freshProvider);
    }

    if (selectedProvider && idsEqual(selectedProvider.id, providerId)) {
      setSelectedProvider(freshProvider);
    }

    if (changeProvider && idsEqual(changeProvider.id, providerId)) {
      setChangeProvider(freshProvider);
    }
  }

  function refreshGuestViews(updatedGuests, guestId) {
    const freshGuest = updatedGuests.find((g) => g.id === guestId);

    if (activeGuest && activeGuest.id === guestId) {
      setActiveGuest(freshGuest);
    }
  }


  function renderProviderCalendar(provider, selectedDate, onSelectDate) {
    return (
      <ProviderCalendarView
        provider={provider}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        getAllDates={getAllDates}
        groupDatesByMonth={groupDatesByMonth}
        getDaysInMonth={getDaysInMonth}
        getMondayBasedStartIndex={getMondayBasedStartIndex}
        getMonthLabel={getMonthLabel}
        getDateTextFromMonthAndDay={getDateTextFromMonthAndDay}
        isExceptionDate={isExceptionDate}
        hasAnySlotOnDate={hasAnySlotOnDate}
        isFullyBookedDate={isFullyBookedDate}
        premiumCalendarCardStyle={premiumCalendarCardStyle}
        premiumCalendarGridStyle={premiumCalendarGridStyle}
        premiumCalendarDayBaseStyle={premiumCalendarDayBaseStyle}
      />
    );
  }

  function normalizeGuestCode(code) {
    return String(code || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "-")
      .replace(/[^A-Z0-9_-]/g, "");
  }

  function isValidGuestCode(code) {
    const normalizedCode = normalizeGuestCode(code);
    const visibleLength = normalizedCode.replace(/[-_]/g, "").length;

    return normalizedCode.length >= 6 && visibleLength >= 3 && /^[A-Z0-9_-]+$/.test(normalizedCode);
  }

  async function createProvider() {
    const normalizedGuestCode = normalizeGuestCode(guestCode);

    if (!providerName || !providerEmail || !providerPin || !normalizedGuestCode) {
      alert("Add meg a nevet, az email címet, a 4 jegyű PIN-t és a vendégkódot.");
      return;
    }

    if (providerPin.length !== 4) {
      alert("A PIN legyen pontosan 4 számjegy.");
      return;
    }

    if (!isValidGuestCode(normalizedGuestCode)) {
      alert("A vendégkód legalább 6 karakter legyen. Használhatsz nagybetűt, számot, kötőjelet és aláhúzást.");
      return;
    }

    if (providers.some((p) => (p.email || "").toLowerCase() === providerEmail.toLowerCase())) {
      alert("Ezzel az email címmel már van szolgáltató regisztrálva.");
      return;
    }

    if (providers.some((p) => (p.guestCode || "").toUpperCase() === normalizedGuestCode)) {
      alert("Ez a vendégkód már foglalt.");
      return;
    }

    const newProvider = {
      id: Date.now(),
      name: providerName,
      email: providerEmail,
      phone: providerPhone,
      pin: providerPin,
      guestCode: normalizedGuestCode,
      workDays: [],
      workStart: "08:00",
      workEnd: "16:00",
      slotLength: 60,
      weeksAhead: 4,
      exceptionDates: [],
      breaks: [],
      services: [],
      blockedEmails: [],
      slots: [],
      notifications: [],
      emailNotifications: providerEmailNotifications,
      pinLoginEnabled: true,
      slotWarningEnabled: false,
      slotWarningWeeks: 1,
    };

    setProviders([...providers, newProvider]);

    const providerInsertRow = {
      nev: providerName,
      profilnev: "",
      email: providerEmail,
      telefon: providerPhone,
      pin: providerPin,
      vendegkod: normalizedGuestCode,
      email_ertesites: providerEmailNotifications,
      pin_belepes: true,
      idopont_figyelmeztetes: false,
      idopont_figyelmeztetes_hetek: 1,
    };

    let { error } = await supabase.from("szolgaltatok").insert([providerInsertRow]);

    if (error && (
      String(error.message || "").toLowerCase().includes("telefon") ||
      String(error.message || "").toLowerCase().includes("email_ertesites") ||
      String(error.message || "").toLowerCase().includes("pin_belepes") ||
      String(error.message || "").toLowerCase().includes("idopont_figyelmeztetes") ||
      String(error.message || "").toLowerCase().includes("idopont_figyelmeztetes_hetek")
    )) {
      const { telefon, email_ertesites, pin_belepes, idopont_figyelmeztetes, idopont_figyelmeztetes_hetek, ...fallbackProviderRow } = providerInsertRow;
      const fallbackResult = await supabase.from("szolgaltatok").insert([fallbackProviderRow]);
      error = fallbackResult.error;
    }

    if (error) {
      console.error(error);
      alert("A szolgáltató helyben létrejött, de Supabase-be nem sikerült menteni. Nézd meg a Console hibát.");
    } else {
      alert(`Szolgáltató létrehozva és Supabase-be is elmentve!\nNév: ${providerName}\nBelépési email: ${providerEmail}\nPIN: ${providerPin}\nVendégkód: ${normalizedGuestCode}`);
    }

    setProviderName("");
    setProviderEmail("");
    setProviderPhone("");
    setProviderPin("");
    setGuestCode("");
    setLoginUsername(providerEmail);
    setMode("providerLogin");
  }

  function mapSupabaseProvider(row) {
    return {
      id: row.id,
      name: row.nev || "",
      email: row.email || "",
      phone: row.telefon || "",
      pin: row.pin || "",
      guestCode: row.vendegkod || "",
      workDays: [],
      workStart: "08:00",
      workEnd: "16:00",
      slotLength: 60,
      weeksAhead: 4,
      exceptionDates: [],
      breaks: [],
      services: [],
      blockedEmails: [],
      slots: [],
      notifications: [],
      emailNotifications: row.email_ertesites ?? true,
      pinLoginEnabled: row.pin_belepes !== false,
      slotWarningEnabled: row.idopont_figyelmeztetes === true,
      slotWarningWeeks: Number(row.idopont_figyelmeztetes_hetek || 1),
    };
  }

  async function providerLogin() {
    const loginEmail = (loginUsername || "").trim();
    const loginEmailLower = loginEmail.toLowerCase();
    const loginPinValue = (loginPin || "").trim();

    if (!loginEmail) {
      alert("Add meg az email címet.");
      return;
    }

    const freshData = await loadSupabaseData();
    const providerSource = freshData?.providers || providers;

    let found = null;

    const { data: directProviderRow, error: directProviderError } = await supabase
      .from("szolgaltatok")
      .select("*")
      .ilike("email", loginEmail)
      .maybeSingle();

    if (directProviderError) {
      console.error(directProviderError);
      alert("Supabase bejelentkezési hiba. Nézd meg a Console hibát.");
      return;
    }

    if (directProviderRow) {
      const mappedProvider = mapSupabaseProvider(directProviderRow);
      found =
        providerSource.find((provider) => idsEqual(provider.id, mappedProvider.id)) ||
        providerSource.find((provider) => normalizeEmail(provider.email) === normalizeEmail(mappedProvider.email)) ||
        mappedProvider;

      found = {
        ...found,
        ...mappedProvider,
        slots: Array.isArray(found.slots) ? found.slots : [],
        notifications: Array.isArray(found.notifications) ? found.notifications : [],
        services: Array.isArray(found.services) ? found.services : [],
        exceptionDates: Array.isArray(found.exceptionDates) ? found.exceptionDates : [],
        breaks: Array.isArray(found.breaks) ? found.breaks : [],
        blockedEmails: Array.isArray(found.blockedEmails) ? found.blockedEmails : [],
      };
    } else {
      found = providerSource.find((p) => normalizeEmail(p.email) === loginEmailLower);
    }

    if (!found) {
      alert("Nem találtam szolgáltatót ezzel az email címmel.");
      return;
    }

    const needsPin = found.pinLoginEnabled !== false;

    if (needsPin && !loginPinValue) {
      alert("Ehhez a szolgáltatói fiókhoz PIN szükséges.");
      return;
    }

    if (needsPin && String(found.pin || "") !== loginPinValue) {
      alert("Hibás email cím vagy PIN.");
      return;
    }

    const normalizedProvider = {
      ...found,
      slots: Array.isArray(found.slots) ? found.slots : [],
      notifications: Array.isArray(found.notifications) ? found.notifications : [],
      services: Array.isArray(found.services) ? found.services : [],
      exceptionDates: Array.isArray(found.exceptionDates) ? found.exceptionDates : [],
      breaks: Array.isArray(found.breaks) ? found.breaks : [],
      blockedEmails: Array.isArray(found.blockedEmails) ? found.blockedEmails : [],
      emailNotifications: found.emailNotifications ?? true,
      pinLoginEnabled: found.pinLoginEnabled !== false,
      slotWarningEnabled: found.slotWarningEnabled === true,
      slotWarningWeeks: Number(found.slotWarningWeeks || 1),
    };

    setProviders((currentProviders) => {
      const withoutDuplicate = currentProviders.filter(
        (provider) => !idsEqual(provider.id, normalizedProvider.id) && normalizeEmail(provider.email) !== normalizeEmail(normalizedProvider.email)
      );
      return [...withoutDuplicate, normalizedProvider];
    });
    setActiveProvider(normalizedProvider);
    setProviderEmailNotifications(normalizedProvider.emailNotifications !== false);
    setProviderOverviewPanel("todayBookings");
    setWorkDays(normalizedProvider.workDays || []);
    setWorkStart(normalizedProvider.workStart || "08:00");
    setWorkEnd(normalizedProvider.workEnd || "16:00");
    setSlotLength(normalizedProvider.slotLength || 60);
    setWeeksAhead(normalizedProvider.weeksAhead || 4);
    setProviderCalendarDate("");
    setLoginUsername("");
    setLoginPin("");
  }

  function isLikelyUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || ""));
  }

  async function getSupabaseProviderId(provider) {
    if (!provider) return null;

    if (isLikelyUuid(provider.id)) {
      return provider.id;
    }

    const providerEmailValue = (provider.email || "").trim();

    if (!providerEmailValue) {
      return null;
    }

    const { data, error } = await supabase
      .from("szolgaltatok")
      .select("id")
      .ilike("email", providerEmailValue)
      .maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data?.id || null;
  }


  async function getSupabaseGuestId(guest) {
    if (!guest) return null;

    if (isLikelyUuid(guest.id)) {
      return guest.id;
    }

    const guestEmailValue = (guest.email || "").trim();

    if (!guestEmailValue) {
      return null;
    }

    const { data, error } = await supabase
      .from("vendegek")
      .select("id")
      .ilike("email", guestEmailValue)
      .maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data?.id || null;
  }

  async function getSupabaseSlotId(provider, slot) {
    if (!provider || !slot) return null;

    if (isLikelyUuid(slot.id)) {
      return slot.id;
    }

    const providerDbId = await getSupabaseProviderId(provider);

    if (!providerDbId || !slot.date || !slot.time) {
      return null;
    }

    const { data, error } = await supabase
      .from("idopontok")
      .select("id")
      .eq("szolgaltato_id", providerDbId)
      .eq("datum", slot.date)
      .eq("ido", slot.time)
      .maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data?.id || null;
  }

  async function findSupabaseBookingId(booking, providerDbId, guestDbId, slotDbId) {
    if (booking && isLikelyUuid(booking.id)) {
      return booking.id;
    }

    if (!providerDbId || !guestDbId || !slotDbId) {
      return null;
    }

    const { data, error } = await supabase
      .from("foglalasok")
      .select("id")
      .eq("szolgaltato_id", providerDbId)
      .eq("vendeg_id", guestDbId)
      .eq("idopont_id", slotDbId)
      .maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data?.id || null;
  }

  async function syncBookingCancellationToSupabase(booking, provider, slot) {
    const providerDbId = await getSupabaseProviderId(provider);
    const guestDbId = await getSupabaseGuestId({
      id: booking.guestId,
      email: booking.guestEmail,
    });
    const slotDbId = await getSupabaseSlotId(provider, slot || {
      id: booking.slotId,
      date: booking.date,
      time: booking.time,
    });

    if (!providerDbId || !guestDbId || !slotDbId) {
      return { ok: false, reason: "Hiányzik a Supabase szolgáltató, vendég vagy időpont azonosító." };
    }

    const bookingDbId = await findSupabaseBookingId(booking, providerDbId, guestDbId, slotDbId);

    if (bookingDbId) {
      const { error: deleteError } = await supabase
        .from("foglalasok")
        .delete()
        .eq("id", bookingDbId);

      if (deleteError) {
        console.error(deleteError);
        return { ok: false, error: deleteError };
      }
    } else {
      const { error: deleteError } = await supabase
        .from("foglalasok")
        .delete()
        .eq("szolgaltato_id", providerDbId)
        .eq("vendeg_id", guestDbId)
        .eq("idopont_id", slotDbId);

      if (deleteError) {
        console.error(deleteError);
        return { ok: false, error: deleteError };
      }
    }

    const { error: slotError } = await supabase
      .from("idopontok")
      .update({ foglalt: false })
      .eq("id", slotDbId);

    if (slotError) {
      console.error(slotError);
      return { ok: false, error: slotError };
    }

    return { ok: true };
  }

  async function syncBookingChangeToSupabase(booking, provider, oldSlot, newSlot) {
    const providerDbId = await getSupabaseProviderId(provider);
    const guestDbId = await getSupabaseGuestId({
      id: booking.guestId,
      email: booking.guestEmail || activeGuest?.email,
    });
    const oldSlotDbId = await getSupabaseSlotId(provider, oldSlot || {
      id: booking.slotId,
      date: booking.date,
      time: booking.time,
    });
    const newSlotDbId = await getSupabaseSlotId(provider, newSlot);

    if (!providerDbId || !guestDbId || !oldSlotDbId || !newSlotDbId) {
      return { ok: false, reason: "Hiányzik a Supabase szolgáltató, vendég vagy időpont azonosító." };
    }

    const bookingDbId = await findSupabaseBookingId(booking, providerDbId, guestDbId, oldSlotDbId);

    if (bookingDbId) {
      const { error: updateBookingError } = await supabase
        .from("foglalasok")
        .update({
          idopont_id: newSlotDbId,
          szolgaltatas: booking.service || "",
          megjegyzes: booking.note || "",
        })
        .eq("id", bookingDbId);

      if (updateBookingError) {
        console.error(updateBookingError);
        return { ok: false, error: updateBookingError };
      }
    } else {
      const { error: deleteOldError } = await supabase
        .from("foglalasok")
        .delete()
        .eq("szolgaltato_id", providerDbId)
        .eq("vendeg_id", guestDbId)
        .eq("idopont_id", oldSlotDbId);

      if (deleteOldError) {
        console.error(deleteOldError);
        return { ok: false, error: deleteOldError };
      }

      const { error: insertNewError } = await supabase.from("foglalasok").insert([
        {
          szolgaltato_id: providerDbId,
          vendeg_id: guestDbId,
          idopont_id: newSlotDbId,
          szolgaltatas: booking.service || "",
          megjegyzes: booking.note || "",
        },
      ]);

      if (insertNewError) {
        console.error(insertNewError);
        return { ok: false, error: insertNewError };
      }
    }

    const { error: freeOldSlotError } = await supabase
      .from("idopontok")
      .update({ foglalt: false })
      .eq("id", oldSlotDbId);

    if (freeOldSlotError) {
      console.error(freeOldSlotError);
      return { ok: false, error: freeOldSlotError };
    }

    const { error: bookNewSlotError } = await supabase
      .from("idopontok")
      .update({ foglalt: true })
      .eq("id", newSlotDbId);

    if (bookNewSlotError) {
      console.error(bookNewSlotError);
      return { ok: false, error: bookNewSlotError };
    }

    return { ok: true };
  }


  async function saveMessageToSupabase(message, options = {}) {
    const provider =
      options.provider ||
      providers.find((p) => idsEqual(p.id, message.providerId)) ||
      selectedProvider ||
      activeProvider;

    const guest =
      options.guest ||
      guests.find((g) => idsEqual(g.id, message.guestId)) ||
      guests.find((g) => (g.email || "").toLowerCase() === (message.guestEmail || "").toLowerCase()) ||
      activeGuest;

    const slot =
      options.slot ||
      (provider && Array.isArray(provider.slots)
        ? provider.slots.find((s) => s.id === message.slotId)
        : null) ||
      (message.date && message.time ? { id: message.slotId, date: message.date, time: message.time } : null);

    const providerDbId = await getSupabaseProviderId(provider);
    const guestDbId = await getSupabaseGuestId(guest);
    const slotDbId = slot ? await getSupabaseSlotId(provider, slot) : null;

    if (!providerDbId || !guestDbId) {
      return { ok: false, reason: "Hiányzik a Supabase szolgáltató vagy vendég azonosító." };
    }

    const sender = message.from || "message";
    const textValue = message.text || "";
    const typeValue = message.type || "message";

    const row = {
      szolgaltato_id: providerDbId,
      vendeg_id: guestDbId,
      kuldo: sender,
      uzenet: textValue,
      tipus: typeValue,
    };

    if (slotDbId) {
      row.idopont_id = slotDbId;
    }

    const { error } = await supabase.from("uzenetek").insert([row]);

    if (!error) {
      return { ok: true };
    }

    console.error(error);
    return { ok: false, error };
  }


  async function createGuest() {
    if (!guestName || !guestEmail || !guestPin) {
      alert("Add meg a vendég nevét, email címét és PIN-jét.");
      return;
    }

    if (guestPin.length !== 4) {
      alert("A vendég PIN legyen pontosan 4 számjegy.");
      return;
    }

    const sameGuestExists = guests.some(
      (g) => g.name.toLowerCase() === guestName.toLowerCase() && g.pin === guestPin
    );

    if (sameGuestExists) {
      alert("Ez a vendég ezzel a névvel és PIN-nel már létezik.");
      return;
    }

    if (guests.some((g) => (g.email || "").toLowerCase() === guestEmail.toLowerCase())) {
      alert("Ezzel az email címmel már van vendég regisztrálva.");
      return;
    }

    const newGuest = {
      id: Date.now(),
      name: guestName,
      email: guestEmail,
      phone: guestPhone,
      pin: guestPin,
      providerIds: [],
      notifications: [],
      emailNotifications: guestEmailNotifications,
      pinLoginEnabled: true,
    };

    setGuests([...guests, newGuest]);

    const guestInsertRow = {
      nev: guestName,
      email: guestEmail,
      telefon: guestPhone,
      pin: guestPin,
      email_ertesites: guestEmailNotifications,
      pin_belepes: true,
    };

    let { error } = await supabase.from("vendegek").insert([guestInsertRow]);

    if (error && String(error.message || "").toLowerCase().includes("telefon")) {
      console.warn("A vendegek.telefon oszlop még nem létezik, ezért telefonszám nélkül mentem.", error);

      const { telefon, email_ertesites, pin_belepes, ...fallbackGuestRow } = guestInsertRow;
      const { error: fallbackError } = await supabase.from("vendegek").insert([fallbackGuestRow]);

      if (fallbackError) {
        console.error(fallbackError);
        alert("A vendég helyben létrejött, de Supabase-be nem sikerült menteni. Nézd meg a Console hibát.");
      } else {
        alert(`Vendég létrehozva és Supabase-be is elmentve!\nNév: ${guestName}\nEmail: ${guestEmail}\nPIN: ${guestPin}\n\nFigyelem: a telefonszám mentéséhez futtasd a telefon oszlopot létrehozó SQL-t.`);
      }

      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setGuestPin("");
      setGuestLoginEmail(guestEmail);
      setMode("guestLogin");
      return;
    }

    if (error && (String(error.message || "").toLowerCase().includes("email_ertesites") || String(error.message || "").toLowerCase().includes("pin_belepes"))) {
      const { email_ertesites, pin_belepes, ...fallbackGuestRow } = guestInsertRow;
      const fallbackResult = await supabase.from("vendegek").insert([fallbackGuestRow]);
      error = fallbackResult.error;
    }

    if (error) {
      console.error(error);
      alert("A vendég helyben létrejött, de Supabase-be nem sikerült menteni. Nézd meg a Console hibát.");
    } else {
      alert(`Vendég létrehozva és Supabase-be is elmentve!\nNév: ${guestName}\nEmail: ${guestEmail}\nPIN: ${guestPin}`);
    }

    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setGuestPin("");
    setGuestLoginEmail(guestEmail);
    setMode("guestLogin");
  }

  function mapSupabaseGuest(row) {
    return {
      id: row.id,
      name: row.nev || "",
      email: row.email || "",
      phone: row.telefon || "",
      pin: row.pin || "",
      providerIds: [],
      notifications: [],
      emailNotifications: row.email_ertesites ?? true,
      pinLoginEnabled: row.pin_belepes !== false,
    };
  }

  async function updateProviderPreference(field, value) {
    if (!activeProvider) return;

    const updatedProvider = { ...activeProvider, [field]: value };
    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id ? { ...provider, [field]: value } : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProvider);

    if (field === "emailNotifications") setProviderEmailNotifications(value);

    const providerDbId = await getSupabaseProviderId(activeProvider);
    if (!providerDbId) return;

    const providerPreferenceColumns = {
      pinLoginEnabled: "pin_belepes",
      emailNotifications: "email_ertesites",
      slotWarningEnabled: "idopont_figyelmeztetes",
      slotWarningWeeks: "idopont_figyelmeztetes_hetek",
    };
    const column = providerPreferenceColumns[field];

    if (!column) return;

    const { error } = await supabase
      .from("szolgaltatok")
      .update({ [column]: value })
      .eq("id", providerDbId);

    if (error) {
      console.warn("A beállítás helyben frissült, de Supabase-ben még hiányozhat az oszlop:", error);
      alert("A beállítás helyben frissült. Ha újratöltés után nem marad meg, futtasd a megadott Supabase SQL-t.");
    }
  }

  async function updateGuestPreference(field, value) {
    if (!activeGuest) return;

    const updatedGuest = { ...activeGuest, [field]: value };
    const updatedGuests = guests.map((guest) =>
      guest.id === activeGuest.id ? { ...guest, [field]: value } : guest
    );

    setGuests(updatedGuests);
    setActiveGuest(updatedGuest);

    if (field === "emailNotifications") setGuestEmailNotifications(value);

    const guestDbId = await getSupabaseGuestId(activeGuest);
    if (!guestDbId) return;

    const column = field === "pinLoginEnabled" ? "pin_belepes" : "email_ertesites";
    const { error } = await supabase
      .from("vendegek")
      .update({ [column]: value })
      .eq("id", guestDbId);

    if (error) {
      console.warn("A beállítás helyben frissült, de Supabase-ben még hiányozhat az oszlop:", error);
      alert("A beállítás helyben frissült. Ha újratöltés után nem marad meg, futtasd a megadott Supabase SQL-t.");
    }
  }

  async function saveActiveProviderSettings() {
    if (!activeProvider) return;

    const providerDbId = await getSupabaseProviderId(activeProvider);

    if (!providerDbId) {
      alert("Nem találtam a szolgáltatót Supabase-ben, ezért csak helyben maradtak meg a beállítások.");
      return;
    }

    const { error } = await supabase
      .from("szolgaltatok")
      .update({
        email_ertesites: activeProvider.emailNotifications !== false,
        pin_belepes: activeProvider.pinLoginEnabled !== false,
        idopont_figyelmeztetes: activeProvider.slotWarningEnabled === true,
        idopont_figyelmeztetes_hetek: Number(activeProvider.slotWarningWeeks || 1),
      })
      .eq("id", providerDbId);

    if (error) {
      console.error(error);
      alert("A beállítások mentése nem sikerült. Ellenőrizd, hogy a pin_belepes, email_ertesites, idopont_figyelmeztetes és idopont_figyelmeztetes_hetek oszlopok léteznek-e Supabase-ben.");
      return;
    }

    await loadSupabaseData();
    alert("Beállítások elmentve.");
  }

  async function saveActiveGuestSettings() {
    if (!activeGuest) return;

    const guestDbId = await getSupabaseGuestId(activeGuest);

    if (!guestDbId) {
      alert("Nem találtam a vendéget Supabase-ben, ezért csak helyben maradtak meg a beállítások.");
      return;
    }

    const { error } = await supabase
      .from("vendegek")
      .update({
        email_ertesites: activeGuest.emailNotifications !== false,
        pin_belepes: activeGuest.pinLoginEnabled !== false,
      })
      .eq("id", guestDbId);

    if (error) {
      console.error(error);
      alert("A beállítások mentése nem sikerült. Ellenőrizd, hogy a pin_belepes és email_ertesites oszlopok léteznek-e Supabase-ben.");
      return;
    }

    await loadSupabaseData();
    alert("Beállítások elmentve.");
  }

  async function updateActiveGuestPhone() {
    if (!activeGuest) return;

    const cleanedPhone = String(editableGuestPhone || "").trim();
    const updatedGuest = { ...activeGuest, phone: cleanedPhone };

    const updatedGuests = guests.map((guest) =>
      guest.id === activeGuest.id ? { ...guest, phone: cleanedPhone } : guest
    );

    setGuests(updatedGuests);
    setActiveGuest(updatedGuest);

    const guestDbId = await getSupabaseGuestId(activeGuest);

    if (!guestDbId) {
      alert("A telefonszám helyben frissült, de Supabase-ben nem találtam a vendéget.");
      return;
    }

    const { error } = await supabase
      .from("vendegek")
      .update({ telefon: cleanedPhone })
      .eq("id", guestDbId);

    if (error && String(error.message || "").toLowerCase().includes("telefon")) {
      console.error(error);
      alert("A telefonszám helyben frissült, de Supabase-ben még nincs telefon oszlop. Futtasd a telefon oszlopot létrehozó SQL-t.");
      return;
    }

    if (error) {
      console.error(error);
      alert("A telefonszám helyben frissült, de Supabase-be nem sikerült menteni. Nézd meg a Console hibát.");
      return;
    }

    setShowGuestPhoneEdit(false);
    alert("Telefonszám frissítve és Supabase-be is elmentve.");
  }

  async function guestLogin() {
    const loginEmail = (guestLoginEmail || "").trim();
    const loginEmailLower = loginEmail.toLowerCase();
    const loginPinValue = (guestLoginPin || "").trim();

    if (!loginEmail) {
      alert("Add meg az email címet.");
      return;
    }

    const freshData = await loadSupabaseData();
    const guestSource = freshData?.guests || guests;

    let found = null;

    const { data: directGuestRow, error: directGuestError } = await supabase
      .from("vendegek")
      .select("*")
      .ilike("email", loginEmail)
      .maybeSingle();

    if (directGuestError) {
      console.error(directGuestError);
      alert("Supabase vendég bejelentkezési hiba. Nézd meg a Console hibát.");
      return;
    }

    if (directGuestRow) {
      const mappedGuest = mapSupabaseGuest(directGuestRow);
      found =
        guestSource.find((guest) => idsEqual(guest.id, mappedGuest.id)) ||
        guestSource.find((guest) => normalizeEmail(guest.email) === normalizeEmail(mappedGuest.email)) ||
        mappedGuest;

      found = {
        ...found,
        ...mappedGuest,
        providerIds: Array.isArray(found.providerIds) ? found.providerIds : [],
        notifications: Array.isArray(found.notifications) ? found.notifications : [],
      };
    } else {
      found = guestSource.find((g) => normalizeEmail(g.email) === loginEmailLower);
    }

    if (!found) {
      alert("Nem találtam vendéget ezzel az email címmel.");
      return;
    }

    const needsPin = found.pinLoginEnabled !== false;

    if (needsPin && !loginPinValue) {
      alert("Ehhez a vendég fiókhoz PIN szükséges.");
      return;
    }

    if (needsPin && String(found.pin || "") !== loginPinValue) {
      alert("Hibás vendég email vagy PIN.");
      return;
    }

    const normalizedGuest = {
      ...found,
      providerIds: Array.isArray(found.providerIds) ? found.providerIds : [],
      notifications: Array.isArray(found.notifications) ? found.notifications : [],
      emailNotifications: found.emailNotifications ?? true,
      pinLoginEnabled: found.pinLoginEnabled !== false,
    };

    setGuests((currentGuests) => {
      const withoutDuplicate = currentGuests.filter(
        (guest) => !idsEqual(guest.id, normalizedGuest.id) && normalizeEmail(guest.email) !== normalizeEmail(normalizedGuest.email)
      );
      return [...withoutDuplicate, normalizedGuest];
    });
    setActiveGuest(normalizedGuest);
    setGuestOverviewPanel("");
    setGuestEmailNotifications(normalizedGuest.emailNotifications !== false);
    setEditableGuestPhone(normalizedGuest.phone || "");
    setGuestLoginEmail("");
    setGuestLoginPin("");
  }

  function toggleWorkDay(day) {
    setWorkDays(workDays.includes(day) ? workDays.filter((d) => d !== day) : [...workDays, day]);
  }

  function addService() {
    if (!activeProvider || !newServiceName.trim()) {
      alert("Írd be a szolgáltatás nevét.");
      return;
    }

    const service = newServiceName.trim();
    const currentServices = activeProvider.services || [];

    if (currentServices.some((s) => s.toLowerCase() === service.toLowerCase())) {
      alert("Ez a szolgáltatás már szerepel.");
      return;
    }

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? { ...provider, services: [...currentServices, service] }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));
    setNewServiceName("");
  }

  function removeService(serviceToRemove) {
    if (!activeProvider) return;

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? { ...provider, services: (provider.services || []).filter((service) => service !== serviceToRemove) }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));
  }

  async function addExceptionDate() {
    if (!activeProvider || !exceptionDate) {
      alert("Válassz ki egy dátumot.");
      return;
    }

    const currentExceptions = activeProvider.exceptionDates || [];

    if (currentExceptions.includes(exceptionDate)) {
      alert("Ez a kivétel nap már hozzá van adva.");
      return;
    }

    const bookingsOnDate = getBookingsForProviderDate(activeProvider, exceptionDate);

    if (bookingsOnDate.length > 0) {
      const bookingNames = bookingsOnDate.map((booking) => booking.guestName || "Vendég").join(", ");
      const confirmed = confirm(
        `Vigyázz, erre a napra már ${bookingsOnDate.length} aktív foglalás van: ${bookingNames}. Biztosan nem dolgozik napnak jelölöd?

Ha igen, az érintett időpontok felszabadulnak, a vendégek pedig értesítést kapnak.`
      );

      if (!confirmed) return;
    }

    const cancelMessage = "A szolgáltató ezt a napot nem dolgozik napnak jelölte, ezért az időpontod törölve lett.";
    const affectedSlotIds = bookingsOnDate.map((booking) => booking.slotId);
    const affectedGuestIds = [...new Set(bookingsOnDate.map((booking) => booking.guestId).filter(Boolean))];
    const providerNotificationCountBeforeException = getVisibleProviderNotifications(activeProvider).length;

    const bookingMatchesAffectedDate = (booking) =>
      booking &&
      booking.active &&
      idsEqual(booking.providerId, activeProvider.id) &&
      booking.date === exceptionDate;

    const slotMatchesAffectedBooking = (slot) =>
      slot &&
      bookingsOnDate.some(
        (booking) =>
          idsEqual(slot.id, booking.slotId) ||
          (
            slot.date === booking.date &&
            String(slot.time || "").slice(0, 5) === String(booking.time || "").slice(0, 5)
          )
      );

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? {
            ...provider,
            exceptionDates: [...currentExceptions, exceptionDate],
            slots: (provider.slots || []).map((slot) =>
              slotMatchesAffectedBooking(slot)
                ? { ...slot, booked: false, bookedBy: "", guestId: null, guestEmail: "", guestPhone: "", service: "", note: "" }
                : slot
            ),
            notifications: bookingsOnDate.length > 0
              ? [
                  {
                    id: Date.now(),
                    text: `${bookingsOnDate.length} foglalás törölve, mert ${formatDateHu(exceptionDate)} nem dolgozik nap lett.`,
                    note: cancelMessage,
                    type: "provider_cancel",
                  },
                  ...(provider.notifications || []),
                ]
              : provider.notifications || [],
          }
        : provider
    );

    const updatedBookings = guestBookings.map((booking) =>
      bookingMatchesAffectedDate(booking)
        ? { ...booking, active: false, cancelledByProvider: true, cancelledByGuest: false, providerCancelMessage: cancelMessage }
        : booking
    );

    const updatedGuests = guests.map((guest) =>
      affectedGuestIds.includes(guest.id)
        ? {
            ...guest,
            notifications: [
              {
                id: Date.now() + Math.random(),
                text: `${activeProvider.name} törölte az időpontodat, mert ${formatDateHu(exceptionDate)} nem dolgozik nap lett.`,
                message: cancelMessage,
                type: "provider_cancel",
              },
              ...(guest.notifications || []),
            ],
          }
        : guest
    );

    const cancelMessages = bookingsOnDate.map((booking, index) => ({
      id: Date.now() + index,
      providerId: activeProvider.id,
      providerName: activeProvider.name,
      guestId: booking.guestId,
      guestName: booking.guestName,
      slotId: booking.slotId,
      date: booking.date,
      time: booking.time,
      from: "provider",
      fromName: activeProvider.name,
      toName: booking.guestName,
      text: cancelMessage,
      type: "cancel",
    }));

    setProviders(updatedProviders);
    setGuestBookings(updatedBookings);
    setGuests(updatedGuests);
    setMessages([...cancelMessages, ...messages]);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));
    if (bookingsOnDate.length > 0) {
      markProviderOverviewPanelUnread(activeProvider.id, "providerNotifications", providerNotificationCountBeforeException);
      affectedGuestIds.forEach((guestId) => markGuestOverviewPanelUnread(guestId, "guestNotifications", -1));
      affectedGuestIds.forEach((guestId) => markGuestOverviewPanelUnread(guestId, "guestCancelledBookings", -1));
    }
    setExceptionDate("");

    const providerDbId = await getSupabaseProviderId(activeProvider);

    if (providerDbId) {
      const { error } = await supabase.from("kivetel_napok").insert([{ szolgaltato_id: providerDbId, datum: exceptionDate }]);

      if (error) {
        console.error(error);
        alert("Kivétel nap hozzáadva helyben, de Supabase-be nem sikerült menteni.");
        return;
      }

      for (const booking of bookingsOnDate) {
        const slot = (activeProvider.slots || []).find((slotItem) => slotItem.id === booking.slotId) || {
          id: booking.slotId,
          date: booking.date,
          time: booking.time,
        };
        const cancelMessageRow = cancelMessages.find((message) => message.slotId === booking.slotId);

        await saveMessageToSupabase(cancelMessageRow, {
          provider: activeProvider,
          guest: guests.find((guest) => guest.id === booking.guestId),
          slot,
        });

        await syncBookingCancellationToSupabase(booking, activeProvider, slot);
      }

      alert(
        bookingsOnDate.length > 0
          ? `Kivétel nap hozzáadva. ${bookingsOnDate.length} foglalás törölve és az időpontok Supabase-ben is felszabadítva.`
          : "Kivétel nap hozzáadva és Supabase-be is elmentve."
      );
      return;
    }

    alert("Kivétel nap hozzáadva helyben. Supabase mentéshez jelentkezz be Supabase-ben létező szolgáltatóval.");
  }

  async function removeExceptionDate(dateToRemove) {
    if (!activeProvider) return;

    if (!confirm(`${formatDateHu(dateToRemove)} újra munkanap legyen?`)) return;

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? {
            ...provider,
            exceptionDates: (provider.exceptionDates || []).filter((date) => date !== dateToRemove),
          }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));

    const providerDbId = await getSupabaseProviderId(activeProvider);
    if (!providerDbId) {
      alert("A kivétel nap helyben visszavonva.");
      return;
    }

    const { error } = await supabase
      .from("kivetel_napok")
      .delete()
      .eq("szolgaltato_id", providerDbId)
      .eq("datum", dateToRemove);

    if (error) {
      console.error(error);
      alert("A kivétel nap helyben visszavonva, de Supabase-ből nem sikerült törölni.");
      return;
    }

    alert("A nap újra munkanapként jelenik meg.");
  }
  function timeToMinutes(time) {
    const [hour = 0, minute = 0] = String(time || "00:00").split(":").map(Number);
    return hour * 60 + minute;
  }

  function slotOverlapsBreak(slotStartMinute, slotLengthMinutes, breakItem) {
    const breakStartMinute = timeToMinutes(breakItem.start);
    const breakEndMinute = timeToMinutes(breakItem.end);
    const slotEndMinute = slotStartMinute + Number(slotLengthMinutes);
    return slotStartMinute < breakEndMinute && slotEndMinute > breakStartMinute;
  }

  function isSlotInsideProviderBreak(provider, dateText, dayName, slotStartMinute, slotLengthMinutes) {
    const breaks = Array.isArray(provider?.breaks) ? provider.breaks : [];
    return breaks.some((breakItem) => {
      if (!breakItem?.start || !breakItem?.end) return false;
      if (breakItem.type === "single" && breakItem.date !== dateText) return false;
      if (breakItem.type !== "single" && breakItem.day !== dayName) return false;
      return slotOverlapsBreak(slotStartMinute, slotLengthMinutes, breakItem);
    });
  }

  async function addProviderBreak() {
    if (!activeProvider) return;

    if (!breakStart || !breakEnd) {
      alert("Add meg a szünet kezdetét és végét.");
      return;
    }

    if (timeToMinutes(breakEnd) <= timeToMinutes(breakStart)) {
      alert("A szünet vége később legyen, mint a kezdete.");
      return;
    }

    if (breakType === "single" && !breakDate) {
      alert("Egyedi szünethez válassz dátumot.");
      return;
    }

    const newBreak = {
      id: `${Date.now()}-${Math.random()}`,
      type: breakType,
      day: breakType === "weekly" ? breakDay : "",
      date: breakType === "single" ? breakDate : "",
      start: breakStart,
      end: breakEnd,
    };

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? { ...provider, breaks: [...(provider.breaks || []), newBreak] }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((provider) => provider.id === activeProvider.id));

    const providerDbId = await getSupabaseProviderId(activeProvider);
    if (providerDbId) {
      const { error } = await supabase.from("szunetek").insert([
        {
          szolgaltato_id: providerDbId,
          tipus: newBreak.type,
          nap: newBreak.day || null,
          datum: newBreak.date || null,
          kezdet: newBreak.start,
          veg: newBreak.end,
        },
      ]);

      if (error) {
        console.warn("A szünet helyben létrejött, de Supabase-be még nem menthető. Valószínűleg hiányzik a szunetek tábla.", error);
      }
    }
  }

  async function removeProviderBreak(breakId) {
    if (!activeProvider) return;

    const breakToRemove = (activeProvider.breaks || []).find((item) => item.id === breakId);
    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? { ...provider, breaks: (provider.breaks || []).filter((item) => item.id !== breakId) }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((provider) => provider.id === activeProvider.id));

    if (breakToRemove && isLikelyUuid(breakToRemove.id)) {
      const { error } = await supabase.from("szunetek").delete().eq("id", breakToRemove.id);
      if (error) console.warn("Szünet törlése Supabase-ből nem sikerült.", error);
    }
  }

  async function generateSlots() {
    if (!activeProvider) return;

    if (workDays.length === 0) {
      alert("Válassz legalább egy munkanapot.");
      return;
    }

    const providerDbId = await getSupabaseProviderId(activeProvider);
    const providerSource =
      providers.find((provider) => idsEqual(provider.id, activeProvider.id)) ||
      providers.find((provider) => providerDbId && idsEqual(provider.id, providerDbId)) ||
      providers.find((provider) => normalizeEmail(provider.email) === normalizeEmail(activeProvider.email)) ||
      activeProvider;

    const providerBase = {
      ...providerSource,
      ...activeProvider,
      id: providerDbId || activeProvider.id || providerSource.id,
      workDays,
      workStart,
      workEnd,
      slotLength: Number(slotLength),
      weeksAhead: Number(weeksAhead),
      exceptionDates: activeProvider.exceptionDates || providerSource.exceptionDates || [],
      breaks: activeProvider.breaks || providerSource.breaks || [],
      services: activeProvider.services || providerSource.services || [],
      blockedEmails: activeProvider.blockedEmails || providerSource.blockedEmails || [],
      notifications: activeProvider.notifications || providerSource.notifications || [],
    };

    const newSlots = [];
    const today = new Date();
    const totalDays = Number(weeksAhead) * 7;
    const exceptions = providerBase.exceptionDates || [];

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const formattedDate = formatDate(date);
      const dayName = getHungarianDayName(date);

      if (exceptions.includes(formattedDate)) continue;
      if (!workDays.includes(dayName)) continue;

      const [startHour, startMinute] = workStart.split(":").map(Number);
      const [endHour, endMinute] = workEnd.split(":").map(Number);

      let current = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      while (current + Number(slotLength) <= end) {
        if (isSlotInsideProviderBreak(providerBase, formattedDate, dayName, current, Number(slotLength))) {
          current += Number(slotLength);
          continue;
        }

        const hour = Math.floor(current / 60).toString().padStart(2, "0");
        const minute = (current % 60).toString().padStart(2, "0");

        newSlots.push({
          id: `${formattedDate}-${hour}:${minute}-${Date.now()}-${Math.random()}`,
          date: formattedDate,
          day: dayName,
          time: `${hour}:${minute}`,
          booked: false,
          bookedBy: "",
          guestId: null,
          guestEmail: "",
          guestPhone: "",
          service: "",
          note: "",
        });

        current += Number(slotLength);
      }
    }

    const existingSlots = Array.isArray(providerBase.slots) ? providerBase.slots : [];
    const slotMap = new Map();

    existingSlots.forEach((slot) => {
      if (!slot || !slot.date || !slot.time) return;
      slotMap.set(`${slot.date}-${String(slot.time).slice(0, 5)}`, {
        ...slot,
        time: String(slot.time).slice(0, 5),
      });
    });

    let addedSlotsCount = 0;
    const addedSlots = [];

    newSlots.forEach((slot) => {
      const key = `${slot.date}-${slot.time}`;

      if (!slotMap.has(key)) {
        slotMap.set(key, slot);
        addedSlots.push(slot);
        addedSlotsCount++;
      }
    });

    let mergedSlots = Array.from(slotMap.values()).sort((a, b) => {
      const aValue = `${a.date} ${a.time}`;
      const bValue = `${b.date} ${b.time}`;
      return aValue.localeCompare(bValue);
    });

    const applyProviderSlots = (slotsToApply) => {
      const normalizedProvider = {
        ...providerBase,
        slots: slotsToApply,
      };

      let providerWasUpdated = false;
      const updatedProviders = providers.map((provider) => {
        const sameProvider =
          idsEqual(provider.id, activeProvider.id) ||
          idsEqual(provider.id, normalizedProvider.id) ||
          (providerDbId && idsEqual(provider.id, providerDbId)) ||
          normalizeEmail(provider.email) === normalizeEmail(normalizedProvider.email);

        if (!sameProvider) return provider;

        providerWasUpdated = true;
        return {
          ...provider,
          ...normalizedProvider,
          id: providerDbId || provider.id || normalizedProvider.id,
          slots: slotsToApply,
        };
      });

      if (!providerWasUpdated) {
        updatedProviders.push(normalizedProvider);
      }

      setProviders(updatedProviders);
      setActiveProvider(normalizedProvider);

      if (selectedProvider && (
        idsEqual(selectedProvider.id, normalizedProvider.id) ||
        normalizeEmail(selectedProvider.email) === normalizeEmail(normalizedProvider.email)
      )) {
        setSelectedProvider(normalizedProvider);
      }

      if (changeProvider && (
        idsEqual(changeProvider.id, normalizedProvider.id) ||
        normalizeEmail(changeProvider.email) === normalizeEmail(normalizedProvider.email)
      )) {
        setChangeProvider(normalizedProvider);
      }
    };

    applyProviderSlots(mergedSlots);
    setProviderCalendarDate("");

    let supabaseMessage = "";

    if (addedSlots.length > 0) {
      if (providerDbId) {
        const rows = addedSlots.map((slot) => ({
          szolgaltato_id: providerDbId,
          datum: slot.date,
          ido: slot.time,
          foglalt: false,
        }));

        const { error } = await supabase.from("idopontok").insert(rows);

        if (error) {
          console.error(error);
          supabaseMessage = "\n\nFigyelem: az új időpontok helyben létrejöttek, de Supabase-be nem sikerült elmenteni őket.";
        } else {
          const { data: savedSlotRows, error: savedSlotRowsError } = await supabase
            .from("idopontok")
            .select("*")
            .eq("szolgaltato_id", providerDbId);

          if (!savedSlotRowsError && Array.isArray(savedSlotRows)) {
            const refreshedSlotMap = new Map();

            mergedSlots.forEach((slot) => {
              if (!slot || !slot.date || !slot.time) return;
              refreshedSlotMap.set(`${slot.date}-${String(slot.time).slice(0, 5)}`, {
                ...slot,
                time: String(slot.time).slice(0, 5),
              });
            });

            savedSlotRows.forEach((row) => {
              if (!row?.datum || !row?.ido) return;

              const timeText = formatTimeFromSupabase(row.ido);
              const key = `${row.datum}-${timeText}`;
              const existingSlot = refreshedSlotMap.get(key) || {};

              refreshedSlotMap.set(key, {
                ...existingSlot,
                id: row.id || existingSlot.id || key,
                date: row.datum,
                day: getHungarianDayName(new Date(`${row.datum}T00:00:00`)),
                time: timeText,
                booked: Boolean(row.foglalt),
                bookedBy: existingSlot.bookedBy || "",
                guestId: existingSlot.guestId || null,
                guestEmail: existingSlot.guestEmail || "",
                guestPhone: existingSlot.guestPhone || "",
                service: existingSlot.service || "",
                note: existingSlot.note || "",
              });
            });

            mergedSlots = Array.from(refreshedSlotMap.values()).sort((a, b) =>
              `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`)
            );

            applyProviderSlots(mergedSlots);
          } else if (savedSlotRowsError) {
            console.warn("Az időpontok mentése sikerült, de a visszaolvasás nem sikerült:", savedSlotRowsError);
          }

          supabaseMessage = `\n\nSupabase mentés: ${rows.length} új időpont elmentve.`;
        }
      } else {
        supabaseMessage = "\n\nFigyelem: helyben létrejöttek az időpontok, de Supabase mentéshez Supabase-ben létező szolgáltatóval kell belépni.";
      }
    } else {
      supabaseMessage = "\n\nSupabase mentés: nem volt új időpont, ezért nem kellett új sort menteni.";
    }

    alert(
      `Időpontok frissítve.\n\nÚj időpontok hozzáadva: ${addedSlotsCount}\nA meglévő foglalások és korábbi időpontok megmaradtak.${supabaseMessage}`
    );
  }

  async function deleteFreeSlots() {
    if (!activeProvider) return;

    const providerDbId = await getSupabaseProviderId(activeProvider);
    const providerSource =
      providers.find((provider) => idsEqual(provider.id, activeProvider.id)) ||
      providers.find((provider) => providerDbId && idsEqual(provider.id, providerDbId)) ||
      providers.find((provider) => normalizeEmail(provider.email) === normalizeEmail(activeProvider.email)) ||
      activeProvider;

    const providerSlots = Array.isArray(providerSource.slots) ? providerSource.slots : [];
    const activeProviderBookings = (guestBookings || []).filter(
      (booking) => booking && booking.active && (
        idsEqual(booking.providerId, providerSource.id) ||
        idsEqual(booking.providerId, activeProvider.id) ||
        (providerDbId && idsEqual(booking.providerId, providerDbId)) ||
        normalizeEmail(booking.providerName) === normalizeEmail(providerSource.name)
      )
    );

    const bookingKeys = new Set(
      activeProviderBookings
        .filter((booking) => booking.date && booking.time)
        .map((booking) => `${booking.date}-${String(booking.time).slice(0, 5)}`)
    );

    const freeSlotsToDelete = providerSlots.filter((slot) => {
      if (!slot || !slot.date || !slot.time) return false;
      const slotKey = `${slot.date}-${String(slot.time).slice(0, 5)}`;
      return !slot.booked && !bookingKeys.has(slotKey);
    });

    if (freeSlotsToDelete.length === 0) {
      alert("Nincs törölhető szabad időpont. A foglalt időpontokat nem törlöm.");
      return;
    }

    if (!confirm(`Biztosan törlöd az összes szabad időpontot?\n\nTörlendő szabad időpontok száma: ${freeSlotsToDelete.length}\n\nA foglalt időpontok megmaradnak.`)) {
      return;
    }

    const freeSlotKeys = new Set(
      freeSlotsToDelete.map((slot) => `${slot.date}-${String(slot.time).slice(0, 5)}`)
    );

    const remainingSlots = providerSlots.filter((slot) => {
      if (!slot || !slot.date || !slot.time) return true;
      const slotKey = `${slot.date}-${String(slot.time).slice(0, 5)}`;
      return !freeSlotKeys.has(slotKey);
    });

    const updatedProvider = {
      ...providerSource,
      ...activeProvider,
      id: providerDbId || activeProvider.id || providerSource.id,
      slots: remainingSlots,
    };

    let providerWasUpdated = false;
    const updatedProviders = providers.map((provider) => {
      const sameProvider =
        idsEqual(provider.id, activeProvider.id) ||
        idsEqual(provider.id, updatedProvider.id) ||
        (providerDbId && idsEqual(provider.id, providerDbId)) ||
        normalizeEmail(provider.email) === normalizeEmail(updatedProvider.email);

      if (!sameProvider) return provider;

      providerWasUpdated = true;
      return {
        ...provider,
        ...updatedProvider,
        id: providerDbId || provider.id || updatedProvider.id,
        slots: remainingSlots,
      };
    });

    if (!providerWasUpdated) {
      updatedProviders.push(updatedProvider);
    }

    setProviders(updatedProviders);
    setActiveProvider(updatedProvider);
    setProviderCalendarDate("");

    if (selectedProvider && (
      idsEqual(selectedProvider.id, updatedProvider.id) ||
      normalizeEmail(selectedProvider.email) === normalizeEmail(updatedProvider.email)
    )) {
      setSelectedProvider(updatedProvider);
    }

    if (changeProvider && (
      idsEqual(changeProvider.id, updatedProvider.id) ||
      normalizeEmail(changeProvider.email) === normalizeEmail(updatedProvider.email)
    )) {
      setChangeProvider(updatedProvider);
    }

    let supabaseMessage = "";

    if (providerDbId) {
      const uuidSlotIds = freeSlotsToDelete
        .filter((slot) => isLikelyUuid(slot.id))
        .map((slot) => slot.id);

      if (uuidSlotIds.length > 0) {
        const { error } = await supabase
          .from("idopontok")
          .delete()
          .in("id", uuidSlotIds)
          .eq("foglalt", false);

        if (error) {
          console.error(error);
          supabaseMessage = "\n\nFigyelem: helyben töröltem a szabad időpontokat, de Supabase-ben nem sikerült minden UUID-s időpontot törölni.";
        }
      }

      const nonUuidSlots = freeSlotsToDelete.filter((slot) => !isLikelyUuid(slot.id));

      for (const slot of nonUuidSlots) {
        const { error } = await supabase
          .from("idopontok")
          .delete()
          .eq("szolgaltato_id", providerDbId)
          .eq("datum", slot.date)
          .eq("ido", String(slot.time).slice(0, 5))
          .eq("foglalt", false);

        if (error) {
          console.error(error);
          supabaseMessage = "\n\nFigyelem: helyben töröltem a szabad időpontokat, de Supabase-ben nem sikerült minden időpontot törölni.";
        }
      }

      if (!supabaseMessage) {
        supabaseMessage = `\n\nSupabase törlés lefutott: ${freeSlotsToDelete.length} szabad időpont törölve vagy törlésre ellenőrizve.`;
      }
    } else {
      supabaseMessage = "\n\nFigyelem: helyben töröltem a szabad időpontokat, de Supabase törléshez Supabase-ben létező szolgáltatóval kell belépni.";
    }

    try {
      localStorage.setItem("providers", JSON.stringify(updatedProviders));
    } catch (error) {
      console.warn("A szabad időpontok törlése után a helyi mentés frissítése nem sikerült:", error);
    }

    await loadSupabaseData();

    alert(`Szabad időpontok törölve.

Törölt szabad időpontok: ${freeSlotsToDelete.length}
A foglalt időpontok megmaradtak.${supabaseMessage}`);
  }


  function getProviderStats(provider) {
    return getProviderStatsFromData({
      provider,
      guestBookings,
      guests,
      idsEqual,
      todayText: formatDate(new Date()),
      providerMessages: provider ? getMessagesForProvider(provider.id) : [],
      visibleProviderGuestMessages: provider ? getVisibleProviderGuestMessages(provider.id) : [],
      visibleProviderNotifications: getVisibleProviderNotifications(provider),
    });
  }

  function renderProviderStats(provider) {
    const stats = getProviderStats(provider);

    return (
      <ProviderOverview
        provider={provider}
        stats={stats}
        providerOverviewPanel={providerOverviewPanel}
        providerSeenOverviewCounts={providerSeenOverviewCounts}
        setProviderOverviewPanel={setProviderOverviewPanel}
        markProviderOverviewPanelSeen={markProviderOverviewPanelSeen}
        hasUnseenOverviewItem={hasUnseenOverviewItem}
        renderProviderOverviewPanel={renderProviderOverviewPanel}
        formatDateHu={formatDateHu}
        overviewNewBadgeStyle={overviewNewBadgeStyle}
      />
    );
  }

    function clearProviderNotifications() {
    if (!activeProvider) return;

    const visibleNotifications = getVisibleProviderNotifications(activeProvider);

    if (visibleNotifications.length === 0) {
      alert("Nincs törölhető értesítés.");
      return;
    }

    if (!confirm("Biztosan törlöd az összes látható értesítést ennél a szolgáltatónál?")) return;

    const keysToHide = visibleNotifications.map((notification) =>
      getProviderNotificationKey(activeProvider.id, notification)
    );

    setHiddenProviderNotificationKeys((currentKeys) => [...new Set([...currentKeys, ...keysToHide])]);

    const updatedProviders = providers.map((provider) =>
      idsEqual(provider.id, activeProvider.id)
        ? { ...provider, notifications: [] }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider({ ...activeProvider, notifications: [] });
    markProviderOverviewPanelUnread(activeProvider.id, "providerNotifications", 0);
    alert("Értesítések törölve.");
  }

  function clearProviderGuestMessages() {
    if (!activeProvider) return;

    const visibleMessages = getVisibleProviderGuestMessages(activeProvider.id);

    if (visibleMessages.length === 0) {
      alert("Nincs törölhető vendég üzenet.");
      return;
    }

    if (!confirm("Biztosan törlöd az összes látható vendég üzenetet ennél a szolgáltatónál?")) return;

    const keysToHide = visibleMessages.map((message) =>
      getProviderMessageKey(activeProvider.id, message)
    );

    setHiddenProviderMessageKeys((currentKeys) => [...new Set([...currentKeys, ...keysToHide])]);
    alert("Vendég üzenetek törölve.");
  }

function renderProviderOverviewPanel(provider, panel) {
    if (!provider || !panel) return null;

    const todayText = formatDate(new Date());
    const providerBookings = getProviderActiveBookingsSortedFromList(guestBookings, idsEqual, provider.id);
    const providerSlots = Array.isArray(provider.slots) ? provider.slots : [];
    const guestMessages = getVisibleProviderGuestMessages(provider.id);
    const providerNotifications = getVisibleProviderNotifications(provider);

    const panelBoxStyle = {
      ...premiumPanelStyle,
      marginTop: "14px",
      textAlign: "left",
    };

    const smallCardStyle = {
      ...premiumListCardStyle,
      margin: "8px 0",
    };

    function renderBookingList(title, bookings) {
      return (
        <div style={panelBoxStyle}>
          <h4 style={{ marginTop: 0 }}>{title}</h4>
          {bookings.length === 0 && <p>Nincs találat.</p>}
          {bookings.map((booking) => {
            const matchingSlot = providerSlots.find(
              (slot) =>
                slot &&
                (
                  idsEqual(slot.id, booking.slotId) ||
                  (slot.date === booking.date && String(slot.time || "").slice(0, 5) === String(booking.time || "").slice(0, 5))
                )
            );
            const cancelSlot = matchingSlot || {
              id: booking.slotId || booking.id,
              date: booking.date,
              day: booking.day,
              time: booking.time,
              booked: true,
              bookedBy: booking.guestName || "Vendég",
              guestId: booking.guestId,
              guestEmail: booking.guestEmail,
              guestPhone: booking.guestPhone,
              service: booking.service,
              note: booking.note,
            };
            const cancelKey = cancelSlot.id || booking.id;

            return (
              <div key={booking.id} style={smallCardStyle}>
                <b>{booking.guestName || "Vendég"}</b> — {formatDateHu(booking.date)} {booking.time}
                {booking.guestEmail && (
                  <>
                    <br />
                    Email: {booking.guestEmail}
                  </>
                )}
                {booking.guestPhone && (
                  <>
                    <br />
                    Telefon: {booking.guestPhone}
                    {renderPhoneCallLink(booking.guestPhone)}
                  </>
                )}
                {booking.service && (
                  <>
                    <br />
                    Szolgáltatás: {booking.service}
                  </>
                )}
                {booking.note && (
                  <>
                    <br />
                    Megjegyzés: {booking.note}
                  </>
                )}

                <br /><br />

                <input
                  placeholder="Lemondás oka / üzenet a vendégnek - kötelező"
                  value={providerCancelMessages[cancelKey] || ""}
                  onChange={(e) =>
                    setProviderCancelMessages({
                      ...providerCancelMessages,
                      [cancelKey]: e.target.value,
                    })
                  }
                  style={{ ...premiumInlineInputStyle, width: "100%" }}
                />

                <br /><br />

                <button
                  onClick={() => cancelBookingByProvider(cancelSlot)}
                  style={dangerButtonStyle}
                >
                  Időpont lemondása szolgáltatóként
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    if (panel === "registeredGuests") {
      return renderRegisteredGuestsForProvider(provider);
    }

    if (panel === "activeBookings") {
      return renderBookingList("Foglalt időpontok", providerBookings);
    }

    if (panel === "todayBookings") {
      return renderBookingList("Mai foglalások", providerBookings.filter((booking) => booking.date === todayText));
    }

    if (panel === "upcomingBookings") {
      return renderBookingList("Foglalt időpontok", providerBookings);
    }

    if (panel === "freeSlots") {
      const freeSlots = getProviderFreeSlotsFromProvider(provider);

      return (
        <div style={panelBoxStyle}>
          <h4 style={{ marginTop: 0 }}>Szabad időpontok</h4>
          {freeSlots.length === 0 && <p>Nincs szabad időpont.</p>}
          {freeSlots.map((slot) => (
            <div key={slot.id} style={smallCardStyle}>
              {formatDateHu(slot.date)} {slot.time}
            </div>
          ))}
        </div>
      );
    }

    if (panel === "bookedSlots") {
      return renderBookingList("Foglalt időpontok", providerBookings);
    }

    if (panel === "blockedGuests") {
      return (
        <BlockedGuests
          provider={provider}
          guests={guests}
          normalizeEmail={normalizeEmail}
          unblockGuestEmail={unblockGuestEmail}
          panelBoxStyle={panelBoxStyle}
          smallCardStyle={smallCardStyle}
          providerSmallButtonStyle={providerSmallButtonStyle}
        />
      );
    }

    if (panel === "guestMessages") {
      return (
        <ProviderMessages
          provider={provider}
          guestMessages={guestMessages}
          guests={guests}
          providerMessageTexts={providerMessageTexts}
          setProviderMessageTexts={setProviderMessageTexts}
          clearProviderGuestMessages={clearProviderGuestMessages}
          sendProviderDirectMessageToGuest={sendProviderDirectMessageToGuest}
          getProviderMessageKey={getProviderMessageKey}
          idsEqual={idsEqual}
          formatDateHu={formatDateHu}
          panelBoxStyle={panelBoxStyle}
          smallCardStyle={smallCardStyle}
          dangerButtonStyle={dangerButtonStyle}
          providerSmallButtonStyle={providerSmallButtonStyle}
          premiumInlineInputStyle={premiumInlineInputStyle}
        />
      );
    }

    if (panel === "providerNotifications") {
      return (
        <ProviderNotifications
          provider={provider}
          providerNotifications={providerNotifications}
          clearProviderNotifications={clearProviderNotifications}
          getProviderNotificationKey={getProviderNotificationKey}
          panelBoxStyle={panelBoxStyle}
          smallCardStyle={smallCardStyle}
          dangerButtonStyle={dangerButtonStyle}
        />
      );
    }

    return null;
  }


  function getGuestActiveBookings(guest) {
    return getGuestActiveBookingsFromList(guestBookings, idsEqual, guest);
  }

  function getGuestCancelledBookingKey(guestId, booking) {
    return getGuestCancelledBookingKeyValue(normalizeId, guestId, booking);
  }

  function getGuestCancelledBookings(guest) {
    return getGuestCancelledBookingsFromList(guestBookings, idsEqual, guest);
  }

  function getVisibleGuestCancelledBookings(guest) {
    if (!guest) return [];

    return getGuestCancelledBookings(guest).filter(
      (booking) => !hiddenGuestCancelledBookingKeys.includes(getGuestCancelledBookingKey(guest.id, booking))
    );
  }

  function getVisibleGuestMessages(guestId) {
    return getMessagesForGuest(guestId).filter(
      (message) =>
        (message?.type || "message") === "message" &&
        !hiddenGuestMessageKeys.includes(getGuestMessageKey(guestId, message))
    );
  }

  function getGuestStats(guest) {
    if (!guest) {
      return {
        todayBookings: 0,
        activeBookings: 0,
        guestMessages: 0,
        guestNotifications: 0,
        cancelledBookings: 0,
      };
    }

    const todayText = formatDate(new Date());
    const activeBookings = getGuestActiveBookings(guest);

    return {
      todayBookings: activeBookings.filter((booking) => booking.date === todayText).length,
      activeBookings: activeBookings.length,
      guestMessages: getVisibleGuestMessages(guest.id).length,
      guestNotifications: getVisibleGuestNotifications(guest).length,
      cancelledBookings: getVisibleGuestCancelledBookings(guest).length,
    };
  }

  function clearGuestMessages() {
    if (!activeGuest) return;

    const visibleMessages = getVisibleGuestMessages(activeGuest.id);

    if (visibleMessages.length === 0) {
      alert("Nincs törölhető üzenet.");
      return;
    }

    if (!confirm("Biztosan törlöd az összes látható üzenetet?")) return;

    const keysToHide = visibleMessages.map((message) => getGuestMessageKey(activeGuest.id, message));
    setHiddenGuestMessageKeys((currentKeys) => [...new Set([...currentKeys, ...keysToHide])]);
    alert("Üzenetek törölve.");
  }

  function clearGuestNotifications() {
    if (!activeGuest) return;

    const visibleNotifications = getVisibleGuestNotifications(activeGuest);

    if (visibleNotifications.length === 0) {
      alert("Nincs törölhető értesítés.");
      return;
    }

    if (!confirm("Biztosan törlöd az összes látható értesítést?")) return;

    const keysToHide = visibleNotifications.map((notification) =>
      getGuestNotificationKey(activeGuest.id, notification)
    );

    setHiddenGuestNotificationKeys((currentKeys) => [...new Set([...currentKeys, ...keysToHide])]);

    const updatedGuests = guests.map((guest) =>
      idsEqual(guest.id, activeGuest.id) ? { ...guest, notifications: [] } : guest
    );

    setGuests(updatedGuests);
    setActiveGuest({ ...activeGuest, notifications: [] });
    markGuestOverviewPanelUnread(activeGuest.id, "guestNotifications", 0);
    alert("Értesítések törölve.");
  }

  function clearGuestCancelledBookings() {
    if (!activeGuest) return;

    const visibleCancelledBookings = getVisibleGuestCancelledBookings(activeGuest);

    if (visibleCancelledBookings.length === 0) {
      alert("Nincs törölhető lemondott időpont.");
      return;
    }

    if (!confirm("Biztosan törlöd a lemondott időpontok látható listáját?")) return;

    const keysToHide = visibleCancelledBookings.map((booking) =>
      getGuestCancelledBookingKey(activeGuest.id, booking)
    );

    setHiddenGuestCancelledBookingKeys((currentKeys) => [...new Set([...currentKeys, ...keysToHide])]);
    alert("Lemondott időpontok törölve.");
  }

  function renderGuestBookingCard(booking, compact = false) {
    return (
      <div key={booking.id} style={premiumListCardStyle}>
        <b>{booking.providerName || "Szolgáltató"}</b>
        <br />
        {formatDateHu(booking.date)} — {booking.day || ""} — {booking.time}
        {booking.service && (
          <>
            <br />
            Szolgáltatás: {booking.service}
          </>
        )}
        {booking.note && (
          <>
            <br />
            Megjegyzés: {booking.note}
          </>
        )}
        {booking.changed && (
          <>
            <br />
            Módosítva. Régi időpont: {formatDateHu(booking.oldDate)} {booking.oldTime}
          </>
        )}

        {!compact && (
          <>
            <div style={{ marginTop: "12px" }}>
              <input
                placeholder="Üzenet a szolgáltatónak"
                value={guestMessageTexts[booking.id] || ""}
                onChange={(e) =>
                  setGuestMessageTexts({
                    ...guestMessageTexts,
                    [booking.id]: e.target.value,
                  })
                }
                style={{ ...premiumInlineInputStyle, width: "100%" }}
              />
            </div>

            <div style={premiumActionButtonRowStyle}>
              <button
                onClick={() => sendGuestMessageToProvider(booking)}
                style={{ ...guestSmallButtonStyle, ...premiumFullWidthMobileButtonStyle }}
              >
                Üzenet írása
              </button>
              <button
                onClick={() => startChangeBooking(booking)}
                style={{ ...guestSmallButtonStyle, ...premiumFullWidthMobileButtonStyle }}
              >
                Időpont módosítása
              </button>
              <button
                onClick={() => cancelBookingByGuest(booking)}
                style={{ ...dangerButtonStyle, ...premiumFullWidthMobileButtonStyle }}
              >
                Időpont lemondása
              </button>
            </div>

            {changeBookingId === booking.id && changeProvider && (
              <div style={{ ...premiumPanelStyle, marginTop: "12px" }}>
                <h4>Új időpont választása</h4>

                <h4>Válassz új napot</h4>
                {renderCalendar(changeProvider, changeCalendarDate, (date) => {
                  setChangeCalendarDate(date);
                  setChangeSlot(null);
                })}

                {changeCalendarDate && (
                  <>
                    <h4>Szabad időpontok ezen a napon: {formatDateHu(changeCalendarDate)}</h4>

                    {getAvailableSlotsForDate(changeProvider, changeCalendarDate).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setChangeSlot(slot)}
                        style={{
                          ...guestSmallButtonStyle,
                          display: "block",
                          margin: "8px auto",
                          opacity: changeSlot?.id === slot.id ? 1 : 0.82,
                          transform: changeSlot?.id === slot.id ? "scale(1.03)" : "none",
                          background: changeSlot?.id === slot.id
                            ? "linear-gradient(135deg, #b8860b 0%, #ffcf5c 45%, #7f5a83 100%)"
                            : guestSmallButtonStyle.background,
                          border: changeSlot?.id === slot.id ? "3px solid #ffe29a" : guestSmallButtonStyle.border,
                        }}
                      >
                        {changeSlot?.id === slot.id ? `✓ ${slot.time}` : slot.time}
                      </button>
                    ))}
                  </>
                )}

                <p>Új kiválasztott időpont: {changeSlot ? `${formatDateHu(changeSlot.date)} ${changeSlot.time}` : "-"}</p>

                <button onClick={() => confirmChangeBooking(booking)} style={guestSmallButtonStyle}>Módosítás mentése</button>
                <button onClick={cancelChangeBooking} style={{ ...premiumNeutralButtonStyle, marginLeft: "10px" }}>Mégse</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function renderGuestStats(guest) {
    return (
      <GuestOverview
        guest={guest}
        guestOverviewPanel={guestOverviewPanel}
        setGuestOverviewPanel={setGuestOverviewPanel}
        guestSeenOverviewCounts={guestSeenOverviewCounts}
        getGuestStats={getGuestStats}
        hasUnseenOverviewItem={hasUnseenOverviewItem}
        markGuestOverviewPanelSeen={markGuestOverviewPanelSeen}
        getGuestActiveBookings={getGuestActiveBookings}
        getVisibleGuestCancelledBookings={getVisibleGuestCancelledBookings}
        getVisibleGuestMessages={getVisibleGuestMessages}
        getVisibleGuestNotifications={getVisibleGuestNotifications}
        clearGuestMessages={clearGuestMessages}
        clearGuestNotifications={clearGuestNotifications}
        clearGuestCancelledBookings={clearGuestCancelledBookings}
        renderGuestBookingCard={renderGuestBookingCard}
        formatDate={formatDate}
        formatDateHu={formatDateHu}
        premiumPanelStyle={premiumPanelStyle}
        premiumListCardStyle={premiumListCardStyle}
        dangerButtonStyle={dangerButtonStyle}
        overviewNewBadgeStyle={overviewNewBadgeStyle}
      />
    );
  }


  function getRegisteredGuestsForProvider(providerId) {
    return getRegisteredGuestsForProviderFromList(guests, idsEqual, providerId);
  }



  function getGuestBookingsForProvider(providerId, guest) {
    return getGuestBookingsForProviderFromList(guestBookings, idsEqual, normalizeEmail, providerId, guest);
  }

  function getProviderGuestBookingSummary(providerId, guest) {
    return getProviderGuestBookingSummaryFromList(guestBookings, idsEqual, normalizeEmail, providerId, guest);
  }

  function renderRegisteredGuestsForProvider(provider) {
    return (
      <RegisteredGuestsPanel
        provider={provider}
        selectedProviderGuestId={selectedProviderGuestId}
        setSelectedProviderGuestId={setSelectedProviderGuestId}
        providerMessageTexts={providerMessageTexts}
        setProviderMessageTexts={setProviderMessageTexts}
        getRegisteredGuestsForProvider={getRegisteredGuestsForProvider}
        getProviderGuestBookingSummary={getProviderGuestBookingSummary}
        isGuestBlockedByProvider={isGuestBlockedByProvider}
        renderPhoneCallLink={renderPhoneCallLink}
        sendProviderDirectMessageToGuest={sendProviderDirectMessageToGuest}
        blockGuestEmail={blockGuestEmail}
        unblockGuestEmail={unblockGuestEmail}
        formatDateHu={formatDateHu}
        premiumPanelStyle={premiumPanelStyle}
        premiumInlineInputStyle={premiumInlineInputStyle}
        providerSmallButtonStyle={providerSmallButtonStyle}
      />
    );
  }

  async function saveProviderGuestLinkToSupabase(provider, guest) {
    const providerDbId = await getSupabaseProviderId(provider);
    const guestDbId = await getSupabaseGuestId(guest);

    if (!providerDbId || !guestDbId) {
      return { ok: false, reason: "Hiányzik a Supabase szolgáltató vagy vendég azonosító." };
    }

    const { error } = await supabase
      .from("vendeg_szolgaltatok")
      .upsert(
        [{ szolgaltato_id: providerDbId, vendeg_id: guestDbId }],
        { onConflict: "szolgaltato_id,vendeg_id" }
      );

    if (error) {
      console.error(error);
      return { ok: false, error };
    }

    return { ok: true };
  }

  async function addProviderToGuest() {
    if (!activeGuest) return;

    const normalizedCode = normalizeGuestCode(guestProviderCode);
    const foundProvider = providers.find((p) => (p.guestCode || "").toUpperCase() === normalizedCode);

    if (!foundProvider) {
      alert("Nincs ilyen vendégkód.");
      return;
    }

    if (isGuestBlockedByProvider(foundProvider, activeGuest.email)) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudod hozzáadni vagy megnyitni az időpontjait.");
      return;
    }

    const blockedInSupabase = await isGuestBlockedInSupabase(foundProvider, activeGuest.email);

    if (blockedInSupabase) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudod hozzáadni vagy megnyitni az időpontjait.");
      return;
    }

    if ((activeGuest.providerIds || []).some((providerId) => idsEqual(providerId, foundProvider.id))) {
      alert("Ez a szolgáltató már hozzá van adva.");
      return;
    }

    const updatedGuests = guests.map((g) =>
      idsEqual(g.id, activeGuest.id)
        ? { ...g, providerIds: [...filterExistingProviderIds(g.providerIds || [], providers), foundProvider.id] }
        : g
    );

    setGuests(updatedGuests);
    setActiveGuest(updatedGuests.find((g) => g.id === activeGuest.id));
    setGuestProviderCode("");

    const linkResult = await saveProviderGuestLinkToSupabase(foundProvider, activeGuest);

    if (!linkResult.ok) {
      alert("A szolgáltató hozzá lett adva helyben, de Supabase-be nem sikerült elmenteni a kapcsolatot. Ellenőrizd, hogy a vendeg_szolgaltatok tábla létre van-e hozva.");
    }
  }

  async function bookSlot() {
    if (!activeGuest) {
      alert("Először jelentkezz be vendégként.");
      return;
    }

    if (!selectedProvider || !selectedSlot) {
      alert("Válassz időpontot.");
      return;
    }

    if (isSlotInPast(selectedSlot)) {
      alert("Ez az időpont már elmúlt, ezért nem foglalható.");
      setSelectedSlot(null);
      return;
    }

    if (isGuestBlockedByProvider(selectedProvider, activeGuest.email)) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz nála időpontot foglalni.");
      return;
    }

    const blockedInSupabase = await isGuestBlockedInSupabase(selectedProvider, activeGuest.email);

    if (blockedInSupabase) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz nála időpontot foglalni.");
      return;
    }

    const existingBookingOnSelectedDate = guestBookings.find(
      (booking) =>
        booking.active &&
        idsEqual(booking.providerId, selectedProvider.id) &&
        idsEqual(booking.guestId, activeGuest.id) &&
        booking.date === selectedSlot.date &&
        (booking.guestEmail || "").toLowerCase() === (activeGuest.email || "").toLowerCase()
    );

    if (existingBookingOnSelectedDate) {
      if (idsEqual(existingBookingOnSelectedDate.slotId, selectedSlot.id)) {
        alert("Ez már a jelenlegi lefoglalt időpontod.");
        return;
      }

      await confirmChangeBooking(existingBookingOnSelectedDate, selectedProvider, selectedSlot);
      return;
    }

    const guestPhoneValue = activeGuest.phone || "";

    const updatedProviders = providers.map((provider) =>
      provider.id === selectedProvider.id
        ? {
            ...provider,
            slots: provider.slots.map((slot) =>
              slot.id === selectedSlot.id
                ? {
                    ...slot,
                    booked: true,
                    bookedBy: activeGuest.name,
                    guestId: activeGuest.id,
                    guestEmail: activeGuest.email || "",
                    guestPhone: guestPhoneValue,
                    service: selectedService,
                    note: guestNote,
                  }
                : slot
            ),
            notifications: [
              {
                id: Date.now(),
                text: `${activeGuest.name} lefoglalta ezt az időpontot: ${selectedSlot.date} ${selectedSlot.time}`,
                note: guestNote,
                service: selectedService,
              },
              ...(provider.notifications || []),
            ],
          }
        : provider
    );

    const booking = {
      id: Date.now(),
      guestId: activeGuest.id,
      guestName: activeGuest.name,
      guestEmail: activeGuest.email || "",
      guestPhone: guestPhoneValue,
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      day: selectedSlot.day,
      time: selectedSlot.time,
      service: selectedService,
      note: guestNote,
      active: true,
      cancelledByProvider: false,
      providerCancelMessage: "",
      changed: false,
      oldDate: "",
      oldTime: "",
    };

    setProviders(updatedProviders);
    setGuestBookings([...guestBookings, booking]);

    let supabaseBookingMessage = "";
    const providerDbId = await getSupabaseProviderId(selectedProvider);
    const guestDbId = await getSupabaseGuestId(activeGuest);
    const slotDbId = await getSupabaseSlotId(selectedProvider, selectedSlot);

    if (providerDbId && guestDbId && slotDbId) {
      const { error: bookingError } = await supabase.from("foglalasok").insert([
        {
          szolgaltato_id: providerDbId,
          vendeg_id: guestDbId,
          idopont_id: slotDbId,
          szolgaltatas: selectedService || "",
          megjegyzes: guestNote || "",
        },
      ]);

      const { error: slotUpdateError } = await supabase
        .from("idopontok")
        .update({ foglalt: true })
        .eq("id", slotDbId);

      if (bookingError || slotUpdateError) {
        console.error(bookingError || slotUpdateError);
        supabaseBookingMessage = "\n\nFigyelem: a foglalás helyben létrejött, de Supabase-be nem sikerült teljesen menteni.";
      } else {
        supabaseBookingMessage = "\n\nSupabase mentés: foglalás elmentve, időpont foglaltra állítva.";
      }
    } else {
      supabaseBookingMessage = "\n\nFigyelem: a foglalás helyben létrejött, de Supabase mentéshez a szolgáltatónak, vendégnek és időpontnak is szerepelnie kell a Supabase-ben.";
    }

    let freshProvider = updatedProviders.find((p) => idsEqual(p.id, selectedProvider.id));

    if (providerDbId && guestDbId && slotDbId && !supabaseBookingMessage.includes("Figyelem")) {
      const freshData = await loadSupabaseData();

      if (freshData?.providers) {
        freshProvider =
          freshData.providers.find((provider) => idsEqual(provider.id, providerDbId)) ||
          freshData.providers.find((provider) => normalizeEmail(provider.email) === normalizeEmail(selectedProvider.email)) ||
          freshProvider;

        const freshGuest = freshData.guests?.find((guest) => idsEqual(guest.id, guestDbId)) || activeGuest;
        const freshBooking =
          freshData.guestBookings?.find(
            (item) =>
              idsEqual(item.providerId, providerDbId) &&
              idsEqual(item.guestId, guestDbId) &&
              idsEqual(item.slotId, slotDbId)
          ) || booking;

        if (freshGuest && activeGuest && idsEqual(freshGuest.id, activeGuest.id)) {
          setActiveGuest(freshGuest);
        }

        booking.id = freshBooking.id || booking.id;
        booking.providerId = freshBooking.providerId || booking.providerId;
        booking.guestId = freshBooking.guestId || booking.guestId;
        booking.slotId = freshBooking.slotId || booking.slotId;
      }
    }

    setSelectedProvider(freshProvider);

    if (activeProvider && idsEqual(activeProvider.id, selectedProvider.id)) {
      setActiveProvider(freshProvider);
    }

    const bookingEmailResult = await sendBookingCreatedEmails({
      booking,
      provider: freshProvider || selectedProvider,
      guest: activeGuest,
    });

    const emailMessage = bookingEmailResult.guestEmailResult.ok || bookingEmailResult.providerEmailResult.ok
      ? "\n\nEmail értesítés: kiküldés elindítva."
      : "\n\nEmail értesítés: nem sikerült elküldeni. Ellenőrizd a Supabase send-email Edge Functiont.";

    setSelectedSlot(null);
    setSelectedCalendarDate("");
    setGuestNote("");
    setSelectedService("");
    alert(`Foglalás elküldve!${supabaseBookingMessage}${emailMessage}`);
  }

  function startChangeBooking(booking) {
    const provider = providers.find((p) => idsEqual(p.id, booking.providerId));

    if (!provider) {
      alert("A szolgáltató már nem található.");
      return;
    }

    setChangeBookingId(booking.id);
    setChangeProvider(provider);
    setChangeSlot(null);
    setChangeCalendarDate("");
  }

  function cancelChangeBooking() {
    setChangeBookingId(null);
    setChangeProvider(null);
    setChangeSlot(null);
    setChangeCalendarDate("");
  }

  async function confirmChangeBooking(booking, providerOverride = null, slotOverride = null) {
    const providerForChange = providerOverride || changeProvider;
    const slotForChange = slotOverride || changeSlot;

    if (!activeGuest || !providerForChange || !slotForChange) {
      alert("Válassz új időpontot.");
      return;
    }

    if (isSlotInPast(slotForChange)) {
      alert("Ez az időpont már elmúlt, ezért nem választható.");
      setChangeSlot(null);
      return;
    }

    if (isGuestBlockedByProvider(providerForChange, activeGuest.email)) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz nála időpontot módosítani.");
      return;
    }

    const blockedInSupabase = await isGuestBlockedInSupabase(providerForChange, activeGuest.email);

    if (blockedInSupabase) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz nála időpontot módosítani.");
      return;
    }

    const alreadyHasAnotherBookingOnDate = guestBookings.some(
      (otherBooking) =>
        otherBooking.active &&
        !idsEqual(otherBooking.id, booking.id) &&
        idsEqual(otherBooking.providerId, booking.providerId) &&
        otherBooking.date === slotForChange.date &&
        (otherBooking.guestEmail || "").toLowerCase() === (activeGuest.email || "").toLowerCase()
    );

    if (alreadyHasAnotherBookingOnDate) {
      alert("Erre a napra már van másik aktív foglalásod ennél a szolgáltatónál.");
      return;
    }

    const oldText = `${booking.date} ${booking.time}`;
    const newText = `${slotForChange.date} ${slotForChange.time}`;

    const confirmed = confirm(
      `Biztosan lecseréled a ${formatDateHu(booking.date)} ${booking.time} időpontodat erre: ${formatDateHu(slotForChange.date)} ${slotForChange.time}?`
    );

    if (!confirmed) return;

    const providerNotificationCountBeforeChange = getVisibleProviderNotifications(providerForChange).length;

    const updatedProviders = providers.map((provider) =>
      idsEqual(provider.id, booking.providerId)
        ? {
            ...provider,
            slots: provider.slots.map((slot) => {
              if (idsEqual(slot.id, booking.slotId)) {
                return {
                  ...slot,
                  booked: false,
                  bookedBy: "",
                  guestId: null,
                  guestEmail: "",
                  guestPhone: "",
                  service: "",
                  note: "",
                };
              }

              if (idsEqual(slot.id, slotForChange.id)) {
                return {
                  ...slot,
                  booked: true,
                  bookedBy: activeGuest.name,
                  guestId: activeGuest.id,
                  guestEmail: activeGuest.email || booking.guestEmail || "",
                  guestPhone: activeGuest.phone || "",
                  service: booking.service || "",
                  note: booking.note || "",
                };
              }

              return slot;
            }),
            notifications: [
              {
                id: Date.now(),
                text: `${activeGuest.name} módosította az időpontját. Régi: ${oldText}. Új: ${newText}`,
                note: booking.note || "",
                service: booking.service || "",
              },
              ...(provider.notifications || []),
            ],
          }
        : provider
    );

    const updatedBookings = guestBookings.map((b) =>
      idsEqual(b.id, booking.id)
        ? {
            ...b,
            slotId: slotForChange.id,
            oldDate: b.date,
            oldTime: b.time,
            date: slotForChange.date,
            day: slotForChange.day,
            time: slotForChange.time,
            changed: true,
          }
        : b
    );

    const changeMessage = {
      id: Date.now(),
      providerId: booking.providerId,
      providerName: booking.providerName,
      guestId: booking.guestId,
      guestName: booking.guestName || activeGuest.name,
      guestEmail: booking.guestEmail || activeGuest.email,
      slotId: slotForChange.id,
      date: slotForChange.date,
      time: slotForChange.time,
      from: "guest",
      fromName: activeGuest.name || "Vendég",
      toName: booking.providerName || providerForChange.name || "Szolgáltató",
      text: `A vendég módosította az időpontot. Régi időpont: ${oldText}. Új időpont: ${newText}.`,
      type: "change",
      createdAt: new Date().toISOString(),
    };

    setProviders(updatedProviders);
    setGuestBookings(updatedBookings);
    setMessages([changeMessage, ...messages]);
    refreshProviderViews(updatedProviders, booking.providerId);
    markProviderOverviewPanelUnread(booking.providerId, "providerNotifications", providerNotificationCountBeforeChange);

    const oldSlotForSupabase = providerForChange.slots.find((slot) => idsEqual(slot.id, booking.slotId)) || {
      id: booking.slotId,
      date: booking.date,
      time: booking.time,
    };

    const supabaseChangeResult = await syncBookingChangeToSupabase(
      booking,
      providerForChange,
      oldSlotForSupabase,
      slotForChange
    );

    const supabaseMessageResult = await saveMessageToSupabase(changeMessage, {
      provider: providerForChange,
      guest: activeGuest,
      slot: slotForChange,
    });

    const changeEmailResult = await sendBookingChangedEmails({
      booking,
      provider: providerForChange,
      guest: activeGuest,
      oldText,
      newText,
    });

    const emailSuffix = changeEmailResult.guestEmailResult.ok || changeEmailResult.providerEmailResult.ok
      ? " Email értesítés elküldve."
      : " Figyelem: email értesítést nem sikerült küldeni.";

    setChangeBookingId(null);
    setChangeProvider(null);
    setChangeSlot(null);
    setChangeCalendarDate("");

    if (supabaseChangeResult.ok && supabaseMessageResult.ok) {
      alert(`Időpont módosítva, Supabase-ben frissítve, és a szolgáltató módosításként kapott értesítést.${emailSuffix}`);
    } else if (supabaseChangeResult.ok) {
      alert(`Időpont módosítva és Supabase-ben frissítve. Figyelem: a módosítási értesítést nem sikerült Supabase-be menteni.${emailSuffix}`);
    } else {
      alert(`Időpont módosítva helyben. Figyelem: Supabase-ben nem sikerült teljesen frissíteni.${emailSuffix}`);
    }
  }

  async function cancelBookingByGuest(booking) {
    if (!confirm(`Biztosan lemondod ezt az időpontot?\n\n${booking.providerName || "Szolgáltató"} - ${formatDateHu(booking.date)} ${booking.time}`)) return;

    const providerForSupabase = providers.find((provider) => idsEqual(provider.id, booking.providerId));
    const providerNotificationCountBeforeCancel = providerForSupabase
      ? getVisibleProviderNotifications(providerForSupabase).length
      : 0;
    const slotForSupabase = providerForSupabase && Array.isArray(providerForSupabase.slots)
      ? providerForSupabase.slots.find((slot) => slot.id === booking.slotId)
      : {
          id: booking.slotId,
          date: booking.date,
          time: booking.time,
        };

    const updatedProviders = providers.map((provider) =>
      idsEqual(provider.id, booking.providerId)
        ? {
            ...provider,
            slots: provider.slots.map((slot) =>
              slot.id === booking.slotId
                ? { ...slot, booked: false, bookedBy: "", guestId: null, guestEmail: "", guestPhone: "", service: "", note: "" }
                : slot
            ),
            notifications: [
              {
                id: Date.now(),
                text: `${booking.guestName} lemondta ezt az időpontot: ${booking.date} ${booking.time}`,
                note: "Vendég által lemondva.",
                type: "cancel",
              },
              ...(provider.notifications || []),
            ],
          }
        : provider
    );

    const updatedBookings = guestBookings.map((b) =>
      idsEqual(b.id, booking.id)
        ? {
            ...b,
            active: false,
            cancelledByGuest: true,
          }
        : b
    );

    const cancelMessage = {
      id: Date.now(),
      providerId: booking.providerId,
      providerName: booking.providerName,
      guestId: booking.guestId,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      slotId: booking.slotId,
      date: booking.date,
      time: booking.time,
      from: "guest",
      fromName: booking.guestName || activeGuest?.name || "Vendég",
      toName: booking.providerName || "Szolgáltató",
      text: `A vendég lemondta az időpontot: ${booking.date} ${booking.time}`,
      type: "cancel",
      createdAt: new Date().toISOString(),
    };

    const guestCancelNotification = {
      id: Date.now() + 1,
      text: `Lemondtad ezt az időpontot: ${booking.providerName || "Szolgáltató"} - ${formatDateHu(booking.date)} ${booking.time}`,
      message: "Vendég által lemondva.",
      type: "cancel",
    };

    const updatedGuestsAfterCancel = guests.map((guest) =>
      idsEqual(guest.id, booking.guestId)
        ? { ...guest, notifications: [guestCancelNotification, ...(guest.notifications || [])] }
        : guest
    );

    setProviders(updatedProviders);
    setGuests(updatedGuestsAfterCancel);
    if (activeGuest && idsEqual(activeGuest.id, booking.guestId)) {
      setActiveGuest({ ...activeGuest, notifications: [guestCancelNotification, ...(activeGuest.notifications || [])] });
    }
    setGuestBookings(updatedBookings);
    setMessages([cancelMessage, ...messages]);

    refreshProviderViews(updatedProviders, booking.providerId);
    markProviderOverviewPanelUnread(booking.providerId, "providerNotifications", providerNotificationCountBeforeCancel);
    markGuestOverviewPanelUnread(booking.guestId, "guestCancelledBookings", -1);

    const supabaseCancelResult = await syncBookingCancellationToSupabase(
      booking,
      providerForSupabase,
      slotForSupabase
    );

    const supabaseMessageResult = await saveMessageToSupabase(cancelMessage, {
      provider: providerForSupabase,
      guest: {
        id: booking.guestId,
        name: booking.guestName,
        email: booking.guestEmail,
        phone: booking.guestPhone,
      },
      slot: slotForSupabase,
    });

    const cancelEmailResult = await sendBookingCancelledEmail({
      booking,
      provider: providerForSupabase,
    });

    const emailSuffix = cancelEmailResult.ok
      ? " Email értesítés elküldve."
      : " Figyelem: email értesítést nem sikerült küldeni.";

    if (supabaseCancelResult.ok && supabaseMessageResult.ok) {
      alert(`Időpont lemondva, Supabase-ben felszabadítva, és a szolgáltató is kapott értesítést.${emailSuffix}`);
    } else if (supabaseCancelResult.ok) {
      alert(`Időpont lemondva és Supabase-ben felszabadítva. Figyelem: a lemondási üzenetet nem sikerült Supabase-be menteni.${emailSuffix}`);
    } else {
      alert(`Időpont lemondva helyben. Figyelem: Supabase-ben nem sikerült teljesen felszabadítani.${emailSuffix}`);
    }
  }

  async function cancelBookingByProvider(slot) {
    if (!activeProvider || !slot || !slot.booked) return;

    const cancelKey = slot.id || `${slot.date || ""}-${slot.time || ""}`;
    const message = (providerCancelMessages[cancelKey] || providerCancelMessages[slot.id] || "").trim();

    if (!message) {
      alert("Lemondáskor kötelező üzenetet írni a vendégnek.");
      return;
    }

    const bookingForSupabase =
      guestBookings.find(
        (booking) =>
          booking &&
          booking.active &&
          (
            idsEqual(booking.slotId, slot.id) ||
            (
              idsEqual(booking.providerId, activeProvider.id) &&
              booking.date === slot.date &&
              String(booking.time || "").slice(0, 5) === String(slot.time || "").slice(0, 5) &&
              (
                (slot.guestId && idsEqual(booking.guestId, slot.guestId)) ||
                (slot.guestEmail && normalizeEmail(booking.guestEmail) === normalizeEmail(slot.guestEmail))
              )
            )
          )
      ) || {
        id: null,
        guestId: slot.guestId,
        guestEmail: slot.guestEmail,
        providerId: activeProvider.id,
        slotId: slot.id,
        date: slot.date,
        time: slot.time,
      };

    const guestForNotification = guests.find(
      (guest) =>
        idsEqual(guest.id, slot.guestId) ||
        normalizeEmail(guest.email) === normalizeEmail(slot.guestEmail || bookingForSupabase.guestEmail)
    );
    const guestNotificationCountBeforeCancel = guestForNotification
      ? getVisibleGuestNotifications(guestForNotification).length
      : 0;

    const slotMatches = (candidateSlot) =>
      candidateSlot &&
      (
        idsEqual(candidateSlot.id, slot.id) ||
        (
          candidateSlot.date === slot.date &&
          String(candidateSlot.time || "").slice(0, 5) === String(slot.time || "").slice(0, 5)
        )
      );

    const updatedProviders = providers.map((provider) => {
      const sameProvider =
        idsEqual(provider.id, activeProvider.id) ||
        normalizeEmail(provider.email) === normalizeEmail(activeProvider.email);

      if (!sameProvider) return provider;

      return {
        ...provider,
        slots: (provider.slots || []).map((providerSlot) =>
          slotMatches(providerSlot)
            ? { ...providerSlot, booked: false, bookedBy: "", guestId: null, guestEmail: "", guestPhone: "", service: "", note: "" }
            : providerSlot
        ),
        notifications: [
          {
            id: Date.now(),
            text: `${activeProvider.name} lemondta ${slot.bookedBy || bookingForSupabase.guestName || "Vendég"} időpontját: ${slot.date} ${slot.time}`,
            note: message,
          },
          ...(provider.notifications || []),
        ],
      };
    });

    const updatedBookings = guestBookings.map((booking) =>
      booking &&
      booking.active &&
      (
        idsEqual(booking.id, bookingForSupabase.id) ||
        idsEqual(booking.slotId, slot.id) ||
        (
          idsEqual(booking.providerId, activeProvider.id) &&
          booking.date === slot.date &&
          String(booking.time || "").slice(0, 5) === String(slot.time || "").slice(0, 5)
        )
      )
        ? {
            ...booking,
            active: false,
            cancelledByProvider: true,
            providerCancelMessage: message,
          }
        : booking
    );

    const updatedGuests = guests.map((guest) =>
      guestForNotification && idsEqual(guest.id, guestForNotification.id)
        ? {
            ...guest,
            notifications: [
              {
                id: Date.now(),
                text: `${activeProvider.name} lemondta az időpontodat: ${slot.date} ${slot.time}`,
                message,
                type: "provider_cancel",
              },
              ...(guest.notifications || []),
            ],
          }
        : guest
    );

    const cancelMessage = {
      id: Date.now(),
      providerId: activeProvider.id,
      providerName: activeProvider.name,
      guestId: slot.guestId || bookingForSupabase.guestId,
      guestName: slot.bookedBy || bookingForSupabase.guestName || guestForNotification?.name || "Vendég",
      guestEmail: slot.guestEmail || bookingForSupabase.guestEmail || guestForNotification?.email || "",
      slotId: slot.id || bookingForSupabase.slotId,
      date: slot.date,
      time: slot.time,
      from: "provider",
      fromName: activeProvider.name,
      toName: slot.bookedBy || bookingForSupabase.guestName || guestForNotification?.name || "Vendég",
      text: message,
      type: "provider_cancel",
      createdAt: new Date().toISOString(),
    };

    setMessages([cancelMessage, ...messages]);
    setProviders(updatedProviders);
    setGuestBookings(updatedBookings);
    setGuests(updatedGuests);

    const freshProvider = updatedProviders.find(
      (provider) => idsEqual(provider.id, activeProvider.id) || normalizeEmail(provider.email) === normalizeEmail(activeProvider.email)
    );
    setActiveProvider(freshProvider || activeProvider);

    if (selectedProvider && idsEqual(selectedProvider.id, activeProvider.id)) {
      setSelectedProvider(freshProvider || activeProvider);
    }

    if (activeGuest) {
      refreshGuestViews(updatedGuests, activeGuest.id);
    }

    if (guestForNotification) {
      markGuestOverviewPanelUnread(guestForNotification.id, "guestNotifications", guestNotificationCountBeforeCancel);
      markGuestOverviewPanelUnread(guestForNotification.id, "guestCancelledBookings", -1);
    }

    const supabaseMessageResult = await saveMessageToSupabase(cancelMessage, {
      provider: activeProvider,
      guest: guestForNotification || {
        id: bookingForSupabase.guestId,
        name: bookingForSupabase.guestName,
        email: bookingForSupabase.guestEmail,
        phone: bookingForSupabase.guestPhone,
      },
      slot,
    });

    const supabaseCancelResult = await syncBookingCancellationToSupabase(
      bookingForSupabase,
      activeProvider,
      slot
    );

    setProviderCancelMessages({ ...providerCancelMessages, [cancelKey]: "", [slot.id]: "" });

    if (supabaseCancelResult.ok) {
      await loadSupabaseData();
    }

    if (supabaseMessageResult.ok && supabaseCancelResult.ok) {
      alert("A szolgáltató lemondta az időpontot. Az üzenet elmentve, az időpont Supabase-ben is felszabadítva.");
    } else if (supabaseCancelResult.ok) {
      alert("A szolgáltató lemondta az időpontot. Az időpont Supabase-ben is felszabadítva, de az üzenetet nem sikerült menteni.");
    } else {
      alert("A szolgáltató lemondta az időpontot helyben. Figyelem: Supabase-ben nem sikerült teljesen felszabadítani.");
    }
  }


  async function recoverProviderLogin() {
    if (!forgotProviderEmail) {
      alert("Add meg az email címed.");
      return;
    }

    const emailValue = forgotProviderEmail.trim();

    const foundProvider = providers.find(
      (p) => (p.email || "").toLowerCase() === emailValue.toLowerCase()
    );

    if (!foundProvider) {
      alert("Nem találtam szolgáltatót ezzel az email címmel.");
      return;
    }

    const emailResult = await sendLoginRecoveryEmail({
      to: foundProvider.email,
      subject: "Szolgáltatói belépési adatok",
      type: "provider_login_recovery",
      lines: [
        "Szolgáltatói belépési adatok:",
        `Belépési email: ${foundProvider.email}`,
        `PIN: ${foundProvider.pin}`,
        `Vendégkód: ${foundProvider.guestCode}`,
      ],
    });

    if (emailResult.ok) {
      alert("Elküldtem a szolgáltatói belépési adatokat emailben.");
      setForgotProviderEmail("");
    } else {
      alert("Nem sikerült elküldeni az emailt. Ellenőrizd, hogy a Supabase send-email Edge Function be van-e állítva.");
    }
  }

  async function recoverGuestLogin() {
    if (!forgotGuestEmail) {
      alert("Add meg az email címed.");
      return;
    }

    const emailValue = forgotGuestEmail.trim();

    const foundGuest = guests.find(
      (g) => (g.email || "").toLowerCase() === emailValue.toLowerCase()
    );

    if (!foundGuest) {
      alert("Nem találtam vendéget ezzel az email címmel.");
      return;
    }

    const emailResult = await sendLoginRecoveryEmail({
      to: foundGuest.email,
      subject: "Vendég belépési adatok",
      type: "guest_login_recovery",
      lines: [
        "Vendég belépési adatok:",
        `Név: ${foundGuest.name}`,
        `Email: ${foundGuest.email}`,
        `PIN: ${foundGuest.pin}`,
      ],
    });

    if (emailResult.ok) {
      alert("Elküldtem a vendég belépési adatokat emailben.");
      setForgotGuestEmail("");
    } else {
      alert("Nem sikerült elküldeni az emailt. Ellenőrizd, hogy a Supabase send-email Edge Function be van-e állítva.");
    }
  }


  async function recoverAnyLogin() {
    if (!forgotLoginEmail) {
      alert("Add meg az email címed.");
      return;
    }

    const emailValue = forgotLoginEmail.trim();
    const normalizedEmail = emailValue.toLowerCase();

    const foundProvider = providers.find(
      (provider) => (provider.email || "").toLowerCase() === normalizedEmail
    );

    const foundGuest = guests.find(
      (guest) => (guest.email || "").toLowerCase() === normalizedEmail
    );

    if (!foundProvider && !foundGuest) {
      alert("Nem találtam ilyen email címmel regisztrált fiókot.");
      return;
    }

    const emailSections = [];

    if (foundProvider) {
      emailSections.push(
        "Szolgáltatói belépési adatok:",
        `Belépési email: ${foundProvider.email}`,
        `PIN: ${foundProvider.pin}`,
        `Vendégkód: ${foundProvider.guestCode}`,
        ""
      );
    }

    if (foundGuest) {
      emailSections.push(
        "Vendég belépési adatok:",
        `Név: ${foundGuest.name}`,
        `Email: ${foundGuest.email}`,
        `PIN: ${foundGuest.pin}`
      );
    }

    const emailResult = await sendLoginRecoveryEmail({
      to: emailValue,
      subject: "Időpont Foglaló - elfelejtett jelszó",
      type: "login_recovery",
      lines: emailSections,
    });

    if (emailResult.ok) {
      alert("Elküldtem a belépési adatokat emailben.");
      setForgotLoginEmail("");
      setMode("");
    } else {
      alert("Nem sikerült elküldeni az emailt. Ellenőrizd, hogy a Supabase send-email Edge Function be van-e állítva.");
    }
  }


  function getMessagesForProvider(providerId) {
    return messages
      .filter((message) => idsEqual(message.providerId, providerId))
      .sort((a, b) => String(b.createdAt || b.id || "").localeCompare(String(a.createdAt || a.id || "")));
  }

  function getMessagesForGuest(guestId) {
    return messages
      .filter((message) => message.guestId === guestId)
      .sort((a, b) => b.id - a.id);
  }

  async function sendProviderMessageToGuest(slot) {
    if (!activeProvider || !slot.booked || !slot.guestId) return;

    const text = (providerMessageTexts[slot.id] || "").trim();

    if (!text) {
      alert("Írj üzenetet a vendégnek.");
      return;
    }

    const newMessage = {
      id: Date.now(),
      providerId: activeProvider.id,
      providerName: activeProvider.name,
      guestId: slot.guestId,
      guestName: slot.bookedBy,
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      from: "provider",
      fromName: activeProvider.name,
      toName: slot.bookedBy,
      text,
      type: "message",
    };

    setMessages([newMessage, ...messages]);

    const updatedGuests = guests.map((guest) =>
      guest.id === slot.guestId
        ? {
            ...guest,
            notifications: [
              {
                id: Date.now(),
                text: `${activeProvider.name} üzenetet küldött neked: ${slot.date} ${slot.time}`,
                message: text,
              },
              ...(guest.notifications || []),
            ],
          }
        : guest
    );

    const guestForMessage = guests.find((guest) => idsEqual(guest.id, slot.guestId));
    const guestNotificationCountBeforeMessage = guestForMessage ? getVisibleGuestNotifications(guestForMessage).length : 0;

    setGuests(updatedGuests);
    refreshGuestViews(updatedGuests, slot.guestId);
    markGuestOverviewPanelUnread(slot.guestId, "guestNotifications", guestNotificationCountBeforeMessage);

    const supabaseMessageResult = await saveMessageToSupabase(newMessage, {
      provider: activeProvider,
      guest: guests.find((guest) => guest.id === slot.guestId),
      slot,
    });

    const guestForEmail = guests.find((guest) => guest.id === slot.guestId);
    const emailResult = await sendMessageNotificationEmail({
      message: newMessage,
      recipientEmail: guestForEmail?.email || slot.guestEmail,
    });

    setProviderMessageTexts({ ...providerMessageTexts, [slot.id]: "" });

    const emailSuffix = emailResult.ok
      ? " Email értesítés elküldve."
      : " Figyelem: email értesítést nem sikerült küldeni.";

    if (supabaseMessageResult.ok) {
      alert(`Üzenet elküldve a vendégnek és Supabase-be is elmentve.${emailSuffix}`);
    } else {
      alert(`Üzenet elküldve a vendégnek. Figyelem: Supabase-be nem sikerült menteni.${emailSuffix}`);
    }
  }

  async function sendProviderDirectMessageToGuest(guest, textKey, relatedMessage = {}) {
    if (!activeProvider || !guest) return;

    const text = (providerMessageTexts[textKey] || "").trim();

    if (!text) {
      alert("Írj üzenetet a vendégnek.");
      return;
    }

    const newMessage = {
      id: Date.now(),
      providerId: activeProvider.id,
      providerName: activeProvider.name,
      guestId: guest.id,
      guestName: guest.name,
      guestEmail: guest.email || "",
      slotId: relatedMessage.slotId || "",
      date: relatedMessage.date || "",
      time: relatedMessage.time || "",
      from: "provider",
      fromName: activeProvider.name,
      toName: guest.name || "Vendég",
      text,
      type: "message",
    };

    setMessages([newMessage, ...messages]);

    const updatedGuests = guests.map((guestItem) =>
      idsEqual(guestItem.id, guest.id)
        ? {
            ...guestItem,
            notifications: [
              {
                id: Date.now(),
                text: `${activeProvider.name} üzenetet küldött neked.`,
                message: text,
              },
              ...(guestItem.notifications || []),
            ],
          }
        : guestItem
    );

    setGuests(updatedGuests);
    refreshGuestViews(updatedGuests, guest.id);

    const supabaseMessageResult = await saveMessageToSupabase(newMessage, {
      provider: activeProvider,
      guest,
      slot: null,
    });

    const emailResult = await sendMessageNotificationEmail({
      message: newMessage,
      recipientEmail: guest.email,
    });

    setProviderMessageTexts({ ...providerMessageTexts, [textKey]: "" });

    const emailSuffix = emailResult.ok
      ? " Email értesítés elküldve."
      : " Figyelem: email értesítést nem sikerült küldeni.";

    if (supabaseMessageResult.ok) {
      alert(`Üzenet elküldve a vendégnek és Supabase-be is elmentve.${emailSuffix}`);
    } else {
      alert(`Üzenet elküldve a vendégnek. Figyelem: Supabase-be nem sikerült menteni.${emailSuffix}`);
    }
  }

  async function sendGuestMessageToProvider(booking) {
    if (!activeGuest || !booking.providerId) return;

    const provider = providers.find((p) => idsEqual(p.id, booking.providerId));

    if (isGuestBlockedByProvider(provider, activeGuest.email)) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz neki üzenetet küldeni.");
      return;
    }

    const blockedInSupabase = await isGuestBlockedInSupabase(provider, activeGuest.email);

    if (blockedInSupabase) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz neki üzenetet küldeni.");
      return;
    }

    const text = (guestMessageTexts[booking.id] || "").trim();

    if (!text) {
      alert("Írj üzenetet a szolgáltatónak.");
      return;
    }

    const newMessage = {
      id: Date.now(),
      providerId: booking.providerId,
      providerName: booking.providerName,
      guestId: activeGuest.id,
      guestName: activeGuest.name,
      slotId: booking.slotId,
      date: booking.date,
      time: booking.time,
      from: "guest",
      fromName: activeGuest.name,
      toName: booking.providerName,
      text,
      type: "message",
    };

    setMessages([newMessage, ...messages]);

    const updatedProviders = providers.map((provider) =>
      idsEqual(provider.id, booking.providerId)
        ? {
            ...provider,
            notifications: [
              {
                id: Date.now(),
                text: `${activeGuest.name} üzenetet küldött neked: ${booking.date} ${booking.time}`,
                note: text,
              },
              ...(provider.notifications || []),
            ],
          }
        : provider
    );

    const providerNotificationCountBeforeMessage = provider ? getVisibleProviderNotifications(provider).length : 0;

    setProviders(updatedProviders);
    refreshProviderViews(updatedProviders, booking.providerId);
    markProviderOverviewPanelUnread(booking.providerId, "providerNotifications", providerNotificationCountBeforeMessage);

    const supabaseMessageResult = await saveMessageToSupabase(newMessage, {
      provider,
      guest: activeGuest,
      slot: provider && Array.isArray(provider.slots)
        ? provider.slots.find((slot) => slot.id === booking.slotId)
        : { id: booking.slotId, date: booking.date, time: booking.time },
    });

    const emailResult = await sendMessageNotificationEmail({
      message: newMessage,
      recipientEmail: provider?.email,
    });

    setGuestMessageTexts({ ...guestMessageTexts, [booking.id]: "" });

    const emailSuffix = emailResult.ok
      ? " Email értesítés elküldve."
      : " Figyelem: email értesítést nem sikerült küldeni.";

    if (supabaseMessageResult.ok) {
      alert(`Üzenet elküldve a szolgáltatónak és Supabase-be is elmentve.${emailSuffix}`);
    } else {
      alert(`Üzenet elküldve a szolgáltatónak. Figyelem: Supabase-be nem sikerült menteni.${emailSuffix}`);
    }
  }


  async function blockGuestEmail(emailToBlock) {
    if (!activeProvider || !emailToBlock) return;

    const normalizedEmail = emailToBlock.trim().toLowerCase();

    if (!normalizedEmail) return;

    if ((activeProvider.blockedEmails || []).some((email) => email.toLowerCase() === normalizedEmail)) {
      alert("Ez az email cím már tiltva van.");
      return;
    }

    if (!confirm(`Biztosan letiltod ezt a vendéget? ${normalizedEmail}`)) return;

    const blockedGuest = guests.find(
      (guest) => (guest.email || "").toLowerCase() === normalizedEmail
    );

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? {
            ...provider,
            blockedEmails: [...(provider.blockedEmails || []), normalizedEmail],
            slots: (provider.slots || []).map((slot) =>
              (slot.guestEmail || "").toLowerCase() === normalizedEmail && slot.booked
                ? {
                    ...slot,
                    booked: false,
                    bookedBy: "",
                    guestId: null,
                    guestEmail: "",
                    guestPhone: "",
                    service: "",
                    note: "",
                  }
                : slot
            ),
            notifications: [
              {
                id: Date.now(),
                text: `${normalizedEmail} le lett tiltva. Az aktív foglalásai felszabadultak.`,
                note: "",
              },
              ...(provider.notifications || []),
            ],
          }
        : provider
    );

    const updatedBookings = guestBookings.map((booking) =>
      idsEqual(booking.providerId, activeProvider.id) &&
      booking.active &&
      (booking.guestEmail || "").toLowerCase() === normalizedEmail
        ? {
            ...booking,
            active: false,
            cancelledByProvider: true,
            providerCancelMessage: "A szolgáltató letiltotta ezt az email címet, ezért a foglalás törölve lett.",
          }
        : booking
    );

    const updatedGuests = guests.map((guest) =>
      (guest.email || "").toLowerCase() === normalizedEmail
        ? {
            ...guest,
            providerIds: guest.providerIds || [],
            notifications: [
              {
                id: Date.now(),
                text: `${activeProvider.name} letiltott téged, ezért nem tudsz nála több időpontot foglalni.`,
                message: "A szolgáltató letiltotta az email címedet. Az aktív foglalásaid ennél a szolgáltatónál törölve lettek.",
              },
              ...(guest.notifications || []),
            ],
          }
        : guest
    );

    const blockMessage = blockedGuest
      ? {
          id: Date.now(),
          providerId: activeProvider.id,
          providerName: activeProvider.name,
          guestId: blockedGuest.id,
          guestName: blockedGuest.name,
          slotId: "",
          date: "",
          time: "",
          from: "provider",
          fromName: activeProvider.name,
          toName: blockedGuest.name,
          text: "A szolgáltató letiltotta ezt az email címet. Az aktív foglalások törölve lettek.",
          type: "block",
        }
      : null;

    setProviders(updatedProviders);
    setGuestBookings(updatedBookings);
    setGuests(updatedGuests);
    if (blockMessage) {
      setMessages([blockMessage, ...messages]);
      await saveMessageToSupabase(blockMessage, {
        provider: activeProvider,
        guest: blockedGuest,
      });
    }
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));

    if (activeGuest && (activeGuest.email || "").toLowerCase() === normalizedEmail) {
      const refreshedGuest = updatedGuests.find((g) => g.id === activeGuest.id);
      setActiveGuest(refreshedGuest || activeGuest);
      setSelectedProvider(null);
      setSelectedSlot(null);
      setSelectedCalendarDate("");
    }

    const providerDbId = await getSupabaseProviderId(activeProvider);

    if (providerDbId) {
      let blockedGuestDbId = blockedGuest ? await getSupabaseGuestId(blockedGuest) : null;

      if (!blockedGuestDbId) {
        const { data: guestRow, error: guestLookupError } = await supabase
          .from("vendegek")
          .select("id")
          .ilike("email", normalizedEmail)
          .maybeSingle();

        if (guestLookupError) {
          console.error(guestLookupError);
        }

        blockedGuestDbId = guestRow?.id || null;
      }

      if (blockedGuestDbId) {
        const { data: bookingsToClear, error: bookingLookupError } = await supabase
          .from("foglalasok")
          .select("idopont_id")
          .eq("szolgaltato_id", providerDbId)
          .eq("vendeg_id", blockedGuestDbId);

        if (bookingLookupError) {
          console.error(bookingLookupError);
        }

        const slotIdsToFree = (bookingsToClear || [])
          .map((booking) => booking.idopont_id)
          .filter(Boolean);

        if (slotIdsToFree.length > 0) {
          const { error: slotFreeError } = await supabase
            .from("idopontok")
            .update({ foglalt: false })
            .in("id", slotIdsToFree);

          if (slotFreeError) {
            console.error(slotFreeError);
          }
        }

        const { error: bookingDeleteError } = await supabase
          .from("foglalasok")
          .delete()
          .eq("szolgaltato_id", providerDbId)
          .eq("vendeg_id", blockedGuestDbId);

        if (bookingDeleteError) {
          console.error(bookingDeleteError);
          alert("Vendég letiltva, de a Supabase foglalásait nem sikerült törölni.");
          return;
        }
      }

      const { error } = await supabase.from("letiltott_vendegek").insert([
        {
          szolgaltato_id: providerDbId,
          vendeg_email: normalizedEmail,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Vendég letiltva helyben, de Supabase-be nem sikerült menteni.");
        return;
      }

      alert("Vendég letiltva, Supabase-be elmentve, a Supabase foglalásai törölve és az időpontjai felszabadítva.");
      return;
    }

    alert("Vendég letiltva helyben. Supabase mentéshez Supabase-ben létező szolgáltatóval kell belépni.");
  }

  async function unblockGuestEmail(emailToUnblock) {
    if (!activeProvider || !emailToUnblock) return;

    const normalizedEmail = emailToUnblock.trim().toLowerCase();

    if (!normalizedEmail) return;

    if (!confirm(`Biztosan feloldod a tiltást ennél a vendégnél? ${normalizedEmail}`)) return;

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? {
            ...provider,
            blockedEmails: (provider.blockedEmails || []).filter(
              (email) => email.toLowerCase() !== normalizedEmail
            ),
          }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));

    const providerDbId = await getSupabaseProviderId(activeProvider);

    if (providerDbId) {
      const { error } = await supabase
        .from("letiltott_vendegek")
        .delete()
        .eq("szolgaltato_id", providerDbId)
        .eq("vendeg_email", normalizedEmail);

      if (error) {
        console.error(error);
        alert("Tiltás feloldva helyben, de Supabase-ből nem sikerült törölni.");
        return;
      }

      alert("Tiltás feloldva és Supabase-ben is törölve.");
      return;
    }

    alert("Tiltás feloldva helyben. Supabase törléshez Supabase-ben létező szolgáltatóval kell belépni.");
  }


  async function changeProviderGuestCode() {
    if (!activeProvider) return;

    const trimmedCode = normalizeGuestCode(newGuestCode);

    if (!trimmedCode) {
      alert("Add meg az új vendégkódot.");
      return;
    }

    if (!isValidGuestCode(trimmedCode)) {
      alert("Az új vendégkód legalább 6 karakter legyen. Használhatsz nagybetűt, számot, kötőjelet és aláhúzást.");
      return;
    }

    const codeExists = providers.some(
      (provider) =>
        provider.id !== activeProvider.id &&
        (provider.guestCode || "").toUpperCase() === trimmedCode
    );

    if (codeExists) {
      alert("Ez a vendégkód már foglalt. Válassz másikat.");
      return;
    }

    const providerDbId = await getSupabaseProviderId(activeProvider);

    if (providerDbId) {
      const { data: existingCodeProvider, error: existingCodeError } = await supabase
        .from("szolgaltatok")
        .select("id")
        .eq("vendegkod", trimmedCode)
        .neq("id", providerDbId)
        .maybeSingle();

      if (existingCodeError) {
        console.error(existingCodeError);
        alert("Nem sikerült ellenőrizni Supabase-ben, hogy foglalt-e ez a vendégkód. Nézd meg a Console hibát.");
        return;
      }

      if (existingCodeProvider) {
        alert("Ez a vendégkód Supabase-ben már foglalt. Válassz másikat.");
        return;
      }

      const { error: updateGuestCodeError } = await supabase
        .from("szolgaltatok")
        .update({ vendegkod: trimmedCode })
        .eq("id", providerDbId);

      if (updateGuestCodeError) {
        console.error(updateGuestCodeError);
        alert("A vendégkód helyben nem lett módosítva, mert Supabase-be nem sikerült elmenteni. Nézd meg a Console hibát.");
        return;
      }
    } else {
      const { data: existingCodeProvider, error: existingCodeError } = await supabase
        .from("szolgaltatok")
        .select("id")
        .eq("vendegkod", trimmedCode)
        .maybeSingle();

      if (existingCodeError) {
        console.error(existingCodeError);
        alert("Nem sikerült ellenőrizni Supabase-ben, hogy foglalt-e ez a vendégkód. Nézd meg a Console hibát.");
        return;
      }

      if (existingCodeProvider) {
        alert("Ez a vendégkód Supabase-ben már foglalt. Válassz másikat.");
        return;
      }
    }

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? {
            ...provider,
            guestCode: trimmedCode,
          }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));
    setNewGuestCode("");

    alert(
      `Vendégkód módosítva${providerDbId ? " és Supabase-ben is frissítve" : ""}. Új vendégkód: ${trimmedCode}\n\nA régi vendégeid továbbra is kapcsolatban maradnak veled helyben és Supabase-ben is. Az új kód csak az új vendégeknek kell.`
    );
  }

  async function changeProviderPin() {
    if (!activeProvider) return;

    const currentPin = String(providerCurrentPin || "").trim();
    const newPin = String(providerNewPin || "").trim();
    const newPinAgain = String(providerNewPinAgain || "").trim();

    if (!currentPin || !newPin || !newPinAgain) {
      alert("Add meg a jelenlegi PIN-t és kétszer az új PIN-t.");
      return;
    }

    if (currentPin !== String(activeProvider.pin || "")) {
      alert("A jelenlegi PIN nem stimmel.");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      alert("Az új PIN pontosan 4 számjegy legyen.");
      return;
    }

    if (newPin !== newPinAgain) {
      alert("A két új PIN nem egyezik.");
      return;
    }

    const providerDbId = await getSupabaseProviderId(activeProvider);

    if (providerDbId) {
      const { error } = await supabase
        .from("szolgaltatok")
        .update({ pin: newPin })
        .eq("id", providerDbId);

      if (error) {
        console.error(error);
        alert("A PIN nem lett módosítva, mert Supabase-be nem sikerült elmenteni. Nézd meg a Console hibát.");
        return;
      }
    }

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id ? { ...provider, pin: newPin } : provider
    );
    const updatedActiveProvider = { ...activeProvider, pin: newPin };

    setProviders(updatedProviders);
    setActiveProvider(updatedActiveProvider);
    setProviderCurrentPin("");
    setProviderNewPin("");
    setProviderNewPinAgain("");
    setShowProviderPinEdit(false);
    alert(providerDbId ? "Szolgáltatói PIN módosítva és Supabase-ben is frissítve." : "Szolgáltatói PIN helyben módosítva.");
  }

  async function changeGuestPin() {
    if (!activeGuest) return;

    const currentPin = String(guestCurrentPin || "").trim();
    const newPin = String(guestNewPin || "").trim();
    const newPinAgain = String(guestNewPinAgain || "").trim();

    if (!currentPin || !newPin || !newPinAgain) {
      alert("Add meg a jelenlegi PIN-t és kétszer az új PIN-t.");
      return;
    }

    if (currentPin !== String(activeGuest.pin || "")) {
      alert("A jelenlegi PIN nem stimmel.");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      alert("Az új PIN pontosan 4 számjegy legyen.");
      return;
    }

    if (newPin !== newPinAgain) {
      alert("A két új PIN nem egyezik.");
      return;
    }

    const guestDbId = await getSupabaseGuestId(activeGuest);

    if (guestDbId) {
      const { error } = await supabase
        .from("vendegek")
        .update({ pin: newPin })
        .eq("id", guestDbId);

      if (error) {
        console.error(error);
        alert("A PIN nem lett módosítva, mert Supabase-be nem sikerült elmenteni. Nézd meg a Console hibát.");
        return;
      }
    }

    const updatedGuests = guests.map((guest) =>
      guest.id === activeGuest.id ? { ...guest, pin: newPin } : guest
    );
    const updatedActiveGuest = { ...activeGuest, pin: newPin };

    setGuests(updatedGuests);
    setActiveGuest(updatedActiveGuest);
    setGuestCurrentPin("");
    setGuestNewPin("");
    setGuestNewPinAgain("");
    setShowGuestPinEdit(false);
    alert(guestDbId ? "Vendég PIN módosítva és Supabase-ben is frissítve." : "Vendég PIN helyben módosítva.");
  }

  async function deleteProviderAccount() {
    if (!activeProvider) return;

    if (!confirm("Biztosan törlöd a szolgáltatói fiókodat? Ez törli a Supabase-ből is a hozzá tartozó időpontokat, foglalásokat, üzeneteket, tiltásokat, szüneteket és vendégkapcsolatokat.")) return;

    const providerToDelete = activeProvider;
    const providerDbId = await getSupabaseProviderId(providerToDelete);

    if (providerDbId) {
      const { error: linkDeleteError } = await supabase
        .from("vendeg_szolgaltatok")
        .delete()
        .eq("szolgaltato_id", providerDbId);

      if (linkDeleteError && !isMissingSupabaseTableError(linkDeleteError)) {
        console.error(linkDeleteError);
        alert("A szolgáltatói fiók Supabase törlése nem sikerült a vendégkapcsolatoknál. Nézd meg a Console hibát.");
        return;
      }

      const deleteSteps = [
        { table: "uzenetek", column: "szolgaltato_id" },
        { table: "foglalasok", column: "szolgaltato_id" },
        { table: "kivetel_napok", column: "szolgaltato_id" },
        { table: "letiltott_vendegek", column: "szolgaltato_id" },
        { table: "szunetek", column: "szolgaltato_id", optional: true },
        { table: "idopontok", column: "szolgaltato_id" },
      ];

      for (const step of deleteSteps) {
        const { error } = await supabase
          .from(step.table)
          .delete()
          .eq(step.column, providerDbId);

        if (error && !(step.optional && isMissingSupabaseTableError(error))) {
          console.error(error);
          alert(`A szolgáltatói fiók Supabase törlése nem sikerült ennél a táblánál: ${step.table}. Nézd meg a Console hibát.`);
          return;
        }
      }

      const { error: providerDeleteError } = await supabase
        .from("szolgaltatok")
        .delete()
        .eq("id", providerDbId);

      if (providerDeleteError) {
        console.error(providerDeleteError);
        alert("A szolgáltatói fiókot nem sikerült törölni a Supabase szolgaltatok táblából. Nézd meg a Console hibát.");
        return;
      }
    } else {
      console.warn("Nem találtam Supabase szolgáltató azonosítót, ezért csak helyben törlöm a fiókot.");
    }

    const updatedProviders = providers.filter((p) => p.id !== providerToDelete.id);
    const updatedGuests = guests.map((g) => ({
      ...g,
      providerIds: (g.providerIds || []).filter((id) => !idsEqual(id, providerToDelete.id)),
      notifications: (g.notifications || []).filter(
        (notification) =>
          !idsEqual(notification.providerId, providerToDelete.id) &&
          !String(notification.text || notification.message || "").includes(providerToDelete.name || "___")
      ),
    }));
    const updatedBookings = guestBookings.filter((b) => !idsEqual(b.providerId, providerToDelete.id));
    const updatedMessages = messages.filter((message) => !idsEqual(message.providerId, providerToDelete.id));

    setProviders(updatedProviders);
    setGuests(updatedGuests);
    setGuestBookings(updatedBookings);
    setMessages(updatedMessages);

    setActiveProvider(null);
    setSelectedProvider(null);
    setSelectedSlot(null);
    setProviderCalendarDate("");
    setShowProviderNotifications(false);
    setShowProviderMessages(false);
    setShowProviderSettings(false);
    setProviderOverviewPanel("");
    setMode("");

    alert(providerDbId ? "A szolgáltatói fiók és minden kapcsolódó adata helyben és Supabase-ből is törölve lett." : "A szolgáltatói fiók helyben törölve lett.");
  }

  async function deleteGuestAccount() {
    if (!activeGuest) return;

    if (!confirm("Biztosan törlöd a vendég fiókodat? Ez törli a Supabase-ből is a foglalásaidat, üzeneteidet és szolgáltató-kapcsolataidat.")) return;

    const guestToDelete = activeGuest;
    const guestDbId = await getSupabaseGuestId(guestToDelete);
    const guestEmailValue = normalizeEmail(guestToDelete.email);

    if (guestDbId) {
      const { data: guestBookingRows, error: bookingLookupError } = await supabase
        .from("foglalasok")
        .select("id,idopont_id")
        .eq("vendeg_id", guestDbId);

      if (bookingLookupError) {
        console.error(bookingLookupError);
        alert("A vendég Supabase törlése nem sikerült a foglalások lekérdezésénél. Nézd meg a Console hibát.");
        return;
      }

      const bookedSlotIds = [...new Set((guestBookingRows || []).map((row) => row.idopont_id).filter(Boolean))];

      if (bookedSlotIds.length > 0) {
        const { error: slotReleaseError } = await supabase
          .from("idopontok")
          .update({ foglalt: false })
          .in("id", bookedSlotIds);

        if (slotReleaseError) {
          console.error(slotReleaseError);
          alert("A vendég időpontjait nem sikerült felszabadítani Supabase-ben. Nézd meg a Console hibát.");
          return;
        }
      }

      const { error: linkDeleteError } = await supabase
        .from("vendeg_szolgaltatok")
        .delete()
        .eq("vendeg_id", guestDbId);

      if (linkDeleteError && !isMissingSupabaseTableError(linkDeleteError)) {
        console.error(linkDeleteError);
        alert("A vendég Supabase törlése nem sikerült a szolgáltató-kapcsolatoknál. Nézd meg a Console hibát.");
        return;
      }

      const deleteSteps = [
        { table: "uzenetek", column: "vendeg_id" },
        { table: "foglalasok", column: "vendeg_id" },
      ];

      for (const step of deleteSteps) {
        const { error } = await supabase
          .from(step.table)
          .delete()
          .eq(step.column, guestDbId);

        if (error) {
          console.error(error);
          alert(`A vendég Supabase törlése nem sikerült ennél a táblánál: ${step.table}. Nézd meg a Console hibát.`);
          return;
        }
      }

      if (guestEmailValue) {
        const { error: blockedDeleteError } = await supabase
          .from("letiltott_vendegek")
          .delete()
          .ilike("vendeg_email", guestEmailValue);

        if (blockedDeleteError) {
          console.error(blockedDeleteError);
          alert("A vendég tiltási bejegyzéseit nem sikerült törölni Supabase-ben. Nézd meg a Console hibát.");
          return;
        }
      }

      const { error: guestDeleteError } = await supabase
        .from("vendegek")
        .delete()
        .eq("id", guestDbId);

      if (guestDeleteError) {
        console.error(guestDeleteError);
        alert("A vendéget nem sikerült törölni a Supabase vendegek táblából. Nézd meg a Console hibát.");
        return;
      }
    } else {
      console.warn("Nem találtam Supabase vendég azonosítót, ezért csak helyben törlöm a fiókot.");
    }

    const updatedProviders = providers.map((provider) => ({
      ...provider,
      blockedEmails: (provider.blockedEmails || []).filter((email) => normalizeEmail(email) !== guestEmailValue),
      notifications: (provider.notifications || []).filter(
        (notification) =>
          !idsEqual(notification.guestId, guestToDelete.id) &&
          !String(notification.text || notification.message || "").includes(guestToDelete.name || "___") &&
          !String(notification.text || notification.message || "").includes(guestToDelete.email || "___")
      ),
      slots: (provider.slots || []).map((slot) => {
        const slotBelongsToGuest =
          slot.guestId === guestToDelete.id ||
          normalizeEmail(slot.guestEmail) === guestEmailValue;

        if (!slotBelongsToGuest) return slot;

        return {
          ...slot,
          booked: false,
          bookedBy: "",
          guestId: null,
          guestEmail: "",
          guestPhone: "",
          service: "",
          note: "",
        };
      }),
    }));

    const updatedGuests = guests.filter((guest) => guest.id !== guestToDelete.id);
    const updatedBookings = guestBookings.filter(
      (booking) =>
        !idsEqual(booking.guestId, guestToDelete.id) &&
        normalizeEmail(booking.guestEmail) !== guestEmailValue
    );
    const updatedMessages = messages.filter(
      (message) =>
        !idsEqual(message.guestId, guestToDelete.id) &&
        normalizeEmail(message.guestEmail) !== guestEmailValue
    );

    setProviders(updatedProviders);
    setGuests(updatedGuests);
    setGuestBookings(updatedBookings);
    setMessages(updatedMessages);

    setActiveGuest(null);
    setSelectedProvider(null);
    setSelectedSlot(null);
    setChangeBookingId(null);
    setChangeProvider(null);
    setChangeSlot(null);
    setSelectedCalendarDate("");
    setChangeCalendarDate("");
    setShowGuestMessages(false);
    setShowGuestNotifications(false);
    setShowGuestSettings(false);
    setGuestOverviewPanel("");
    setMode("");

    alert(guestDbId ? "A vendég fiók és minden kapcsolódó adata helyben és Supabase-ből is törölve lett." : "A vendég fiók helyben törölve lett.");
  }


  const activeGuestProviders = activeGuest
    ? providers.filter((provider) => (activeGuest.providerIds || []).some((providerId) => idsEqual(providerId, provider.id)))
    : [];

  const activeGuestBookings = activeGuest
    ? guestBookings.filter((b) => idsEqual(b.guestId, activeGuest.id) && b.active)
    : [];

  const selectedExistingBooking = activeGuest && selectedProvider && selectedSlot
    ? guestBookings.find(
        (booking) =>
          booking.active &&
          idsEqual(booking.guestId, activeGuest.id) &&
          idsEqual(booking.providerId, selectedProvider.id) &&
          booking.date === selectedSlot.date
      )
    : null;

  const cancelledGuestBookings = activeGuest
    ? guestBookings.filter((b) => b.guestId === activeGuest.id && b.cancelledByProvider)
    : [];

  const homeButtonBaseStyle = {
    width: "250px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "999px",
    color: "white",
    fontWeight: "700",
    letterSpacing: "0.2px",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(0,0,0,0.16)",
  };

  const providerHomeButtonStyle = {
    ...homeButtonBaseStyle,
    background: "linear-gradient(135deg, #243b55 0%, #141e30 100%)",
  };

  const guestHomeButtonStyle = {
    ...homeButtonBaseStyle,
    background: "linear-gradient(135deg, #7f5a83 0%, #0d324d 100%)",
  };

  const forgotPasswordLinkStyle = {
    marginTop: "26px",
    border: "none",
    background: "transparent",
    color: "#62546f",
    fontSize: "13px",
    textDecoration: "underline",
    cursor: "pointer",
  };


  const premiumFormCardStyle = {
    width: "100%",
    maxWidth: "420px",
    margin: "22px auto 0",
    padding: "24px",
    boxSizing: "border-box",
    borderRadius: "22px",
    border: "1px solid rgba(98, 84, 111, 0.18)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,246,252,0.96) 100%)",
    boxShadow: "0 18px 45px rgba(36, 59, 85, 0.16)",
  };

  const premiumInputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    marginBottom: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(98, 84, 111, 0.22)",
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "#2d2733",
    fontSize: "15px",
    outline: "none",
  };

  const premiumHintStyle = {
    margin: "-4px 0 14px",
    fontSize: "12px",
    color: "#82758d",
  };

  const premiumFieldGroupStyle = {
    marginBottom: "14px",
    textAlign: "left",
  };

  const premiumLabelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#4f4359",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.2px",
  };

  const premiumFormHeaderLineStyle = {
    width: "42px",
    height: "4px",
    margin: "0 auto 20px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #243b55 0%, #6f5878 100%)",
  };

  const providerFormCardStyle = {
    ...premiumFormCardStyle,
    border: "1px solid rgba(36, 59, 85, 0.20)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,248,252,0.98) 100%)",
  };

  const guestFormCardStyle = {
    ...premiumFormCardStyle,
    border: "1px solid rgba(111, 88, 120, 0.20)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(251,247,252,0.98) 100%)",
  };

  const providerPrimaryActionStyle = {
    ...providerHomeButtonStyle,
    width: "100%",
    marginTop: "6px",
  };

  const guestPrimaryActionStyle = {
    ...guestHomeButtonStyle,
    width: "100%",
    marginTop: "6px",
  };

  const secondaryGhostButtonStyle = {
    marginTop: "14px",
    border: "none",
    background: "transparent",
    color: "#62546f",
    fontSize: "13px",
    cursor: "pointer",
  };

  const appShellStyle = {
    maxWidth: "760px",
    width: "100%",
    margin: "30px auto",
    fontFamily: "Arial",
    padding: "18px 14px",
    boxSizing: "border-box",
    textAlign: "center",
    overflowX: "hidden",
    minWidth: 0,
    minHeight: "100vh",
  };

  const premiumPageStyle = {
    width: "100%",
    maxWidth: "720px",
    boxSizing: "border-box",
    margin: "18px auto 0",
    padding: "16px 12px",
    borderRadius: "24px",
    border: "1px solid rgba(98, 84, 111, 0.16)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,246,252,0.98) 100%)",
    boxShadow: "0 18px 45px rgba(36, 59, 85, 0.13)",
  };

  const premiumPanelStyle = {
    border: "1px solid rgba(98, 84, 111, 0.14)",
    padding: "14px",
    margin: "14px 0",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.82)",
    boxShadow: "0 8px 22px rgba(36, 59, 85, 0.08)",
  };

  const providerSmallButtonStyle = {
    padding: "9px 14px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #243b55 0%, #141e30 100%)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(20,30,48,0.16)",
  };

  const guestSmallButtonStyle = {
    padding: "9px 14px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #7f5a83 0%, #0d324d 100%)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(13,50,77,0.16)",
  };

  const dangerButtonStyle = {
    padding: "10px 14px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #9b1c31 0%, #5c0f1d 100%)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  };

  const overviewNewBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3px 8px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #9b1c31 0%, #7f5a83 100%)",
    color: "white",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.2px",
    boxShadow: "0 6px 16px rgba(155,28,49,0.18)",
  };

  const premiumToggleRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid rgba(98, 84, 111, 0.12)",
    textAlign: "left",
  };

  const premiumNeutralButtonStyle = {
    width: "min(100%, 360px)",
    maxWidth: "100%",
    padding: "12px 16px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #f8f5fb 0%, #e7deed 100%)",
    color: "#4f4359",
    fontWeight: "800",
    letterSpacing: "0.2px",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(36, 59, 85, 0.12)",
  };

  const premiumSettingsPanelStyle = {
    ...premiumPanelStyle,
    display: showProviderSettings || showGuestSettings ? "block" : "none",
    background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,246,252,0.96) 100%)",
  };

  const premiumCalendarCardStyle = {
    width: "100%",
    maxWidth: "560px",
    overflowX: "hidden",
    boxSizing: "border-box",
    border: "1px solid rgba(98, 84, 111, 0.14)",
    padding: "10px 8px",
    margin: "0 auto 16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.86)",
  };

  const premiumCalendarGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "3px",
    textAlign: "center",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    alignItems: "stretch",
  };

  const premiumCalendarDayBaseStyle = {
    width: "100%",
    minWidth: 0,
    minHeight: "42px",
    padding: "4px 1px",
    borderRadius: "11px",
    boxSizing: "border-box",
    fontSize: "11px",
    lineHeight: "1.08",
    overflow: "hidden",
    overflowWrap: "anywhere",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const premiumInlineInputStyle = {
    ...premiumInputStyle,
    maxWidth: "360px",
    marginBottom: "8px",
  };

  const premiumSelectStyle = {
    ...premiumInputStyle,
    maxWidth: "360px",
    marginBottom: "8px",
  };

  const premiumListCardStyle = {
    border: "1px solid rgba(98, 84, 111, 0.14)",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.86)",
    boxShadow: "0 6px 18px rgba(36, 59, 85, 0.06)",
    textAlign: "left",
    boxSizing: "border-box",
    maxWidth: "100%",
    overflow: "hidden",
  };

  const premiumActionButtonRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
    width: "100%",
    boxSizing: "border-box",
  };

  const premiumFullWidthMobileButtonStyle = {
    minWidth: "min(100%, 220px)",
    maxWidth: "100%",
    textAlign: "center",
  };

  const premiumHeaderTextStyle = {
    color: "#62546f",
    margin: "4px 0",
  };

  const premiumMiniButtonGapStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px",
    marginTop: "10px",
  };

  const premiumTitleStyle = {
    margin: "26px 0 8px",
    fontSize: "clamp(38px, 10vw, 64px)",
    lineHeight: "1.05",
    fontWeight: "900",
    letterSpacing: "-1.2px",
    color: "#243b55",
    textShadow: "0 10px 30px rgba(36, 59, 85, 0.10)",
  };

  const premiumLandingHintStyle = {
    width: "100%",
    maxWidth: "520px",
    boxSizing: "border-box",
    margin: "28px auto 0",
    padding: "16px 18px",
    borderRadius: "22px",
    border: "1px solid rgba(98, 84, 111, 0.14)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(248,246,252,0.86) 100%)",
    color: "#62546f",
    fontSize: "14px",
    lineHeight: "1.5",
    boxShadow: "0 14px 34px rgba(36, 59, 85, 0.10)",
  };

  const premiumSectionTitleStyle = {
    color: "#62546f",
    marginTop: "24px",
    marginBottom: "12px",
    fontWeight: "900",
    letterSpacing: "-0.3px",
  };

  return (
    <div style={appShellStyle} translate="no" className="notranslate" lang="hu">
      <h1 style={premiumTitleStyle}>Időpont Foglaló</h1>
      <div style={{ ...premiumFormHeaderLineStyle, width: "110px", height: "5px", margin: "0 auto 24px", background: "linear-gradient(90deg, rgba(36,59,85,0), #243b55, #7f5a83, rgba(127,90,131,0))" }}></div>

      {!mode && (
        <HomePage
          setMode={setMode}
          styles={{
            providerHomeButtonStyle,
            guestHomeButtonStyle,
            forgotPasswordLinkStyle,
            premiumLandingHintStyle,
          }}
        />
      )}


      <ForgotPassword
        mode={mode}
        setMode={setMode}
        forgotLoginEmail={forgotLoginEmail}
        setForgotLoginEmail={setForgotLoginEmail}
        forgotProviderEmail={forgotProviderEmail}
        setForgotProviderEmail={setForgotProviderEmail}
        forgotGuestEmail={forgotGuestEmail}
        setForgotGuestEmail={setForgotGuestEmail}
        recoverAnyLogin={recoverAnyLogin}
        recoverProviderLogin={recoverProviderLogin}
        recoverGuestLogin={recoverGuestLogin}
        premiumPageStyle={premiumPageStyle}
        guestFormCardStyle={guestFormCardStyle}
        providerFormCardStyle={providerFormCardStyle}
        premiumFormHeaderLineStyle={premiumFormHeaderLineStyle}
        premiumHintStyle={premiumHintStyle}
        premiumFieldGroupStyle={premiumFieldGroupStyle}
        premiumLabelStyle={premiumLabelStyle}
        premiumInputStyle={premiumInputStyle}
        guestPrimaryActionStyle={guestPrimaryActionStyle}
        providerPrimaryActionStyle={providerPrimaryActionStyle}
        secondaryGhostButtonStyle={secondaryGhostButtonStyle}
      />


      {mode === "createProvider" && (
        <ProviderRegister
          providerName={providerName}
          setProviderName={setProviderName}
          providerEmail={providerEmail}
          setProviderEmail={setProviderEmail}
          providerPhone={providerPhone}
          setProviderPhone={setProviderPhone}
          providerPin={providerPin}
          setProviderPin={setProviderPin}
          guestCode={guestCode}
          setGuestCode={setGuestCode}
          providerEmailNotifications={providerEmailNotifications}
          setProviderEmailNotifications={setProviderEmailNotifications}
          createProvider={createProvider}
          normalizeGuestCode={normalizeGuestCode}
          setMode={setMode}
          providerFormCardStyle={providerFormCardStyle}
          premiumFormHeaderLineStyle={premiumFormHeaderLineStyle}
          premiumFieldGroupStyle={premiumFieldGroupStyle}
          premiumLabelStyle={premiumLabelStyle}
          premiumInputStyle={premiumInputStyle}
          premiumToggleRowStyle={premiumToggleRowStyle}
          providerPrimaryActionStyle={providerPrimaryActionStyle}
          secondaryGhostButtonStyle={secondaryGhostButtonStyle}
        />
      )}

      
{mode === "providerLogin" && (
        <>
          {!activeProvider && (
            <ProviderLogin
              loginUsername={loginUsername}
              setLoginUsername={setLoginUsername}
              loginPin={loginPin}
              setLoginPin={setLoginPin}
              providerLogin={providerLogin}
              onBack={() => setMode("")}
              styles={{
                providerFormCardStyle,
                premiumFormHeaderLineStyle,
                premiumFieldGroupStyle,
                premiumLabelStyle,
                premiumInputStyle,
                providerPrimaryActionStyle,
                secondaryGhostButtonStyle,
              }}
            />
          )}

          {activeProvider && (
            <div style={premiumPageStyle}>
              <h2 style={{ marginTop: 0, color: "#243b55" }}>{activeProvider.name}</h2>
              <p style={premiumHeaderTextStyle}>Email: <b>{activeProvider.email || "nincs megadva"}</b></p>
              <p style={premiumHeaderTextStyle}>Vendégkód: <b>{activeProvider.guestCode}</b></p>

              {renderProviderStats(activeProvider)}

              <div style={premiumPanelStyle}>
                <h3 style={{ marginTop: 0 }}>Mai foglalások</h3>
                {getBookingsForProviderDate(activeProvider, formatDate(new Date())).length === 0 && (
                  <p style={premiumHintStyle}>Ma még nincs foglalt időpont.</p>
                )}
                {getBookingsForProviderDate(activeProvider, formatDate(new Date())).map((booking) => (
                  <div key={booking.id} style={premiumListCardStyle}>
                    <b>{booking.time}</b> — {booking.guestName || "Vendég"}
                    {booking.service && (
                      <>
                        <br />
                        Szolgáltatás: {booking.service}
                      </>
                    )}
                    {booking.guestPhone && (
                      <>
                        <br />
                        Telefon: {booking.guestPhone}
                              {renderPhoneCallLink(booking.guestPhone)}
                      </>
                    )}
                    {booking.note && (
                      <>
                        <br />
                        Megjegyzés: {booking.note}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => setShowProviderSettings(!showProviderSettings)} style={{ ...providerSmallButtonStyle, margin: "12px 0" }}>
                {showProviderSettings ? "Beállítások bezárása" : "Beállítások"}
              </button>

              <ProviderSettings
                showProviderSettings={showProviderSettings}
                premiumPanelStyle={premiumPanelStyle}
                premiumToggleRowStyle={premiumToggleRowStyle}
                activeProvider={activeProvider}
                providerEmailNotifications={providerEmailNotifications}
                updateProviderPreference={updateProviderPreference}
                premiumLabelStyle={premiumLabelStyle}
                premiumSelectStyle={premiumSelectStyle}
                premiumHintStyle={premiumHintStyle}
                saveActiveProviderSettings={saveActiveProviderSettings}
                providerSmallButtonStyle={providerSmallButtonStyle}
                showDeveloperContact={showDeveloperContact}
                setShowDeveloperContact={setShowDeveloperContact}
                developerMessageText={developerMessageText}
                setDeveloperMessageText={setDeveloperMessageText}
                sendDeveloperMessage={sendDeveloperMessage}
                premiumInputStyle={premiumInputStyle}
                deleteProviderAccount={deleteProviderAccount}
                dangerButtonStyle={dangerButtonStyle}
                premiumSettingsPanelStyle={premiumSettingsPanelStyle}
                showProviderGuestCodeEdit={showProviderGuestCodeEdit}
                setShowProviderGuestCodeEdit={setShowProviderGuestCodeEdit}
                premiumNeutralButtonStyle={premiumNeutralButtonStyle}
                newGuestCode={newGuestCode}
                setNewGuestCode={setNewGuestCode}
                normalizeGuestCode={normalizeGuestCode}
                premiumInlineInputStyle={premiumInlineInputStyle}
                changeProviderGuestCode={changeProviderGuestCode}
                showProviderPinEdit={showProviderPinEdit}
                setShowProviderPinEdit={setShowProviderPinEdit}
                providerCurrentPin={providerCurrentPin}
                setProviderCurrentPin={setProviderCurrentPin}
                providerNewPin={providerNewPin}
                setProviderNewPin={setProviderNewPin}
                providerNewPinAgain={providerNewPinAgain}
                setProviderNewPinAgain={setProviderNewPinAgain}
                changeProviderPin={changeProviderPin}
              />

              {getSlotGenerationWarning(activeProvider) && (
                <div style={{
                  ...premiumPanelStyle,
                  border: "1px solid rgba(214, 167, 0, 0.45)",
                  background: "linear-gradient(180deg, rgba(255, 251, 224, 0.98) 0%, rgba(255, 255, 255, 0.96) 100%)",
                  color: "#6b5200",
                  fontWeight: "700",
                }}>
                  ⚠️ {getSlotGenerationWarning(activeProvider)}
                </div>
              )}

              <h3 style={premiumSectionTitleStyle}>Időpontok és foglalások</h3>

              <ScheduleSettings
                activeProvider={activeProvider}
                days={days}
                showProviderScheduleSettings={showProviderScheduleSettings}
                setShowProviderScheduleSettings={setShowProviderScheduleSettings}
                workDays={workDays}
                toggleWorkDay={toggleWorkDay}
                workStart={workStart}
                setWorkStart={setWorkStart}
                workEnd={workEnd}
                setWorkEnd={setWorkEnd}
                slotLength={slotLength}
                setSlotLength={setSlotLength}
                weeksAhead={weeksAhead}
                setWeeksAhead={setWeeksAhead}
                exceptionDate={exceptionDate}
                setExceptionDate={setExceptionDate}
                addExceptionDate={addExceptionDate}
                removeExceptionDate={removeExceptionDate}
                breakType={breakType}
                setBreakType={setBreakType}
                breakDay={breakDay}
                setBreakDay={setBreakDay}
                breakDate={breakDate}
                setBreakDate={setBreakDate}
                breakStart={breakStart}
                setBreakStart={setBreakStart}
                breakEnd={breakEnd}
                setBreakEnd={setBreakEnd}
                addProviderBreak={addProviderBreak}
                removeProviderBreak={removeProviderBreak}
                generateSlots={generateSlots}
                formatDateHu={formatDateHu}
                premiumPanelStyle={premiumPanelStyle}
                premiumNeutralButtonStyle={premiumNeutralButtonStyle}
                premiumInlineInputStyle={premiumInlineInputStyle}
                premiumSelectStyle={premiumSelectStyle}
                premiumHintStyle={premiumHintStyle}
                premiumListCardStyle={premiumListCardStyle}
                providerSmallButtonStyle={providerSmallButtonStyle}
                dangerButtonStyle={dangerButtonStyle}
              />

              {showProviderScheduleSettings && (
                <div style={{ marginTop: "12px", marginBottom: "8px" }}>
                  <button onClick={deleteFreeSlots} style={dangerButtonStyle}>
                    Összes szabad időpont törlése
                  </button>
                  <p style={premiumHintStyle}>
                    Csak a szabad időpontokat törli. A már lefoglalt időpontok megmaradnak.
                  </p>
                </div>
              )}


              <h4 style={premiumSectionTitleStyle}>Válassz napot</h4>
              {renderProviderCalendar(activeProvider, providerCalendarDate, (date) => {
                setProviderCalendarDate(date);
              })}

              <ProviderBookings
                activeProvider={activeProvider}
                providerCalendarDate={providerCalendarDate}
                getSlotsForDate={getSlotsForDate}
                formatDateHu={formatDateHu}
                renderPhoneCallLink={renderPhoneCallLink}
                providerMessageTexts={providerMessageTexts}
                setProviderMessageTexts={setProviderMessageTexts}
                sendProviderMessageToGuest={sendProviderMessageToGuest}
                providerCancelMessages={providerCancelMessages}
                setProviderCancelMessages={setProviderCancelMessages}
                cancelBookingByProvider={cancelBookingByProvider}
                premiumListCardStyle={premiumListCardStyle}
                premiumInlineInputStyle={premiumInlineInputStyle}
                providerSmallButtonStyle={providerSmallButtonStyle}
                dangerButtonStyle={dangerButtonStyle}
              />

              <br />
              <button onClick={() => setActiveProvider(null)} style={secondaryGhostButtonStyle}>Kijelentkezés</button>

            </div>
          )}

          {activeProvider && (
            <>
              <br /><br />
              <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>Vissza</button>
            </>
          )}
        </>
      )}

      {mode === "createGuest" && (
        <GuestRegister
          guestName={guestName}
          setGuestName={setGuestName}
          guestEmail={guestEmail}
          setGuestEmail={setGuestEmail}
          guestPhone={guestPhone}
          setGuestPhone={setGuestPhone}
          guestPin={guestPin}
          setGuestPin={setGuestPin}
          guestEmailNotifications={guestEmailNotifications}
          setGuestEmailNotifications={setGuestEmailNotifications}
          createGuest={createGuest}
          setMode={setMode}
          guestFormCardStyle={guestFormCardStyle}
          premiumFormHeaderLineStyle={premiumFormHeaderLineStyle}
          premiumFieldGroupStyle={premiumFieldGroupStyle}
          premiumLabelStyle={premiumLabelStyle}
          premiumInputStyle={premiumInputStyle}
          premiumToggleRowStyle={premiumToggleRowStyle}
          guestPrimaryActionStyle={guestPrimaryActionStyle}
          secondaryGhostButtonStyle={secondaryGhostButtonStyle}
        />
      )}

      {mode === "guestLogin" && (
        <>
          {!activeGuest && (
            <GuestLogin
              guestLoginEmail={guestLoginEmail}
              setGuestLoginEmail={setGuestLoginEmail}
              guestLoginPin={guestLoginPin}
              setGuestLoginPin={setGuestLoginPin}
              guestLogin={guestLogin}
              setMode={setMode}
              guestFormCardStyle={guestFormCardStyle}
              premiumFormHeaderLineStyle={premiumFormHeaderLineStyle}
              premiumFieldGroupStyle={premiumFieldGroupStyle}
              premiumLabelStyle={premiumLabelStyle}
              premiumInputStyle={premiumInputStyle}
              guestPrimaryActionStyle={guestPrimaryActionStyle}
              secondaryGhostButtonStyle={secondaryGhostButtonStyle}
            />
          )}

          {activeGuest && (
            <div style={premiumPageStyle}>
              <h2 style={{ marginTop: 0, color: "#5b4164" }}>Belépve: {activeGuest.name}</h2>
              {activeGuest.email && <p style={premiumHeaderTextStyle}>Email: <b>{activeGuest.email}</b></p>}
              {activeGuest.phone && <p style={premiumHeaderTextStyle}>Telefonszám: <b>{activeGuest.phone}</b></p>}

              <button onClick={() => setShowGuestSettings(!showGuestSettings)} style={{ ...guestSmallButtonStyle, margin: "12px 0" }}>
                {showGuestSettings ? "Beállítások bezárása" : "Beállítások"}
              </button>

              <GuestSettings
                activeGuest={activeGuest}
                showGuestSettings={showGuestSettings}
                guestEmailNotifications={guestEmailNotifications}
                updateGuestPreference={updateGuestPreference}
                saveActiveGuestSettings={saveActiveGuestSettings}
                showDeveloperContact={showDeveloperContact}
                setShowDeveloperContact={setShowDeveloperContact}
                developerMessageText={developerMessageText}
                setDeveloperMessageText={setDeveloperMessageText}
                sendDeveloperMessage={sendDeveloperMessage}
                showGuestPhoneEdit={showGuestPhoneEdit}
                setShowGuestPhoneEdit={setShowGuestPhoneEdit}
                editableGuestPhone={editableGuestPhone}
                setEditableGuestPhone={setEditableGuestPhone}
                updateActiveGuestPhone={updateActiveGuestPhone}
                showGuestPinEdit={showGuestPinEdit}
                setShowGuestPinEdit={setShowGuestPinEdit}
                guestCurrentPin={guestCurrentPin}
                setGuestCurrentPin={setGuestCurrentPin}
                guestNewPin={guestNewPin}
                setGuestNewPin={setGuestNewPin}
                guestNewPinAgain={guestNewPinAgain}
                setGuestNewPinAgain={setGuestNewPinAgain}
                changeGuestPin={changeGuestPin}
                premiumPanelStyle={premiumPanelStyle}
                premiumToggleRowStyle={premiumToggleRowStyle}
                guestSmallButtonStyle={guestSmallButtonStyle}
                premiumInputStyle={premiumInputStyle}
                premiumActionButtonRowStyle={premiumActionButtonRowStyle}
                premiumNeutralButtonStyle={premiumNeutralButtonStyle}
                premiumInlineInputStyle={premiumInlineInputStyle}
              />

              {renderGuestStats(activeGuest)}

              <div style={premiumPanelStyle}>
                <button
                  onClick={() => setShowGuestProviderAdd(!showGuestProviderAdd)}
                  style={premiumNeutralButtonStyle}
                >
                  {showGuestProviderAdd ? "Szolgáltató hozzáadás bezárása" : "Szolgáltató hozzáadása vendégkóddal"}
                </button>

                {showGuestProviderAdd && (
                  <div style={{ marginTop: "12px" }}>
                    <input
                      placeholder="Szolgáltató vendégkódja"
                      value={guestProviderCode}
                      onChange={(e) => setGuestProviderCode(e.target.value.toUpperCase())}
                      style={premiumInlineInputStyle}
                    />

                    <button onClick={addProviderToGuest} style={{ ...guestSmallButtonStyle, marginLeft: "10px" }}>
                      Hozzáadás
                    </button>
                  </div>
                )}
              </div>

              <h3>Szolgáltatóim</h3>

              {activeGuestProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    const fresh = providers.find((p) => p.id === provider.id);

                    if (isGuestBlockedByProvider(fresh, activeGuest.email)) {
                      alert("Ez a szolgáltató letiltott téged, ezért nem tudod megnyitni az időpontjait.");
                      setSelectedProvider(null);
                      setSelectedSlot(null);
                      setSelectedCalendarDate("");
                      setSelectedService("");
                      return;
                    }

                    setSelectedProvider(fresh);
                    setSelectedSlot(null);
                    setSelectedCalendarDate("");
                    setSelectedService("");
                  }}
                  style={{ ...guestSmallButtonStyle, display: "block", margin: "8px auto" }}
                >
                  {provider.name}
                </button>
              ))}

              {selectedProvider && (
                <>
                  <h3>{selectedProvider.name} szabad időpontjai</h3>

                  {(selectedProvider.services || []).length > 0 && (
                    <>
                      <p>Válassz szolgáltatást:</p>
                      <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} style={premiumSelectStyle}>
                        <option value="">Válassz szolgáltatást</option>
                        {(selectedProvider.services || []).map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </>
                  )}

                  <h4>Válassz napot</h4>
                  {renderCalendar(selectedProvider, selectedCalendarDate, (date) => {
                    setSelectedCalendarDate(date);
                    setSelectedSlot(null);
                  })}

                  {selectedCalendarDate && (
                    <>
                      <h4>Szabad időpontok ezen a napon: {formatDateHu(selectedCalendarDate)}</h4>

                      {getAvailableSlotsForDate(selectedProvider, selectedCalendarDate).map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            ...guestSmallButtonStyle,
                            display: "block",
                            margin: "8px auto",
                            opacity: selectedSlot?.id === slot.id ? 1 : 0.86,
                            transform: selectedSlot?.id === slot.id ? "scale(1.08)" : "none",
                            background: selectedSlot?.id === slot.id
                              ? "linear-gradient(135deg, #b8860b 0%, #ffcf5c 45%, #7f5a83 100%)"
                              : guestSmallButtonStyle.background,
                            color: selectedSlot?.id === slot.id ? "#ffffff" : guestSmallButtonStyle.color,
                            border: selectedSlot?.id === slot.id ? "3px solid #ffe29a" : guestSmallButtonStyle.border,
                            boxShadow: selectedSlot?.id === slot.id
                              ? "0 10px 24px rgba(184, 134, 11, 0.34)"
                              : guestSmallButtonStyle.boxShadow,
                          }}
                        >
                          {selectedSlot?.id === slot.id ? `✓ ${slot.time}` : slot.time}
                        </button>
                      ))}
                    </>
                  )}

                  <h3>
                    Kiválasztott időpont:{" "}
                    {selectedSlot ? `${formatDateHu(selectedSlot.date)} ${selectedSlot.time}` : "-"}
                  </h3>

                  {selectedSlot && (
                    <>
                      <textarea
                        placeholder="Megjegyzés a szolgáltatónak. Nem kötelező."
                        value={guestNote}
                        onChange={(e) => setGuestNote(e.target.value)}
                        style={{ ...premiumInputStyle, minHeight: "90px" }}
                      />
                      <br /><br />
                    </>
                  )}

                  <button onClick={bookSlot} style={guestSmallButtonStyle}>
                    {selectedExistingBooking ? "Időpont módosítása" : "Időpont lefoglalása"}
                  </button>
                </>
              )}

              <br />
              <button onClick={() => setActiveGuest(null)} style={secondaryGhostButtonStyle}>Vendég kijelentkezés</button>

              <br /><br />

              <button onClick={deleteGuestAccount} style={{ ...dangerButtonStyle, display: showGuestSettings ? "inline-block" : "none" }}>
                Vendég fiók törlése
              </button>
            </div>
          )}

          {activeGuest && (
            <>
              <br /><br />
              <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>Vissza</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
