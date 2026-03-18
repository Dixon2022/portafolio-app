import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentWeekStartUtc } from "@/lib/visit-analytics";

const VISITOR_COOKIE_NAME = "portfolio_visitor_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export async function POST() {
  const cookieStore = await cookies();
  const existingVisitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
  const visitorId = existingVisitorId ?? randomUUID();
  const now = new Date();

  await prisma.weeklyVisit.upsert({
    where: {
      visitorId_weekStart: {
        visitorId,
        weekStart: getCurrentWeekStartUtc(now),
      },
    },
    update: {
      lastSeenAt: now,
    },
    create: {
      visitorId,
      weekStart: getCurrentWeekStartUtc(now),
      firstSeenAt: now,
      lastSeenAt: now,
    },
  });

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: VISITOR_COOKIE_NAME,
    value: visitorId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  return response;
}
