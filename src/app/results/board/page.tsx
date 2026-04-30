"use client";
import { useState, useMemo } from "react";

// ── TYPES ──────────────────────────────────────────────────────────
type Status = "declared" | "expected" | "upcoming";
type Region = "northeast" | "national" | "north" | "east" | "west" | "south";
interface Board {
  id: string;
  abbr: string;
  name: string;
  full: string;
  state: string;
  region: Region;
  classes: number[];
  status: Status;
  url: string;
  slug: string;
}

// ── DATA ───────────────────────────────────────────────────────────
const boards: Board[] = [
  // NORTH EAST
  { id:"seba",    abbr:"SEBA",    name:"SEBA HSLC",           full:"Board of Secondary Education, Assam",             state:"Assam",            region:"northeast", classes:[10],     status:"declared", url:"https://sebaonline.org/",                       slug:"/results/seba-hslc-result-2026" },
  { id:"ahsec",   abbr:"AHSEC",   name:"AHSEC HS",             full:"Assam Higher Secondary Education Council",         state:"Assam",            region:"northeast", classes:[12],     status:"expected", url:"https://ahsec.assam.gov.in/",                   slug:"/results/ahsec-hs-result-2026" },
  { id:"tbse10",  abbr:"TBSE",    name:"TBSE Madhyamik",       full:"Tripura Board of Secondary Education",             state:"Tripura",          region:"northeast", classes:[10],     status:"declared", url:"https://tbse.tripura.gov.in/",                  slug:"/results/tbse-madhyamik-result-2026" },
  { id:"tbse12",  abbr:"TBSE",    name:"TBSE Higher Secondary", full:"Tripura Board — Class 12",                        state:"Tripura",          region:"northeast", classes:[12],     status:"expected", url:"https://tbse.tripura.gov.in/",                  slug:"/results/tbse-hs-result-2026" },
  { id:"nbse",    abbr:"NBSE",    name:"NBSE HSLC & HSSLC",    full:"Nagaland Board of School Education",               state:"Nagaland",         region:"northeast", classes:[10,12],  status:"declared", url:"https://nbsenagaland.com/",                     slug:"/results/nbse-result-2026" },
  { id:"mbose",   abbr:"MBOSE",   name:"MBOSE SSLC & HSSLC",   full:"Meghalaya Board of School Education",              state:"Meghalaya",        region:"northeast", classes:[10,12],  status:"declared", url:"https://mbose.in/",                             slug:"/results/mbose-result-2026" },
  { id:"mbse",    abbr:"MBSE",    name:"MBSE HSLC & HSSLC",    full:"Mizoram Board of School Education",                state:"Mizoram",          region:"northeast", classes:[10,12],  status:"expected", url:"https://mbse.mizoram.gov.in/",                  slug:"/results/mbse-result-2026" },
  { id:"bsem",    abbr:"BSEM",    name:"BSEM / COHSEM",        full:"Manipur Board of Secondary & Higher Secondary",    state:"Manipur",          region:"northeast", classes:[10,12],  status:"declared", url:"https://bsem.nic.in/",                          slug:"/results/bsem-result-2026" },
  // NATIONAL
  { id:"cbse10",  abbr:"CBSE",    name:"CBSE Class 10",         full:"Central Board of Secondary Education",             state:"National",         region:"national",  classes:[10],     status:"expected", url:"https://results.cbse.nic.in/",                  slug:"/results/cbse-class-10-result-2026" },
  { id:"cbse12",  abbr:"CBSE",    name:"CBSE Class 12",         full:"Central Board of Secondary Education",             state:"National",         region:"national",  classes:[12],     status:"declared", url:"https://results.cbse.nic.in/",                  slug:"/results/cbse-class-12-result-2026" },
  { id:"icse",    abbr:"CISCE",   name:"ICSE Class 10",         full:"Council for Indian School Certificate Examinations", state:"National",        region:"national",  classes:[10],     status:"declared", url:"https://results.cisce.org/",                    slug:"/results/icse-result-2026" },
  { id:"isc",     abbr:"CISCE",   name:"ISC Class 12",          full:"Council for Indian School Certificate Examinations", state:"National",        region:"national",  classes:[12],     status:"declared", url:"https://results.cisce.org/",                    slug:"/results/isc-result-2026" },
  { id:"nios",    abbr:"NIOS",    name:"NIOS Open Board",       full:"National Institute of Open Schooling",             state:"National / Open",  region:"national",  classes:[10,12],  status:"upcoming", url:"https://results.nios.ac.in/",                   slug:"/results/nios-result-2026" },
  // NORTH
  { id:"up10",    abbr:"UPMSP",   name:"UP Board Class 10",     full:"UP Madhyamik Shiksha Parishad",                    state:"Uttar Pradesh",    region:"north",     classes:[10],     status:"declared", url:"https://upresults.nic.in/",                     slug:"/results/up-board-class-10-result-2026" },
  { id:"up12",    abbr:"UPMSP",   name:"UP Board Class 12",     full:"UP Madhyamik Shiksha Parishad",                    state:"Uttar Pradesh",    region:"north",     classes:[12],     status:"declared", url:"https://upresults.nic.in/",                     slug:"/results/up-board-class-12-result-2026" },
  { id:"rbse",    abbr:"RBSE",    name:"Rajasthan Board",       full:"Rajasthan Board of Secondary Education",           state:"Rajasthan",        region:"north",     classes:[10,12],  status:"declared", url:"https://rajeduboard.rajasthan.gov.in/",          slug:"/results/rbse-result-2026" },
  { id:"pseb",    abbr:"PSEB",    name:"Punjab Board",          full:"Punjab School Education Board",                    state:"Punjab",           region:"north",     classes:[10,12],  status:"declared", url:"https://pseb.ac.in/",                           slug:"/results/pseb-result-2026" },
  { id:"hbse",    abbr:"HBSE",    name:"Haryana Board",         full:"Haryana Board of School Education",                state:"Haryana",          region:"north",     classes:[10,12],  status:"expected", url:"https://bseh.org.in/",                          slug:"/results/hbse-result-2026" },
  { id:"hpbose",  abbr:"HPBOSE",  name:"HP Board",              full:"HP Board of School Education",                     state:"Himachal Pradesh", region:"north",     classes:[10,12],  status:"expected", url:"https://hpbose.org/",                           slug:"/results/hpbose-result-2026" },
  { id:"jkbose",  abbr:"JKBOSE",  name:"JK Board",              full:"Jammu & Kashmir Board of School Education",        state:"J&K",              region:"north",     classes:[10,12],  status:"expected", url:"https://jkbose.nic.in/",                        slug:"/results/jkbose-result-2026" },
  { id:"ubse",    abbr:"UBSE",    name:"Uttarakhand Board",     full:"Uttarakhand Board of School Education",            state:"Uttarakhand",      region:"north",     classes:[10,12],  status:"upcoming", url:"https://ubse.uk.gov.in/",                       slug:"/results/ubse-result-2026" },
  // EAST
  { id:"bseb",    abbr:"BSEB",    name:"Bihar Board",           full:"Bihar School Examination Board",                   state:"Bihar",            region:"east",      classes:[10,12],  status:"declared", url:"https://biharboardonline.bihar.gov.in/",         slug:"/results/bseb-result-2026" },
  { id:"jac",     abbr:"JAC",     name:"Jharkhand Board",       full:"Jharkhand Academic Council",                       state:"Jharkhand",        region:"east",      classes:[10,12],  status:"declared", url:"https://jac.jharkhand.gov.in/",                 slug:"/results/jac-result-2026" },
  { id:"wbbse",   abbr:"WBBSE",   name:"WB Board Class 10",     full:"West Bengal Board of Secondary Education",         state:"West Bengal",      region:"east",      classes:[10],     status:"declared", url:"https://wbbse.wb.gov.in/",                      slug:"/results/wbbse-result-2026" },
  { id:"wbchse",  abbr:"WBCHSE",  name:"WB Board Class 12",     full:"West Bengal Council of Higher Secondary Education", state:"West Bengal",     region:"east",      classes:[12],     status:"expected", url:"https://wbchse.wb.gov.in/",                     slug:"/results/wbchse-result-2026" },
  { id:"odisha",  abbr:"BSE",     name:"Odisha Board",          full:"Board of Secondary Education, Odisha",             state:"Odisha",           region:"east",      classes:[10,12],  status:"declared", url:"https://bseodisha.ac.in/",                      slug:"/results/odisha-board-result-2026" },
  { id:"cgbse",   abbr:"CGBSE",   name:"Chhattisgarh Board",    full:"CG Board of Secondary Education",                  state:"Chhattisgarh",    region:"east",      classes:[10,12],  status:"declared", url:"https://cgbse.net/",                            slug:"/results/cgbse-result-2026" },
  // WEST
  { id:"msbshse", abbr:"MSBSHSE", name:"Maharashtra Board",     full:"Maharashtra State Board of Secondary Education",   state:"Maharashtra",      region:"west",      classes:[10,12],  status:"declared", url:"https://mahresult.nic.in/",                     slug:"/results/maharashtra-board-result-2026" },
  { id:"gseb",    abbr:"GSEB",    name:"Gujarat Board",         full:"Gujarat Secondary & Higher Secondary Education Board", state:"Gujarat",       region:"west",      classes:[10,12],  status:"expected", url:"https://gseb.org/",                             slug:"/results/gseb-result-2026" },
  { id:"mpbse",   abbr:"MPBSE",   name:"MP Board",              full:"Madhya Pradesh Board of Secondary Education",      state:"Madhya Pradesh",   region:"west",      classes:[10,12],  status:"declared", url:"https://mpbse.nic.in/",                         slug:"/results/mpbse-result-2026" },
  { id:"goa",     abbr:"GBSHSE",  name:"Goa Board",             full:"Goa Board of Secondary & Higher Secondary Education", state:"Goa",           region:"west",      classes:[10,12],  status:"declared", url:"https://gbshse.gov.in/",                        slug:"/results/goa-board-result-2026" },
  // SOUTH
  { id:"tn",      abbr:"TNDGE",   name:"Tamil Nadu Board",      full:"TN Directorate of Government Examinations",        state:"Tamil Nadu",       region:"south",     classes:[10,12],  status:"declared", url:"https://dge.tn.gov.in/",                        slug:"/results/tn-board-result-2026" },
  { id:"ap",      abbr:"BSEAP",   name:"AP Board",              full:"Board of Secondary Education, Andhra Pradesh",     state:"Andhra Pradesh",   region:"south",     classes:[10,12],  status:"declared", url:"https://bse.ap.gov.in/",                        slug:"/results/ap-board-result-2026" },
  { id:"ts",      abbr:"BIE-TS",  name:"Telangana Board",       full:"Board of Intermediate Education, Telangana",       state:"Telangana",        region:"south",     classes:[10,12],  status:"declared", url:"https://bie.telangana.gov.in/",                 slug:"/results/telangana-board-result-2026" },
  { id:"ksb",     abbr:"KSEAB",   name:"Karnataka Board",       full:"Karnataka School Examination & Assessment Board",  state:"Karnataka",        region:"south",     classes:[10,12],  status:"declared", url:"https://karresults.nic.in/",                    slug:"/results/karnataka-board-result-2026" },
  { id:"kerala",  abbr:"KERALA",  name:"Kerala Board",          full:"Kerala Board of Public Examinations",              state:"Kerala",           region:"south",     classes:[10,12],  status:"declared", url:"https://keralaresults.nic.in/",                 slug:"/results/kerala-board-result-2026" },
];

// ── METADATA (for Next.js App Router) ──────────────────────────────
// export const metadata = {
//   title: "All India Board Result 2026 | Assam Career Point",
//   description: "Check SEBA HSLC, AHSEC HS, CBSE, UP Board, Bihar Board and all 30+ state board results 2026. Direct official links with live status.",
//   keywords: "board result 2026, SEBA result, AHSEC result, CBSE result, all india board result",
// };

// ── SECTION CONFIG ─────────────────────────────────────────────────
const sections: { key: Region; label: string; color: string }[] = [
  { key: "northeast", label: "North East India", color: "#e53935" },
  { key: "national",  label: "National Boards",  color: "#4fc3f7" },
  { key: "north",     label: "North India",      color: "#ffb300" },
  { key: "east",      label: "East India",       color: "#00d4aa" },
  { key: "west",      label: "West India",       color: "#ff7043" },
  { key: "south",     label: "South India",      color: "#ab47bc" },
];

// ── STATUS CONFIG ──────────────────────────────────────────────────
const statusConfig = {
  declared: { label: "Declared", cls: "s-declared", pulse: "pulse-teal", btn: "Check Result →" },
  expected: { label: "Expected", cls: "s-expected", pulse: "pulse-amber", btn: "Notify Me →" },
  upcoming: { label: "Upcoming", cls: "s-upcoming", pulse: "pulse-grey",  btn: "Coming Soon" },
};

// ── BOARD CARD ─────────────────────────────────────────────────────
function BoardCard({ board }: { board: Board }) {
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt]     = useState({ x: 0, y: 0, active: false });
  const cfg = statusConfig[board.status];

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = -((y - r.height / 2) / r.height) * 8;
    const ry =  ((x - r.width  / 2) / r.width)  * 10;
    setTilt({ x: rx, y: ry, active: true });
  }

  function handleMouseLeave() { setTilt({ x: 0, y: 0, active: false }); }

  function copyLink(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText(`https://assamcareerpoint-info.com${board.slug}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const style: React.CSSProperties = tilt.active
    ? { transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale(1.01)` }
    : {};

  return (
    <a
      href={board.slug}
      className={`board-card ${board.status}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => { e.preventDefault(); window.open(board.url, "_blank", "noopener"); }}
    >
      <div className="card-glow" />
      <div className="card-top">
        <span className="board-abbr">{board.abbr}</span>
        <span className={`status-badge ${cfg.cls}`}>
          <span className={`pulse-dot ${cfg.pulse}`} />
          {cfg.label}
        </span>
      </div>
      <div className="state-tag">
        <span className="state-dot" />
        {board.state}
      </div>
      <div className="board-name">{board.name}</div>
      <div className="board-full">{board.full}</div>
      <div className="class-row">
        {board.classes.map(c => (
          <span key={c} className={`class-chip c${c}`}>Class {c}</span>
        ))}
      </div>
      <div className="card-footer">
        <span className="check-label">{cfg.btn}</span>
        <div className="copy-wrap">
          <span className="tooltip-text">Copy link</span>
          <button
            className={`copy-btn${copied ? " copied" : ""}`}
            onClick={copyLink}
            aria-label="Copy result link"
          >
            {copied ? "✓" : "⧉"}
          </button>
        </div>
      </div>
    </a>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────
export default function BoardResultsPage() {
  const [search,      setSearch]      = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [statusFilter,setStatusFilter]= useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [lang,        setLang]        = useState<"en"|"as">("en");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return boards.filter(b => {
      const gOk = groupFilter  === "all" || b.region === groupFilter;
      const sOk = statusFilter === "all" || b.status === statusFilter;
      const cOk = classFilter  === "all" || b.classes.includes(parseInt(classFilter));
      const qOk = !q || [b.name, b.state, b.full, b.abbr].some(s => s.toLowerCase().includes(q));
      return gOk && sOk && cOk && qOk;
    });
  }, [search, groupFilter, statusFilter, classFilter]);

  const declared = filtered.filter(b => b.status === "declared").length;
  const expected = filtered.filter(b => b.status === "expected").length;
  const upcoming = filtered.filter(b => b.status === "upcoming").length;

  const grouped = Object.fromEntries(sections.map(s => [s.key, filtered.filter(b => b.region === s.key)]));

  return (
    <>
      {/* ── INLINE STYLES ── */}
      <style>{`
        /* Paste the CSS from the portal's globals.css or add here */
        .board-results-wrap { max-width:1200px; margin:0 auto; padding:2rem 1.25rem 4rem; }

        /* Stats */
        .stats-bar { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:10px; margin-bottom:2rem; }
        .stat-box { background:#0f1e2e; border:0.5px solid #1e3248; border-radius:12px; padding:14px; text-align:center; }
        .stat-val { font-size:1.6rem; font-weight:800; line-height:1; }
        .stat-label { font-size:10px; color:#4a6880; margin-top:4px; text-transform:uppercase; letter-spacing:.05em; }
        .s-teal { color:#00d4aa; } .s-amber { color:#ffb300; } .s-blue { color:#4fc3f7; } .s-red { color:#e53935; }

        /* Live strip */
        .live-strip { background:linear-gradient(90deg,rgba(229,57,53,.15),rgba(229,57,53,.05)); border:0.5px solid rgba(229,57,53,.25); border-radius:10px; padding:8px 14px; display:flex; align-items:center; gap:10px; margin-bottom:1.75rem; }
        .live-dot { width:7px; height:7px; border-radius:50%; background:#e53935; animation:pulse-a 1.2s infinite; flex-shrink:0; }
        .live-text { font-size:12px; color:#7a9bb5; flex:1; }
        .live-count { font-size:12px; font-weight:700; color:#e53935; background:rgba(229,57,53,.1); padding:2px 9px; border-radius:6px; }

        /* Controls */
        .search-wrap { position:relative; margin-bottom:1rem; }
        .search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#4a6880; pointer-events:none; }
        .search-input { width:100%; background:#0f1e2e; border:0.5px solid #1e3248; border-radius:12px; padding:12px 44px; font-size:14px; color:#e8f4ff; outline:none; transition:.25s; }
        .search-input::placeholder { color:#4a6880; }
        .search-input:focus { border-color:#00d4aa; box-shadow:0 0 0 3px rgba(0,212,170,.08); }
        .search-count { position:absolute; right:14px; top:50%; transform:translateY(-50%); font-size:11px; color:#4a6880; }
        .filter-row { display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
        .f-btn { font-size:11px; padding:5px 14px; border-radius:999px; border:0.5px solid #1e3248; background:transparent; color:#7a9bb5; cursor:pointer; transition:.2s; white-space:nowrap; }
        .f-btn:hover { border-color:#243d56; color:#e8f4ff; }
        .f-btn.act-red { background:#e53935; border-color:#e53935; color:#fff; font-weight:500; }
        .f-btn.act-teal { background:#00d4aa; border-color:#00d4aa; color:#080f18; font-weight:500; }
        .f-btn.act-amber { background:#ffb300; border-color:#ffb300; color:#080f18; font-weight:500; }
        .f-sep { width:1px; height:22px; background:#1e3248; margin:0 4px; }

        /* Section head */
        .section-head { display:flex; align-items:center; gap:10px; margin:2rem 0 1rem; }
        .sh-line { flex:1; height:0.5px; background:linear-gradient(90deg,#1e3248,transparent); }
        .sh-label { font-size:11px; font-weight:700; color:#4a6880; letter-spacing:.1em; text-transform:uppercase; white-space:nowrap; }

        /* Grid */
        .boards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; }

        /* Card */
        .board-card { background:#0f1e2e; border:0.5px solid #1e3248; border-radius:16px; padding:18px; position:relative; overflow:hidden; cursor:pointer; transition:border-color .25s, box-shadow .25s; transform-style:preserve-3d; will-change:transform; text-decoration:none; display:block; color:inherit; }
        .board-card::before { content:''; position:absolute; inset:0; border-radius:16px; background:linear-gradient(135deg,rgba(255,255,255,.04) 0%,transparent 50%,rgba(0,212,170,.03) 100%); opacity:0; transition:.3s; }
        .board-card:hover { border-color:#243d56; box-shadow:0 20px 60px rgba(0,0,0,.4), 0 0 0 0.5px rgba(0,212,170,.2); }
        .board-card:hover::before { opacity:1; }
        .board-card.declared { border-color:rgba(0,212,170,.25); }
        .board-card.declared:hover { border-color:rgba(0,212,170,.5); box-shadow:0 20px 60px rgba(0,0,0,.4),0 0 0 0.5px rgba(0,212,170,.3),0 0 30px rgba(0,212,170,.08); }

        .card-glow { position:absolute; top:0; left:50%; transform:translateX(-50%); width:60%; height:1px; opacity:0; transition:.3s; }
        .board-card.declared .card-glow { background:linear-gradient(90deg,transparent,#00d4aa,transparent); }
        .board-card.expected .card-glow { background:linear-gradient(90deg,transparent,#ffb300,transparent); }
        .board-card.upcoming .card-glow { background:linear-gradient(90deg,transparent,#4a6880,transparent); }
        .board-card:hover .card-glow { opacity:1; }

        .card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; gap:8px; }
        .board-abbr { font-size:11px; font-weight:700; color:#4a6880; letter-spacing:.08em; text-transform:uppercase; }
        .status-badge { display:flex; align-items:center; gap:4px; font-size:10px; font-weight:600; padding:3px 9px; border-radius:999px; flex-shrink:0; }
        .s-declared { background:rgba(0,212,170,.12); color:#00d4aa; border:0.5px solid rgba(0,212,170,.3); }
        .s-expected { background:rgba(255,179,0,.1); color:#ffb300; border:0.5px solid rgba(255,179,0,.3); }
        .s-upcoming { background:rgba(74,104,128,.15); color:#4a6880; border:0.5px solid #1e3248; }

        .pulse-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .pulse-teal  { background:#00d4aa; animation:pulse-t 1.5s infinite; }
        .pulse-amber { background:#ffb300; animation:pulse-a 1.5s infinite; }
        .pulse-grey  { background:#4a6880; }
        @keyframes pulse-t { 0%,100%{box-shadow:0 0 0 0 rgba(0,212,170,.5)}50%{box-shadow:0 0 0 5px rgba(0,212,170,0)} }
        @keyframes pulse-a { 0%,100%{box-shadow:0 0 0 0 rgba(255,179,0,.5)} 50%{box-shadow:0 0 0 5px rgba(255,179,0,0)} }

        .state-tag { display:flex; align-items:center; gap:4px; font-size:9px; color:#4a6880; margin-bottom:6px; }
        .state-dot { width:4px; height:4px; border-radius:50%; background:#e53935; flex-shrink:0; }
        .board-name { font-size:15px; font-weight:700; color:#e8f4ff; line-height:1.3; margin-bottom:3px; }
        .board-full { font-size:11px; color:#7a9bb5; line-height:1.5; margin-bottom:10px; }

        .class-row { display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap; }
        .class-chip { font-size:10px; padding:3px 10px; border-radius:6px; font-weight:600; }
        .c10 { background:rgba(79,195,247,.1); color:#4fc3f7; border:0.5px solid rgba(79,195,247,.3); }
        .c12 { background:rgba(229,57,53,.1); color:#ff5252; border:0.5px solid rgba(229,57,53,.3); }

        .card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:0.5px solid #1e3248; }
        .check-label { font-size:11px; font-weight:600; color:#00d4aa; transition:.2s; }
        .board-card:hover .check-label { color:#00ffcc; }
        .copy-wrap { position:relative; }
        .tooltip-text { position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:#1e3248; color:#e8f4ff; font-size:10px; padding:4px 8px; border-radius:6px; white-space:nowrap; pointer-events:none; opacity:0; transition:.15s; z-index:10; }
        .copy-wrap:hover .tooltip-text { opacity:1; }
        .copy-btn { width:26px; height:26px; border-radius:7px; border:0.5px solid #1e3248; background:transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; color:#4a6880; font-size:11px; }
        .copy-btn:hover { border-color:#243d56; color:#e8f4ff; }
        .copy-btn.copied { border-color:#00d4aa; color:#00d4aa; background:rgba(0,212,170,.08); }

        /* Empty */
        .empty-state { text-align:center; padding:4rem 2rem; color:#4a6880; }
        .empty-icon { font-size:3rem; margin-bottom:1rem; opacity:.4; }
        .empty-state h3 { font-size:1.1rem; color:#7a9bb5; margin-bottom:.5rem; }

        /* Lang toggle */
        .lang-toggle { display:flex; background:#0f1e2e; border:0.5px solid #1e3248; border-radius:8px; overflow:hidden; flex-shrink:0; }
        .lang-btn { font-size:12px; padding:7px 16px; cursor:pointer; color:#7a9bb5; border:none; background:transparent; font-weight:500; transition:.2s; }
        .lang-btn.active { background:#e53935; color:#fff; }
      `}</style>

      <div className="board-results-wrap">

        {/* ── BREADCRUMB ── */}
        <nav style={{ fontSize:11, color:"#4a6880", marginBottom:"1rem", display:"flex", gap:8, alignItems:"center" }}>
          <a href="/" style={{ color:"#7a9bb5", textDecoration:"none" }}>Home</a>
          <span>/</span>
          <a href="/results" style={{ color:"#7a9bb5", textDecoration:"none" }}>Results</a>
          <span>/</span>
          <span style={{ color:"#e8f4ff" }}>Board Results</span>
        </nav>

        {/* ── PAGE HEADER ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"1rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
          <div>
            <h1 style={{ fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:800, letterSpacing:"-.02em", lineHeight:1.1, marginBottom:".4rem" }}>
              {lang === "en" ? <>All India <span style={{ color:"#00d4aa" }}>Board Results</span> 2026</> : <>সকলো ভাৰত <span style={{ color:"#00d4aa" }}>ব'ৰ্ড পৰীক্ষাৰ ফলাফল</span> ২০২৬</>}
            </h1>
            <p style={{ fontSize:13, color:"#7a9bb5", maxWidth:440, lineHeight:1.7, marginTop:".4rem" }}>
              {lang === "en"
                ? "Class 10 & 12 results from 30+ boards — SEBA, AHSEC, CBSE, UP Board & all state boards. Direct official links."
                : "৩০+ ব'ৰ্ডৰ দশম আৰু দ্বাদশ শ্ৰেণীৰ ফলাফল — ছেবা, আহছেক, চিবিএছই আৰু সকলো ৰাজ্যিক ব'ৰ্ড।"}
            </p>
          </div>
          <div className="lang-toggle">
            <button className={`lang-btn${lang==="en"?" active":""}`} onClick={() => setLang("en")}>EN</button>
            <button className={`lang-btn${lang==="as"?" active":""}`} onClick={() => setLang("as")}>অ</button>
          </div>
        </div>

        {/* ── LIVE STRIP ── */}
        <div className="live-strip">
          <div className="live-dot" />
          <div className="live-text"><strong style={{ color:"#e53935" }}>Live Updates</strong> — Results are being declared. Page updates when new results are out.</div>
          <div className="live-count">{declared} Live</div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="stats-bar">
          <div className="stat-box"><div className={`stat-val s-teal`}>{declared}</div><div className="stat-label">Declared</div></div>
          <div className="stat-box"><div className={`stat-val s-amber`}>{expected}</div><div className="stat-label">Expected</div></div>
          <div className="stat-box"><div className={`stat-val s-blue`}>{upcoming}</div><div className="stat-label">Upcoming</div></div>
          <div className="stat-box"><div className={`stat-val s-red`}>{filtered.length}</div><div className="stat-label">Total Boards</div></div>
        </div>

        {/* ── SEARCH + FILTERS ── */}
        <div style={{ marginBottom:"1.75rem" }}>
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input className="search-input" type="text" placeholder="Search board, state, class..." value={search} onChange={e => setSearch(e.target.value)} />
            <span className="search-count">{filtered.length} results</span>
          </div>
          <div className="filter-row">
            {["all","northeast","national","north","east","west","south"].map(g => (
              <button key={g} className={`f-btn${groupFilter===g?" act-red":""}`} onClick={() => setGroupFilter(g)}>
                {g==="all"?"All Boards":g==="northeast"?"North East":g==="national"?"National":g.charAt(0).toUpperCase()+g.slice(1)+" India"}
              </button>
            ))}
            <div className="f-sep" />
            {["all","declared","expected","upcoming"].map(s => (
              <button key={s} className={`f-btn${statusFilter===s?(s==="declared"?" act-teal":s==="expected"?" act-amber":" act-red"):""}`} onClick={() => setStatusFilter(s)}>
                {s==="all"?"All Status":s==="declared"?"🟢 Declared":s==="expected"?"🟡 Expected":"⚪ Upcoming"}
              </button>
            ))}
            <div className="f-sep" />
            {["all","10","12"].map(c => (
              <button key={c} className={`f-btn${classFilter===c?" act-red":""}`} onClick={() => setClassFilter(c)}>
                {c==="all"?"All Classes":`Class ${c}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── BOARDS ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No boards found</h3>
            <p style={{ fontSize:13, marginTop:".5rem" }}>Try a different search or filter.</p>
          </div>
        ) : (
          sections.map(sec => {
            const list = grouped[sec.key] || [];
            if (!list.length) return null;
            return (
              <div key={sec.key}>
                <div className="section-head">
                  <div className="sh-line" />
                  <div style={{ width:6, height:6, borderRadius:"50%", background:sec.color, flexShrink:0 }} />
                  <div className="sh-label">{sec.label}</div>
                  <div className="sh-line" style={{ background:`linear-gradient(90deg,transparent,#1e3248)` }} />
                </div>
                <div className="boards-grid">
                  {list.map(b => <BoardCard key={b.id} board={b} />)}
                </div>
              </div>
            );
          })
        )}

      </div>
    </>
  );
}
