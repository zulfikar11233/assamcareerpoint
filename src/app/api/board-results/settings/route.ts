// src/app/api/board-results/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getPageSettings,
  getAllBoardOverrides,
  updatePageSettings,
  bulkUpsertBoards,
  initBoardResultsTables,
} from "@/lib/board-results-db";

export async function GET() {
  await initBoardResultsTables();
  const pageSettings = await getPageSettings();
  const overridesMap = await getAllBoardOverrides();
  const boards = Object.values(overridesMap);
  return NextResponse.json({ pageSettings, boards });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.pageSettings) await updatePageSettings(body.pageSettings);
  if (body.boards) await bulkUpsertBoards(body.boards);
  return NextResponse.json({ ok: true });
}