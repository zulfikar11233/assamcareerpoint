// src/lib/db.ts
// This file connects to our SQLite database
// Think of SQLite as a smart Excel file that stores all our data

import Database from 'better-sqlite3';
import path from 'path';

// The database file will be created at the root of your project
const DB_PATH = path.join(process.cwd(), 'database.sqlite');

// Create a connection to the database
// The database file is created automatically if it doesn't exist
let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');
    // Create tables if they don't exist yet
    createTables(db);
  }
  return db;
}

// This function creates all our database tables
// Tables are like sheets in Excel — each stores different data
function createTables(database: Database.Database) {

  // USERS TABLE — stores admin login info
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      created_at TEXT    DEFAULT (datetime('now'))
    )
  `);

  // CATEGORIES TABLE — Govt Job, Private Job, Admit Card, etc.
  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    )
  `);

  // JOBS TABLE — stores all job postings
  database.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      organization TEXT NOT NULL,
      category_id  INTEGER NOT NULL,
      district     TEXT,
      vacancy      INTEGER DEFAULT 0,
      qualification TEXT,
      age_limit    TEXT,
      salary       TEXT,
      last_date    TEXT,
      how_to_apply TEXT,
      apply_link   TEXT,
      pdf_path     TEXT,
      youtube_link TEXT,
      post_date    TEXT DEFAULT (date('now')),
      updated_at   TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // PDF_DOCUMENTS TABLE — stores uploaded PDFs
  database.exec(`
    CREATE TABLE IF NOT EXISTS pdf_documents (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT,
      file_path   TEXT NOT NULL,
      category    TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now'))
    )
  `);

  // INSERT DEFAULT CATEGORIES if not already there
  const categoryCount = database.prepare(
    'SELECT COUNT(*) as count FROM categories'
  ).get() as { count: number };

  if (categoryCount.count === 0) {
    const insertCat = database.prepare(
      'INSERT INTO categories (name, slug) VALUES (?, ?)'
    );
    insertCat.run('Govt Jobs',    'govt-jobs');
    insertCat.run('Private Jobs', 'private-jobs');
    insertCat.run('District Jobs','district-jobs');
    insertCat.run('Admit Card',   'admit-card');
    insertCat.run('Result',       'result');
    insertCat.run('Syllabus',     'syllabus');
    insertCat.run('Answer Key',   'answer-key');
    insertCat.run('PDF Forms',    'pdf-forms');
    console.log('✅ Default categories created');
  }
}

export default getDb;