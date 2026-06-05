import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import DeveloperContact from "./components/DeveloperContact";
import ProviderLogin from "./components/ProviderLogin";
import GuestLogin from "./components/GuestLogin";
import ProviderRegister from "./components/ProviderRegister";

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
  const [testAccessData, setTestAccessData] = useState(null);
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
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);
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
    return `${normalizeId(providerId)}|${normalizeId(notification?.id)}|${String(notification?.text || "").trim()}`;
  }

  function getVisibleProviderNotifications(provider) {
    if (!provider) return [];

    return (provider.notifications || []).filter(
      (notification) => !hiddenProviderNotificationKeys.includes(getProviderNotificationKey(provider.id, notification))
    );
  }

  function getProviderMessageKey(providerId, message) {
    return `${normalizeId(providerId)}|${normalizeId(message?.id)}|${String(message?.text || "").trim()}`;
  }

  function isRealGuestMessage(message) {
    return message?.from === "guest" && (message?.type || "message") === "message";
  }

  function getVisibleProviderGuestMessages(providerId) {
    if (!providerId) return [];

    return getMessagesForProvider(providerId).filter(
      (message) => isRealGuestMessage(message) && !hiddenProviderMessageKeys.includes(getProviderMessageKey(providerId, message))
    );
  }

  function getGuestMessageKey(guestId, message) {
    return `${normalizeId(guestId)}|${normalizeId(message?.id)}|${String(message?.text || "").trim()}`;
  }

  function getGuestNotificationKey(guestId, notification) {
    return `${normalizeId(guestId)}|${normalizeId(notification?.id)}|${String(notification?.text || "").trim()}|${String(notification?.message || "").trim()}`;
  }

  function getVisibleGuestNotifications(guest) {
    if (!guest) return [];

    return (guest.notifications || []).filter(
      (notification) => !hiddenGuestNotificationKeys.includes(getGuestNotificationKey(guest.id, notification))
    );
  }

  function getOverviewSeenKey(ownerId, panelKey) {
    return `${normalizeId(ownerId)}|${panelKey}`;
  }

  function getSeenCount(seenCounts, ownerId, panelKey) {
    return Number(seenCounts?.[getOverviewSeenKey(ownerId, panelKey)] || 0);
  }

  function hasUnseenOverviewItem(seenCounts, ownerId, panelKey, currentValue) {
    return Number(currentValue || 0) > 0 && Number(currentValue || 0) > getSeenCount(seenCounts, ownerId, panelKey);
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

  function chunkArray(array, size) {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }

    return chunks;
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

  function buildPlainTextEmail(lines) {
    return lines.filter((line) => line !== null && line !== undefined).join("\n");
  }

  function buildHtmlEmail(title, lines) {
    const safeLines = lines
      .filter((line) => line !== null && line !== undefined)
      .map((line) =>
        String(line)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
      );

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #222;">
        <h2 style="margin-bottom: 12px;">${String(title || "Értesítés")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")}</h2>
        ${safeLines.map((line) => `<p style="margin: 6px 0;">${line}</p>`).join("")}
      </div>
    `;
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
    if (!provider || !date) return [];

    return guestBookings.filter(
      (booking) => booking.active && idsEqual(booking.providerId, provider.id) && booking.date === date
    );
  }

  function renderCopyField(label, value) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{label}</div>
        <input
          value={value || ""}
          readOnly
          onClick={(event) => event.target.select()}
          style={{ width: "280px", padding: "6px" }}
        />
        <button onClick={() => copyToClipboard(value)} style={{ ...premiumNeutralButtonStyle, marginLeft: "8px" }}>
          Másolás
        </button>
      </div>
    );
  }

  function renderTestAccessData() {
    if (!testAccessData) return null;

    return (
      <div style={{ border: "2px solid #75b82a", borderRadius: "10px", padding: "14px", marginTop: "18px", backgroundColor: "#f2ffe9" }}>
        <h3>Teszt belépési adatok</h3>
        <p style={{ marginTop: 0 }}>Kattints a mezőbe vagy a Másolás gombra.</p>

        <h4>Példa szolgáltató</h4>
        {renderCopyField("Email", testAccessData.providerEmail)}
        {renderCopyField("PIN", testAccessData.providerPin)}
        {renderCopyField("Vendégkód", testAccessData.providerGuestCode)}

        <h4>Példa vendég</h4>
        {renderCopyField("Email", testAccessData.guestEmail)}
        {renderCopyField("PIN", testAccessData.guestPin)}

        <h4>Ellenőrző adatok</h4>
        {renderCopyField("Letiltott vendég email", testAccessData.blockedEmail)}
        {renderCopyField("Betelt nap", testAccessData.fullDayDate)}
      </div>
    );
  }

  async function clearPreviousStressTestDataFromSupabase(providerEmails, guestEmails) {
    const { data: oldProviders, error: providerLookupError } = await supabase
      .from("szolgaltatok")
      .select("id")
      .in("email", providerEmails);

    if (providerLookupError) throw providerLookupError;

    const { data: oldGuests, error: guestLookupError } = await supabase
      .from("vendegek")
      .select("id")
      .in("email", guestEmails);

    if (guestLookupError) throw guestLookupError;

    const providerIds = (oldProviders || []).map((row) => row.id);
    const guestIds = (oldGuests || []).map((row) => row.id);

    if (providerIds.length > 0) {
      const { error: providerLinkDeleteError } = await supabase
        .from("vendeg_szolgaltatok")
        .delete()
        .in("szolgaltato_id", providerIds);

      if (providerLinkDeleteError && !isMissingSupabaseTableError(providerLinkDeleteError)) {
        throw providerLinkDeleteError;
      }

      await supabase.from("uzenetek").delete().in("szolgaltato_id", providerIds);
      await supabase.from("foglalasok").delete().in("szolgaltato_id", providerIds);
      await supabase.from("kivetel_napok").delete().in("szolgaltato_id", providerIds);
      await supabase.from("letiltott_vendegek").delete().in("szolgaltato_id", providerIds);
      await supabase.from("idopontok").delete().in("szolgaltato_id", providerIds);
      await supabase.from("szolgaltatok").delete().in("id", providerIds);
    }

    if (guestIds.length > 0) {
      const { error: guestLinkDeleteError } = await supabase
        .from("vendeg_szolgaltatok")
        .delete()
        .in("vendeg_id", guestIds);

      if (guestLinkDeleteError && !isMissingSupabaseTableError(guestLinkDeleteError)) {
        throw guestLinkDeleteError;
      }

      await supabase.from("uzenetek").delete().in("vendeg_id", guestIds);
      await supabase.from("foglalasok").delete().in("vendeg_id", guestIds);
      await supabase.from("vendegek").delete().in("id", guestIds);
    }
  }

  async function saveStressTestDataToSupabase(demoProviders, demoGuests, demoBookings, demoMessages) {
    const providerEmails = demoProviders.map((provider) => provider.email);
    const guestEmails = demoGuests.map((guest) => guest.email);

    await clearPreviousStressTestDataFromSupabase(providerEmails, guestEmails);

    const providerRows = demoProviders.map((provider) => ({
      nev: provider.name,
      profilnev: "Stresszteszt profil",
      email: provider.email,
      pin: provider.pin,
      vendegkod: provider.guestCode,
    }));

    const insertedProviders = [];
    for (const chunk of chunkArray(providerRows, 100)) {
      const { data, error } = await supabase.from("szolgaltatok").insert(chunk).select("id,email");
      if (error) throw error;
      insertedProviders.push(...(data || []));
    }

    const providerDbIdByEmail = new Map(insertedProviders.map((row) => [normalizeEmail(row.email), row.id]));
    const providerDbIdByLocalId = new Map(
      demoProviders.map((provider) => [provider.id, providerDbIdByEmail.get(normalizeEmail(provider.email))])
    );

    const guestRows = demoGuests.map((guest) => ({
      nev: guest.name,
      email: guest.email,
      telefon: guest.phone || "",
      pin: guest.pin,
    }));

    const insertedGuests = [];
    for (const chunk of chunkArray(guestRows, 100)) {
      const { data, error } = await supabase.from("vendegek").insert(chunk).select("id,email");
      if (error) throw error;
      insertedGuests.push(...(data || []));
    }

    const guestDbIdByEmail = new Map(insertedGuests.map((row) => [normalizeEmail(row.email), row.id]));
    const guestDbIdByLocalId = new Map(
      demoGuests.map((guest) => [guest.id, guestDbIdByEmail.get(normalizeEmail(guest.email))])
    );

    const providerGuestLinkRows = [];
    demoGuests.forEach((guest) => {
      const guestDbId = guestDbIdByLocalId.get(guest.id);
      if (!guestDbId) return;

      (guest.providerIds || []).forEach((providerId) => {
        const providerDbId = providerDbIdByLocalId.get(providerId);
        if (!providerDbId) return;

        providerGuestLinkRows.push({
          szolgaltato_id: providerDbId,
          vendeg_id: guestDbId,
        });
      });
    });

    for (const chunk of chunkArray(providerGuestLinkRows, 300)) {
      const { error } = await supabase
        .from("vendeg_szolgaltatok")
        .upsert(chunk, { onConflict: "szolgaltato_id,vendeg_id" });

      if (error) throw error;
    }

    const slotRows = [];
    demoProviders.forEach((provider) => {
      const providerDbId = providerDbIdByLocalId.get(provider.id);
      if (!providerDbId) return;

      (provider.slots || []).forEach((slot) => {
        slotRows.push({
          szolgaltato_id: providerDbId,
          datum: slot.date,
          ido: slot.time,
          foglalt: Boolean(slot.booked),
        });
      });
    });

    const insertedSlots = [];
    for (const chunk of chunkArray(slotRows, 500)) {
      const { data, error } = await supabase
        .from("idopontok")
        .insert(chunk)
        .select("id,szolgaltato_id,datum,ido");
      if (error) throw error;
      insertedSlots.push(...(data || []));
    }

    const slotDbIdByKey = new Map(
      insertedSlots.map((slot) => [
        `${slot.szolgaltato_id}|${slot.datum}|${formatTimeFromSupabase(slot.ido)}`,
        slot.id,
      ])
    );

    const exceptionRows = [];
    demoProviders.forEach((provider) => {
      const providerDbId = providerDbIdByLocalId.get(provider.id);
      if (!providerDbId) return;

      (provider.exceptionDates || []).forEach((date) => {
        exceptionRows.push({ szolgaltato_id: providerDbId, datum: date });
      });
    });

    for (const chunk of chunkArray(exceptionRows, 200)) {
      const { error } = await supabase.from("kivetel_napok").insert(chunk);
      if (error) throw error;
    }

    const blockedRows = [];
    demoProviders.forEach((provider) => {
      const providerDbId = providerDbIdByLocalId.get(provider.id);
      if (!providerDbId) return;

      (provider.blockedEmails || []).forEach((email) => {
        blockedRows.push({ szolgaltato_id: providerDbId, vendeg_email: email });
      });
    });

    for (const chunk of chunkArray(blockedRows, 200)) {
      const { error } = await supabase.from("letiltott_vendegek").insert(chunk);
      if (error) throw error;
    }

    const bookingRows = [];
    demoBookings.forEach((booking) => {
      if (!booking.active) return;

      const providerDbId = providerDbIdByLocalId.get(booking.providerId);
      const guestDbId = guestDbIdByLocalId.get(booking.guestId);
      const slotDbId = providerDbId
        ? slotDbIdByKey.get(`${providerDbId}|${booking.date}|${booking.time}`)
        : null;

      if (!providerDbId || !guestDbId || !slotDbId) return;

      bookingRows.push({
        szolgaltato_id: providerDbId,
        vendeg_id: guestDbId,
        idopont_id: slotDbId,
        szolgaltatas: booking.service || "",
        megjegyzes: booking.note || "",
      });
    });

    for (const chunk of chunkArray(bookingRows, 200)) {
      const { error } = await supabase.from("foglalasok").insert(chunk);
      if (error) throw error;
    }

    const messageRows = [];
    demoMessages.forEach((message) => {
      const providerDbId = providerDbIdByLocalId.get(message.providerId);
      const guestDbId = guestDbIdByLocalId.get(message.guestId);

      if (!providerDbId || !guestDbId) return;

      const slotDbId = message.date && message.time
        ? slotDbIdByKey.get(`${providerDbId}|${message.date}|${message.time}`)
        : null;

      const row = {
        szolgaltato_id: providerDbId,
        vendeg_id: guestDbId,
        kuldo: message.from || "message",
        uzenet: message.text || "",
        tipus: message.type || "message",
      };

      if (slotDbId) {
        row.idopont_id = slotDbId;
      }

      messageRows.push(row);
    });

    for (const chunk of chunkArray(messageRows, 200)) {
      const { error } = await supabase.from("uzenetek").insert(chunk);
      if (error) throw error;
    }

    return {
      providers: providerRows.length,
      guests: guestRows.length,
      slots: slotRows.length,
      bookings: bookingRows.length,
      messages: messageRows.length,
      exceptions: exceptionRows.length,
      blocked: blockedRows.length,
      providerGuestLinks: providerGuestLinkRows.length,
    };
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

      const slot = {
        id: row.id,
        date: row.datum,
        day: getHungarianDayName(new Date(`${row.datum}T00:00:00`)),
        time: formatTimeFromSupabase(row.ido),
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
    });

    const loadedBookings = bookingRows.map((row) => {
      const provider = providerMap.get(row.szolgaltato_id);
      const guest = guestMap.get(row.vendeg_id);
      const slot = slotMap.get(row.idopont_id);

      if (slot && guest) {
        slot.booked = true;
        slot.bookedBy = guest.name || "";
        slot.guestId = guest.id;
        slot.guestEmail = guest.email || "";
        slot.guestPhone = guest.phone || "";
        slot.service = row.szolgaltatas || "";
        slot.note = row.megjegyzes || "";
      }

      if (guest && provider && !guest.providerIds.some((providerId) => idsEqual(providerId, provider.id))) {
        guest.providerIds = [...guest.providerIds, provider.id];
      }

      if (provider) {
        provider.notifications = [
          {
            id: row.id,
            text: `${guest?.name || "Vendég"} lefoglalta ezt az időpontot: ${slot?.date || ""} ${slot?.time || ""}`,
            note: row.megjegyzes || "",
            service: row.szolgaltatas || "",
          },
          ...(provider.notifications || []),
        ];
      }

      return {
        id: row.id,
        guestId: guest?.id || row.vendeg_id,
        guestName: guest?.name || "",
        guestEmail: guest?.email || "",
        guestPhone: guest?.phone || "",
        providerId: provider?.id || row.szolgaltato_id,
        providerName: provider?.name || "",
        slotId: slot?.id || row.idopont_id,
        date: slot?.date || "",
        day: slot?.day || "",
        time: slot?.time || "",
        service: row.szolgaltatas || "",
        note: row.megjegyzes || "",
        active: true,
        cancelledByProvider: false,
        providerCancelMessage: "",
        changed: false,
        oldDate: "",
        oldTime: "",
      };
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

    const loadedProviders = Array.from(providerMap.values()).map((provider) => ({
      ...provider,
      exceptionDates: [...new Set(provider.exceptionDates || [])].sort(),
      breaks: Array.isArray(provider.breaks) ? provider.breaks : [],
      blockedEmails: [...new Set(provider.blockedEmails || [])],
      slots: (provider.slots || []).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
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

  function getHungarianDayName(date) {
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

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function getSlotDateTime(slot) {
    if (!slot || !slot.date || !slot.time) return null;

    const normalizedTime = String(slot.time).slice(0, 5);
    const dateTime = new Date(`${slot.date}T${normalizedTime}:00`);

    if (Number.isNaN(dateTime.getTime())) return null;

    return dateTime;
  }

  function isSlotInPast(slot) {
    const slotDateTime = getSlotDateTime(slot);

    if (!slotDateTime) return true;

    return slotDateTime.getTime() <= Date.now();
  }

  function isSlotBookable(slot) {
    return Boolean(slot && slot.date && slot.time && !slot.booked && !isSlotInPast(slot));
  }

  function getProviderLatestFutureSlotDate(provider) {
    if (!provider || !Array.isArray(provider.slots)) return null;

    const futureSlotDates = provider.slots
      .map((slot) => getSlotDateTime(slot))
      .filter((dateTime) => dateTime && dateTime.getTime() > Date.now())
      .sort((a, b) => b.getTime() - a.getTime());

    return futureSlotDates[0] || null;
  }

  function getSlotGenerationWarning(provider) {
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

  function getUniqueAvailableDates(provider) {
    if (!provider || !Array.isArray(provider.slots)) return [];

    const dates = provider.slots
      .filter((slot) => isSlotBookable(slot))
      .map((slot) => slot.date);

    return [...new Set(dates)].sort();
  }

  function getAvailableSlotsForDate(provider, date) {
    if (!provider || !date || !Array.isArray(provider.slots)) return [];

    return provider.slots.filter((slot) => slot && slot.date === date && isSlotBookable(slot));
  }

  function getAllDates(provider) {
    if (!provider) return [];

    const slotDates = Array.isArray(provider.slots)
      ? provider.slots.filter((slot) => slot && slot.date).map((slot) => slot.date)
      : [];

    const exceptionDates = Array.isArray(provider.exceptionDates) ? provider.exceptionDates : [];

    return [...new Set([...slotDates, ...exceptionDates])].sort();
  }

  function getSlotsForDate(provider, date) {
    if (!provider || !date || !Array.isArray(provider.slots)) return [];

    return provider.slots.filter((slot) => slot && slot.date === date);
  }

  function dateHasBookedSlot(provider, date) {
    if (!provider || !date || !Array.isArray(provider.slots)) return false;

    return provider.slots.some((slot) => slot && slot.date === date && slot.booked);
  }

  function formatDateHu(dateText) {
    if (!dateText) return "-";

    const [year, month, day] = dateText.split("-");
    return `${year}.${month}.${day}.`;
  }

  function groupDatesByMonth(dates) {
    const grouped = {};

    dates.filter(Boolean).forEach((date) => {
      const [year, month] = date.split("-");
      const key = `${year}-${month}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(date);
    });

    return grouped;
  }

  function getMonthLabel(monthKey) {
    const [year, month] = monthKey.split("-");
    const monthNames = [
      "január",
      "február",
      "március",
      "április",
      "május",
      "június",
      "július",
      "augusztus",
      "szeptember",
      "október",
      "november",
      "december",
    ];

    return `${year}. ${monthNames[Number(month) - 1]}`;
  }

  function getMondayBasedStartIndex(monthKey) {
    const [year, month] = monthKey.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay();

    if (firstDay === 0) return 6;
    return firstDay - 1;
  }

  function getDaysInMonth(monthKey) {
    const [year, month] = monthKey.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  }

  function getDateTextFromMonthAndDay(monthKey, day) {
    return `${monthKey}-${String(day).padStart(2, "0")}`;
  }

  function isExceptionDate(provider, date) {
    if (!provider || !Array.isArray(provider.exceptionDates)) return false;
    return provider.exceptionDates.includes(date);
  }

  function hasAnySlotOnDate(provider, date) {
    if (!provider || !Array.isArray(provider.slots)) return false;
    return provider.slots.some((slot) => slot && slot.date === date);
  }

  function hasAvailableSlotOnDate(provider, date) {
    if (!provider || !Array.isArray(provider.slots)) return false;
    return provider.slots.some((slot) => slot && slot.date === date && isSlotBookable(slot));
  }

  function isFullyBookedDate(provider, date) {
    if (!hasAnySlotOnDate(provider, date)) return false;
    if (isExceptionDate(provider, date)) return false;
    return !hasAvailableSlotOnDate(provider, date);
  }

  function dateHasAnyBooking(provider, date) {
    if (!provider || !Array.isArray(provider.slots)) return false;
    return provider.slots.some((slot) => slot && slot.date === date && slot.booked);
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
    if (!guestEmail || !date) return false;

    return guestBookings.some(
      (booking) =>
        booking.active &&
        idsEqual(booking.providerId, providerId) &&
        booking.date === date &&
        (booking.guestEmail || "").toLowerCase() === guestEmail.toLowerCase()
    );
  }

  function renderCalendar(provider, selectedDate, onSelectDate) {
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
                        backgroundColor: selectedDate === date ? "#75b82a" : "#e9f7df",
                        border: selectedDate === date ? "2px solid #1b5e20" : "1px solid #75b82a",
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
      phone: providerPhone,
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
    const affectedGuestIds = bookingsOnDate.map((booking) => booking.guestId);

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? {
            ...provider,
            exceptionDates: [...currentExceptions, exceptionDate],
            slots: (provider.slots || []).map((slot) =>
              affectedSlotIds.includes(slot.id)
                ? { ...slot, booked: false, bookedBy: "", guestId: null, guestEmail: "", guestPhone: "", service: "", note: "" }
                : slot
            ),
            notifications: bookingsOnDate.length > 0
              ? [
                  {
                    id: Date.now(),
                    text: `${bookingsOnDate.length} foglalás törölve, mert ${formatDateHu(exceptionDate)} nem dolgozik nap lett.`,
                    note: cancelMessage,
                  },
                  ...(provider.notifications || []),
                ]
              : provider.notifications || [],
          }
        : provider
    );

    const updatedBookings = guestBookings.map((booking) =>
      affectedSlotIds.includes(booking.slotId) && booking.active
        ? { ...booking, active: false, cancelledByProvider: true, providerCancelMessage: cancelMessage }
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

    const newSlots = [];
    const today = new Date();
    const totalDays = Number(weeksAhead) * 7;
    const exceptions = activeProvider.exceptionDates || [];

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
        if (isSlotInsideProviderBreak(activeProvider, formattedDate, dayName, current, Number(slotLength))) {
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
          guestPhone: "",
          service: "",
          note: "",
        });

        current += Number(slotLength);
      }
    }

    const existingSlots = Array.isArray(activeProvider.slots) ? activeProvider.slots : [];
    const slotMap = new Map();

    existingSlots.forEach((slot) => {
      if (!slot || !slot.date || !slot.time) return;
      slotMap.set(`${slot.date}-${slot.time}`, slot);
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

    const mergedSlots = Array.from(slotMap.values()).sort((a, b) => {
      const aValue = `${a.date} ${a.time}`;
      const bValue = `${b.date} ${b.time}`;
      return aValue.localeCompare(bValue);
    });

    const updatedProviders = providers.map((p) =>
      p.id === activeProvider.id
        ? {
            ...p,
            workDays,
            workStart,
            workEnd,
            slotLength: Number(slotLength),
            weeksAhead: Number(weeksAhead),
            exceptionDates: activeProvider.exceptionDates || [],
            breaks: activeProvider.breaks || [],
            services: activeProvider.services || [],
            blockedEmails: activeProvider.blockedEmails || [],
            slots: mergedSlots,
          }
        : p
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));
    setProviderCalendarDate("");

    let supabaseMessage = "";

    if (addedSlots.length > 0) {
      const providerDbId = await getSupabaseProviderId(activeProvider);

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

  function getProviderStats(provider) {
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

    const todayText = formatDate(new Date());
    const providerBookings = guestBookings.filter(
      (booking) => booking.active && idsEqual(booking.providerId, provider.id)
    );
    const providerSlots = Array.isArray(provider.slots) ? provider.slots : [];
    const providerMessages = getMessagesForProvider(provider.id);
    const registeredGuests = getRegisteredGuestsForProvider(provider.id);

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
      unreadLikeMessages: getVisibleProviderGuestMessages(provider.id).length,
      providerNotifications: getVisibleProviderNotifications(provider).length,
      nextBooking: sortedUpcomingBookings[0] || null,
    };
  }

  function renderProviderStats(provider) {
    const stats = getProviderStats(provider);
    const statCards = [
      { key: "todayBookings", label: "Mai foglalások", value: stats.todayBookings },
      { key: "bookedSlots", label: "Foglalt időpontok", value: stats.bookedSlots },
      { key: "freeSlots", label: "Szabad időpontok", value: stats.freeSlots },
      { key: "guestMessages", label: "Üzenetek", value: stats.unreadLikeMessages },
      { key: "providerNotifications", label: "Értesítések", value: stats.providerNotifications },
      { key: "registeredGuests", label: "Regisztrált vendégek", value: stats.registeredGuests },
      { key: "blockedGuests", label: "Tiltott vendégek", value: stats.blockedGuests },
    ];

    return (
      <div style={{ border: "1px solid rgba(117,184,42,0.45)", borderRadius: "22px", padding: "14px", marginTop: "16px", marginBottom: "16px", background: "linear-gradient(180deg, rgba(248,255,243,0.96) 0%, rgba(255,255,255,0.94) 100%)", boxShadow: "0 12px 30px rgba(36,59,85,0.10)" }}>
        <h3 style={{ marginTop: 0, color: "#62546f" }}>Áttekintés</h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          {statCards.map((card) => {
            const active = providerOverviewPanel === card.key;
            const hasUnseen = hasUnseenOverviewItem(providerSeenOverviewCounts, provider.id, card.key, card.value);

            return (
              <div
                key={card.key}
                style={{
                  border: active ? "2px solid #1b5e20" : hasUnseen ? "2px solid #9b1c31" : "1px solid rgba(117,184,42,0.28)",
                  borderRadius: "18px",
                  background: active
                    ? "linear-gradient(180deg, #f2ffe9 0%, #ffffff 100%)"
                    : hasUnseen
                      ? "linear-gradient(180deg, #fff6f8 0%, #ffffff 100%)"
                      : "rgba(255,255,255,0.88)",
                  boxShadow: active
                    ? "0 12px 28px rgba(27,94,32,0.14)"
                    : hasUnseen
                      ? "0 12px 28px rgba(155,28,49,0.16)"
                      : "0 8px 18px rgba(36,59,85,0.07)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => {
                    if (active) {
                      setProviderOverviewPanel("");
                      return;
                    }

                    markProviderOverviewPanelSeen(provider, card.key, card.value);
                    setProviderOverviewPanel(card.key);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    padding: "13px 14px",
                    background: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                  title={active ? "Részletek bezárása" : "Részletek megnyitása"}
                >
                  <span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: hasUnseen ? "#9b1c31" : "#555", fontWeight: "800" }}>
                      {card.label}
                      {hasUnseen && <span style={overviewNewBadgeStyle}>Új</span>}
                    </span>
                    <span style={{ display: "block", fontSize: "24px", fontWeight: "800", color: hasUnseen ? "#9b1c31" : "#1b5e20", lineHeight: 1.1 }}>{card.value}</span>
                  </span>
                  <span style={{ color: active ? "#1b5e20" : hasUnseen ? "#9b1c31" : "#777", fontSize: "18px", fontWeight: "800" }}>
                    {active ? "−" : "+"}
                  </span>
                </button>

                {active && (
                  <div style={{ padding: "0 12px 12px" }}>
                    {renderProviderOverviewPanel(provider, card.key)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {stats.nextBooking ? (
          <p style={{ marginBottom: 0 }}>
            Következő foglalás: <b>{stats.nextBooking.guestName || "Vendég"}</b> — {formatDateHu(stats.nextBooking.date)} {stats.nextBooking.time}
          </p>
        ) : (
          <p style={{ marginBottom: 0 }}>Nincs közelgő foglalás.</p>
        )}
      </div>
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
    const providerBookings = guestBookings
      .filter((booking) => booking.active && idsEqual(booking.providerId, provider.id))
      .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
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
          {bookings.map((booking) => (
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
            </div>
          ))}
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
      const freeSlots = providerSlots
        .filter((slot) => slot && !slot.booked)
        .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));

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
        <div style={panelBoxStyle}>
          <h4 style={{ marginTop: 0 }}>Tiltott vendégek</h4>
          {(provider.blockedEmails || []).length === 0 && <p>Nincs letiltott vendég.</p>}
          {(provider.blockedEmails || []).map((email) => {
            const blockedGuest = guests.find((guest) => normalizeEmail(guest.email) === normalizeEmail(email));

            return (
              <div key={email} style={smallCardStyle}>
                <b>{blockedGuest?.name || email}</b>
                {blockedGuest?.email && (
                  <>
                    <br />
                    Email: {blockedGuest.email}
                  </>
                )}
                {blockedGuest?.phone && (
                  <>
                    <br />
                    Telefon: {blockedGuest.phone}
                  </>
                )}
                <br />
                <button onClick={() => unblockGuestEmail(email)} style={{ ...providerSmallButtonStyle, marginTop: "8px" }}>
                  Tiltás feloldása
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    if (panel === "guestMessages") {
      return (
        <div style={panelBoxStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
            <h4 style={{ margin: 0 }}>Üzenetek</h4>
            {guestMessages.length > 0 && (
              <button onClick={clearProviderGuestMessages} style={{ ...dangerButtonStyle, padding: "9px 12px", fontSize: "13px" }}>
                Üzenetek törlése
              </button>
            )}
          </div>
          <p style={{ marginTop: "8px", color: "#6b5d72", fontSize: "13px" }}>
            Itt csak a vendégek valódi, kézzel írt üzenetei jelennek meg. Lemondás és módosítás az Értesítések alatt lesz.
          </p>
          {guestMessages.length === 0 && <p>Nincs vendégtől érkezett üzenet.</p>}
          {guestMessages.map((message) => {
            const replyGuest = guests.find((guest) => idsEqual(guest.id, message.guestId)) || {
              id: message.guestId,
              name: message.guestName || message.fromName || "Vendég",
              email: message.guestEmail || "",
            };
            const replyKey = `reply-${message.id}`;

            return (
              <div key={getProviderMessageKey(provider.id, message)} style={smallCardStyle}>
                <b>{message.fromName || "Vendég"}</b>
                {message.date && message.time && <> — {formatDateHu(message.date)} {message.time}</>}
                <br />
                Üzenet: {message.text}

                <div style={{ marginTop: "10px" }}>
                  <textarea
                    placeholder={`Válasz ${replyGuest.name || "vendég"}nak...`}
                    value={providerMessageTexts[replyKey] || ""}
                    onChange={(e) => setProviderMessageTexts({ ...providerMessageTexts, [replyKey]: e.target.value })}
                    style={{ ...premiumInlineInputStyle, width: "100%", minHeight: "70px", resize: "vertical" }}
                  />
                  <br />
                  <button onClick={() => sendProviderDirectMessageToGuest(replyGuest, replyKey, message)} style={providerSmallButtonStyle}>
                    Válasz küldése
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (panel === "providerNotifications") {
      return (
        <div style={panelBoxStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
            <h4 style={{ margin: 0 }}>Értesítések</h4>
            {providerNotifications.length > 0 && (
              <button
                onClick={clearProviderNotifications}
                style={{ ...dangerButtonStyle, width: "100%", maxWidth: "320px", alignSelf: "center", padding: "10px 14px", fontSize: "13px" }}
              >
                Értesítések törlése
              </button>
            )}
          </div>
          <p style={{ marginTop: "8px", color: "#6b5d72", fontSize: "13px" }}>
            Itt látszanak a foglalások, módosítások és lemondások.
          </p>
          {providerNotifications.length === 0 && <p>Nincs új értesítés.</p>}
          {providerNotifications.map((notification) => (
            <div key={getProviderNotificationKey(provider.id, notification)} style={smallCardStyle}>
              <b>{notification.text}</b>
              {notification.service && (
                <>
                  <br />
                  Szolgáltatás: {notification.service}
                </>
              )}
              {notification.note && (
                <>
                  <br />
                  Megjegyzés / üzenet: {notification.note}
                </>
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  }


  function getGuestActiveBookings(guest) {
    if (!guest) return [];

    return guestBookings
      .filter((booking) => booking && booking.active && idsEqual(booking.guestId, guest.id))
      .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
  }

  function getGuestCancelledBookingKey(guestId, booking) {
    return `${normalizeId(guestId)}|${normalizeId(booking?.id)}|${String(booking?.date || "").trim()}|${String(booking?.time || "").trim()}`;
  }

  function getGuestCancelledBookings(guest) {
    if (!guest) return [];

    return guestBookings
      .filter((booking) => booking && idsEqual(booking.guestId, guest.id) && !booking.active && (booking.cancelledByGuest || booking.cancelledByProvider))
      .sort((a, b) => `${b.date || ""} ${b.time || ""}`.localeCompare(`${a.date || ""} ${a.time || ""}`));
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

  function renderGuestOverviewPanel(guest, panel) {
    if (!guest || !panel) return null;

    const todayText = formatDate(new Date());
    const activeBookings = getGuestActiveBookings(guest);
    const todayBookings = activeBookings.filter((booking) => booking.date === todayText);
    const cancelledBookings = getVisibleGuestCancelledBookings(guest);
    const guestMessages = getVisibleGuestMessages(guest.id);
    const guestNotifications = getVisibleGuestNotifications(guest);

    const panelBoxStyle = {
      ...premiumPanelStyle,
      marginTop: "14px",
      textAlign: "left",
    };

    const importantNoticeStyle = {
      ...premiumListCardStyle,
      border: "2px solid #9b1c31",
      background: "linear-gradient(180deg, #fff5f6 0%, #ffffff 100%)",
      boxShadow: "0 10px 26px rgba(155,28,49,0.13)",
    };

    if (panel === "todayGuestBookings") {
      return (
        <div style={panelBoxStyle}>
          <h4 style={{ marginTop: 0 }}>Mai foglalásaim</h4>
          {todayBookings.length === 0 && <p>Mára nincs aktív foglalásod.</p>}
          {todayBookings.map((booking) => renderGuestBookingCard(booking))}
        </div>
      );
    }

    if (panel === "guestBookings") {
      return (
        <div style={panelBoxStyle}>
          <h4 style={{ marginTop: 0 }}>Foglalásaim</h4>
          {activeBookings.length === 0 && <p>Nincs aktív foglalásod.</p>}
          {activeBookings.map((booking) => renderGuestBookingCard(booking))}
        </div>
      );
    }

    if (panel === "guestMessages") {
      return (
        <div style={panelBoxStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <h4 style={{ marginTop: 0, marginBottom: "8px" }}>Üzenetek</h4>
            {guestMessages.length > 0 && (
              <button onClick={clearGuestMessages} style={{ ...dangerButtonStyle, padding: "9px 12px", fontSize: "13px" }}>
                Üzenetek törlése
              </button>
            )}
          </div>
          {guestMessages.length === 0 && <p>Még nincs valódi üzeneted.</p>}
          {guestMessages.map((message) => (
            <div key={message.id} style={premiumListCardStyle}>
              <b>{message.from === "provider" ? `Szolgáltatótól: ${message.fromName}` : `Tőled: ${message.toName} részére`}</b>
              {message.date && message.time && (
                <>
                  <br />
                  Időpont: {formatDateHu(message.date)} {message.time}
                </>
              )}
              <br />
              Üzenet: {message.text}
            </div>
          ))}
        </div>
      );
    }

    if (panel === "guestNotifications") {
      return (
        <div style={panelBoxStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
            <h4 style={{ marginTop: 0, marginBottom: "4px" }}>Értesítések</h4>
            {guestNotifications.length > 0 && (
              <button
                onClick={clearGuestNotifications}
                style={{ ...dangerButtonStyle, width: "100%", maxWidth: "320px", alignSelf: "center", padding: "10px 14px", fontSize: "13px" }}
              >
                Értesítések törlése
              </button>
            )}
          </div>
          {guestNotifications.length === 0 && <p>Nincs új értesítésed.</p>}
          {guestNotifications.map((notification) => {
            const important = ["cancel", "provider_cancel"].includes(notification.type);
            return (
              <div key={notification.id} style={important ? importantNoticeStyle : premiumListCardStyle}>
                {important && <b>Fontos lemondási értesítés</b>}
                {important && <br />}
                <b>{notification.text}</b>
                {notification.message && (
                  <>
                    <br />
                    Üzenet: {notification.message}
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (panel === "guestCancelledBookings") {
      return (
        <div style={panelBoxStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
            <h4 style={{ marginTop: 0, marginBottom: "4px" }}>Lemondott időpontok</h4>
            {cancelledBookings.length > 0 && (
              <button
                onClick={clearGuestCancelledBookings}
                style={{ ...dangerButtonStyle, width: "100%", maxWidth: "320px", alignSelf: "center", padding: "10px 14px", fontSize: "13px" }}
              >
                Lemondott időpontok törlése
              </button>
            )}
          </div>
          {cancelledBookings.length === 0 && <p>Nincs lemondott időpont.</p>}
          {cancelledBookings.map((booking) => (
            <div key={booking.id} style={premiumListCardStyle}>
              <b>{booking.providerName}</b>
              <br />
              Lemondott időpont: {formatDateHu(booking.date)} — {booking.day || ""} — {booking.time}
              <br />
              {booking.cancelledByGuest ? "Te mondtad le ezt az időpontot." : "A szolgáltató mondta le ezt az időpontot."}
              {booking.providerCancelMessage && (
                <>
                  <br />
                  Üzenet: {booking.providerCancelMessage}
                </>
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  }

  function renderGuestStats(guest) {
    const stats = getGuestStats(guest);
    const statCards = [
      { key: "todayGuestBookings", label: "Mai foglalásaim", value: stats.todayBookings },
      { key: "guestBookings", label: "Foglalásaim", value: stats.activeBookings },
      { key: "guestMessages", label: "Üzenetek", value: stats.guestMessages },
      { key: "guestNotifications", label: "Értesítések", value: stats.guestNotifications },
      { key: "guestCancelledBookings", label: "Lemondott időpontok", value: stats.cancelledBookings },
    ];

    return (
      <div style={{ border: "1px solid rgba(127,90,131,0.36)", borderRadius: "22px", padding: "14px", marginTop: "16px", marginBottom: "16px", background: "linear-gradient(180deg, rgba(251,247,252,0.96) 0%, rgba(255,255,255,0.94) 100%)", boxShadow: "0 12px 30px rgba(36,59,85,0.10)" }}>
        <h3 style={{ marginTop: 0, color: "#5b4164" }}>Áttekintés</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
          {statCards.map((card) => {
            const active = guestOverviewPanel === card.key;
            const hasUnseen = hasUnseenOverviewItem(guestSeenOverviewCounts, guest.id, card.key, card.value);

            return (
              <div
                key={card.key}
                style={{
                  border: active ? "2px solid #7f5a83" : hasUnseen ? "2px solid #9b1c31" : "1px solid rgba(127,90,131,0.24)",
                  borderRadius: "18px",
                  background: active
                    ? "linear-gradient(180deg, #fbf2ff 0%, #ffffff 100%)"
                    : hasUnseen
                      ? "linear-gradient(180deg, #fff6f8 0%, #ffffff 100%)"
                      : "rgba(255,255,255,0.88)",
                  boxShadow: active
                    ? "0 12px 28px rgba(127,90,131,0.14)"
                    : hasUnseen
                      ? "0 12px 28px rgba(155,28,49,0.16)"
                      : "0 8px 18px rgba(36,59,85,0.07)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => {
                    if (active) {
                      setGuestOverviewPanel("");
                      return;
                    }

                    markGuestOverviewPanelSeen(guest, card.key, card.value);
                    setGuestOverviewPanel(card.key);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    padding: "13px 14px",
                    background: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: hasUnseen ? "#9b1c31" : "#555", fontWeight: "800" }}>
                      {card.label}
                      {hasUnseen && <span style={overviewNewBadgeStyle}>Új</span>}
                    </span>
                    <span style={{ display: "block", fontSize: "24px", fontWeight: "800", color: hasUnseen ? "#9b1c31" : "#7f5a83", lineHeight: 1.1 }}>{card.value}</span>
                  </span>
                  <span style={{ color: active ? "#7f5a83" : hasUnseen ? "#9b1c31" : "#777", fontSize: "18px", fontWeight: "800" }}>
                    {active ? "−" : "+"}
                  </span>
                </button>

                {active && (
                  <div style={{ padding: "0 12px 12px" }}>
                    {renderGuestOverviewPanel(guest, card.key)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function getRegisteredGuestsForProvider(providerId) {
    if (!providerId) return [];

    return guests
      .filter((guest) => Array.isArray(guest.providerIds) && guest.providerIds.some((guestProviderId) => idsEqual(guestProviderId, providerId)))
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", "hu"));
  }


  function getGuestBookingsForProvider(providerId, guest) {
    if (!providerId || !guest) return [];

    const guestEmailValue = normalizeEmail(guest.email);

    return guestBookings
      .filter((booking) => {
        if (!booking || !idsEqual(booking.providerId, providerId) || !booking.active) return false;
        if (booking.guestId && idsEqual(booking.guestId, guest.id)) return true;
        return guestEmailValue && normalizeEmail(booking.guestEmail) === guestEmailValue;
      })
      .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
  }

  function getProviderGuestBookingSummary(providerId, guest) {
    const relatedBookings = getGuestBookingsForProvider(providerId, guest);
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

  function renderRegisteredGuestsForProvider(provider) {
    const registeredGuests = getRegisteredGuestsForProvider(provider.id);
    const selectedGuest = registeredGuests.find((guest) => guest.id === selectedProviderGuestId);
    const selectedGuestBlocked = selectedGuest
      ? isGuestBlockedByProvider(provider, selectedGuest.email)
      : false;
    const selectedGuestBookingSummary = selectedGuest
      ? getProviderGuestBookingSummary(provider.id, selectedGuest)
      : { lastBooking: null, futureBookings: [] };

    return (
      <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "12px", marginTop: "16px", marginBottom: "16px" }}>
        <h3>Regisztrált vendégeim</h3>
        <p>Ennyi vendég adta hozzá a vendégkódodat: <b>{registeredGuests.length}</b></p>

        {registeredGuests.length === 0 && <p>Még nincs olyan vendég, aki hozzáadta volna a vendégkódodat.</p>}

        {registeredGuests.map((guest) => {
          const guestBlocked = isGuestBlockedByProvider(provider, guest.email);

          return (
            <button
              key={guest.id}
              onClick={() => setSelectedProviderGuestId(selectedProviderGuestId === guest.id ? null : guest.id)}
              style={{
                display: "block",
                width: "100%",
                maxWidth: "420px",
                margin: "6px auto",
                padding: "8px",
                borderRadius: "8px",
                border: selectedProviderGuestId === guest.id
                  ? guestBlocked ? "2px solid #b00020" : "2px solid #75b82a"
                  : guestBlocked ? "1px solid #d00000" : "1px solid #ccc",
                backgroundColor: selectedProviderGuestId === guest.id
                  ? guestBlocked ? "#fff0f0" : "#f2ffe9"
                  : guestBlocked ? "#fff7f7" : "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {guest.name || "Névtelen vendég"}
              {guestBlocked && <span style={{ color: "#b00020", marginLeft: "10px" }}>tiltva</span>}
            </button>
          );
        })}

        {selectedGuest && (
          <div
            style={{
              border: selectedGuestBlocked ? "1px solid #d00000" : "1px solid #75b82a",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "10px",
              backgroundColor: selectedGuestBlocked ? "#fff7f7" : "#f8fff3",
            }}
          >
            <h4>{selectedGuest.name || "Vendég adatai"}</h4>
            <p>Állapot: <b style={{ color: selectedGuestBlocked ? "#b00020" : "#1b5e20" }}>{selectedGuestBlocked ? "tiltott" : "aktív"}</b></p>
            <p>Email: <b>{selectedGuest.email || "nincs megadva"}</b></p>
            <p>Telefon: <b>{selectedGuest.phone || "nincs megadva"}</b>{selectedGuest.phone && renderPhoneCallLink(selectedGuest.phone)}</p>

            <div style={{ ...premiumPanelStyle, marginTop: "12px", background: "white" }}>
              <h4 style={{ marginTop: 0 }}>Üzenet írása {selectedGuest.name || "vendég"}nak</h4>
              <textarea
                placeholder="Írd ide az üzenetet..."
                value={providerMessageTexts[`registered-${selectedGuest.id}`] || ""}
                onChange={(e) => setProviderMessageTexts({ ...providerMessageTexts, [`registered-${selectedGuest.id}`]: e.target.value })}
                style={{ ...premiumInlineInputStyle, width: "100%", minHeight: "80px", resize: "vertical" }}
              />
              <br />
              <button onClick={() => sendProviderDirectMessageToGuest(selectedGuest, `registered-${selectedGuest.id}`)} style={providerSmallButtonStyle}>
                Üzenet küldése {selectedGuest.name || "vendég"}nak
              </button>
            </div>

            <div
              style={{
                border: "1px solid #d6eac8",
                borderRadius: "10px",
                padding: "10px",
                marginTop: "12px",
                backgroundColor: "white",
                textAlign: "left",
                maxWidth: "520px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <h4 style={{ marginTop: 0, marginBottom: "8px", textAlign: "center" }}>Foglalási előzmények</h4>

              {selectedGuestBookingSummary.lastBooking ? (
                <p style={{ margin: "6px 0" }}>
                  Legutolsó foglalás: <b>{formatDateHu(selectedGuestBookingSummary.lastBooking.date)} {selectedGuestBookingSummary.lastBooking.time}</b>
                  {selectedGuestBookingSummary.lastBooking.service && (
                    <span> — {selectedGuestBookingSummary.lastBooking.service}</span>
                  )}
                </p>
              ) : (
                <p style={{ margin: "6px 0", color: "#777" }}>Még nincs korábbi foglalása ennél a szolgáltatónál.</p>
              )}

              {selectedGuestBookingSummary.futureBookings.length > 0 ? (
                <div style={{ marginTop: "10px" }}>
                  <p style={{ margin: "6px 0", fontWeight: "bold", color: "#1b5e20" }}>Aktív jövőbeli foglalás:</p>
                  {selectedGuestBookingSummary.futureBookings.map((booking) => (
                    <div
                      key={booking.id}
                      style={{
                        border: "1px solid #75b82a",
                        borderRadius: "8px",
                        padding: "8px",
                        marginTop: "6px",
                        backgroundColor: "#f2ffe9",
                        color: "#1b5e20",
                        fontWeight: "bold",
                      }}
                    >
                      {formatDateHu(booking.date)} {booking.time}
                      {booking.service && <span> — {booking.service}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: "10px 0 0", color: "#777" }}>Nincs előre aktív foglalása.</p>
              )}
            </div>

            {selectedGuest.email && !selectedGuestBlocked && (
              <button
                onClick={() => blockGuestEmail(selectedGuest.email)}
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #b00020",
                  backgroundColor: "#d00000",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {selectedGuest.name || "Vendég"} tiltása
              </button>
            )}

            {selectedGuest.email && selectedGuestBlocked && (
              <button
                onClick={() => unblockGuestEmail(selectedGuest.email)}
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #2e7d32",
                  backgroundColor: "#75b82a",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {selectedGuest.name || "Vendég"} tiltásának feloldása
              </button>
            )}
          </div>
        )}
      </div>
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
    if (!activeProvider || !slot.booked) return;

    const message = (providerCancelMessages[slot.id] || "").trim();

    if (!message) {
      alert("Lemondáskor kötelező üzenetet írni a vendégnek.");
      return;
    }

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? {
            ...provider,
            slots: provider.slots.map((s) =>
              s.id === slot.id
                ? { ...s, booked: false, bookedBy: "", guestId: null, guestEmail: "", guestPhone: "", service: "", note: "" }
                : s
            ),
            notifications: [
              {
                id: Date.now(),
                text: `${activeProvider.name} lemondta ${slot.bookedBy} időpontját: ${slot.date} ${slot.time}`,
                note: message,
              },
              ...(provider.notifications || []),
            ],
          }
        : provider
    );

    const updatedBookings = guestBookings.map((booking) =>
      booking.slotId === slot.id && booking.active
        ? {
            ...booking,
            active: false,
            cancelledByProvider: true,
            providerCancelMessage: message,
          }
        : booking
    );

    const updatedGuests = guests.map((guest) =>
      guest.id === slot.guestId
        ? {
            ...guest,
            notifications: [
              {
                id: Date.now(),
                text: `${activeProvider.name} lemondta az időpontodat: ${slot.date} ${slot.time}`,
                message,
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
      guestId: slot.guestId,
      guestName: slot.bookedBy,
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      from: "provider",
      fromName: activeProvider.name,
      toName: slot.bookedBy,
      text: message,
      type: "cancel",
    };

    setMessages([cancelMessage, ...messages]);
    setProviders(updatedProviders);
    setGuestBookings(updatedBookings);
    setGuests(updatedGuests);

    const freshProvider = updatedProviders.find((p) => p.id === activeProvider.id);
    setActiveProvider(freshProvider);

    if (selectedProvider && idsEqual(selectedProvider.id, activeProvider.id)) {
      setSelectedProvider(freshProvider);
    }

    if (activeGuest) {
      refreshGuestViews(updatedGuests, activeGuest.id);
    }

    const supabaseMessageResult = await saveMessageToSupabase(cancelMessage, {
      provider: activeProvider,
      guest: guests.find((guest) => guest.id === slot.guestId),
      slot,
    });

    const bookingForSupabase =
      guestBookings.find((booking) => booking.active && booking.slotId === slot.id) || {
        id: null,
        guestId: slot.guestId,
        guestEmail: slot.guestEmail,
        providerId: activeProvider.id,
        slotId: slot.id,
        date: slot.date,
        time: slot.time,
      };

    const supabaseCancelResult = await syncBookingCancellationToSupabase(
      bookingForSupabase,
      activeProvider,
      slot
    );

    setProviderCancelMessages({ ...providerCancelMessages, [slot.id]: "" });

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

    setGuests(updatedGuests);
    refreshGuestViews(updatedGuests, slot.guestId);

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

    setProviders(updatedProviders);
    refreshProviderViews(updatedProviders, booking.providerId);

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


  function generateDemoData() {
    const confirmed = confirm(
      "Ez létrehoz sok teszt szolgáltatót, vendéget és foglalást. A jelenlegi tesztadatokat felülírja. Mehet?"
    );

    if (!confirmed) return;

    const demoProviders = [];
    const demoGuests = [];
    const demoBookings = [];
    const demoMessages = [];

    const serviceOptions = [
      "Hajvágás",
      "Műköröm töltés",
      "Gél lakk",
      "Masszázs",
      "Kozmetika",
    ];

    const firstNames = [
      "Kati",
      "Laci",
      "Anna",
      "Péter",
      "Renáta",
      "Sanyi",
      "Móni",
      "Zoli",
      "Eszter",
      "Tamás",
    ];

    const providerNames = [
      "Maris Körmös",
      "Pisti Fodrász",
      "Anna Kozmetika",
      "Kati Masszázs",
      "Renáta Szalon",
      "Beauty Studio",
      "Relax Masszázs",
      "Modern Hair",
      "Nail Art Studio",
      "Fodrász Expressz",
    ];

    const today = new Date();

    for (let i = 0; i < 20; i++) {
      const providerId = 100000 + i;
      const providerName = providerNames[i % providerNames.length] + " " + (i + 1);
      const providerGuestCode = `TESZT-${String(i + 1).padStart(3, "0")}`;

      const slots = [];
      const workDaysForDemo = ["Hétfő", "Kedd", "Szombat"];

      for (let d = 0; d < 28; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);

        const dateText = formatDate(date);
        const dayName = getHungarianDayName(date);

        if (!workDaysForDemo.includes(dayName)) continue;

        ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"].forEach((time) => {
          slots.push({
            id: `${providerId}-${dateText}-${time}`,
            date: dateText,
            day: dayName,
            time,
            booked: false,
            bookedBy: "",
            guestId: null,
            guestEmail: "",
            guestPhone: "",
            service: "",
            note: "",
          });
        });
      }

      demoProviders.push({
        id: providerId,
        name: providerName,
        email: `szolgaltato${i + 1}@teszt.hu`,
        pin: String(1000 + i),
        guestCode: providerGuestCode,
        workDays: workDaysForDemo,
        workStart: "08:00",
        workEnd: "16:00",
        slotLength: 60,
        weeksAhead: 4,
        exceptionDates: [],
        services: serviceOptions,
        blockedEmails: i === 0 ? ["tiltott@teszt.hu"] : [],
        slots,
        notifications: [],
      });
    }

    for (let i = 0; i < 100; i++) {
      const guestId = 200000 + i;
      const guestName = `${firstNames[i % firstNames.length]} Teszt ${i + 1}`;
      const guestEmail = i === 0 ? "tiltott@teszt.hu" : `vendeg${i + 1}@teszt.hu`;

      const providerIds = [
        demoProviders[i % demoProviders.length].id,
        demoProviders[(i + 3) % demoProviders.length].id,
        demoProviders[(i + 7) % demoProviders.length].id,
      ];

      demoGuests.push({
        id: guestId,
        name: guestName,
        email: guestEmail,
        phone: `+43 660 ${String(1000000 + i)}`,
        pin: String(2000 + (i % 1000)),
        providerIds,
        notifications: [],
      });
    }

    demoGuests.forEach((guest, index) => {
      const provider = demoProviders[index % demoProviders.length];

      if (isGuestBlockedByProvider(provider, guest.email)) return;

      const freeSlot = provider.slots.find((slot) => !slot.booked);

      if (!freeSlot) return;

      freeSlot.booked = true;
      freeSlot.bookedBy = guest.name;
      freeSlot.guestId = guest.id;
      freeSlot.guestEmail = guest.email;
      freeSlot.guestPhone = guest.phone;
      freeSlot.service = serviceOptions[index % serviceOptions.length];
      freeSlot.note = index % 3 === 0 ? "Teszt megjegyzés" : "";

      const booking = {
        id: 300000 + index,
        guestId: guest.id,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        providerId: provider.id,
        providerName: provider.name,
        slotId: freeSlot.id,
        date: freeSlot.date,
        day: freeSlot.day,
        time: freeSlot.time,
        service: freeSlot.service,
        note: freeSlot.note,
        active: true,
        cancelledByProvider: false,
        providerCancelMessage: "",
        changed: false,
        oldDate: "",
        oldTime: "",
      };

      demoBookings.push(booking);

      provider.notifications.unshift({
        id: 400000 + index,
        text: `${guest.name} lefoglalta ezt az időpontot: ${freeSlot.date} ${freeSlot.time}`,
        note: freeSlot.note,
        service: freeSlot.service,
      });

      if (index % 10 === 0) {
        demoMessages.push({
          id: 500000 + index,
          providerId: provider.id,
          providerName: provider.name,
          guestId: guest.id,
          guestName: guest.name,
          slotId: freeSlot.id,
          date: freeSlot.date,
          time: freeSlot.time,
          from: "guest",
          fromName: guest.name,
          toName: provider.name,
          text: "Ez egy teszt üzenet a vendégtől.",
          type: "message",
        });
      }
    });

    setProviders(demoProviders);
    setGuests(demoGuests);
    setGuestBookings(demoBookings);
    setMessages(demoMessages);
    setActiveProvider(null);
    setActiveGuest(null);
    setSelectedProvider(null);
    setSelectedSlot(null);
    setMode("");

    alert(
      `Tesztadatok létrehozva.\n\nSzolgáltatók: ${demoProviders.length}\nVendégek: ${demoGuests.length}\nFoglalások: ${demoBookings.length}\nÜzenetek: ${demoMessages.length}\n\nPélda szolgáltató belépés:\nszolgaltato1@teszt.hu / 1000\n\nPélda vendég belépés:\nvendeg2@teszt.hu / 2001`
    );
  }


  async function generateBigStressTestData() {
    const confirmed = confirm(
      "Ez egy NAGY, összetett tesztet hoz létre sok szolgáltatóval, vendéggel, foglalással, üzenettel, letiltott vendéggel, kivétel nappal és teljesen betelt nappal. A jelenlegi helyi tesztadatokat felülírja. Mehet?"
    );

    if (!confirmed) return;

    const demoProviders = [];
    const demoGuests = [];
    const demoBookings = [];
    const demoMessages = [];

    const serviceOptions = [
      "Hajvágás",
      "Szakáll igazítás",
      "Műköröm töltés",
      "Új köröm szett",
      "Gél lakk",
      "Masszázs",
      "Kozmetika",
      "Festés",
    ];

    const firstNames = [
      "Kati", "Laci", "Anna", "Péter", "Renáta", "Sanyi", "Móni", "Zoli", "Eszter", "Tamás",
      "Judit", "Norbi", "Lilla", "Gábor", "Réka", "Bence", "Dóra", "Ádám", "Niki", "Feri"
    ];

    const providerBaseNames = [
      "Maris Körmös", "Pisti Fodrász", "Anna Kozmetika", "Kati Masszázs", "Renáta Szalon",
      "Beauty Studio", "Relax Masszázs", "Modern Hair", "Nail Art Studio", "Fodrász Expressz"
    ];

    const today = new Date();

    for (let i = 0; i < 50; i++) {
      const providerId = 1000000 + i;
      const providerName = providerBaseNames[i % providerBaseNames.length] + " " + (i + 1);
      const providerGuestCode = `BIG-${String(i + 1).padStart(4, "0")}`;

      const slots = [];
      const workDaysForDemo = i % 2 === 0
        ? ["Hétfő", "Kedd", "Szombat"]
        : ["Szerda", "Csütörtök", "Péntek"];

      for (let d = 0; d < 42; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);

        const dateText = formatDate(date);
        const dayName = getHungarianDayName(date);

        if (!workDaysForDemo.includes(dayName)) continue;

        ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].forEach((time) => {
          slots.push({
            id: `${providerId}-${dateText}-${time}`,
            date: dateText,
            day: dayName,
            time,
            booked: false,
            bookedBy: "",
            guestId: null,
            guestEmail: "",
            guestPhone: "",
            service: "",
            note: "",
          });
        });
      }

      const exceptionDates = [];
      if (slots.length > 20) {
        exceptionDates.push(slots[15].date);
      }

      demoProviders.push({
        id: providerId,
        name: providerName,
        email: `bigszolgaltato${i + 1}@teszt.hu`,
        pin: String(3000 + i),
        guestCode: providerGuestCode,
        workDays: workDaysForDemo,
        workStart: "08:00",
        workEnd: "18:00",
        slotLength: 60,
        weeksAhead: 6,
        exceptionDates,
        services: serviceOptions,
        blockedEmails: i < 10 ? [`blocked${i + 1}@teszt.hu`] : [],
        slots,
        notifications: [],
      });
    }

    for (let i = 0; i < 500; i++) {
      const guestId = 2000000 + i;
      const guestName = `${firstNames[i % firstNames.length]} Nagyteszt ${i + 1}`;
      const guestEmail = i < 10 ? `blocked${i + 1}@teszt.hu` : `bigvendeg${i + 1}@teszt.hu`;

      const providerIds = [
        demoProviders[i % demoProviders.length].id,
        demoProviders[(i + 5) % demoProviders.length].id,
        demoProviders[(i + 17) % demoProviders.length].id,
        demoProviders[(i + 31) % demoProviders.length].id,
      ];

      demoGuests.push({
        id: guestId,
        name: guestName,
        email: guestEmail,
        phone: `+43 660 ${String(2000000 + i)}`,
        pin: String(4000 + (i % 1000)),
        providerIds,
        notifications: [],
      });
    }

    // Normál foglalások sok szolgáltatóhoz
    demoGuests.forEach((guest, index) => {
      const provider = demoProviders[index % demoProviders.length];

      if (isGuestBlockedByProvider(provider, guest.email)) {
        guest.notifications.unshift({
          id: 7000000 + index,
          text: `${provider.name} letiltott téged, ezért nem tudsz nála időpontot foglalni.`,
          message: "Teszt tiltott vendég.",
        });
        return;
      }

      const freeSlot = provider.slots.find(
        (slot) =>
          !slot.booked &&
          !provider.exceptionDates.includes(slot.date) &&
          !guestAlreadyHasBookingOnDate(provider.id, guest.email, slot.date)
      );

      if (!freeSlot) return;

      freeSlot.booked = true;
      freeSlot.bookedBy = guest.name;
      freeSlot.guestId = guest.id;
      freeSlot.guestEmail = guest.email;
      freeSlot.guestPhone = guest.phone;
      freeSlot.service = serviceOptions[index % serviceOptions.length];
      freeSlot.note = index % 4 === 0 ? "Nagyteszt megjegyzés" : "";

      const booking = {
        id: 3000000 + index,
        guestId: guest.id,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        providerId: provider.id,
        providerName: provider.name,
        slotId: freeSlot.id,
        date: freeSlot.date,
        day: freeSlot.day,
        time: freeSlot.time,
        service: freeSlot.service,
        note: freeSlot.note,
        active: true,
        cancelledByProvider: false,
        providerCancelMessage: "",
        changed: false,
        oldDate: "",
        oldTime: "",
      };

      demoBookings.push(booking);

      provider.notifications.unshift({
        id: 5000000 + index,
        text: `${guest.name} lefoglalta ezt az időpontot: ${freeSlot.date} ${freeSlot.time}`,
        note: freeSlot.note,
        service: freeSlot.service,
      });

      if (index % 15 === 0) {
        demoMessages.push({
          id: 6000000 + index,
          providerId: provider.id,
          providerName: provider.name,
          guestId: guest.id,
          guestName: guest.name,
          slotId: freeSlot.id,
          date: freeSlot.date,
          time: freeSlot.time,
          from: index % 30 === 0 ? "provider" : "guest",
          fromName: index % 30 === 0 ? provider.name : guest.name,
          toName: index % 30 === 0 ? guest.name : provider.name,
          text: index % 30 === 0 ? "Ez egy teszt válasz a szolgáltatótól." : "Ez egy teszt üzenet a vendégtől.",
          type: "message",
        });
      }
    });

    // Teljesen betelt nap létrehozása az első szolgáltatónál
    const fullProvider = demoProviders[0];
    const fullDayDate = fullProvider.slots.length > 0 ? fullProvider.slots[0].date : "";
    const fullDaySlots = fullProvider.slots.filter((slot) => slot.date === fullDayDate);

    fullDaySlots.forEach((slot, index) => {
      if (slot.booked) return;

      const guest = demoGuests[100 + index];

      if (!guest) return;

      slot.booked = true;
      slot.bookedBy = guest.name;
      slot.guestId = guest.id;
      slot.guestEmail = guest.email;
      slot.guestPhone = guest.phone;
      slot.service = serviceOptions[index % serviceOptions.length];
      slot.note = "Betelt nap teszt";

      demoBookings.push({
        id: 8000000 + index,
        guestId: guest.id,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        providerId: fullProvider.id,
        providerName: fullProvider.name,
        slotId: slot.id,
        date: slot.date,
        day: slot.day,
        time: slot.time,
        service: slot.service,
        note: slot.note,
        active: true,
        cancelledByProvider: false,
        providerCancelMessage: "",
        changed: false,
        oldDate: "",
        oldTime: "",
      });
    });

    fullProvider.notifications.unshift({
      id: 9000000,
      text: `Teljesen betelt tesztnap létrehozva: ${fullDayDate}`,
      note: "Ezen a napon minden időpont foglalt.",
      service: "",
    });

    // Célzott tesztesetek: üzenetváltás mindkét irányba, tiltott vendég és betelt nap
    const sampleBookings = demoBookings
      .filter((booking) => idsEqual(booking.providerId, fullProvider.id))
      .slice(0, 5);

    sampleBookings.forEach((booking, index) => {
      const providerMessage = {
        id: 9100000 + index,
        providerId: booking.providerId,
        providerName: booking.providerName,
        guestId: booking.guestId,
        guestName: booking.guestName,
        slotId: booking.slotId,
        date: booking.date,
        time: booking.time,
        from: "provider",
        fromName: booking.providerName,
        toName: booking.guestName,
        text: `Stresszteszt szolgáltatói üzenet #${index + 1}: rendben, várunk.`,
        type: "message",
      };

      const guestMessage = {
        id: 9200000 + index,
        providerId: booking.providerId,
        providerName: booking.providerName,
        guestId: booking.guestId,
        guestName: booking.guestName,
        slotId: booking.slotId,
        date: booking.date,
        time: booking.time,
        from: "guest",
        fromName: booking.guestName,
        toName: booking.providerName,
        text: `Stresszteszt vendégüzenet #${index + 1}: köszönöm, megyek.`,
        type: "message",
      };

      demoMessages.unshift(providerMessage, guestMessage);

      const guest = demoGuests.find((item) => item.id === booking.guestId);

      if (guest) {
        guest.notifications.unshift({
          id: 9300000 + index,
          text: `${booking.providerName} üzenetet küldött neked: ${booking.date} ${booking.time}`,
          message: providerMessage.text,
        });
      }

      fullProvider.notifications.unshift({
        id: 9400000 + index,
        text: `${booking.guestName} üzenetet küldött neked: ${booking.date} ${booking.time}`,
        note: guestMessage.text,
      });
    });

    const blockedStressGuest = demoGuests.find((guest) => guest.email === "blocked1@teszt.hu");

    if (blockedStressGuest) {
      blockedStressGuest.notifications.unshift({
        id: 9500000,
        text: `${fullProvider.name} letiltott téged, ezért ennél a szolgáltatónál nem tudsz foglalni.`,
        message: "Stresszteszt: tiltott vendég ellenőrzése.",
      });

      fullProvider.notifications.unshift({
        id: 9600000,
        text: `${blockedStressGuest.email} tiltott vendégként szerepel a stressztesztben.`,
        note: "Foglalni nem szabad tudnia ennél a szolgáltatónál.",
      });
    }

    setProviders(demoProviders);
    setGuests(demoGuests);
    setGuestBookings(demoBookings);
    setMessages(demoMessages);
    setActiveProvider(null);
    setActiveGuest(null);
    setSelectedProvider(null);
    setSelectedSlot(null);
    setTestAccessData({
      providerEmail: "bigszolgaltato1@teszt.hu",
      providerPin: "3000",
      providerGuestCode: "BIG-0001",
      guestEmail: "bigvendeg101@teszt.hu",
      guestPin: "4100",
      blockedEmail: "blocked1@teszt.hu",
      fullDayDate,
    });
    setMode("");

    let supabaseSummary = "";

    try {
      const saved = await saveStressTestDataToSupabase(demoProviders, demoGuests, demoBookings, demoMessages);
      await loadSupabaseData();
      supabaseSummary = `

Supabase mentés sikeres:
Szolgáltatók: ${saved.providers}
Vendégek: ${saved.guests}
Időpontok: ${saved.slots}
Foglalások: ${saved.bookings}
Üzenetek: ${saved.messages}
Kivétel napok: ${saved.exceptions}
Letiltások: ${saved.blocked}
Vendég-szolgáltató kapcsolatok: ${saved.providerGuestLinks || 0}`;
    } catch (error) {
      console.error("Stresszteszt Supabase mentési hiba:", error);
      supabaseSummary = "\n\nFigyelem: a stresszteszt helyben létrejött, de Supabase-be nem sikerült menteni. Nézd meg a Console hibát.";
    }

    alert(
      `Nagy stresszteszt létrehozva.

Szolgáltatók: ${demoProviders.length}
Vendégek: ${demoGuests.length}
Foglalások: ${demoBookings.length}
Üzenetek: ${demoMessages.length}
Letiltott email teszt: blocked1@teszt.hu
Betelt nap az első szolgáltatónál: ${fullDayDate}${supabaseSummary}

A belépési adatok most külön, kimásolható mezőkben látszanak a főoldalon.`
    );
  }

  function clearAllData() {
    const confirmed = confirm(
      "Biztosan törlöd a HELYI tesztadatokat ebből a böngészőből?\n\nEz nem törli a Supabase adatbázist, csak a böngészőben ragadt tesztadatokat, értesítéseket, foglalásokat és üzeneteket."
    );

    if (!confirmed) return;

    localStorage.removeItem("providers");
    localStorage.removeItem("guests");
    localStorage.removeItem("guestBookings");
    localStorage.removeItem("messages");

    setProviders([]);
    setGuests([]);
    setGuestBookings([]);
    setMessages([]);

    setMode("");
    setActiveProvider(null);
    setActiveGuest(null);
    setSelectedProvider(null);
    setSelectedSlot(null);
    setChangeProvider(null);
    setChangeSlot(null);
    setChangeBookingId(null);

    setProviderName("");
    setProviderEmail("");
    setProviderPhone("");
    setProviderPin("");
    setGuestCode("");
    setNewGuestCode("");
    setLoginUsername("");
    setLoginPin("");
    setForgotProviderEmail("");
    setForgotGuestEmail("");

    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setGuestPin("");
    setGuestLoginEmail("");
    setGuestLoginPin("");
    setGuestProviderCode("");
    setGuestNote("");
    setSelectedService("");

    setSelectedCalendarDate("");
    setChangeCalendarDate("");
    setProviderCalendarDate("");
    setExceptionDate("");
    setProviderCancelMessages({});
    setProviderMessageTexts({});
    setGuestMessageTexts({});
    setNewServiceName("");

    alert("A helyi tesztadatok törölve. A Supabase adatbázis változatlan maradt.");
  }


  function isGeneratedTestProviderRow(row) {
    const email = normalizeEmail(row?.email);
    const name = String(row?.nev || "").toLowerCase();
    const profileName = String(row?.profilnev || "").toLowerCase();

    return (
      email.endsWith("@teszt.hu") ||
      email.startsWith("bigszolgaltato") ||
      email.startsWith("szolgaltato") ||
      name.includes("teszt") ||
      name.includes("nagyteszt") ||
      profileName.includes("teszt") ||
      profileName.includes("stresszteszt")
    );
  }

  function isGeneratedTestGuestRow(row) {
    const email = normalizeEmail(row?.email);
    const name = String(row?.nev || "").toLowerCase();

    return (
      email.endsWith("@teszt.hu") ||
      email.startsWith("bigvendeg") ||
      email.startsWith("vendeg") ||
      email.startsWith("blocked") ||
      email === "tiltott@teszt.hu" ||
      name.includes("teszt") ||
      name.includes("nagyteszt")
    );
  }

  function isGeneratedTestProvider(provider) {
    return isGeneratedTestProviderRow({
      email: provider?.email,
      nev: provider?.name,
      profilnev: provider?.profileName,
    });
  }

  function isGeneratedTestGuest(guest) {
    return isGeneratedTestGuestRow({
      email: guest?.email,
      nev: guest?.name,
    });
  }

  async function deleteRowsByIds(tableName, ids) {
    const cleanIds = [...new Set((ids || []).filter(Boolean))];

    for (const chunk of chunkArray(cleanIds, 200)) {
      const { error } = await supabase.from(tableName).delete().in("id", chunk);

      if (error) {
        console.error(`Supabase törlési hiba (${tableName}):`, error);
        throw error;
      }
    }
  }

  async function clearSupabaseTestData() {
    const confirmed = confirm(
      "Biztosan törlöd a Supabase tesztadatokat?\n\nEz törli: üzenetek, foglalások, időpontok, kivétel napok, letiltott vendégek.\n\nPlusz törli a generált teszt szolgáltatókat és teszt vendégeket is, például @teszt.hu, bigszolgaltato..., bigvendeg..., blocked...\n\nA saját, kézzel regisztrált szolgáltatók és vendégek megmaradnak."
    );

    if (!confirmed) return;

    try {
      const { data: providerRows, error: providerLookupError } = await supabase
        .from("szolgaltatok")
        .select("id, nev, profilnev, email");

      if (providerLookupError) throw providerLookupError;

      const { data: guestRows, error: guestLookupError } = await supabase
        .from("vendegek")
        .select("id, nev, email");

      if (guestLookupError) throw guestLookupError;

      const testProviderIds = (providerRows || [])
        .filter(isGeneratedTestProviderRow)
        .map((row) => row.id);

      const testGuestIds = (guestRows || [])
        .filter(isGeneratedTestGuestRow)
        .map((row) => row.id);

      const tablesToClear = [
        "uzenetek",
        "foglalasok",
        "letiltott_vendegek",
        "kivetel_napok",
        "idopontok",
      ];

      for (const tableName of tablesToClear) {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .not("id", "is", null);

        if (error) {
          console.error(`Supabase törlési hiba (${tableName}):`, error);
          alert(`Hiba történt a(z) ${tableName} tábla törlése közben. Nézd meg a Console hibát.`);
          return;
        }
      }

      await deleteRowsByIds("vendegek", testGuestIds);
      await deleteRowsByIds("szolgaltatok", testProviderIds);

      const remainingProviders = providers
        .filter((provider) => !isGeneratedTestProvider(provider))
        .map((provider) => ({
          ...provider,
          exceptionDates: [],
          blockedEmails: [],
          slots: [],
          notifications: [],
        }));

      const remainingGuests = guests
        .filter((guest) => !isGeneratedTestGuest(guest))
        .map((guest) => ({
          ...guest,
          notifications: [],
        }));

      setProviders(remainingProviders);
      setGuests(remainingGuests);
      setGuestBookings([]);
      setMessages([]);

      setSelectedProvider(null);
      setSelectedSlot(null);
      setSelectedCalendarDate("");
      setChangeProvider(null);
      setChangeSlot(null);
      setChangeBookingId(null);
      setChangeCalendarDate("");
      setProviderCalendarDate("");
      setExceptionDate("");
      setProviderCancelMessages({});
      setProviderMessageTexts({});
      setGuestMessageTexts({});
      setTestAccessData(null);

      if (activeProvider) {
        const refreshedProvider = remainingProviders.find((provider) => provider.id === activeProvider.id);
        setActiveProvider(refreshedProvider || null);
      }

      if (activeGuest) {
        const refreshedGuest = remainingGuests.find((guest) => guest.id === activeGuest.id);
        setActiveGuest(refreshedGuest || null);
      }

      await loadSupabaseData();

      alert(
        `Supabase tesztadatok törölve.\n\nTörölt teszt szolgáltatók: ${testProviderIds.length}\nTörölt teszt vendégek: ${testGuestIds.length}\n\nA saját, kézzel regisztrált szolgáltatók és vendégek megmaradtak.`
      );
    } catch (error) {
      console.error("Supabase tesztadat törlési hiba:", error);
      alert("Hiba történt a Supabase tesztadatok törlése közben. Nézd meg a Console hibát.");
    }
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

              {showProviderSettings && (
                <div style={premiumPanelStyle}>
                  <h3 style={{ marginTop: 0 }}>Szolgáltatói beállítások</h3>
                  <div style={premiumToggleRowStyle}>
                    <span>Email értesítés foglalásokról</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={(activeProvider.emailNotifications ?? providerEmailNotifications) !== false}
                        onChange={(e) => updateProviderPreference("emailNotifications", e.target.checked)}
                      />
                      {" "}{(activeProvider.emailNotifications ?? providerEmailNotifications) !== false ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  <div style={premiumToggleRowStyle}>
                    <span>PIN kérése belépéskor</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={activeProvider.pinLoginEnabled !== false}
                        onChange={(e) => updateProviderPreference("pinLoginEnabled", e.target.checked)}
                      />
                      {" "}{activeProvider.pinLoginEnabled !== false ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  <div style={premiumToggleRowStyle}>
                    <span>Időpont-generálási figyelmeztetés</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={activeProvider.slotWarningEnabled === true}
                        onChange={(e) => updateProviderPreference("slotWarningEnabled", e.target.checked)}
                      />
                      {" "}{activeProvider.slotWarningEnabled === true ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  {activeProvider.slotWarningEnabled === true && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={premiumLabelStyle}>Hány hétnél figyelmeztessen?</label>
                      <select
                        value={String(activeProvider.slotWarningWeeks || 1)}
                        onChange={(e) => updateProviderPreference("slotWarningWeeks", Number(e.target.value))}
                        style={premiumSelectStyle}
                      >
                        <option value="1">1 hét</option>
                        <option value="2">2 hét</option>
                        <option value="3">3 hét</option>
                        <option value="4">4 hét</option>
                      </select>
                      <p style={premiumHintStyle}>
                        Példa: ha 1 hét van beállítva, akkor figyelmeztet, amikor már csak legfeljebb 1 hétre van előre időpont generálva.
                      </p>
                    </div>
                  )}

                  <button onClick={saveActiveProviderSettings} style={{ ...providerSmallButtonStyle, marginTop: "12px" }}>
                    Beállítások mentése
                  </button>

                  <DeveloperContact
                    senderType="provider"
                    senderName={activeProvider.name}
                    senderEmail={activeProvider.email}
                    showDeveloperContact={showDeveloperContact}
                    setShowDeveloperContact={setShowDeveloperContact}
                    developerMessageText={developerMessageText}
                    setDeveloperMessageText={setDeveloperMessageText}
                    sendDeveloperMessage={sendDeveloperMessage}
                    buttonStyle={providerSmallButtonStyle}
                    inputStyle={premiumInputStyle}
                  />

                  <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(98, 84, 111, 0.12)" }}>
                    <button onClick={deleteProviderAccount} style={dangerButtonStyle}>
                      Szolgáltatói fiók törlése
                    </button>
                  </div>
                </div>
              )}

              <div style={premiumSettingsPanelStyle}>
                <button
                  onClick={() => setShowProviderGuestCodeEdit(!showProviderGuestCodeEdit)}
                  style={premiumNeutralButtonStyle}
                >
                  {showProviderGuestCodeEdit ? "Vendégkód módosítás bezárása" : "Vendégkód módosítása"}
                </button>

                {showProviderGuestCodeEdit && (
                  <div style={{ marginTop: "12px" }}>
                    <input
                      placeholder="Új vendégkód, pl. MONI-2026"
                      value={newGuestCode}
                      onChange={(e) => setNewGuestCode(normalizeGuestCode(e.target.value))}
                      style={premiumInlineInputStyle}
                    />
                    <p>Legalább 6 karakter. A már csatlakozott vendégek megmaradnak.</p>
                    <button onClick={changeProviderGuestCode} style={providerSmallButtonStyle}>
                      Vendégkód mentése
                    </button>
                  </div>
                )}
              </div>

              <div style={premiumSettingsPanelStyle}>
                <button
                  onClick={() => setShowProviderPinEdit(!showProviderPinEdit)}
                  style={premiumNeutralButtonStyle}
                >
                  {showProviderPinEdit ? "PIN módosítás bezárása" : "Saját PIN módosítása"}
                </button>

                {showProviderPinEdit && (
                  <div style={premiumPanelStyle}>
                    <h3>Saját PIN módosítása</h3>
                    <p style={{ marginTop: 0 }}>Itt tudod módosítani a szolgáltatói belépési PIN-kódodat.</p>
                    <input
                      placeholder="Jelenlegi PIN"
                      value={providerCurrentPin}
                      onChange={(e) => setProviderCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={premiumInlineInputStyle}
                    />
                    <input
                      placeholder="Új PIN"
                      value={providerNewPin}
                      onChange={(e) => setProviderNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={premiumInlineInputStyle}
                    />
                    <input
                      placeholder="Új PIN még egyszer"
                      value={providerNewPinAgain}
                      onChange={(e) => setProviderNewPinAgain(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={premiumInlineInputStyle}
                    />
                    <button onClick={changeProviderPin} style={providerSmallButtonStyle}>PIN módosítása</button>
                  </div>
                )}
              </div>

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



              <h4 style={premiumSectionTitleStyle}>Válassz napot</h4>
              {renderProviderCalendar(activeProvider, providerCalendarDate, (date) => {
                setProviderCalendarDate(date);
              })}

              {providerCalendarDate && (
                <>
                  <h4>Időpontok ezen a napon: {formatDateHu(providerCalendarDate)}</h4>

                  {getSlotsForDate(activeProvider, providerCalendarDate).map((slot) => (
                    <div key={slot.id} style={premiumListCardStyle}>
                      <b>{slot.time}</b>
                      <br />

                      {slot.booked ? (
                        <>
                          Foglalt: {slot.bookedBy}
                          {slot.guestEmail && (
                            <>
                              <br />
                              Email: {slot.guestEmail}
                            </>
                          )}
                          {slot.guestPhone && (
                            <>
                              <br />
                              Telefon: {slot.guestPhone}
                              {renderPhoneCallLink(slot.guestPhone)}
                            </>
                          )}
                          {slot.service && (
                            <>
                              <br />
                              Szolgáltatás: {slot.service}
                            </>
                          )}
                          {slot.note && (
                            <>
                              <br />
                              Megjegyzés: {slot.note}
                            </>
                          )}

                          <br /><br />

                          <input
                            placeholder="Üzenet a vendégnek"
                            value={providerMessageTexts[slot.id] || ""}
                            onChange={(e) =>
                              setProviderMessageTexts({
                                ...providerMessageTexts,
                                [slot.id]: e.target.value,
                              })
                            }
                            style={{ ...premiumInlineInputStyle, width: "100%" }}
                          />

                          <br /><br />

                          <button onClick={() => sendProviderMessageToGuest(slot)} style={providerSmallButtonStyle}>
                            Üzenet küldése a vendégnek
                          </button>

                          <br /><br />

                          <input
                            placeholder="Lemondás oka / üzenet a vendégnek - kötelező"
                            value={providerCancelMessages[slot.id] || ""}
                            onChange={(e) =>
                              setProviderCancelMessages({
                                ...providerCancelMessages,
                                [slot.id]: e.target.value,
                              })
                            }
                            style={{ ...premiumInlineInputStyle, width: "100%" }}
                          />

                          <br /><br />

                          <button onClick={() => cancelBookingByProvider(slot)} style={dangerButtonStyle}>
                            Időpont lemondása szolgáltatóként
                          </button>
                        </>
                      ) : (
                        "Szabad"
                      )}
                    </div>
                  ))}
                </>
              )}

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
        <div style={guestFormCardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#5b4164" }}>Vendég regisztráció</h2>
          <div style={premiumFormHeaderLineStyle}></div>

          <div style={premiumFieldGroupStyle}>
            <label style={premiumLabelStyle}>Név</label>
            <input
              style={premiumInputStyle}
              placeholder="Kovács Anna"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <div style={premiumFieldGroupStyle}>
            <label style={premiumLabelStyle}>Email</label>
            <input
              style={premiumInputStyle}
              placeholder="anna@email.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>

          <div style={premiumFieldGroupStyle}>
            <label style={premiumLabelStyle}>Telefon <span style={{ fontWeight: 400, color: "#82758d" }}>(nem kötelező)</span></label>
            <input
              style={premiumInputStyle}
              placeholder="+36..."
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>

          <div style={premiumFieldGroupStyle}>
            <label style={premiumLabelStyle}>PIN</label>
            <input
              style={premiumInputStyle}
              placeholder="4 számjegy"
              value={guestPin}
              onChange={(e) => setGuestPin(e.target.value)}
              maxLength="4"
            />
          </div>

          <label style={{ ...premiumToggleRowStyle, borderBottom: "none", justifyContent: "center", marginBottom: "10px" }}>
            <input type="checkbox" checked={guestEmailNotifications} onChange={(e) => setGuestEmailNotifications(e.target.checked)} />
            <span>Kérek email értesítést a foglalásaimról</span>
          </label>

          <button onClick={createGuest} style={guestPrimaryActionStyle}>
            Vendég létrehozása
          </button>

          <button onClick={() => setMode("")} style={secondaryGhostButtonStyle}>
            Vissza
          </button>
        </div>
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

              {showGuestSettings && (
                <div style={premiumPanelStyle}>
                  <h3 style={{ marginTop: 0 }}>Vendég beállítások</h3>
                  <div style={premiumToggleRowStyle}>
                    <span>Email értesítés foglalásokról</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={(activeGuest.emailNotifications ?? guestEmailNotifications) !== false}
                        onChange={(e) => updateGuestPreference("emailNotifications", e.target.checked)}
                      />
                      {" "}{(activeGuest.emailNotifications ?? guestEmailNotifications) !== false ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  <div style={premiumToggleRowStyle}>
                    <span>PIN kérése belépéskor</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={activeGuest.pinLoginEnabled !== false}
                        onChange={(e) => updateGuestPreference("pinLoginEnabled", e.target.checked)}
                      />
                      {" "}{activeGuest.pinLoginEnabled !== false ? "Bekapcsolva" : "Kikapcsolva"}
                    </label>
                  </div>

                  <button onClick={saveActiveGuestSettings} style={{ ...guestSmallButtonStyle, marginTop: "12px" }}>
                    Beállítások mentése
                  </button>

                  <DeveloperContact
                    senderType="guest"
                    senderName={activeGuest.name}
                    senderEmail={activeGuest.email}
                    showDeveloperContact={showDeveloperContact}
                    setShowDeveloperContact={setShowDeveloperContact}
                    developerMessageText={developerMessageText}
                    setDeveloperMessageText={setDeveloperMessageText}
                    sendDeveloperMessage={sendDeveloperMessage}
                    buttonStyle={guestSmallButtonStyle}
                    inputStyle={premiumInputStyle}
                  />
                </div>
              )}

              <div style={{ ...premiumActionButtonRowStyle, display: showGuestSettings ? "flex" : "none" }}>
                <button
                  onClick={() => setShowGuestPhoneEdit(!showGuestPhoneEdit)}
                  style={premiumNeutralButtonStyle}
                >
                  {showGuestPhoneEdit ? "Telefonszám módosítás bezárása" : "Telefonszám módosítása"}
                </button>

                <button
                  onClick={() => setShowGuestPinEdit(!showGuestPinEdit)}
                  style={premiumNeutralButtonStyle}
                >
                  {showGuestPinEdit ? "PIN módosítás bezárása" : "Saját PIN módosítása"}
                </button>
              </div>

              {showGuestPhoneEdit && (
                <div style={premiumPanelStyle}>
                  <h3>Telefonszám módosítása</h3>
                  <p style={{ marginTop: 0 }}>Nem kötelező, de a szolgáltató így könnyebben elérhet.</p>
                  <input
                    placeholder="Telefonszám, pl. +36..."
                    value={editableGuestPhone}
                    onChange={(e) => setEditableGuestPhone(e.target.value)}
                    style={{ ...premiumInlineInputStyle, width: "100%" }}
                  />
                  <button onClick={updateActiveGuestPhone} style={{ ...premiumNeutralButtonStyle, marginLeft: "8px" }}>
                    Telefonszám mentése
                  </button>
                </div>
              )}

              {showGuestPinEdit && (
                <div style={premiumPanelStyle}>
                  <h3>Saját PIN módosítása</h3>
                  <p style={{ marginTop: 0 }}>Itt tudod módosítani a vendég belépési PIN-kódodat.</p>
                  <input
                    placeholder="Jelenlegi PIN"
                    value={guestCurrentPin}
                    onChange={(e) => setGuestCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength="4"
                      style={premiumInlineInputStyle}
                  />
                  <input
                    placeholder="Új PIN"
                    value={guestNewPin}
                    onChange={(e) => setGuestNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength="4"
                      style={premiumInlineInputStyle}
                  />
                  <input
                    placeholder="Új PIN még egyszer"














































































                    value={guestNewPinAgain}
                    onChange={(e) => setGuestNewPinAgain(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength="4"
                      style={premiumInlineInputStyle}
                  />
                  <button onClick={changeGuestPin} style={guestSmallButtonStyle}>PIN módosítása</button>
                </div>
              )}

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

              {renderGuestStats(activeGuest)}



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
