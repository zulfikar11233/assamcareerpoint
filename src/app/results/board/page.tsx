"use client";
// src/app/results/board/page.tsx
// All India Board Results hub page
// - White cards with bold colored borders
// - 3D mouse-follow tilt on hover
// - Dynamic title/year/links from admin panel (via API)
// - Language toggle EN / অ
// - Footer with portal branding

import { useState, useEffect, useMemo } from "react";

// ── TYPES ──────────────────────────────────────────────────────────
type Status  = "declared" | "expected" | "upcoming";
type Region  = "northeast" | "national" | "north" | "east" | "west" | "south";

interface Board {
  id: string; abbr: string; name: string; full: string;
  state: string; region: Region; classes: number[];
  defaultStatus: Status; defaultUrl: string;
}
interface PageSettings {
  page_title: string; page_year: string;
  page_subtitle_en: string; page_subtitle_as: string;
}
interface BoardOverride {
  board_id: string; custom_url: string; status: Status;
}

// ── STATIC BOARD DATA (structure only — URLs/status come from DB) ──
const BOARDS: Board[] = [
  { id:"seba",    abbr:"SEBA",    name:"SEBA HSLC",            full:"Board of Secondary Education, Assam",              state:"Assam",            region:"northeast", classes:[10],    defaultStatus:"declared", defaultUrl:"https://sebaonline.org/" },
  { id:"ahsec",   abbr:"AHSEC",   name:"AHSEC HS",              full:"Assam Higher Secondary Education Council",          state:"Assam",            region:"northeast", classes:[12],    defaultStatus:"expected", defaultUrl:"https://ahsec.assam.gov.in/" },
  { id:"tbse10",  abbr:"TBSE",    name:"TBSE Madhyamik",        full:"Tripura Board of Secondary Education",              state:"Tripura",          region:"northeast", classes:[10],    defaultStatus:"declared", defaultUrl:"https://tbse.tripura.gov.in/" },
  { id:"tbse12",  abbr:"TBSE",    name:"TBSE Higher Secondary", full:"Tripura Board — Class 12",                          state:"Tripura",          region:"northeast", classes:[12],    defaultStatus:"expected", defaultUrl:"https://tbse.tripura.gov.in/" },
  { id:"nbse",    abbr:"NBSE",    name:"NBSE HSLC & HSSLC",     full:"Nagaland Board of School Education",                state:"Nagaland",         region:"northeast", classes:[10,12], defaultStatus:"declared", defaultUrl:"https://nbsenagaland.com/" },
  { id:"mbose",   abbr:"MBOSE",   name:"MBOSE SSLC & HSSLC",    full:"Meghalaya Board of School Education",               state:"Meghalaya",        region:"northeast", classes:[10,12], defaultStatus:"declared", defaultUrl:"https://mbose.in/" },
  { id:"mbse",    abbr:"MBSE",    name:"MBSE HSLC & HSSLC",     full:"Mizoram Board of School Education",                 state:"Mizoram",          region:"northeast", classes:[10,12], defaultStatus:"expected", defaultUrl:"https://mbse.mizoram.gov.in/" },
  { id:"bsem",    abbr:"BSEM",    name:"BSEM / COHSEM",         full:"Manipur Board of Secondary & Higher Secondary",     state:"Manipur",          region:"northeast", classes:[10,12], defaultStatus:"declared", defaultUrl:"https://bsem.nic.in/" },
  { id:"cbse10",  abbr:"CBSE",    name:"CBSE Class 10",          full:"Central Board of Secondary Education",              state:"National",         region:"national",  classes:[10],    defaultStatus:"expected", defaultUrl:"https://results.cbse.nic.in/" },
  { id:"cbse12",  abbr:"CBSE",    name:"CBSE Class 12",          full:"Central Board of Secondary Education",              state:"National",         region:"national",  classes:[12],    defaultStatus:"declared", defaultUrl:"https://results.cbse.nic.in/" },
  { id:"icse",    abbr:"CISCE",   name:"ICSE Class 10",          full:"Council for Indian School Certificate Examinations", state:"National",        region:"national",  classes:[10],    defaultStatus:"declared", defaultUrl:"https://results.cisce.org/" },
  { id:"isc",     abbr:"CISCE",   name:"ISC Class 12",           full:"Council for Indian School Certificate Examinations", state:"National",        region:"national",  classes:[12],    defaultStatus:"declared", defaultUrl:"https://results.cisce.org/" },
  { id:"nios",    abbr:"NIOS",    name:"NIOS Open Board",        full:"National Institute of Open Schooling",              state:"National / Open",  region:"national",  classes:[10,12], defaultStatus:"upcoming", defaultUrl:"https://results.nios.ac.in/" },
  { id:"up10",    abbr:"UPMSP",   name:"UP Board Class 10",      full:"UP Madhyamik Shiksha Parishad",                     state:"Uttar Pradesh",    region:"north",     classes:[10],    defaultStatus:"declared", defaultUrl:"https://upresults.nic.in/" },
  { id:"up12",    abbr:"UPMSP",   name:"UP Board Class 12",      full:"UP Madhyamik Shiksha Parishad",                     state:"Uttar Pradesh",    region:"north",     classes:[12],    defaultStatus:"declared", defaultUrl:"https://upresults.nic.in/" },
  { id:"rbse",    abbr:"RBSE",    name:"Rajasthan Board",        full:"Rajasthan Board of Secondary Education",            state:"Rajasthan",        region:"north",     classes:[10,12], defaultStatus:"declared", defaultUrl:"https://rajeduboard.rajasthan.gov.in/" },
  { id:"pseb",    abbr:"PSEB",    name:"Punjab Board",           full:"Punjab School Education Board",                     state:"Punjab",           region:"north",     classes:[10,12], defaultStatus:"declared", defaultUrl:"https://pseb.ac.in/" },
  { id:"hbse",    abbr:"HBSE",    name:"Haryana Board",          full:"Haryana Board of School Education",                 state:"Haryana",          region:"north",     classes:[10,12], defaultStatus:"expected", defaultUrl:"https://bseh.org.in/" },
  { id:"hpbose",  abbr:"HPBOSE",  name:"HP Board",               full:"HP Board of School Education",                      state:"Himachal Pradesh", region:"north",     classes:[10,12], defaultStatus:"expected", defaultUrl:"https://hpbose.org/" },
  { id:"jkbose",  abbr:"JKBOSE",  name:"JK Board",               full:"Jammu & Kashmir Board of School Education",         state:"J&K",              region:"north",     classes:[10,12], defaultStatus:"expected", defaultUrl:"https://jkbose.nic.in/" },
  { id:"ubse",    abbr:"UBSE",    name:"Uttarakhand Board",      full:"Uttarakhand Board of School Education",             state:"Uttarakhand",      region:"north",     classes:[10,12], defaultStatus:"upcoming", defaultUrl:"https://ubse.uk.gov.in/" },
  { id:"bseb",    abbr:"BSEB",    name:"Bihar Board",            full:"Bihar School Examination Board",                    state:"Bihar",            region:"east",      classes:[10,12], defaultStatus:"declared", defaultUrl:"https://biharboardonline.bihar.gov.in/" },
  { id:"jac",     abbr:"JAC",     name:"Jharkhand Board",        full:"Jharkhand Academic Council",                        state:"Jharkhand",        region:"east",      classes:[10,12], defaultStatus:"declared", defaultUrl:"https://jac.jharkhand.gov.in/" },
  { id:"wbbse",   abbr:"WBBSE",   name:"WB Board Class 10",      full:"West Bengal Board of Secondary Education",           state:"West Bengal",      region:"east",      classes:[10],    defaultStatus:"declared", defaultUrl:"https://wbbse.wb.gov.in/" },
  { id:"wbchse",  abbr:"WBCHSE",  name:"WB Board Class 12",      full:"West Bengal Council of Higher Secondary Education",  state:"West Bengal",      region:"east",      classes:[12],    defaultStatus:"expected", defaultUrl:"https://wbchse.wb.gov.in/" },
  { id:"odisha",  abbr:"BSE",     name:"Odisha Board",           full:"Board of Secondary Education, Odisha",              state:"Odisha",           region:"east",      classes:[10,12], defaultStatus:"declared", defaultUrl:"https://bseodisha.ac.in/" },
  { id:"cgbse",   abbr:"CGBSE",   name:"Chhattisgarh Board",     full:"CG Board of Secondary Education",                   state:"Chhattisgarh",    region:"east",      classes:[10,12], defaultStatus:"declared", defaultUrl:"https://cgbse.net/" },
  { id:"msbshse", abbr:"MSBSHSE", name:"Maharashtra Board",      full:"Maharashtra State Board of Secondary Education",    state:"Maharashtra",      region:"west",      classes:[10,12], defaultStatus:"declared", defaultUrl:"https://mahresult.nic.in/" },
  { id:"gseb",    abbr:"GSEB",    name:"Gujarat Board",          full:"Gujarat Secondary & Higher Secondary Education Board", state:"Gujarat",        region:"west",      classes:[10,12], defaultStatus:"expected", defaultUrl:"https://gseb.org/" },
  { id:"mpbse",   abbr:"MPBSE",   name:"MP Board",               full:"Madhya Pradesh Board of Secondary Education",       state:"Madhya Pradesh",   region:"west",      classes:[10,12], defaultStatus:"declared", defaultUrl:"https://mpbse.nic.in/" },
  { id:"goa",     abbr:"GBSHSE",  name:"Goa Board",              full:"Goa Board of Secondary & Higher Secondary Education", state:"Goa",            region:"west",      classes:[10,12], defaultStatus:"declared", defaultUrl:"https://gbshse.gov.in/" },
  { id:"tn",      abbr:"TNDGE",   name:"Tamil Nadu Board",       full:"TN Directorate of Government Examinations",         state:"Tamil Nadu",       region:"south",     classes:[10,12], defaultStatus:"declared", defaultUrl:"https://dge.tn.gov.in/" },
  { id:"ap",      abbr:"BSEAP",   name:"AP Board",               full:"Board of Secondary Education, Andhra Pradesh",      state:"Andhra Pradesh",   region:"south",     classes:[10,12], defaultStatus:"declared", defaultUrl:"https://bse.ap.gov.in/" },
  { id:"ts",      abbr:"BIE-TS",  name:"Telangana Board",        full:"Board of Intermediate Education, Telangana",        state:"Telangana",        region:"south",     classes:[10,12], defaultStatus:"declared", defaultUrl:"https://bie.telangana.gov.in/" },
  { id:"ksb",     abbr:"KSEAB",   name:"Karnataka Board",        full:"Karnataka School Examination & Assessment Board",   state:"Karnataka",        region:"south",     classes:[10,12], defaultStatus:"declared", defaultUrl:"https://karresults.nic.in/" },
  { id:"kerala",  abbr:"KERALA",  name:"Kerala Board",           full:"Kerala Board of Public Examinations",               state:"Kerala",           region:"south",     classes:[10,12], defaultStatus:"declared", defaultUrl:"https://keralaresults.nic.in/" },
];

// ── SECTIONS ───────────────────────────────────────────────────────
const SECTIONS: { key: Region; label: string; color: string; border: string }[] = [
  { key:"northeast", label:"North East India", color:"#e53935", border:"rgba(229,57,53,.6)" },
  { key:"national",  label:"National Boards",  color:"#1565c0", border:"rgba(21,101,192,.6)" },
  { key:"north",     label:"North India",      color:"#f57c00", border:"rgba(245,124,0,.6)" },
  { key:"east",      label:"East India",       color:"#00897b", border:"rgba(0,137,123,.6)" },
  { key:"west",      label:"West India",       color:"#6a1b9a", border:"rgba(106,27,154,.6)" },
  { key:"south",     label:"South India",      color:"#283593", border:"rgba(40,53,147,.6)" },
];

// Border color per status (for card left-accent)
const STATUS_BORDER: Record<Status, string> = {
  declared: "#00c896",
  expected: "#f59e0b",
  upcoming: "#94a3b8",
};
const STATUS_BG: Record<Status, string> = {
  declared: "rgba(0,200,150,.08)",
  expected: "rgba(245,158,11,.08)",
  upcoming: "rgba(148,163,184,.06)",
};
const STATUS_LABEL: Record<Status, string> = {
  declared: "Declared",
  expected: "Expected",
  upcoming: "Upcoming",
};
const STATUS_BTN: Record<Status, string> = {
  declared: "Check Result →",
  expected: "Expected Soon",
  upcoming: "Coming Soon",
};

// ── CARD ───────────────────────────────────────────────────────────
function BoardCard({
  board, url, status, year,
}: {
  board: Board; url: string; status: Status; year: string;
}) {
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt]     = useState({ x: 0, y: 0, on: false });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const rx = -((e.clientY - r.top  - r.height / 2) / r.height) * 7;
    const ry =  ((e.clientX - r.left - r.width  / 2) / r.width)  * 9;
    setTilt({ x: rx, y: ry, on: true });
  }
  function onMouseLeave() { setTilt({ x: 0, y: 0, on: false }); }

  function onCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  }

  const cardStyle: React.CSSProperties = {
    transform: tilt.on
      ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-5px) scale(1.015)`
      : "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)",
    borderLeft: `4px solid ${STATUS_BORDER[status]}`,
    boxShadow: tilt.on
      ? `0 16px 48px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.6)`
      : `0 2px 8px rgba(0,0,0,.07)`,
    background: tilt.on ? "#ffffff" : "#fafcff",
  };

  return (
    <div
      className="bc-card"
      style={cardStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => window.open(url, "_blank", "noopener")}
    >
      {/* TOP ROW */}
      <div className="bc-top">
        <span className="bc-abbr">{board.abbr}</span>
        <span className="bc-badge" style={{ background: STATUS_BG[status], color: STATUS_BORDER[status], border:`1px solid ${STATUS_BORDER[status]}` }}>
          <span className="bc-pulse" style={{ background: STATUS_BORDER[status] }} />
          {STATUS_LABEL[status]}
        </span>
      </div>

      {/* STATE */}
      <div className="bc-state">
        <span className="bc-state-dot" />
        {board.state}
      </div>

      {/* TITLE */}
      <div className="bc-name">{board.name} {year}</div>
      <div className="bc-full">{board.full}</div>

      {/* CLASS CHIPS */}
      <div className="bc-chips">
        {board.classes.map(c => (
          <span key={c} className={`bc-chip bc-c${c}`}>Class {c}</span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="bc-footer">
        <span className="bc-btn" style={{ color: STATUS_BORDER[status] }}>
          {STATUS_BTN[status]}
        </span>
        <div style={{ position:"relative" }}>
          <span className="bc-tooltip">Copy URL</span>
          <button
            className={`bc-copy${copied ? " bc-copied" : ""}`}
            onClick={onCopy}
            aria-label="Copy result URL"
          >
            {copied ? "✓" : "⧉"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────
export default function BoardResultsPage() {
  const [settings, setSettings] = useState<PageSettings>({
    page_title:       "All India Board Results 2026",
    page_year:        "2026",
    page_subtitle_en: "Class 10 & 12 results from 30+ boards — SEBA, AHSEC, CBSE, UP Board & all state boards. Direct official links.",
    page_subtitle_as: "৩০+ ব'ৰ্ডৰ দশম আৰু দ্বাদশ শ্ৰেণীৰ ফলাফল — ছেবা, আহছেক, চিবিএছই আৰু সকলো ৰাজ্যিক ব'ৰ্ড।",
  });
  const [overrides, setOverrides] = useState<Record<string, BoardOverride>>({});
  const [lang,        setLang]    = useState<"en"|"as">("en");
  const [search,      setSearch]  = useState("");
  const [groupFilter, setGroup]   = useState("all");
  const [statusFilter,setStatus]  = useState("all");
  const [classFilter, setClass]   = useState("all");

  // ── LOAD FROM API ──────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/board-results/settings")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.pageSettings)  setSettings(data.pageSettings);
        if (data?.boards) {
          const map: Record<string, BoardOverride> = {};
          data.boards.forEach((b: BoardOverride) => { map[b.board_id] = b; });
          setOverrides(map);
        }
      })
      .catch(() => {});
  }, []);

  // Merge static data with DB overrides
  const mergedBoards = useMemo(() =>
    BOARDS.map(b => ({
      ...b,
      url:    overrides[b.id]?.custom_url || b.defaultUrl,
      status: overrides[b.id]?.status    || b.defaultStatus,
    }))
  , [overrides]);

  // Filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return mergedBoards.filter(b => {
      const gOk = groupFilter  === "all" || b.region === groupFilter;
      const sOk = statusFilter === "all" || b.status === statusFilter;
      const cOk = classFilter  === "all" || b.classes.includes(parseInt(classFilter));
      const qOk = !q || [b.name, b.state, b.full, b.abbr].some(s => s.toLowerCase().includes(q));
      return gOk && sOk && cOk && qOk;
    });
  }, [mergedBoards, search, groupFilter, statusFilter, classFilter]);

  const declared = filtered.filter(b => b.status === "declared").length;
  const expected = filtered.filter(b => b.status === "expected").length;
  const upcoming = filtered.filter(b => b.status === "upcoming").length;

  const grouped = Object.fromEntries(
    SECTIONS.map(s => [s.key, filtered.filter(b => b.region === s.key)])
  );

  // Title: highlight the year in teal
  function renderTitle(title: string) {
    const yr = settings.page_year;
    if (!yr || !title.includes(yr)) return title;
    const [before, after] = title.split(yr);
    return <>{before}<span style={{ color:"#00d4aa" }}>{yr}</span>{after}</>;
  }

  return (
    <>
      <style>{`
        /* ── LAYOUT ── */
        .br-wrap { max-width:1200px; margin:0 auto; padding:2rem 1.25rem 0; }

        /* ── BREADCRUMB ── */
        .br-crumb { display:flex; gap:7px; font-size:11px; color:#4a6880; margin-bottom:1rem; align-items:center; }
        .br-crumb a { color:#7a9bb5; text-decoration:none; transition:.15s; }
        .br-crumb a:hover { color:#e8f4ff; }

        /* ── HEADER ── */
        .br-header { display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; margin-bottom:1.5rem; }
        .br-h1 { font-size:clamp(1.6rem,4vw,2.4rem); font-weight:800; letter-spacing:-.02em; color:#e8f4ff; line-height:1.15; margin-bottom:.4rem; }
        .br-sub { font-size:13px; color:#7a9bb5; max-width:480px; line-height:1.7; }
        .br-lang { display:flex; background:#0f1e2e; border:0.5px solid #1e3248; border-radius:8px; overflow:hidden; flex-shrink:0; }
        .br-lang-btn { font-size:12px; padding:7px 16px; border:none; background:transparent; color:#7a9bb5; cursor:pointer; font-weight:500; transition:.2s; }
        .br-lang-btn.active { background:#e53935; color:#fff; }

        /* ── LIVE STRIP ── */
        .br-live { background:linear-gradient(90deg,rgba(229,57,53,.12),transparent); border:0.5px solid rgba(229,57,53,.2); border-radius:10px; padding:9px 14px; display:flex; align-items:center; gap:10px; margin-bottom:1.5rem; }
        .br-live-dot { width:7px; height:7px; border-radius:50%; background:#e53935; animation:bpulse 1.3s infinite; flex-shrink:0; }
        @keyframes bpulse { 0%,100%{box-shadow:0 0 0 0 rgba(229,57,53,.5)} 50%{box-shadow:0 0 0 6px rgba(229,57,53,0)} }
        .br-live-text { font-size:12px; color:#7a9bb5; flex:1; }
        .br-live-text strong { color:#e53935; }
        .br-live-pill { font-size:12px; font-weight:700; color:#e53935; background:rgba(229,57,53,.1); padding:2px 10px; border-radius:6px; white-space:nowrap; }

        /* ── STATS ── */
        .br-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:10px; margin-bottom:1.75rem; }
        .br-stat { background:#0f1e2e; border:0.5px solid #1e3248; border-radius:12px; padding:14px; text-align:center; }
        .br-stat-v { font-size:1.6rem; font-weight:800; line-height:1; }
        .br-stat-l { font-size:10px; color:#4a6880; margin-top:4px; text-transform:uppercase; letter-spacing:.05em; }

        /* ── SEARCH & FILTERS ── */
        .br-controls { margin-bottom:1.75rem; }
        .br-search-wrap { position:relative; margin-bottom:.85rem; }
        .br-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#4a6880; font-size:16px; pointer-events:none; }
        .br-search { width:100%; background:#0f1e2e; border:0.5px solid #1e3248; border-radius:12px; padding:11px 44px; font-size:14px; color:#e8f4ff; outline:none; transition:.25s; }
        .br-search::placeholder { color:#4a6880; }
        .br-search:focus { border-color:#00d4aa; box-shadow:0 0 0 3px rgba(0,212,170,.08); }
        .br-search-count { position:absolute; right:13px; top:50%; transform:translateY(-50%); font-size:11px; color:#4a6880; }
        .br-filters { display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
        .br-fbtn { font-size:11px; padding:5px 13px; border-radius:999px; border:0.5px solid #1e3248; background:transparent; color:#7a9bb5; cursor:pointer; transition:.2s; white-space:nowrap; }
        .br-fbtn:hover { border-color:#243d56; color:#e8f4ff; }
        .br-fbtn.ar { background:#e53935; border-color:#e53935; color:#fff; font-weight:500; }
        .br-fbtn.at { background:#00d4aa; border-color:#00d4aa; color:#080f18; font-weight:500; }
        .br-fbtn.aa { background:#f59e0b; border-color:#f59e0b; color:#080f18; font-weight:500; }
        .br-sep { width:1px; height:22px; background:#1e3248; margin:0 3px; }

        /* ── SECTION HEAD ── */
        .br-sec-head { display:flex; align-items:center; gap:10px; margin:2rem 0 1rem; }
        .br-sec-line { flex:1; height:0.5px; }
        .br-sec-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .br-sec-label { font-size:11px; font-weight:700; color:#4a6880; text-transform:uppercase; letter-spacing:.1em; white-space:nowrap; }

        /* ── GRID ── */
        .br-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:14px; }

        /* ── CARD (White) ── */
        .bc-card {
          background:#fafcff;
          border:1.5px solid #e2e8f0;
          border-left:4px solid #00c896;
          border-radius:14px;
          padding:18px;
          cursor:pointer;
          transition:transform .25s ease, box-shadow .25s ease, background .15s ease, border-color .2s ease;
          transform-style:preserve-3d;
          will-change:transform;
          position:relative;
          overflow:hidden;
        }
        .bc-card::before {
          content:'';position:absolute;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent);
          opacity:0;transition:.3s;
        }
        .bc-card:hover::before { opacity:1; }

        .bc-top { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:10px; }
        .bc-abbr { font-size:10px; font-weight:700; color:#64748b; letter-spacing:.1em; text-transform:uppercase; }
        .bc-badge { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:600; padding:3px 9px; border-radius:999px; white-space:nowrap; flex-shrink:0; }
        .bc-pulse { width:6px; height:6px; border-radius:50%; flex-shrink:0; animation:bpulse 1.5s infinite; }

        .bc-state { display:flex; align-items:center; gap:4px; font-size:10px; color:#94a3b8; margin-bottom:6px; }
        .bc-state-dot { width:4px; height:4px; border-radius:50%; background:#e53935; flex-shrink:0; }

        .bc-name { font-size:15px; font-weight:700; color:#0f172a; line-height:1.3; margin-bottom:3px; }
        .bc-full { font-size:11px; color:#64748b; line-height:1.5; margin-bottom:10px; }

        .bc-chips { display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap; }
        .bc-chip { font-size:10px; padding:3px 10px; border-radius:6px; font-weight:600; }
        .bc-c10 { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
        .bc-c12 { background:#fff1f2; color:#be123c; border:1px solid #fecdd3; }

        .bc-footer { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid #f1f5f9; }
        .bc-btn { font-size:11px; font-weight:700; transition:.15s; }
        .bc-copy { width:27px; height:27px; border-radius:7px; border:1.5px solid #e2e8f0; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; color:#94a3b8; font-size:12px; }
        .bc-copy:hover { border-color:#cbd5e1; color:#475569; }
        .bc-copy.bc-copied { border-color:#00c896; color:#00c896; background:#f0fdf9; }
        .bc-tooltip { position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:#1e293b; color:#e8f4ff; font-size:10px; padding:3px 8px; border-radius:5px; white-space:nowrap; opacity:0; pointer-events:none; transition:.15s; z-index:10; }
        div:hover > .bc-tooltip { opacity:1; }

        /* ── EMPTY ── */
        .br-empty { text-align:center; padding:4rem 2rem; color:#4a6880; }
        .br-empty-icon { font-size:2.5rem; margin-bottom:.75rem; opacity:.4; }

        /* ── FOOTER ── */
        .br-footer {
          background:#080f18;
          border-top:0.5px solid #1e3248;
          margin-top:3rem;
          padding:1.5rem 1.25rem;
          text-align:center;
        }
        .br-footer-inner { max-width:1200px; margin:0 auto; }
        .br-footer-logo { font-size:13px; font-weight:700; color:#e8f4ff; margin-bottom:.5rem; }
        .br-footer-logo span { color:#e53935; }
        .br-footer-links { display:flex; flex-wrap:wrap; justify-content:center; gap:6px 16px; margin-bottom:.75rem; }
        .br-footer-links a { font-size:12px; color:#7a9bb5; text-decoration:none; transition:.15s; }
        .br-footer-links a:hover { color:#00d4aa; }
        .br-footer-sep { color:#1e3248; }
        .br-copy { font-size:11px; color:#4a6880; }
      `}</style>

      <div className="br-wrap">

        {/* BREADCRUMB */}
        <nav className="br-crumb">
          <a href="/">Home</a><span>/</span>
          <a href="/results">Results</a><span>/</span>
          <span style={{ color:"#e8f4ff" }}>Board Results</span>
        </nav>

        {/* HEADER */}
        <div className="br-header">
          <div>
            <h1 className="br-h1">{renderTitle(settings.page_title)}</h1>
            <p className="br-sub">
              {lang === "en" ? settings.page_subtitle_en : settings.page_subtitle_as}
            </p>
          </div>
          <div className="br-lang">
            <button className={`br-lang-btn${lang==="en"?" active":""}`} onClick={() => setLang("en")}>EN</button>
            <button className={`br-lang-btn${lang==="as"?" active":""}`} onClick={() => setLang("as")}>অ</button>
          </div>
        </div>

        {/* LIVE STRIP */}
        <div className="br-live">
          <div className="br-live-dot" />
          <div className="br-live-text">
            <strong>Live Updates</strong> — Results are being declared. Page reflects latest status.
          </div>
          <div className="br-live-pill">{declared} Live</div>
        </div>

        {/* STATS */}
        <div className="br-stats">
          <div className="br-stat"><div className="br-stat-v" style={{ color:"#00c896" }}>{declared}</div><div className="br-stat-l">Declared</div></div>
          <div className="br-stat"><div className="br-stat-v" style={{ color:"#f59e0b" }}>{expected}</div><div className="br-stat-l">Expected</div></div>
          <div className="br-stat"><div className="br-stat-v" style={{ color:"#94a3b8" }}>{upcoming}</div><div className="br-stat-l">Upcoming</div></div>
          <div className="br-stat"><div className="br-stat-v" style={{ color:"#e53935" }}>{filtered.length}</div><div className="br-stat-l">Total Boards</div></div>
        </div>

        {/* CONTROLS */}
        <div className="br-controls">
          <div className="br-search-wrap">
            <span className="br-search-icon">⌕</span>
            <input className="br-search" type="text" placeholder="Search board, state..." value={search} onChange={e => setSearch(e.target.value)} />
            <span className="br-search-count">{filtered.length} results</span>
          </div>
          <div className="br-filters">
            {["all","northeast","national","north","east","west","south"].map(g => (
              <button key={g} className={`br-fbtn${groupFilter===g?" ar":""}`} onClick={() => setGroup(g)}>
                {g==="all"?"All Boards":g==="northeast"?"North East":g==="national"?"National":g.charAt(0).toUpperCase()+g.slice(1)+" India"}
              </button>
            ))}
            <div className="br-sep" />
            <button className={`br-fbtn${statusFilter==="all"?" ar":""}`} onClick={() => setStatus("all")}>All Status</button>
            <button className={`br-fbtn${statusFilter==="declared"?" at":""}`} onClick={() => setStatus("declared")}>🟢 Declared</button>
            <button className={`br-fbtn${statusFilter==="expected"?" aa":""}`} onClick={() => setStatus("expected")}>🟡 Expected</button>
            <button className={`br-fbtn${statusFilter==="upcoming"?" ar":""}`} onClick={() => setStatus("upcoming")}>⚪ Upcoming</button>
            <div className="br-sep" />
            {["all","10","12"].map(c => (
              <button key={c} className={`br-fbtn${classFilter===c?" ar":""}`} onClick={() => setClass(c)}>
                {c==="all"?"All Classes":`Class ${c}`}
              </button>
            ))}
          </div>
        </div>

        {/* BOARDS */}
        {filtered.length === 0 ? (
          <div className="br-empty">
            <div className="br-empty-icon">🔍</div>
            <h3 style={{ color:"#7a9bb5", fontSize:"1rem" }}>No boards found</h3>
            <p style={{ fontSize:12, marginTop:6 }}>Try a different search or filter.</p>
          </div>
        ) : (
          SECTIONS.map(sec => {
            const list = grouped[sec.key] || [];
            if (!list.length) return null;
            return (
              <div key={sec.key}>
                <div className="br-sec-head">
                  <div className="br-sec-line" style={{ background:`linear-gradient(90deg,${sec.border},transparent)` }} />
                  <div className="br-sec-dot" style={{ background: sec.color }} />
                  <div className="br-sec-label">{sec.label}</div>
                  <div className="br-sec-line" style={{ background:`linear-gradient(90deg,transparent,${sec.border})` }} />
                </div>
                <div className="br-grid">
                  {list.map(b => (
                    <BoardCard key={b.id} board={b} url={b.url} status={b.status} year={settings.page_year} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="br-footer">
        <div className="br-footer-inner">
          <div className="br-footer-logo">
            Assam Career <span>Point</span> &amp; Info
          </div>
          <div className="br-footer-links">
            <a href="https://www.assamcareerpoint-info.com/">Home</a>
            <span className="br-footer-sep">·</span>
            <a href="https://www.assamcareerpoint-info.com/privacy-policy">Privacy</a>
            <span className="br-footer-sep">·</span>
            <a href="https://www.assamcareerpoint-info.com/about-us">About</a>
            <span className="br-footer-sep">·</span>
            <a href="https://www.assamcareerpoint-info.com/contact">Contact</a>
            <span className="br-footer-sep">·</span>
            <a href="/results">All Results</a>
          </div>
          <div className="br-copy">
            © 2025–{settings.page_year} Assam Career Point &amp; Info · All rights reserved
          </div>
        </div>
      </footer>
    </>
  );
}
