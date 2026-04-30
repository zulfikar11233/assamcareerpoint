"use client";
// src/app/admin/board-results/page.tsx
// Admin panel: edit page title, year, subtitle, and per-board URL + status
// Access at: /admin/board-results

import { useState, useEffect } from "react";

// ── TYPES ──────────────────────────────────────────────────────────
interface PageSettings {
  page_title: string;
  page_year: string;
  page_subtitle_en: string;
  page_subtitle_as: string;
}
interface BoardRow {
  board_id: string;
  board_name: string;
  custom_url: string;
  status: "declared" | "expected" | "upcoming";
}

// ── DEFAULT BOARDS (fallback seed data) ────────────────────────────
const DEFAULT_BOARDS: BoardRow[] = [
  { board_id:"seba",    board_name:"SEBA HSLC",            custom_url:"https://sebaonline.org/",                    status:"declared" },
  { board_id:"ahsec",   board_name:"AHSEC HS",              custom_url:"https://ahsec.assam.gov.in/",                status:"expected" },
  { board_id:"tbse10",  board_name:"TBSE Madhyamik",        custom_url:"https://tbse.tripura.gov.in/",               status:"declared" },
  { board_id:"tbse12",  board_name:"TBSE Higher Secondary", custom_url:"https://tbse.tripura.gov.in/",               status:"expected" },
  { board_id:"nbse",    board_name:"NBSE HSLC & HSSLC",     custom_url:"https://nbsenagaland.com/",                  status:"declared" },
  { board_id:"mbose",   board_name:"MBOSE SSLC & HSSLC",    custom_url:"https://mbose.in/",                          status:"declared" },
  { board_id:"mbse",    board_name:"MBSE HSLC & HSSLC",     custom_url:"https://mbse.mizoram.gov.in/",               status:"expected" },
  { board_id:"bsem",    board_name:"BSEM / COHSEM",         custom_url:"https://bsem.nic.in/",                       status:"declared" },
  { board_id:"cbse10",  board_name:"CBSE Class 10",         custom_url:"https://results.cbse.nic.in/",               status:"expected" },
  { board_id:"cbse12",  board_name:"CBSE Class 12",         custom_url:"https://results.cbse.nic.in/",               status:"declared" },
  { board_id:"icse",    board_name:"ICSE Class 10",         custom_url:"https://results.cisce.org/",                 status:"declared" },
  { board_id:"isc",     board_name:"ISC Class 12",          custom_url:"https://results.cisce.org/",                 status:"declared" },
  { board_id:"nios",    board_name:"NIOS Open Board",       custom_url:"https://results.nios.ac.in/",                status:"upcoming" },
  { board_id:"up10",    board_name:"UP Board Class 10",     custom_url:"https://upresults.nic.in/",                  status:"declared" },
  { board_id:"up12",    board_name:"UP Board Class 12",     custom_url:"https://upresults.nic.in/",                  status:"declared" },
  { board_id:"rbse",    board_name:"Rajasthan Board",       custom_url:"https://rajeduboard.rajasthan.gov.in/",      status:"declared" },
  { board_id:"pseb",    board_name:"Punjab Board",          custom_url:"https://pseb.ac.in/",                        status:"declared" },
  { board_id:"hbse",    board_name:"Haryana Board",         custom_url:"https://bseh.org.in/",                       status:"expected" },
  { board_id:"hpbose",  board_name:"HP Board",              custom_url:"https://hpbose.org/",                        status:"expected" },
  { board_id:"jkbose",  board_name:"JK Board",              custom_url:"https://jkbose.nic.in/",                     status:"expected" },
  { board_id:"ubse",    board_name:"Uttarakhand Board",     custom_url:"https://ubse.uk.gov.in/",                    status:"upcoming" },
  { board_id:"bseb",    board_name:"Bihar Board",           custom_url:"https://biharboardonline.bihar.gov.in/",     status:"declared" },
  { board_id:"jac",     board_name:"Jharkhand Board",       custom_url:"https://jac.jharkhand.gov.in/",              status:"declared" },
  { board_id:"wbbse",   board_name:"WB Board Class 10",     custom_url:"https://wbbse.wb.gov.in/",                   status:"declared" },
  { board_id:"wbchse",  board_name:"WB Board Class 12",     custom_url:"https://wbchse.wb.gov.in/",                  status:"expected" },
  { board_id:"odisha",  board_name:"Odisha Board",          custom_url:"https://bseodisha.ac.in/",                   status:"declared" },
  { board_id:"cgbse",   board_name:"Chhattisgarh Board",    custom_url:"https://cgbse.net/",                         status:"declared" },
  { board_id:"msbshse", board_name:"Maharashtra Board",     custom_url:"https://mahresult.nic.in/",                  status:"declared" },
  { board_id:"gseb",    board_name:"Gujarat Board",         custom_url:"https://gseb.org/",                          status:"expected" },
  { board_id:"mpbse",   board_name:"MP Board",              custom_url:"https://mpbse.nic.in/",                      status:"declared" },
  { board_id:"goa",     board_name:"Goa Board",             custom_url:"https://gbshse.gov.in/",                     status:"declared" },
  { board_id:"tn",      board_name:"Tamil Nadu Board",      custom_url:"https://dge.tn.gov.in/",                     status:"declared" },
  { board_id:"ap",      board_name:"AP Board",              custom_url:"https://bse.ap.gov.in/",                     status:"declared" },
  { board_id:"ts",      board_name:"Telangana Board",       custom_url:"https://bie.telangana.gov.in/",              status:"declared" },
  { board_id:"ksb",     board_name:"Karnataka Board",       custom_url:"https://karresults.nic.in/",                 status:"declared" },
  { board_id:"kerala",  board_name:"Kerala Board",          custom_url:"https://keralaresults.nic.in/",              status:"declared" },
];

const STATUS_COLORS: Record<string, string> = {
  declared: "#00d4aa",
  expected: "#ffb300",
  upcoming: "#7a9bb5",
};

// ── COMPONENT ─────────────────────────────────────────────────────
export default function BoardResultsAdmin() {
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    page_title:       "All India Board Results 2026",
    page_year:        "2026",
    page_subtitle_en: "Class 10 & 12 results from 30+ boards — SEBA, AHSEC, CBSE, UP Board & all state boards. Direct official links.",
    page_subtitle_as: "৩০+ ব'ৰ্ডৰ দশম আৰু দ্বাদশ শ্ৰেণীৰ ফলাফল — ছেবা, আহছেক, চিবিএছই আৰু সকলো ৰাজ্যিক ব'ৰ্ড।",
  });
  const [boards, setBoards]       = useState<BoardRow[]>(DEFAULT_BOARDS);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState<"page"|"boards">("page");
  const [toast, setToast]         = useState<{msg:string;type:"ok"|"err"}|null>(null);

  // Load from API on mount
  useEffect(() => {
    fetch("/api/board-results/settings")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.pageSettings) setPageSettings(data.pageSettings);
        if (data?.boards?.length) setBoards(data.boards);
      })
      .catch(() => {}); // silently use defaults if API not yet set up
  }, []);

  function showToast(msg: string, type: "ok"|"err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── SAVE PAGE SETTINGS ──────────────────────────────────────────
  async function savePageSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/board-results/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSettings }),
      });
      if (res.ok) { setSaved(true); showToast("Page settings saved!"); setTimeout(() => setSaved(false), 2500); }
      else showToast("Failed to save. Check console.", "err");
    } catch { showToast("Network error.", "err"); }
    setSaving(false);
  }

  // ── SAVE BOARDS ─────────────────────────────────────────────────
  async function saveBoards() {
    setSaving(true);
    try {
      const res = await fetch("/api/board-results/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boards }),
      });
      if (res.ok) showToast("All board links saved!");
      else showToast("Failed to save boards.", "err");
    } catch { showToast("Network error.", "err"); }
    setSaving(false);
  }

  function updateBoard(idx: number, field: keyof BoardRow, value: string) {
    setBoards(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  }

  const filteredBoards = boards.filter(b =>
    b.board_name.toLowerCase().includes(search.toLowerCase()) ||
    b.board_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .admin-wrap { max-width:900px; margin:0 auto; padding:2rem 1.25rem 4rem; font-family:'DM Sans',sans-serif; }
        .admin-header { margin-bottom:1.75rem; }
        .admin-header h1 { font-size:1.4rem; font-weight:700; color:#e8f4ff; margin-bottom:.25rem; }
        .admin-header p { font-size:12px; color:#7a9bb5; }
        .breadcrumb { font-size:11px; color:#4a6880; margin-bottom:.75rem; display:flex; gap:6px; }
        .breadcrumb a { color:#7a9bb5; text-decoration:none; }

        .tabs { display:flex; gap:8px; margin-bottom:1.5rem; border-bottom:0.5px solid #1e3248; padding-bottom:0; }
        .adm-tab { font-size:13px; padding:8px 18px; border:none; background:transparent; color:#7a9bb5; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; font-weight:500; transition:.2s; }
        .adm-tab.active { color:#e8f4ff; border-bottom-color:#e53935; }

        .section-box { background:#0f1e2e; border:0.5px solid #1e3248; border-radius:14px; padding:20px 22px; margin-bottom:14px; }
        .section-label { font-size:11px; font-weight:700; color:#4a6880; letter-spacing:.08em; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .section-label::after { content:''; flex:1; height:0.5px; background:#1e3248; }

        .form-group { margin-bottom:14px; }
        .form-label { font-size:12px; color:#7a9bb5; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
        .form-label span { font-size:10px; background:#1e3248; color:#4a6880; padding:1px 7px; border-radius:4px; }
        .form-input { width:100%; background:#080f18; border:0.5px solid #1e3248; border-radius:8px; padding:9px 12px; font-size:13px; color:#e8f4ff; outline:none; transition:.2s; font-family:'DM Sans',sans-serif; }
        .form-input:focus { border-color:#00d4aa; box-shadow:0 0 0 3px rgba(0,212,170,.08); }
        .form-input::placeholder { color:#4a6880; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

        .preview-box { background:#080f18; border:0.5px solid #1e3248; border-radius:8px; padding:12px 16px; margin-top:12px; }
        .preview-label { font-size:10px; color:#4a6880; margin-bottom:8px; text-transform:uppercase; letter-spacing:.06em; }
        .preview-title { font-size:1.4rem; font-weight:800; color:#e8f4ff; line-height:1.2; }
        .preview-title em { color:#00d4aa; font-style:normal; }
        .preview-sub { font-size:12px; color:#7a9bb5; margin-top:6px; line-height:1.6; }

        .save-btn { display:inline-flex; align-items:center; gap:8px; background:#e53935; color:#fff; border:none; border-radius:8px; padding:10px 22px; font-size:13px; font-weight:600; cursor:pointer; transition:.2s; font-family:'DM Sans',sans-serif; }
        .save-btn:hover { background:#c62828; }
        .save-btn:disabled { opacity:.5; cursor:not-allowed; }
        .save-btn.saved { background:#00d4aa; color:#080f18; }

        /* Boards table */
        .search-row { display:flex; gap:10px; margin-bottom:14px; align-items:center; }
        .board-search { flex:1; background:#080f18; border:0.5px solid #1e3248; border-radius:8px; padding:8px 12px; font-size:13px; color:#e8f4ff; outline:none; font-family:'DM Sans',sans-serif; }
        .board-search:focus { border-color:#00d4aa; }
        .board-count { font-size:11px; color:#4a6880; white-space:nowrap; }

        .board-row { display:grid; grid-template-columns:180px 1fr 130px; gap:10px; align-items:center; padding:10px 0; border-bottom:0.5px solid #0d1923; }
        .board-row:last-child { border-bottom:none; }
        .board-row-name { font-size:12px; font-weight:600; color:#e8f4ff; }
        .board-row-id { font-size:10px; color:#4a6880; font-family:monospace; margin-top:2px; }
        .url-input { width:100%; background:#080f18; border:0.5px solid #1e3248; border-radius:7px; padding:7px 10px; font-size:12px; color:#e8f4ff; outline:none; font-family:monospace; transition:.2s; }
        .url-input:focus { border-color:#00d4aa; box-shadow:0 0 0 2px rgba(0,212,170,.08); }
        .status-select { background:#080f18; border:0.5px solid #1e3248; border-radius:7px; padding:7px 10px; font-size:12px; color:#e8f4ff; outline:none; cursor:pointer; width:100%; font-family:'DM Sans',sans-serif; }
        .status-select:focus { border-color:#00d4aa; }

        /* Toast */
        .toast { position:fixed; bottom:2rem; right:2rem; background:#0f1e2e; border:0.5px solid #1e3248; border-radius:10px; padding:12px 18px; font-size:13px; color:#e8f4ff; z-index:1000; display:flex; align-items:center; gap:8px; box-shadow:0 8px 32px rgba(0,0,0,.4); animation:slideUp .25s ease; }
        .toast.ok { border-color:#00d4aa; } .toast.err { border-color:#e53935; }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        .info-box { background:rgba(0,212,170,.06); border:0.5px solid rgba(0,212,170,.2); border-radius:8px; padding:10px 14px; font-size:12px; color:#7a9bb5; margin-bottom:14px; line-height:1.7; }
        .info-box strong { color:#00d4aa; }
      `}</style>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "ok" ? "✓" : "✗"} {toast.msg}
        </div>
      )}

      <div className="admin-wrap">
        {/* HEADER */}
        <div className="admin-header">
          <div className="breadcrumb">
            <a href="/admin/dashboard">Dashboard</a>
            <span>/</span>
            <span style={{ color:"#e8f4ff" }}>Board Results Settings</span>
          </div>
          <h1>Board Results Page Settings</h1>
          <p>Manage the title, year, and all board result links shown at <strong style={{color:"#00d4aa"}}>/results/board</strong></p>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={`adm-tab${activeTab==="page"?" active":""}`} onClick={() => setActiveTab("page")}>
            Page Settings
          </button>
          <button className={`adm-tab${activeTab==="boards"?" active":""}`} onClick={() => setActiveTab("boards")}>
            Board Links ({boards.length})
          </button>
        </div>

        {/* ── TAB 1: PAGE SETTINGS ── */}
        {activeTab === "page" && (
          <>
            <div className="section-box">
              <div className="section-label">Page Title & Year</div>

              <div className="info-box">
                <strong>How it works:</strong> Change the title and year here any time — e.g. from "2026" to "2027" when next year results start. The live page updates immediately after saving.
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">
                    Page Title <span>Shown as H1 on the page</span>
                  </div>
                  <input
                    className="form-input"
                    value={pageSettings.page_title}
                    onChange={e => setPageSettings(p => ({ ...p, page_title: e.target.value }))}
                    placeholder="All India Board Results 2026"
                  />
                </div>
                <div className="form-group">
                  <div className="form-label">
                    Year <span>Used across the page</span>
                  </div>
                  <input
                    className="form-input"
                    value={pageSettings.page_year}
                    onChange={e => setPageSettings(p => ({ ...p, page_year: e.target.value }))}
                    placeholder="2026"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label">Subtitle (English)</div>
                <input
                  className="form-input"
                  value={pageSettings.page_subtitle_en}
                  onChange={e => setPageSettings(p => ({ ...p, page_subtitle_en: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <div className="form-label">Subtitle (Assamese / অসমীয়া)</div>
                <input
                  className="form-input"
                  value={pageSettings.page_subtitle_as}
                  onChange={e => setPageSettings(p => ({ ...p, page_subtitle_as: e.target.value }))}
                />
              </div>

              {/* LIVE PREVIEW */}
              <div className="preview-box">
                <div className="preview-label">Live preview</div>
                <div className="preview-title">
                  {pageSettings.page_title.split(pageSettings.page_year).map((part, i, arr) => (
                    i < arr.length - 1
                      ? <span key={i}>{part}<em>{pageSettings.page_year}</em></span>
                      : <span key={i}>{part}</span>
                  ))}
                </div>
                <div className="preview-sub">{pageSettings.page_subtitle_en}</div>
              </div>
            </div>

            <button
              className={`save-btn${saved ? " saved" : ""}`}
              onClick={savePageSettings}
              disabled={saving}
            >
              {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Page Settings"}
            </button>
          </>
        )}

        {/* ── TAB 2: BOARD LINKS ── */}
        {activeTab === "boards" && (
          <>
            <div className="section-box">
              <div className="section-label">Board Result Links & Status</div>

              <div className="info-box">
                <strong>How it works:</strong> Edit the URL for any board — paste the actual result page link (e.g. the direct 2026 result URL) and set the status. Changes save to your database and appear live on the page immediately.
              </div>

              <div className="search-row">
                <input
                  className="board-search"
                  type="text"
                  placeholder="Search board..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <span className="board-count">{filteredBoards.length} of {boards.length} boards</span>
              </div>

              {/* TABLE HEADER */}
              <div className="board-row" style={{ borderBottom:"0.5px solid #1e3248", paddingBottom:8, marginBottom:4 }}>
                <div style={{ fontSize:10, color:"#4a6880", textTransform:"uppercase", letterSpacing:".06em" }}>Board</div>
                <div style={{ fontSize:10, color:"#4a6880", textTransform:"uppercase", letterSpacing:".06em" }}>Result URL</div>
                <div style={{ fontSize:10, color:"#4a6880", textTransform:"uppercase", letterSpacing:".06em" }}>Status</div>
              </div>

              {filteredBoards.map((board, idx) => {
                const realIdx = boards.findIndex(b => b.board_id === board.board_id);
                return (
                  <div className="board-row" key={board.board_id}>
                    <div>
                      <div className="board-row-name">{board.board_name}</div>
                      <div className="board-row-id">{board.board_id}</div>
                    </div>
                    <input
                      className="url-input"
                      value={board.custom_url}
                      onChange={e => updateBoard(realIdx, "custom_url", e.target.value)}
                      placeholder="https://..."
                    />
                    <select
                      className="status-select"
                      value={board.status}
                      onChange={e => updateBoard(realIdx, "status", e.target.value)}
                      style={{ color: STATUS_COLORS[board.status] }}
                    >
                      <option value="declared" style={{ color:"#00d4aa" }}>🟢 Declared</option>
                      <option value="expected" style={{ color:"#ffb300" }}>🟡 Expected</option>
                      <option value="upcoming" style={{ color:"#7a9bb5" }}>⚪ Upcoming</option>
                    </select>
                  </div>
                );
              })}
            </div>

            <button
              className="save-btn"
              onClick={saveBoards}
              disabled={saving}
            >
              {saving ? "Saving..." : `Save All ${boards.length} Board Links`}
            </button>
          </>
        )}
      </div>
    </>
  );
}
