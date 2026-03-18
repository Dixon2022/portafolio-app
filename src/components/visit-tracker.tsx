"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    void fetch("/api/track-visit", {
      method: "POST",
      cache: "no-store",
    }).catch(() => {
      // Tracking failures are non-critical for the visitor experience.
    });
  }, []);

  return null;
}
