import { prisma } from "@/lib/prisma";

export function getCurrentWeekStartUtc(referenceDate: Date = new Date()): Date {
  const weekStart = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate())
  );
  const day = weekStart.getUTCDay();
  const distanceFromMonday = (day + 6) % 7;

  weekStart.setUTCDate(weekStart.getUTCDate() - distanceFromMonday);
  weekStart.setUTCHours(0, 0, 0, 0);

  return weekStart;
}

export async function getCurrentWeekUniqueVisitorsCount(): Promise<number> {
  return prisma.weeklyVisit.count({
    where: {
      weekStart: getCurrentWeekStartUtc(),
    },
  });
}
