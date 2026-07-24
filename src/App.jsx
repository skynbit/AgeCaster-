import React, { useState, useEffect, useMemo } from "react";
import { Check, Calendar, Sparkles, Heart, Clock3, Star, ShieldCheck, Zap, X, Play } from "lucide-react";

// TODO: Replace with your real Adsterra Direct Link before going live.
const ADSTERRA_LINK = "https://example.com/replace-with-your-adsterra-direct-link";

const THEMES = {
  dark: {
    bg: "#0f172a",
    bgGlow: "#132340",
    card: "#141e33",
    border: "#22314d",
    text: "#F1F5F9",
    muted: "#93A4C3",
    amber: "#38BDF8",
    amberRgba: "56,189,248",
    green: "#34D399",
    greenRgba: "52,211,153",
    red: "#F87171",
    trackOff: "#22314d",
    cardShadow: "0 0 0 1px rgba(56,189,248,0.10), 0 8px 28px rgba(56,189,248,0.10)",
  },
  light: {
    bg: "#ffffff",
    bgGlow: "#EEF0FF",
    card: "#ffffff",
    border: "#E6E7EE",
    text: "#1E1B2E",
    muted: "#68697A",
    amber: "#6366F1",
    amberRgba: "99,102,241",
    green: "#F59E0B",
    greenRgba: "245,158,11",
    red: "#DC2626",
    trackOff: "#E6E7EE",
    cardShadow: "0 1px 3px rgba(30,27,46,0.06), 0 1px 2px rgba(30,27,46,0.04)",
  },
};

const ZODIAC = [
  { name: "Capricorn", from: [12, 22], to: [1, 19] },
  { name: "Aquarius", from: [1, 20], to: [2, 18] },
  { name: "Pisces", from: [2, 19], to: [3, 20] },
  { name: "Aries", from: [3, 21], to: [4, 19] },
  { name: "Taurus", from: [4, 20], to: [5, 20] },
  { name: "Gemini", from: [5, 21], to: [6, 20] },
  { name: "Cancer", from: [6, 21], to: [7, 22] },
  { name: "Leo", from: [7, 23], to: [8, 22] },
  { name: "Virgo", from: [8, 23], to: [9, 22] },
  { name: "Libra", from: [9, 23], to: [10, 22] },
  { name: "Scorpio", from: [10, 23], to: [11, 21] },
  { name: "Sagittarius", from: [11, 22], to: [12, 21] },
];

function getZodiac(month, day) {
  for (const z of ZODIAC) {
    const [fm, fd] = z.from;
    const [tm, td] = z.to;
    if (fm === tm) {
      if (month === fm && day >= fd && day <= td) return z.name;
    } else if (fm > tm) {
      if ((month === fm && day >= fd) || (month === tm && day <= td)) return z.name;
    } else {
      if ((month === fm && day >= fd) || (month === tm && day <= td) || (month > fm && month < tm))
        return z.name;
    }
  }
  return "Capricorn";
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function pad(n) {
  return String(n).padStart(2, "0");
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Card({ children, style, c }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${c.border}`,
        background: c.card,
        padding: "20px 24px",
        boxShadow: c.cardShadow,
        transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, icon, c }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, color: c.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
      {icon}
      {children}
    </div>
  );
}

function ThemeToggle({ isDark, onToggle, c }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle light and dark mode"
      style={{
        position: "relative",
        width: 56,
        height: 30,
        borderRadius: 999,
        border: `1px solid ${c.border}`,
        background: isDark ? c.trackOff : "#EFE6CF",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        transition: "background 0.25s ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: isDark ? 2 : 28,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: c.amber,
          boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        }}
      >
        {isDark ? "馃寵" : "鈽€锔�"}
      </span>
    </button>
  );
}

function AdSlot({ label = "Advertisement", height = 90, c }) {
  return (
    <div
      style={{
        border: `1px dashed ${c.border}`,
        borderRadius: 12,
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: c.muted,
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        margin: "24px 0",
      }}
    >
      {label}
    </div>
  );
}

function AdModal({ seconds, duration, action, c, onClose }) {
  const label = action === "whatsapp" ? "Redirecting to WhatsApp" : "Your download will continue";
  const pct = Math.min(100, Math.max(0, ((duration - seconds) / duration) * 100));
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: -36, right: 0, background: "transparent", border: "none", color: "#93A4C3", cursor: "pointer" }}>
          <X size={20} />
        </button>

        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 14,
            background: `radial-gradient(circle at 50% 45%, ${c.bgGlow} 0%, #05070d 75%)`,
            border: `1px solid ${c.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 12, left: 14, fontSize: 10, color: "#93A4C3", textTransform: "uppercase", letterSpacing: "0.1em" }}>Advertisement</div>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `rgba(${c.amberRgba},0.15)`,
              border: `2px solid ${c.amber}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 24px rgba(${c.amberRgba},0.35)`,
              animation: "pulseAd 1.4s ease-in-out infinite",
            }}
          >
            <Play size={26} color={c.amber} fill={c.amber} style={{ marginLeft: 3 }} />
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: "#F1F5F9", fontWeight: 600 }}>Ad ending in {seconds}s...</div>
        </div>

        <div style={{ marginTop: 12, height: 5, borderRadius: 999, background: "#22314d", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${c.amber}, #7DD3FC)`, transition: "width 1s linear" }} />
        </div>

        <div style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "#93A4C3" }}>{label} in {seconds}s</div>
      </div>
      <style>{`
        @keyframes pulseAd {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

function GlowText({ children, style }) {
  return (
    <span
      style={{
        backgroundImage: "linear-gradient(90deg, #38BDF8, #7DD3FC)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        textShadow: "0 0 14px rgba(56,189,248,0.55)",
        fontWeight: 700,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function InfoModal({ title, children, c, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto", position: "relative", boxShadow: c.cardShadow }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: c.muted, cursor: "pointer" }}>
          <X size={18} />
        </button>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: c.text }}>{title}</h3>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: c.muted, textAlign: "left" }}>{children}</div>
      </div>
    </div>
  );
}

function Stars({ c }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={14} fill={c.amber} color={c.amber} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: c.muted }}>4.9 / 5 from early users</span>
    </div>
  );
}

export default function AgeCaster() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear - 20);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [manual, setManual] = useState(false);
  const [now, setNow] = useState(new Date());
  const [isDark, setIsDark] = useState(true); // dark mode is the default on load
  const [adModal, setAdModal] = useState({ open: false, seconds: 5, duration: 5, action: null });
  const [activeModal, setActiveModal] = useState(null); // null | 'privacy' | 'terms' | 'contact'
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const c = isDark ? THEMES.dark : THEMES.light;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const maxDay = daysInMonth(year, month);
  useEffect(() => {
    if (day > maxDay) setDay(maxDay);
  }, [maxDay, day]);

  const dob = useMemo(() => new Date(year, month - 1, day, 0, 0, 0), [year, month, day]);

  const data = useMemo(() => {
    const msLived = Math.max(0, now - dob);
    const totalSeconds = Math.floor(msLived / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalDays = Math.floor(totalSeconds / 86400);

    let ay = now.getFullYear() - dob.getFullYear();
    let am = now.getMonth() - dob.getMonth();
    let ad = now.getDate() - dob.getDate();
    if (ad < 0) {
      am -= 1;
      const prevMonthRef = now.getMonth() === 0 ? 12 : now.getMonth();
      const prevYearRef = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      ad += daysInMonth(prevYearRef, prevMonthRef);
    }
    if (am < 0) {
      ay -= 1;
      am += 12;
    }

    let nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday < now) nextBday = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
    if (nextBday.toDateString() === now.toDateString()) {
      nextBday = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }
    const msToBday = nextBday - now;
    const bdayDays = Math.floor(msToBday / 86400000);

    const turns18 = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
    const eligible = now >= turns18;
    const msTo18 = turns18 - now;
    const to18 = {
      days: Math.floor(msTo18 / 86400000),
      hours: Math.floor((msTo18 / 3600000) % 24),
      mins: Math.floor((msTo18 / 60000) % 60),
      secs: Math.floor((msTo18 / 1000) % 60),
    };

    const heartbeats = Math.floor(totalMinutes * 80);

    return {
      ay, am, ad,
      totalDays, totalMinutes, totalSeconds,
      bdayDays,
      eligible, to18,
      zodiac: getZodiac(dob.getMonth() + 1, dob.getDate()),
      weekday: WEEKDAYS[dob.getDay()],
      heartbeats,
    };
  }, [dob, now]);

  const numStyle = { fontVariantNumeric: "tabular-nums", fontFamily: "ui-monospace, 'JetBrains Mono', monospace" };


  // --- Monetized actions ---
  const runDownload = () => {
    const refNo = `#AC-${now.getFullYear()}-X${Math.floor(10 + Math.random() * 89)}`;
    const timestamp = now.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    const dobStr = `${MONTHS[month - 1]} ${pad(day)}, ${year}`;
    const eligibilityText = data.eligible
      ? "ELIGIBLE 鈥� CNIC / Driving License"
      : `NOT YET ELIGIBLE 鈥� ${data.to18.days}d ${data.to18.hours}h to milestone`;
    const summary = `Based on a date of birth of ${dobStr}, the subject's computed chronological age is ${data.ay} years, ${data.am} months, and ${data.ad} days at the time of this report. Across an estimated ${data.totalDays.toLocaleString()} days of continuous existence, the subject's cardiovascular system has completed approximately ${data.heartbeats.toLocaleString()} cycles at a standard 80 BPM baseline. Current legal standing shows the subject is ${data.eligible ? "eligible" : "not yet eligible"} for CNIC / driving license issuance, with the next birthday arriving in ${data.bdayDays} day${data.bdayDays === 1 ? "" : "s"}.`;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>AgeCaster Diagnostic Report ${refNo}</title>
<style>
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; background: #0f172a; color: #F1F5F9; font-family: -apple-system, Inter, system-ui, sans-serif; padding: 36px; }
  .mono { font-variant-numeric: tabular-nums; font-family: ui-monospace, 'JetBrains Mono', monospace; }
  .wrap { max-width: 720px; margin: 0 auto; border: 1px solid #22314d; border-radius: 14px; padding: 32px; background: #141e33; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #22314d; padding-bottom: 18px; margin-bottom: 22px; }
  .brand { font-size: 20px; font-weight: 800; letter-spacing: 0.04em; background-image: linear-gradient(90deg,#38BDF8,#7DD3FC); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 0 10px rgba(56,189,248,0.4); }
  .sub { font-size: 11px; color: #93A4C3; letter-spacing: 0.05em; margin-top: 4px; }
  .meta { text-align: right; font-size: 11px; color: #93A4C3; }
  .meta .ref { color: #38BDF8; font-weight: 700; }
  h2.section { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #93A4C3; margin: 26px 0 10px; }
  .subject-box { border: 1px solid #22314d; border-radius: 10px; padding: 14px 18px; font-size: 14px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .stat { border: 1px solid #22314d; border-radius: 10px; padding: 16px; text-align: center; }
  .stat .num { font-size: 28px; font-weight: 800; color: #38BDF8; }
  .stat .lbl { font-size: 10px; color: #93A4C3; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .kv { border: 1px solid #22314d; border-radius: 10px; padding: 14px 16px; }
  .kv .lbl { font-size: 10px; color: #93A4C3; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .kv .val { font-size: 15px; font-weight: 700; }
  .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .badge.ok { background: rgba(52,211,153,0.15); color: #34D399; border: 1px solid rgba(52,211,153,0.4); }
  .badge.pending { background: rgba(56,189,248,0.12); color: #38BDF8; border: 1px solid rgba(56,189,248,0.4); }
  .summary { font-size: 13px; line-height: 1.7; color: #C7D2E0; border: 1px solid #22314d; border-radius: 10px; padding: 16px 18px; }
  .footer { margin-top: 28px; border-top: 1px solid #22314d; padding-top: 18px; text-align: center; }
  .seal { display: inline-block; font-size: 10px; letter-spacing: 0.08em; color: #34D399; border: 1px solid rgba(52,211,153,0.4); border-radius: 999px; padding: 6px 14px; margin-bottom: 10px; }
  .copyright { font-size: 10px; color: #93A4C3; }
  @media print {
    body { padding: 0; }
    .wrap { border: none; border-radius: 0; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <div class="brand">AGECASTER DIAGNOSTIC LABS</div>
        <div class="sub">Powered by Skynbit Framework v2.4</div>
      </div>
      <div class="meta">
        <div class="ref mono">${refNo}</div>
        <div class="mono">${timestamp}</div>
      </div>
    </div>

    <h2 class="section">Subject Details</h2>
    <div class="subject-box mono">Date of Birth: ${dobStr}</div>

    <h2 class="section">Primary Metrics</h2>
    <div class="grid3">
      <div class="stat"><div class="num mono">${data.ay}</div><div class="lbl">Years</div></div>
      <div class="stat"><div class="num mono">${data.am}</div><div class="lbl">Months</div></div>
      <div class="stat"><div class="num mono">${data.ad}</div><div class="lbl">Days</div></div>
    </div>

    <h2 class="section">Secondary Analysis</h2>
    <div class="grid2">
      <div class="kv"><div class="lbl">Total Days Lived</div><div class="val mono">${data.totalDays.toLocaleString()}</div></div>
      <div class="kv"><div class="lbl">Estimated Heartbeats</div><div class="val mono">${data.heartbeats.toLocaleString()}</div></div>
      <div class="kv"><div class="lbl">Zodiac Sign</div><div class="val">${data.zodiac}</div></div>
      <div class="kv"><div class="lbl">CNIC / License Status</div><div class="val"><span class="badge ${data.eligible ? "ok" : "pending"}">${eligibilityText}</span></div></div>
    </div>

    <h2 class="section">Executive Summary</h2>
    <div class="summary">${summary}</div>

    <div class="footer">
      <div class="seal">VERIFIED ACCURACY 鈥� 100% CLIENT-SIDE COMPUTATION</div>
      <div class="copyright">漏 2026 AgeCaster by Skynbit 鈥� All Rights Reserved.</div>
    </div>
  </div>
</body>
</html>`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
    iframe.srcdoc = html;
    iframe.onload = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error("Print failed", err);
      }
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  const runWhatsapp = () => {
    const text = `My AgeCaster results:\nAge: ${data.ay}y ${data.am}m ${data.ad}d\nNext birthday in ${data.bdayDays} days\nZodiac: ${data.zodiac}\nCheck yours at AgeCaster by Skynbit!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const submitContactForm = (e) => {
    e.preventDefault();
    // NOTE: no backend wired up yet 鈥� replace with a real endpoint / email service call.
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
  };

  const startAd = (action) => {
    window.open(ADSTERRA_LINK, "_blank", "noopener,noreferrer");
    const dur = 5 + Math.floor(Math.random() * 3); // 5, 6, or 7 seconds
    setAdModal({ open: true, seconds: dur, duration: dur, action });
  };

  useEffect(() => {
    if (!adModal.open) return;
    if (adModal.seconds <= 0) {
      const action = adModal.action;
      setAdModal({ open: false, seconds: 5, duration: 5, action: null });
      if (action === "download") runDownload();
      if (action === "whatsapp") runWhatsapp();
      return;
    }
    const t = setTimeout(() => setAdModal((s) => ({ ...s, seconds: s.seconds - 1 })), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adModal.open, adModal.seconds]);

  const btnStyle = (kind) => ({
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: kind === 'primary' ? '#4f46e5' : '#e5e7eb',
    color: kind === 'primary' ? '#ffffff' : '#374151',
  });

  return (
    <div>
      {/* AgeCaster layout components */}
    </div>
  );
}

export default App;

