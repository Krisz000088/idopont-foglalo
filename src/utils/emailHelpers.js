export function buildPlainTextEmail(lines) {
  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}

export function buildHtmlEmail(title, lines) {
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