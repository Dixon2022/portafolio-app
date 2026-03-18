"use client";

import { Velustro } from "uvcanvas";

export function VelustroBackground() {
  return (
    <div className="velustro-backdrop" aria-hidden="true">
      <Velustro className="velustro-canvas" uColor={[0.03, 0.55, 0.42]} />
    </div>
  );
}
