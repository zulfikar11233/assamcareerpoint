// src/lib/board-results-db.ts
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "board_results.db");
const db = new Database(dbPath);

export function initBoardResultsTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS board_results_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    CREATE TABLE IF NOT EXISTS board_overrides (
      board_id TEXT PRIMARY KEY,
      board_name TEXT,
      display_name TEXT,
      result_link TEXT,
      status TEXT,
      expected_date TEXT,
      updated_at TEXT
    );
  `);
}

export async function getPageSettings() {
  const row = db.prepare("SELECT value FROM board_results_settings WHERE key = ?").get("page_settings") as { value: string } | undefined;
  return row ? JSON.parse(row.value) : {
    title: "Board Exam Results 2026",
    description: "Check 10th & 12th results for CBSE, SEBA, AHSEC, ICSE, and other boards.",
    heroMessage: "Get direct links to official result portals",
  };
}

export async function updatePageSettings(settings: any) {
  db.prepare("INSERT OR REPLACE INTO board_results_settings (key, value) VALUES (?, ?)").run("page_settings", JSON.stringify(settings));
}

export async function getAllBoardOverrides() {
  const rows = db.prepare("SELECT * FROM board_overrides").all() as any[];
  const map: Record<string, any> = {};
  for (const row of rows) map[row.board_id] = row;
  return map;
}

export async function bulkUpsertBoards(boards: any[]) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO board_overrides
    (board_id, board_name, display_name, result_link, status, expected_date, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  for (const b of boards) {
    stmt.run(b.board_id, b.board_name, b.display_name, b.result_link, b.status, b.expected_date, now);
  }
}

export async function getBoardOverride(boardId: string) {
  return db.prepare("SELECT * FROM board_overrides WHERE board_id = ?").get(boardId) as any | undefined;
}

initBoardResultsTables();