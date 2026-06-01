import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

function App() {
  const [mode, setMode] = useState("");

  const [providers, setProviders] = useState(() => JSON.parse(localStorage.getItem("providers")) || []);
  const [guests, setGuests] = useState(() => JSON.parse(localStorage.getItem("guests")) || []);
  const [guestBookings, setGuestBookings] = useState(() => JSON.parse(localStorage.getItem("guestBookings")) || []);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem("messages")) || []);

  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerPin, setProviderPin] = useState("");
  const [guestCode, setGuestCode] = useState("");
  const [newGuestCode, setNewGuestCode] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);
  const [forgotProviderEmail, setForgotProviderEmail] = useState("");
  const [forgotGuestEmail, setForgotGuestEmail] = useState("");
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

  useEffect(() => localStorage.setItem("providers", JSON.stringify(providers)), [providers]);
  useEffect(() => localStorage.setItem("guests", JSON.stringify(guests)), [guests]);
  useEffect(() => localStorage.setItem("guestBookings", JSON.stringify(guestBookings)), [guestBookings]);
  useEffect(() => localStorage.setItem("messages", JSON.stringify(messages)), [messages]);


  useEffect(() => {
    loadSupabaseData();
  }, []);

  function formatTimeFromSupabase(timeValue) {
    if (!timeValue) return "";
    return String(timeValue).slice(0, 5);
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
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
        <button onClick={() => copyToClipboard(value)} style={{ marginLeft: "8px" }}>
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
      return;
    }

    const providerRows = providersResult.data || [];
    const guestRows = guestsResult.data || [];
    const slotRows = slotsResult.data || [];
    const bookingRows = bookingsResult.data || [];
    const exceptionRows = exceptionDaysResult.data || [];
    const blockedRows = blockedGuestsResult.data || [];
    const messageRows = messagesResult.data || [];
    let providerGuestLinkRows = [];

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

      if (guest && provider && !guest.providerIds.includes(provider.id)) {
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

      if (provider) {
        provider.notifications = [
          {
            id: row.id,
            text: `${message.fromName} üzenetet küldött: ${slot?.date || ""} ${slot?.time || ""}`,
            note: text,
          },
          ...(provider.notifications || []),
        ];
      }

      if (guest) {
        guest.notifications = [
          {
            id: row.id,
            text: `${message.fromName} üzenetet küldött: ${slot?.date || ""} ${slot?.time || ""}`,
            message: text,
          },
          ...(guest.notifications || []),
        ];
      }

      return message;
    });

    const loadedProviders = Array.from(providerMap.values()).map((provider) => ({
      ...provider,
      exceptionDates: [...new Set(provider.exceptionDates || [])].sort(),
      blockedEmails: [...new Set(provider.blockedEmails || [])],
      slots: (provider.slots || []).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
      notifications: provider.notifications || [],
    }));

    const loadedGuests = Array.from(guestMap.values()).map((guest) => ({
      ...guest,
      providerIds: [...new Set(guest.providerIds || [])],
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
      return loadedProviders.find((provider) => provider.id === currentActiveProvider.id) || currentActiveProvider;
    });

    setActiveGuest((currentActiveGuest) => {
      if (!currentActiveGuest) return currentActiveGuest;
      return loadedGuests.find((guest) => guest.id === currentActiveGuest.id) || currentActiveGuest;
    });
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
        booking.providerId === providerId &&
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
      <>
        {Object.keys(groupedDates).map((monthKey) => {
          const daysInMonth = getDaysInMonth(monthKey);
          const startIndex = getMondayBasedStartIndex(monthKey);

          return (
            <div key={monthKey} style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "16px" }}>
              <h4>{getMonthLabel(monthKey)}</h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "6px",
                  textAlign: "center",
                }}
              >
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
                          padding: "8px",
                          borderRadius: "8px",
                          border: "1px solid #c44",
                          backgroundColor: "#ffd6d6",
                          color: "#8a0000",
                          fontSize: "12px",
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
                          padding: "8px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          backgroundColor: "#e6e6e6",
                          color: "#666",
                          fontSize: "12px",
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
                          padding: "10px",
                          borderRadius: "8px",
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
                        padding: "10px",
                        borderRadius: "8px",
                        border: selectedDate === date ? "2px solid #1b5e20" : "1px solid #2e7d32",
                        backgroundColor: selectedDate === date ? "#75b82a" : "#c8f7b8",
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

              <p style={{ fontSize: "12px" }}>
                Zöld: van szabad időpont / szürke: betelt / piros: nem dolgozik
              </p>
            </div>
          );
        })}
      </>
    );
  }


  function refreshProviderViews(updatedProviders, providerId) {
    const freshProvider = updatedProviders.find((p) => p.id === providerId);

    if (activeProvider && activeProvider.id === providerId) {
      setActiveProvider(freshProvider);
    }

    if (selectedProvider && selectedProvider.id === providerId) {
      setSelectedProvider(freshProvider);
    }

    if (changeProvider && changeProvider.id === providerId) {
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
      <>
        {Object.keys(groupedDates).map((monthKey) => {
          const daysInMonth = getDaysInMonth(monthKey);
          const startIndex = getMondayBasedStartIndex(monthKey);

          return (
            <div key={monthKey} style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "16px" }}>
              <h4>{getMonthLabel(monthKey)}</h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "6px",
                  textAlign: "center",
                }}
              >
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
                          padding: "8px",
                          borderRadius: "8px",
                          border: selectedDate === date ? "2px solid #8a6d00" : "1px solid #d6a700",
                          backgroundColor: selectedDate === date ? "#ffd84d" : "#fff36d",
                          color: "#6b5200",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                        title="Kivétel nap / nem dolgozik"
                      >
                        <div>{dayNumber}</div>
                        <small>Nem dolgozik</small>
                      </button>
                    );
                  }

                  if (!hasSlots) {
                    return (
                      <div
                        key={date}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
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
                        fontSize: "12px",
                      }
                    : {
                        backgroundColor: selectedDate === date ? "#75b82a" : "#e9f7df",
                        border: selectedDate === date ? "2px solid #1b5e20" : "1px solid #75b82a",
                        color: "#1b5e20",
                        fontSize: "14px",
                      };

                  return (
                    <button
                      key={date}
                      onClick={() => onSelectDate(date)}
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
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

              <p style={{ fontSize: "12px" }}>
                Zöld: van szabad időpont / piros: betelt / halvány szürke: nincs időpont / citromsárga: nem dolgozik
              </p>
            </div>
          );
        })}
      </>
    );
  }


  function normalizeGuestCode(code) {
    return code.trim().toUpperCase();
  }

  function isValidGuestCode(code) {
    return /^[A-Z0-9_-]{6,}$/.test(code);
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
      pin: providerPin,
      guestCode: normalizedGuestCode,
      workDays: [],
      workStart: "08:00",
      workEnd: "16:00",
      slotLength: 60,
      weeksAhead: 4,
      exceptionDates: [],
      services: [],
      blockedEmails: [],
      slots: [],
      notifications: [],
    };

    setProviders([...providers, newProvider]);

    const { error } = await supabase.from("szolgaltatok").insert([
      {
        nev: providerName,
        profilnev: "",
        email: providerEmail,
        pin: providerPin,
        vendegkod: normalizedGuestCode,
      },
    ]);

    if (error) {
      console.error(error);
      alert("A szolgáltató helyben létrejött, de Supabase-be nem sikerült menteni. Nézd meg a Console hibát.");
    } else {
      alert(`Szolgáltató létrehozva és Supabase-be is elmentve!\nNév: ${providerName}\nBelépési email: ${providerEmail}\nPIN: ${providerPin}\nVendégkód: ${normalizedGuestCode}`);
    }

    setProviderName("");
    setProviderEmail("");
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
      pin: row.pin || "",
      guestCode: row.vendegkod || "",
      workDays: [],
      workStart: "08:00",
      workEnd: "16:00",
      slotLength: 60,
      weeksAhead: 4,
      exceptionDates: [],
      services: [],
      blockedEmails: [],
      slots: [],
      notifications: [],
    };
  }

  async function providerLogin() {
    const loginEmail = (loginUsername || "").trim();
    const loginEmailLower = loginEmail.toLowerCase();
    const loginPinValue = (loginPin || "").trim();

    let found = providers.find(
      (p) => (p.email || "").toLowerCase() === loginEmailLower && p.pin === loginPinValue
    );

    if (!found) {
      const { data, error } = await supabase
        .from("szolgaltatok")
        .select("*")
        .ilike("email", loginEmail)
        .eq("pin", loginPinValue)
        .maybeSingle();

      if (error) {
        console.error(error);
        alert("Supabase bejelentkezési hiba. Nézd meg a Console hibát.");
        return;
      }

      if (data) {
        found = mapSupabaseProvider(data);

        setProviders((currentProviders) => {
          const alreadyExists = currentProviders.some(
            (provider) => (provider.email || "").toLowerCase() === (found.email || "").toLowerCase()
          );

          return alreadyExists ? currentProviders : [...currentProviders, found];
        });
      }
    }

    if (!found) {
      alert("Hibás email cím vagy PIN.");
      return;
    }

    const normalizedProvider = {
      ...found,
      slots: Array.isArray(found.slots) ? found.slots : [],
      notifications: Array.isArray(found.notifications) ? found.notifications : [],
      services: Array.isArray(found.services) ? found.services : [],
      exceptionDates: Array.isArray(found.exceptionDates) ? found.exceptionDates : [],
      blockedEmails: Array.isArray(found.blockedEmails) ? found.blockedEmails : [],
    };

    setActiveProvider(normalizedProvider);
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
      providers.find((p) => p.id === message.providerId) ||
      selectedProvider ||
      activeProvider;

    const guest =
      options.guest ||
      guests.find((g) => g.id === message.guestId) ||
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
    };

    setGuests([...guests, newGuest]);

    const { error } = await supabase.from("vendegek").insert([
      {
        nev: guestName,
        email: guestEmail,
        telefon: guestPhone,
        pin: guestPin,
      },
    ]);

    if (error && String(error.message || "").toLowerCase().includes("telefon")) {
      console.warn("A vendegek.telefon oszlop még nem létezik, ezért telefonszám nélkül mentem.", error);

      const { error: fallbackError } = await supabase.from("vendegek").insert([
        {
          nev: guestName,
          email: guestEmail,
          pin: guestPin,
        },
      ]);

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
    };
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

    let found = guests.find(
      (g) => (g.email || "").toLowerCase() === loginEmailLower && g.pin === loginPinValue
    );

    if (!found) {
      const { data, error } = await supabase
        .from("vendegek")
        .select("*")
        .ilike("email", loginEmail)
        .eq("pin", loginPinValue)
        .maybeSingle();

      if (error) {
        console.error(error);
        alert("Supabase vendég bejelentkezési hiba. Nézd meg a Console hibát.");
        return;
      }

      if (data) {
        found = mapSupabaseGuest(data);

        setGuests((currentGuests) => {
          const alreadyExists = currentGuests.some(
            (guest) => (guest.email || "").toLowerCase() === (found.email || "").toLowerCase()
          );

          return alreadyExists ? currentGuests : [...currentGuests, found];
        });
      }
    }

    if (!found) {
      alert("Hibás vendég email vagy PIN.");
      return;
    }

    const normalizedGuest = {
      ...found,
      providerIds: Array.isArray(found.providerIds) ? found.providerIds : [],
      notifications: Array.isArray(found.notifications) ? found.notifications : [],
    };

    setActiveGuest(normalizedGuest);
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

    const updatedProviders = providers.map((provider) =>
      provider.id === activeProvider.id
        ? { ...provider, exceptionDates: [...currentExceptions, exceptionDate] }
        : provider
    );

    setProviders(updatedProviders);
    setActiveProvider(updatedProviders.find((p) => p.id === activeProvider.id));
    setExceptionDate("");

    const providerDbId = await getSupabaseProviderId(activeProvider);

    if (providerDbId) {
      const { error } = await supabase.from("kivetel_napok").insert([
        {
          szolgaltato_id: providerDbId,
          datum: exceptionDate,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Kivétel nap hozzáadva helyben, de Supabase-be nem sikerült menteni.");
        return;
      }

      alert("Kivétel nap hozzáadva és Supabase-be is elmentve.");
      return;
    }

    alert("Kivétel nap hozzáadva helyben. Supabase mentéshez jelentkezz be Supabase-ben létező szolgáltatóval.");
  }

  function removeExceptionDate(dateToRemove) {
    if (!activeProvider) return;

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
      (booking) => booking.active && booking.providerId === provider.id
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
      bookedSlots: providerSlots.filter((slot) => slot && slot.booked).length,
      blockedGuests: Array.isArray(provider.blockedEmails) ? provider.blockedEmails.length : 0,
      unreadLikeMessages: providerMessages.filter((message) => message.from === "guest").length,
      nextBooking: sortedUpcomingBookings[0] || null,
    };
  }

  function renderProviderStats(provider) {
    const stats = getProviderStats(provider);
    const statCards = [
      { key: "registeredGuests", label: "Regisztrált vendégek", value: stats.registeredGuests },
      { key: "activeBookings", label: "Aktív foglalások", value: stats.activeBookings },
      { key: "todayBookings", label: "Mai foglalások", value: stats.todayBookings },
      { key: "upcomingBookings", label: "Jövőbeli foglalások", value: stats.upcomingBookings },
      { key: "freeSlots", label: "Szabad időpontok", value: stats.freeSlots },
      { key: "bookedSlots", label: "Foglalt időpontok", value: stats.bookedSlots },
      { key: "blockedGuests", label: "Letiltott vendégek", value: stats.blockedGuests },
      { key: "guestMessages", label: "Vendégüzenetek", value: stats.unreadLikeMessages },
    ];

    return (
      <div style={{ border: "1px solid #75b82a", borderRadius: "10px", padding: "12px", marginTop: "16px", marginBottom: "16px", backgroundColor: "#f8fff3" }}>
        <h3>Áttekintés</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          {statCards.map((card) => {
            const active = providerOverviewPanel === card.key;

            return (
              <button
                key={card.key}
                onClick={() => setProviderOverviewPanel(active ? "" : card.key)}
                style={{
                  border: active ? "2px solid #1b5e20" : "1px solid #d6eac8",
                  borderRadius: "10px",
                  padding: "10px",
                  backgroundColor: active ? "#e9f7df" : "white",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                title="Részletek megnyitása"
              >
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#1b5e20" }}>{card.value}</div>
                <div style={{ fontSize: "12px", color: "#555" }}>{card.label}</div>
              </button>
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

        {renderProviderOverviewPanel(provider, providerOverviewPanel)}
      </div>
    );
  }

  function renderProviderOverviewPanel(provider, panel) {
    if (!provider || !panel) return null;

    const todayText = formatDate(new Date());
    const providerBookings = guestBookings
      .filter((booking) => booking.active && booking.providerId === provider.id)
      .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
    const providerSlots = Array.isArray(provider.slots) ? provider.slots : [];
    const guestMessages = getMessagesForProvider(provider.id).filter((message) => message.from === "guest");

    const panelBoxStyle = {
      border: "1px solid #d6eac8",
      borderRadius: "10px",
      padding: "12px",
      marginTop: "14px",
      backgroundColor: "white",
      textAlign: "left",
    };

    const smallCardStyle = {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "8px",
      margin: "8px 0",
      backgroundColor: "#fafafa",
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
      return renderBookingList("Aktív foglalások", providerBookings);
    }

    if (panel === "todayBookings") {
      return renderBookingList("Mai foglalások", providerBookings.filter((booking) => booking.date === todayText));
    }

    if (panel === "upcomingBookings") {
      return renderBookingList("Jövőbeli foglalások", providerBookings.filter((booking) => booking.date && booking.date >= todayText));
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
      const bookedSlots = providerSlots
        .filter((slot) => slot && slot.booked)
        .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));

      return (
        <div style={panelBoxStyle}>
          <h4 style={{ marginTop: 0 }}>Foglalt időpontok</h4>
          {bookedSlots.length === 0 && <p>Nincs foglalt időpont.</p>}
          {bookedSlots.map((slot) => (
            <div key={slot.id} style={smallCardStyle}>
              <b>{slot.bookedBy || "Vendég"}</b> — {formatDateHu(slot.date)} {slot.time}
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
                </>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (panel === "blockedGuests") {
      return (
        <div style={panelBoxStyle}>
          <h4 style={{ marginTop: 0 }}>Letiltott vendégek</h4>
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
                <button onClick={() => unblockGuestEmail(email)} style={{ marginTop: "8px" }}>
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
          <h4 style={{ marginTop: 0 }}>Vendégüzenetek</h4>
          {guestMessages.length === 0 && <p>Nincs vendégtől érkezett üzenet.</p>}
          {guestMessages.map((message) => (
            <div key={message.id} style={smallCardStyle}>
              <b>{message.fromName || "Vendég"}</b>
              {message.date && message.time && <> — {formatDateHu(message.date)} {message.time}</>}
              <br />
              {message.type === "cancel" && <b>Lemondási üzenet</b>}
              {message.type === "cancel" && <br />}
              Üzenet: {message.text}
            </div>
          ))}
        </div>
      );
    }

    return null;
  }

  function getRegisteredGuestsForProvider(providerId) {
    if (!providerId) return [];

    return guests
      .filter((guest) => Array.isArray(guest.providerIds) && guest.providerIds.includes(providerId))
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", "hu"));
  }


  function getGuestBookingsForProvider(providerId, guest) {
    if (!providerId || !guest) return [];

    const guestEmailValue = normalizeEmail(guest.email);

    return guestBookings
      .filter((booking) => {
        if (!booking || booking.providerId !== providerId || !booking.active) return false;
        if (booking.guestId && booking.guestId === guest.id) return true;
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
            <p>Telefon: <b>{selectedGuest.phone || "nincs megadva"}</b></p>

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

    if (activeGuest.providerIds.includes(foundProvider.id)) {
      alert("Ez a szolgáltató már hozzá van adva.");
      return;
    }

    const updatedGuests = guests.map((g) =>
      g.id === activeGuest.id
        ? { ...g, providerIds: [...g.providerIds, foundProvider.id] }
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

    if (guestAlreadyHasBookingOnDate(selectedProvider.id, activeGuest.email, selectedSlot.date)) {
      alert("Erre a napra már van aktív foglalásod ennél a szolgáltatónál. Módosítani tudod a meglévő időpontodat, de újabbat nem foglalhatsz ugyanarra a napra.");
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

    const freshProvider = updatedProviders.find((p) => p.id === selectedProvider.id);
    setSelectedProvider(freshProvider);

    if (activeProvider && activeProvider.id === selectedProvider.id) {
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
    const provider = providers.find((p) => p.id === booking.providerId);

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

  async function confirmChangeBooking(booking) {
    if (!activeGuest || !changeProvider || !changeSlot) {
      alert("Válassz új időpontot.");
      return;
    }

    if (isSlotInPast(changeSlot)) {
      alert("Ez az időpont már elmúlt, ezért nem választható.");
      setChangeSlot(null);
      return;
    }

    if (isGuestBlockedByProvider(changeProvider, activeGuest.email)) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz nála időpontot módosítani.");
      return;
    }

    const blockedInSupabase = await isGuestBlockedInSupabase(changeProvider, activeGuest.email);

    if (blockedInSupabase) {
      alert("Ez a szolgáltató letiltott téged, ezért nem tudsz nála időpontot módosítani.");
      return;
    }

    const alreadyHasAnotherBookingOnDate = guestBookings.some(
      (otherBooking) =>
        otherBooking.active &&
        otherBooking.id !== booking.id &&
        otherBooking.providerId === booking.providerId &&
        otherBooking.date === changeSlot.date &&
        (otherBooking.guestEmail || "").toLowerCase() === (activeGuest.email || "").toLowerCase()
    );

    if (alreadyHasAnotherBookingOnDate) {
      alert("Erre a napra már van másik aktív foglalásod ennél a szolgáltatónál.");
      return;
    }

    const oldText = `${booking.date} ${booking.time}`;
    const newText = `${changeSlot.date} ${changeSlot.time}`;

    const updatedProviders = providers.map((provider) =>
      provider.id === booking.providerId
        ? {
            ...provider,
            slots: provider.slots.map((slot) => {
              if (slot.id === booking.slotId) {
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

              if (slot.id === changeSlot.id) {
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
      b.id === booking.id
        ? {
            ...b,
            slotId: changeSlot.id,
            oldDate: b.date,
            oldTime: b.time,
            date: changeSlot.date,
            day: changeSlot.day,
            time: changeSlot.time,
            changed: true,
          }
        : b
    );

    setProviders(updatedProviders);
    setGuestBookings(updatedBookings);
    refreshProviderViews(updatedProviders, booking.providerId);

    const oldSlotForSupabase = changeProvider.slots.find((slot) => slot.id === booking.slotId) || {
      id: booking.slotId,
      date: booking.date,
      time: booking.time,
    };

    const supabaseChangeResult = await syncBookingChangeToSupabase(
      booking,
      changeProvider,
      oldSlotForSupabase,
      changeSlot
    );

    const changeEmailResult = await sendBookingChangedEmails({
      booking,
      provider: changeProvider,
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

    if (supabaseChangeResult.ok) {
      alert(`Időpont módosítva és Supabase-ben is frissítve.${emailSuffix}`);
    } else {
      alert(`Időpont módosítva helyben. Figyelem: Supabase-ben nem sikerült teljesen frissíteni.${emailSuffix}`);
    }
  }

  async function cancelBookingByGuest(booking) {
    if (!confirm("Biztosan lemondod ezt az időpontot?")) return;

    const providerForSupabase = providers.find((provider) => provider.id === booking.providerId);
    const slotForSupabase = providerForSupabase && Array.isArray(providerForSupabase.slots)
      ? providerForSupabase.slots.find((slot) => slot.id === booking.slotId)
      : {
          id: booking.slotId,
          date: booking.date,
          time: booking.time,
        };

    const updatedProviders = providers.map((provider) =>
      provider.id === booking.providerId
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
      b.id === booking.id
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

    setProviders(updatedProviders);
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

    if (selectedProvider && selectedProvider.id === activeProvider.id) {
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


  function getMessagesForProvider(providerId) {
    return messages
      .filter((message) => message.providerId === providerId)
      .sort((a, b) => b.id - a.id);
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

  async function sendGuestMessageToProvider(booking) {
    if (!activeGuest || !booking.providerId) return;

    const provider = providers.find((p) => p.id === booking.providerId);

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
      provider.id === booking.providerId
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
      booking.providerId === activeProvider.id &&
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

    if (!confirm("Biztosan törlöd a szolgáltatói fiókodat? Ez törli a Supabase-ből is a hozzá tartozó időpontokat, foglalásokat, üzeneteket, tiltásokat és vendégkapcsolatokat.")) return;

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
        { table: "idopontok", column: "szolgaltato_id" },
      ];

      for (const step of deleteSteps) {
        const { error } = await supabase
          .from(step.table)
          .delete()
          .eq(step.column, providerDbId);

        if (error) {
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
      providerIds: (g.providerIds || []).filter((id) => id !== providerToDelete.id),
      notifications: (g.notifications || []).filter((notification) => notification.providerId !== providerToDelete.id),
    }));
    const updatedBookings = guestBookings.filter((b) => b.providerId !== providerToDelete.id);
    const updatedMessages = messages.filter((message) => message.providerId !== providerToDelete.id);

    setProviders(updatedProviders);
    setGuests(updatedGuests);
    setGuestBookings(updatedBookings);
    setMessages(updatedMessages);

    setActiveProvider(null);
    setSelectedProvider(null);
    setSelectedSlot(null);
    setProviderCalendarDate("");
    setShowProviderNotifications(false);

    alert(providerDbId ? "A szolgáltatói fiók helyben és Supabase-ből is törölve lett." : "A szolgáltatói fiók helyben törölve lett.");
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
      notifications: (provider.notifications || []).filter((notification) => notification.guestId !== guestToDelete.id),
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
        booking.guestId !== guestToDelete.id &&
        normalizeEmail(booking.guestEmail) !== guestEmailValue
    );
    const updatedMessages = messages.filter(
      (message) =>
        message.guestId !== guestToDelete.id &&
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

    alert(guestDbId ? "A vendég fiók helyben és Supabase-ből is törölve lett." : "A vendég fiók helyben törölve lett.");
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
      .filter((booking) => booking.providerId === fullProvider.id)
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
    ? providers.filter((p) => activeGuest.providerIds.includes(p.id))
    : [];

  const activeGuestBookings = activeGuest
    ? guestBookings.filter((b) => b.guestId === activeGuest.id && b.active)
    : [];

  const cancelledGuestBookings = activeGuest
    ? guestBookings.filter((b) => b.guestId === activeGuest.id && b.cancelledByProvider)
    : [];

  return (
    <div style={{ maxWidth: "760px", margin: "30px auto", fontFamily: "Arial", padding: "20px" }}>
      <h1>Időpont Foglaló</h1>

      {!mode && (
        <>
          <h2>Mit szeretnél?</h2>

          <button onClick={() => setMode("createProvider")}>Szolgáltató regisztráció</button>
          <br /><br />

          <button onClick={() => setMode("providerLogin")}>Szolgáltató belépés</button>
          <br /><br />

          <button onClick={() => setMode("forgotProvider")}>Elfelejtett szolgáltatói belépés</button>
          <br /><br />

          <button onClick={() => setMode("createGuest")}>Vendég regisztráció</button>
          <br /><br />

          <button onClick={() => setMode("guestLogin")}>Vendég belépés</button>
          <br /><br />

          <button onClick={() => setMode("forgotGuest")}>Elfelejtett vendég belépés</button>
          <br /><br />

          <button onClick={generateBigStressTestData}>Nagy stresszteszt generálása</button>
          {renderTestAccessData()}
          <br /><br />

          <button onClick={clearAllData}>Helyi tesztadatok teljes törlése</button>
          <br /><br />

          <button onClick={clearSupabaseTestData}>Supabase tesztadatok törlése</button>
        </>
      )}


      {mode === "forgotProvider" && (
        <>
          <h2>Elfelejtett szolgáltatói belépés</h2>
          <p>Add meg a regisztrált email címed. Teszt módban az app megmutatja az adatokat, élesben emailben küldené ki.</p>

          <input
            placeholder="Szolgáltatói email cím"
            value={forgotProviderEmail}
            onChange={(e) => setForgotProviderEmail(e.target.value)}
          />

          <br /><br />

          <button onClick={recoverProviderLogin}>Belépési adatok megmutatása</button>

          <br /><br />
          <button onClick={() => setMode("")}>Vissza</button>
        </>
      )}

      {mode === "forgotGuest" && (
        <>
          <h2>Elfelejtett vendég belépés</h2>
          <p>Add meg a regisztrált email címed. Teszt módban az app megmutatja az adatokat, élesben emailben küldené ki.</p>

          <input
            placeholder="Vendég email cím"
            value={forgotGuestEmail}
            onChange={(e) => setForgotGuestEmail(e.target.value)}
          />

          <br /><br />

          <button onClick={recoverGuestLogin}>Belépési adatok megmutatása</button>

          <br /><br />
          <button onClick={() => setMode("")}>Vissza</button>
        </>
      )}

      {mode === "createProvider" && (
        <>
          <h2>Szolgáltató regisztráció</h2>

          <input placeholder="Név, pl. Maris Körmös" value={providerName} onChange={(e) => setProviderName(e.target.value)} />
          <p>Ez a név fog megjelenni a vendégeknek.</p>

          <input placeholder="Email cím" value={providerEmail} onChange={(e) => setProviderEmail(e.target.value)} />
          <p>Ezzel az email címmel tudsz belépni és később belépési adatot visszaállítani.</p>

          <input placeholder="4 jegyű saját PIN" value={providerPin} onChange={(e) => setProviderPin(e.target.value)} maxLength="4" />
          <p><b>Fontos:</b> jegyezd meg vagy írd fel ezt a PIN-t.</p>

          <input
            placeholder="Vendégkód, pl. MARIS-2026"
            value={guestCode}
            onChange={(e) => setGuestCode(e.target.value.toUpperCase())}
          />
          <p>Ezt a kódot adod meg a vendégeidnek. Legalább 6 karakter, lehet betű, szám, kötőjel vagy aláhúzás.</p>

          <button onClick={createProvider}>Regisztráció</button>
          <br /><br />
          <button onClick={() => setMode("")}>Vissza</button>
        </>
      )}

      {mode === "providerLogin" && (
        <>
          <h2>Szolgáltató belépés</h2>

          {!activeProvider && (
            <>
              <input placeholder="Email cím" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
              <br /><br />
              <input placeholder="4 jegyű PIN" value={loginPin} onChange={(e) => setLoginPin(e.target.value)} maxLength="4" />
              <br /><br />
              <button onClick={providerLogin}>Belépés</button>
            </>
          )}

          {activeProvider && (
            <>
              <h2>{activeProvider.name}</h2>
              <p>Email: <b>{activeProvider.email || "nincs megadva"}</b></p>
              <p>Vendégkód: <b>{activeProvider.guestCode}</b></p>

              {renderProviderStats(activeProvider)}

              <h3>Időpontok és foglalások</h3>

              <h4>Válassz napot</h4>
              {renderProviderCalendar(activeProvider, providerCalendarDate, (date) => {
                setProviderCalendarDate(date);
              })}

              {providerCalendarDate && (
                <>
                  <h4>Időpontok ezen a napon: {formatDateHu(providerCalendarDate)}</h4>

                  {getSlotsForDate(activeProvider, providerCalendarDate).map((slot) => (
                    <div key={slot.id} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
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
                            style={{ width: "80%" }}
                          />

                          <br /><br />

                          <button onClick={() => sendProviderMessageToGuest(slot)}>
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
                            style={{ width: "80%" }}
                          />

                          <br /><br />

                          <button onClick={() => cancelBookingByProvider(slot)}>
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

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowProviderGuestCodeEdit(!showProviderGuestCodeEdit)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showProviderGuestCodeEdit ? "Vendégkód módosítás bezárása" : "Vendégkód módosítása"}
                </button>

                {showProviderGuestCodeEdit && (
                  <div style={{ marginTop: "12px" }}>
                    <input
                      placeholder="Új vendégkód, pl. MARIS-2026"
                      value={newGuestCode}
                      onChange={(e) => setNewGuestCode(e.target.value.toUpperCase())}
                    />
                    <p>Legalább 6 karakter. A már csatlakozott vendégek megmaradnak.</p>
                    <button onClick={changeProviderGuestCode}>
                      Vendégkód mentése
                    </button>
                  </div>
                )}
              </div>

              <div style={{ margin: "14px 0" }}>
                <button
                  onClick={() => setShowProviderPinEdit(!showProviderPinEdit)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showProviderPinEdit ? "PIN módosítás bezárása" : "Saját PIN módosítása"}
                </button>

                {showProviderPinEdit && (
                  <div style={{ border: "1px solid #ddd", padding: "10px", margin: "12px auto", maxWidth: "560px", borderRadius: "8px", backgroundColor: "#fafafa" }}>
                    <h3>Saját PIN módosítása</h3>
                    <p style={{ marginTop: 0 }}>Itt tudod módosítani a szolgáltatói belépési PIN-kódodat. Sikeres módosítás után Supabase-ben is frissül.</p>
                    <input
                      placeholder="Jelenlegi PIN"
                      value={providerCurrentPin}
                      onChange={(e) => setProviderCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={{ marginRight: "8px", marginBottom: "8px" }}
                    />
                    <input
                      placeholder="Új PIN"
                      value={providerNewPin}
                      onChange={(e) => setProviderNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={{ marginRight: "8px", marginBottom: "8px" }}
                    />
                    <input
                      placeholder="Új PIN még egyszer"
                      value={providerNewPinAgain}
                      onChange={(e) => setProviderNewPinAgain(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength="4"
                      style={{ marginRight: "8px", marginBottom: "8px" }}
                    />
                    <button onClick={changeProviderPin}>PIN módosítása</button>
                  </div>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowProviderMessages(!showProviderMessages)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showProviderMessages
                    ? `Üzenetek elrejtése (${getMessagesForProvider(activeProvider.id).length})`
                    : `Üzenetek megnyitása (${getMessagesForProvider(activeProvider.id).length})`}
                </button>

                {showProviderMessages && (
                  <>
                    <h3>Üzeneteim</h3>

                    {getMessagesForProvider(activeProvider.id).length === 0 && <p>Még nincs üzenet.</p>}

                    {getMessagesForProvider(activeProvider.id).map((message) => (
                      <div key={message.id} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "8px" }}>
                        <b>{message.from === "guest" ? `Vendégtől: ${message.fromName}` : `Tőled: ${message.toName} részére`}</b>
                        <br />
                        Időpont: {message.date} {message.time}
                        <br />
                        {message.type === "cancel" && <b>Lemondási üzenet</b>}
                        <br />
                        Üzenet: {message.text}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowProviderNotifications(!showProviderNotifications)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showProviderNotifications
                    ? `Értesítések elrejtése (${(activeProvider.notifications || []).length})`
                    : `Értesítések megnyitása (${(activeProvider.notifications || []).length})`}
                </button>

                {showProviderNotifications && (
                  <>
                    <h3>Értesítések</h3>

                    {(activeProvider.notifications || []).length === 0 && <p>Még nincs értesítés.</p>}

                    {(activeProvider.notifications || []).map((n) => (
                      <div key={n.id} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "8px" }}>
                        <b>{n.text}</b>
                        {n.service && (
                          <>
                            <br />
                            Szolgáltatás: {n.service}
                          </>
                        )}
                        {n.note && (
                          <>
                            <br />
                            Megjegyzés / üzenet: {n.note}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowProviderServices(!showProviderServices)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showProviderServices ? "Szolgáltatások elrejtése" : `Szolgáltatások kezelése (${(activeProvider.services || []).length})`}
                </button>

                {showProviderServices && (
                  <>
                    <h3>Szolgáltatások</h3>

                    <input
                      placeholder="Pl. Műköröm töltés"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                    />
                    <button onClick={addService} style={{ marginLeft: "10px" }}>Hozzáadás</button>

                    {(activeProvider.services || []).length === 0 && <p>Még nincs szolgáltatás megadva. A vendég így is tud foglalni megjegyzéssel.</p>}

                    {(activeProvider.services || []).map((service) => (
                      <div key={service} style={{ margin: "6px 0" }}>
                        <b>{service}</b>
                        <button onClick={() => removeService(service)} style={{ marginLeft: "10px" }}>Törlés</button>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowProviderBlockedGuests(!showProviderBlockedGuests)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showProviderBlockedGuests
                    ? `Letiltott vendégek elrejtése (${(activeProvider.blockedEmails || []).length})`
                    : `Letiltott vendégek megnyitása (${(activeProvider.blockedEmails || []).length})`}
                </button>

                {showProviderBlockedGuests && (
                  <>
                    <h3>Letiltott vendégek</h3>

                    {(activeProvider.blockedEmails || []).length === 0 && <p>Nincs letiltott vendég.</p>}

                    {(activeProvider.blockedEmails || []).map((email) => (
                      <div key={email} style={{ margin: "6px 0" }}>
                        <b>{email}</b>
                        <button onClick={() => unblockGuestEmail(email)} style={{ marginLeft: "10px" }}>
                          Tiltás feloldása
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowProviderScheduleSettings(!showProviderScheduleSettings)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
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
                    <input type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />

                    <p>Munkaidő vége:</p>
                    <input type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />

                    <p>Időpont hossza:</p>
                    <select value={slotLength} onChange={(e) => setSlotLength(e.target.value)}>
                      <option value="15">15 perc</option>
                      <option value="30">30 perc</option>
                      <option value="45">45 perc</option>
                      <option value="60">60 perc</option>
                      <option value="90">90 perc</option>
                    </select>

                    <p>Hány hétre előre generáljon időpontokat?</p>
                    <select value={weeksAhead} onChange={(e) => setWeeksAhead(e.target.value)}>
                      <option value="1">1 hét</option>
                      <option value="2">2 hét</option>
                      <option value="4">4 hét</option>
                      <option value="8">8 hét</option>
                      <option value="12">12 hét</option>
                    </select>

                    <h3>Kivétel napok / szabadnapok</h3>

                    <input type="date" value={exceptionDate} onChange={(e) => setExceptionDate(e.target.value)} />
                    <button onClick={addExceptionDate} style={{ marginLeft: "10px" }}>Kivétel nap hozzáadása</button>

                    {(activeProvider.exceptionDates || []).length === 0 && <p>Nincs kivétel nap megadva.</p>}

                    {(activeProvider.exceptionDates || []).map((date) => (
                      <div key={date} style={{ margin: "6px 0" }}>
                        <b>{date}</b>
                        <button onClick={() => removeExceptionDate(date)} style={{ marginLeft: "10px" }}>
                          Törlés
                        </button>
                      </div>
                    ))}

                    <br /><br />
                    <button onClick={generateSlots}>Időpontok generálása</button>
                  </>
                )}
              </div>

              <br />
              <button onClick={() => setActiveProvider(null)}>Kijelentkezés</button>

              <br /><br />

              <button onClick={deleteProviderAccount} style={{ backgroundColor: "red", color: "white", padding: "10px" }}>
                Szolgáltatói fiók törlése
              </button>
            </>
          )}

          <br /><br />
          <button onClick={() => setMode("")}>Vissza</button>
        </>
      )}

      {mode === "createGuest" && (
        <>
          <h2>Vendég regisztráció</h2>

          <input placeholder="Vendég neve" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
          <br /><br />

          <input placeholder="Email cím" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
          <p>Erre az email címre lehet majd elküldeni az elfelejtett belépési adatokat.</p>

          <input placeholder="Telefonszám, pl. +43..." value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
          <br /><br />

          <input placeholder="4 jegyű vendég PIN" value={guestPin} onChange={(e) => setGuestPin(e.target.value)} maxLength="4" />
          <p><b>Fontos:</b> a belépéshez az email címed és a PIN-ed kell.</p>

          <button onClick={createGuest}>Vendég létrehozása</button>

          <br /><br />
          <button onClick={() => setMode("")}>Vissza</button>
        </>
      )}

      {mode === "guestLogin" && (
        <>
          <h2>Vendég belépés</h2>

          {!activeGuest && (
            <>
              <input
                placeholder="Email cím"
                value={guestLoginEmail}
                onChange={(e) => setGuestLoginEmail(e.target.value)}
              />

              <br /><br />

              <input
                placeholder="4 jegyű vendég PIN"
                value={guestLoginPin}
                onChange={(e) => setGuestLoginPin(e.target.value)}
                maxLength="4"
              />

              <br /><br />

              <button onClick={guestLogin}>Belépés</button>
            </>
          )}

          {activeGuest && (
            <>
              <h2>Belépve: {activeGuest.name}</h2>
              {activeGuest.email && <p>Email: {activeGuest.email}</p>}
              {activeGuest.phone && <p>Telefonszám: {activeGuest.phone}</p>}

              <div style={{ margin: "12px 0" }}>
                <button
                  onClick={() => setShowGuestPhoneEdit(!showGuestPhoneEdit)}
                  style={{ padding: "8px 12px", marginRight: "8px", cursor: "pointer" }}
                >
                  {showGuestPhoneEdit ? "Telefonszám módosítás bezárása" : "Telefonszám módosítása"}
                </button>

                <button
                  onClick={() => setShowGuestPinEdit(!showGuestPinEdit)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showGuestPinEdit ? "PIN módosítás bezárása" : "Saját PIN módosítása"}
                </button>
              </div>

              {showGuestPhoneEdit && (
                <div style={{ border: "1px solid #ddd", padding: "10px", margin: "12px auto", maxWidth: "520px", borderRadius: "8px", backgroundColor: "#fafafa" }}>
                  <h3>Telefonszám módosítása</h3>
                  <p style={{ marginTop: 0 }}>Nem kötelező, de a szolgáltató így könnyebben elérhet.</p>
                  <input
                    placeholder="Telefonszám, pl. +43..."
                    value={editableGuestPhone}
                    onChange={(e) => setEditableGuestPhone(e.target.value)}
                    style={{ width: "70%", padding: "6px" }}
                  />
                  <button onClick={updateActiveGuestPhone} style={{ marginLeft: "8px" }}>
                    Telefonszám mentése
                  </button>
                </div>
              )}

              {showGuestPinEdit && (
                <div style={{ border: "1px solid #ddd", padding: "10px", margin: "12px auto", maxWidth: "520px", borderRadius: "8px", backgroundColor: "#fafafa" }}>
                  <h3>Saját PIN módosítása</h3>
                  <p style={{ marginTop: 0 }}>Itt tudod módosítani a vendég belépési PIN-kódodat. Sikeres módosítás után Supabase-ben is frissül.</p>
                  <input
                    placeholder="Jelenlegi PIN"
                    value={guestCurrentPin}
                    onChange={(e) => setGuestCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength="4"
                    style={{ marginRight: "8px", marginBottom: "8px" }}
                  />
                  <input
                    placeholder="Új PIN"
                    value={guestNewPin}
                    onChange={(e) => setGuestNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength="4"
                    style={{ marginRight: "8px", marginBottom: "8px" }}
                  />
                  <input
                    placeholder="Új PIN még egyszer"
                    value={guestNewPinAgain}
                    onChange={(e) => setGuestNewPinAgain(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength="4"
                    style={{ marginRight: "8px", marginBottom: "8px" }}
                  />
                  <button onClick={changeGuestPin}>PIN módosítása</button>
                </div>
              )}

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowGuestProviderAdd(!showGuestProviderAdd)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showGuestProviderAdd ? "Szolgáltató hozzáadás bezárása" : "Szolgáltató hozzáadása vendégkóddal"}
                </button>

                {showGuestProviderAdd && (
                  <div style={{ marginTop: "12px" }}>
                    <input
                      placeholder="Szolgáltató vendégkódja"
                      value={guestProviderCode}
                      onChange={(e) => setGuestProviderCode(e.target.value.toUpperCase())}
                    />

                    <button onClick={addProviderToGuest} style={{ marginLeft: "10px" }}>
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
                  style={{ display: "block", margin: "8px auto", padding: "10px" }}
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
                      <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
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
                            display: "block",
                            margin: "8px auto",
                            padding: "10px",
                            backgroundColor: selectedSlot?.id === slot.id ? "#75b82a" : "white",
                          }}
                        >
                          {slot.time}
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
                        style={{ width: "100%", minHeight: "80px" }}
                      />
                      <br /><br />
                    </>
                  )}

                  <button onClick={bookSlot}>Időpont lefoglalása</button>
                </>
              )}

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowGuestBookings(!showGuestBookings)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showGuestBookings ? `Saját foglalások elrejtése (${activeGuestBookings.length})` : `Saját foglalásaim megnyitása (${activeGuestBookings.length})`}
                </button>

                {showGuestBookings && (
                  <>
                    <h3>Saját foglalásaim</h3>

                    {activeGuestBookings.length === 0 && <p>Nincs aktív foglalásod.</p>}

                    {activeGuestBookings.map((booking) => (
                      <div key={booking.id} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "8px" }}>
                        <b>{booking.providerName}</b>
                        <br />
                        {booking.date} — {booking.day} — {booking.time}
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
                            Módosítva. Régi időpont: {booking.oldDate} {booking.oldTime}
                          </>
                        )}

                        <br /><br />

                        <input
                          placeholder="Üzenet a szolgáltatónak"
                          value={guestMessageTexts[booking.id] || ""}
                          onChange={(e) =>
                            setGuestMessageTexts({
                              ...guestMessageTexts,
                              [booking.id]: e.target.value,
                            })
                          }
                          style={{ width: "80%" }}
                        />

                        <br /><br />

                        <button onClick={() => sendGuestMessageToProvider(booking)}>
                          Üzenet küldése a szolgáltatónak
                        </button>

                        <br /><br />

                        <button onClick={() => startChangeBooking(booking)}>Időpont módosítása</button>
                        <button onClick={() => cancelBookingByGuest(booking)} style={{ marginLeft: "10px" }}>
                          Időpont lemondása
                        </button>

                        {changeBookingId === booking.id && changeProvider && (
                          <div style={{ marginTop: "12px", borderTop: "1px solid #ddd", paddingTop: "8px" }}>
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
                                      display: "block",
                                      margin: "8px auto",
                                      padding: "10px",
                                      backgroundColor: changeSlot?.id === slot.id ? "#75b82a" : "white",
                                    }}
                                  >
                                    {slot.time}
                                  </button>
                                ))}
                              </>
                            )}

                            <p>Új kiválasztott időpont: {changeSlot ? `${formatDateHu(changeSlot.date)} ${changeSlot.time}` : "-"}</p>

                            <button onClick={() => confirmChangeBooking(booking)}>Módosítás mentése</button>
                            <button onClick={cancelChangeBooking} style={{ marginLeft: "10px" }}>Mégse</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowGuestCancelledBookings(!showGuestCancelledBookings)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showGuestCancelledBookings
                    ? `Lemondott időpontok elrejtése (${cancelledGuestBookings.length})`
                    : `Lemondott időpontok megnyitása (${cancelledGuestBookings.length})`}
                </button>

                {showGuestCancelledBookings && (
                  <>
                    <h3>Szolgáltató által lemondott időpontok</h3>

                    {cancelledGuestBookings.length === 0 && <p>Nincs lemondott időpont.</p>}

                    {cancelledGuestBookings.map((booking) => (
                      <div key={booking.id} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "8px" }}>
                        <b>{booking.providerName}</b>
                        <br />
                        Lemondott időpont: {booking.date} — {booking.day} — {booking.time}
                        {booking.providerCancelMessage && (
                          <>
                            <br />
                            Üzenet: {booking.providerCancelMessage}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowGuestNotifications(!showGuestNotifications)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showGuestNotifications
                    ? `Értesítések elrejtése (${(activeGuest.notifications || []).length})`
                    : `Értesítések megnyitása (${(activeGuest.notifications || []).length})`}
                </button>

                {showGuestNotifications && (
                  <>
                    <h3>Értesítéseim</h3>
                    {(activeGuest.notifications || []).length === 0 && <p>Nincs új értesítésed.</p>}

                    {(activeGuest.notifications || []).map((notification) => (
                      <div key={notification.id} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "8px" }}>
                        <b>{notification.text}</b>
                        {notification.message && (
                          <>
                            <br />
                            Üzenet: {notification.message}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ border: "1px solid #ddd", padding: "10px", margin: "16px 0", borderRadius: "8px" }}>
                <button
                  onClick={() => setShowGuestMessages(!showGuestMessages)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {showGuestMessages
                    ? `Üzenetek elrejtése (${getMessagesForGuest(activeGuest.id).length})`
                    : `Üzenetek megnyitása (${getMessagesForGuest(activeGuest.id).length})`}
                </button>

                {showGuestMessages && (
                  <>
                    <h3>Üzeneteim</h3>

                    {getMessagesForGuest(activeGuest.id).length === 0 && <p>Még nincs üzeneted.</p>}

                    {getMessagesForGuest(activeGuest.id).map((message) => (
                      <div key={message.id} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "8px" }}>
                        <b>{message.from === "provider" ? `Szolgáltatótól: ${message.fromName}` : `Tőled: ${message.toName} részére`}</b>
                        <br />
                        Időpont: {message.date} {message.time}
                        <br />
                        {message.type === "cancel" && <b>Lemondási üzenet</b>}
                        <br />
                        Üzenet: {message.text}
                      </div>
                    ))}
                  </>
                )}
              </div>


              <br />
              <button onClick={() => setActiveGuest(null)}>Vendég kijelentkezés</button>

              <br /><br />

              <button onClick={deleteGuestAccount} style={{ backgroundColor: "red", color: "white", padding: "10px" }}>
                Vendég fiók törlése
              </button>
            </>
          )}

          <br /><br />
          <button onClick={() => setMode("")}>Vissza</button>
        </>
      )}
    </div>
  );
}

export default App;
