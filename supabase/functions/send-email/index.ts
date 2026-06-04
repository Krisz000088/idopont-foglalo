import { Resend } from "npm:resend@4.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const emailFrom = Deno.env.get("EMAIL_FROM") || "Időpontfoglaló <onboarding@resend.dev>";

if (!resendApiKey) {
  console.error("Hiányzik a RESEND_API_KEY secret.");
}

const resend = new Resend(resendApiKey || "");

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Csak POST kérés engedélyezett." }, 405);
  }

  try {
    const body = await req.json();

    const to = String(body?.to || "").trim();
    const subject = String(body?.subject || "Időpontfoglaló értesítés").trim();
    const text = String(body?.text || "").trim();
    const html = String(body?.html || "").trim();

    if (!to) {
      return jsonResponse({ ok: false, error: "Hiányzik a címzett email címe." }, 400);
    }

    if (!resendApiKey) {
      return jsonResponse({ ok: false, error: "Hiányzik a RESEND_API_KEY secret." }, 500);
    }

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
    });

    if (error) {
      console.error("Resend email hiba:", error);
      return jsonResponse({ ok: false, error }, 500);
    }

    return jsonResponse({ ok: true, data });
  } catch (error) {
    console.error("send-email function hiba:", error);
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});