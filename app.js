const cfg = window.SITE_CONFIG || {};
const DATA_URL = "data/events.json";

function $(sel) { return document.querySelector(sel); }

function safeText(v, fallback = "") {
  return (typeof v === "string" && v.trim()) ? v.trim() : fallback;
}

function normalizeEvent(raw, index = 0) {
  const section = safeText(raw.section, "upcoming").toLowerCase();
  const status = safeText(raw.status, "active").toLowerCase();
  return {
    id: safeText(raw.id, `event-${index}`),
    section,
    status,
    title: safeText(raw.title, "Untitled event"),
    date: safeText(raw.date, ""),
    description: safeText(raw.description, ""),
    imageUrl: safeText(raw.imageUrl, ""),
    linkUrl: safeText(raw.linkUrl, ""),
    updatedAt: safeText(raw.updatedAt, "")
  };
}

async function loadEventData() {
  if (cfg.apiBaseUrl) {
    try {
      const res = await fetch(`${cfg.apiBaseUrl}?action=list`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        return Array.isArray(json.events) ? json.events.map(normalizeEvent) : [];
      }
    } catch (err) {
      console.warn("API load failed, falling back to local JSON.", err);
    }
  }

  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.events) ? json.events.map(normalizeEvent) : [];
  } catch (err) {
    console.warn("Local JSON load failed.", err);
    return [];
  }
}

function imgFallbackLabel(item) {
  return (item.title || "Event").slice(0, 32);
}

function thumbHtml(item) {
  if (item.imageUrl) {
    return `<div class="thumb" style="background-image: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(251, 113, 133, 0.18)), url('${item.imageUrl.replace(/'/g, "%27")}'); background-size: cover; background-position: center;">
      <span>${imgFallbackLabel(item)}</span>
    </div>`;
  }
  return `<div class="thumb"><span>${imgFallbackLabel(item)}</span></div>`;
}

function renderUpcoming(events) {
  const mount = $("#upcoming-events");
  const list = events
    .filter(e => e.status !== "deleted" && e.section === "upcoming")
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  $("#count-events").textContent = list.length;

  if (!list.length) {
    mount.innerHTML = `<article class="event-card"><div><div class="date-box">No events yet</div><h3>Add your first event</h3><p class="event-meta">Use the Google Form or edit data/events.json.</p></div></article>`;
    return;
  }

  mount.innerHTML = list.map(item => `
    <article class="event-card">
      <div>
        <div class="date-box">${item.date ? item.date : "Upcoming"}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="event-meta">${escapeHtml(item.description || "No description yet.")}</p>
      </div>
      <div class="contact-row">
        ${item.linkUrl ? `<a class="btn primary" href="${item.linkUrl}" target="_blank" rel="noreferrer">Open</a>` : `<a class="btn primary" href="#contact">Contact</a>`}
        <a class="btn ghost" href="#channel">Channel</a>
      </div>
    </article>
  `).join("");
}

function renderGallery(events) {
  const mount = $("#past-event-gallery");
  const list = events
    .filter(e => e.status !== "deleted" && e.section === "gallery")
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));

  $("#count-gallery").textContent = list.length;

  if (!list.length) {
    mount.innerHTML = `<article class="gallery-card"><div><div class="thumb"><span>Photo 1</span></div><h3>Add gallery photos</h3><p class="gallery-meta">Add a past event photo via the form or JSON file.</p></div></article>`;
    return;
  }

  mount.innerHTML = list.map(item => `
    <article class="gallery-card">
      <div>
        ${thumbHtml(item)}
        <h3>${escapeHtml(item.title)}</h3>
        <p class="gallery-meta">${escapeHtml(item.description || "No caption yet.")}</p>
      </div>
    </article>
  `).join("");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyConfig() {
  $("#hero-badge").textContent = cfg.heroBadge || "कवयित्री · लेखिका";
  $("#hero-title").innerHTML = cfg.heroTitleHtml || "Anusuya Sahu<br />अनुसुया साहू";
  $("#hero-lead").textContent = cfg.heroLead || "";
  $("#bio-text").textContent = cfg.bioText || "";
  $("#youtube-link").href = cfg.youtubeUrl || "#";
  $("#youtube-link-2").href = cfg.youtubeUrl || "#";
  $("#youtube-link-3").href = cfg.youtubeUrl || "#";
  $("#email-link").href = cfg.contactEmail ? `mailto:${cfg.contactEmail}` : "mailto:your-email@example.com";

  const formUrl = cfg.formUrl || "";
  const formButtons = ["#form-link", "#form-link-2"];
  formButtons.forEach(sel => {
    const el = $(sel);
    if (formUrl) {
      el.href = formUrl;
      el.style.display = "inline-flex";
    } else {
      el.href = "#contact";
      el.textContent = "Open Event Form";
    }
  });

  $("#institute h2").textContent = "संस्थान";
  $("#institute .sub").textContent = "Reference site includes an institute section describing literary, cultural, and social activity.";
  $("#institute .institute-card h3").textContent = cfg.instituteTitle || "विश्व साहित्य संस्थान — सिंगापुर";
  $("#institute .institute-card .tiny").textContent = cfg.instituteText || "";

  const works = Array.isArray(cfg.works) ? cfg.works : [];
  const worksMount = document.querySelector("#works .grid-3");
  if (works.length === 3 && worksMount) {
    worksMount.innerHTML = works.map(item => `
      <article class="works-card">
        <div class="pill">${escapeHtml(item.pill || "")}</div>
        <h3>${escapeHtml(item.title || "")}</h3>
        <p class="tiny">${escapeHtml(item.text || "")}</p>
      </article>
    `).join("");
  }
}

async function init() {
  applyConfig();
  $("#year").textContent = new Date().getFullYear();

  const events = await loadEventData();
  renderUpcoming(events);
  renderGallery(events);
}

document.addEventListener("DOMContentLoaded", init);
