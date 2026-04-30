// src/lib/board-results-db.ts
// Manages board_results_settings table in MySQL
// Stores: page title, page year, and per-board override URLs

import { pool } from "./db"; // your existing DB connection

// ── TYPES ─────────────────────────────────────────────────────────
export interface BoardResultSettings {
  id: number;
  board_id: string;          // e.g. "seba", "cbse10"
  board_name: string;        // display name
  custom_url: string;        // editable result link
  status: "declared" | "expected" | "upcoming";
  updated_at: string;
}

export interface PageSettings {
  page_title: string;        // e.g. "All India Board Results 2026"
  page_year: string;         // e.g. "2026"
  page_subtitle_en: string;
  page_subtitle_as: string;
}

// ── INIT TABLES ───────────────────────────────────────────────────
export async function initBoardResultsTables() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS board_results_page_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS board_results_boards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      board_id VARCHAR(50) UNIQUE NOT NULL,
      board_name VARCHAR(150) NOT NULL,
      custom_url TEXT,
      status ENUM('declared','expected','upcoming') DEFAULT 'upcoming',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Seed default page settings if empty
  await pool.execute(`
    INSERT IGNORE INTO board_results_page_settings (setting_key, setting_value) VALUES
    ('page_title',       'All India Board Results 2026'),
    ('page_year',        '2026'),
    ('page_subtitle_en', 'Class 10 & 12 results from 30+ boards — SEBA, AHSEC, CBSE, UP Board & all state boards. Direct official links.'),
    ('page_subtitle_as', '৩০+ ব''ৰ্ডৰ দশম আৰু দ্বাদশ শ্ৰেণীৰ ফলাফল — ছেবা, আহছেক, চিবিএছই আৰু সকলো ৰাজ্যিক ব''ৰ্ড।')
  `);
}

// ── PAGE SETTINGS ─────────────────────────────────────────────────
export async function getPageSettings(): Promise<PageSettings> {
  const [rows] = await pool.execute(
    `SELECT setting_key, setting_value FROM board_results_page_settings`
  ) as any[];
  const map: Record<string, string> = {};
  rows.forEach((r: any) => { map[r.setting_key] = r.setting_value; });
  return {
    page_title:       map.page_title       ?? "All India Board Results 2026",
    page_year:        map.page_year        ?? "2026",
    page_subtitle_en: map.page_subtitle_en ?? "",
    page_subtitle_as: map.page_subtitle_as ?? "",
  };
}

export async function updatePageSettings(settings: Partial<PageSettings>) {
  for (const [key, value] of Object.entries(settings)) {
    await pool.execute(
      `INSERT INTO board_results_page_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [key, value]
    );
  }
}

// ── BOARD URLS ────────────────────────────────────────────────────
export async function getAllBoardOverrides(): Promise<Record<string, BoardResultSettings>> {
  const [rows] = await pool.execute(
    `SELECT * FROM board_results_boards`
  ) as any[];
  const map: Record<string, BoardResultSettings> = {};
  (rows as BoardResultSettings[]).forEach(r => { map[r.board_id] = r; });
  return map;
}

export async function upsertBoardOverride(
  boardId: string,
  boardName: string,
  customUrl: string,
  status: "declared" | "expected" | "upcoming"
) {
  await pool.execute(
    `INSERT INTO board_results_boards (board_id, board_name, custom_url, status)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       board_name = VALUES(board_name),
       custom_url = VALUES(custom_url),
       status     = VALUES(status)`,
    [boardId, boardName, customUrl, status]
  );
}

export async function bulkUpsertBoards(
  boards: { board_id: string; board_name: string; custom_url: string; status: string }[]
) {
  for (const b of boards) {
    await upsertBoardOverride(
      b.board_id,
      b.board_name,
      b.custom_url,
      b.status as "declared" | "expected" | "upcoming"
    );
  }
}
