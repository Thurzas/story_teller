"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MapModal from "./MapModal";
import { ZONES, type Zone } from "@/data/zones";

const IMAGE_ASPECT_RATIO = 750 / 440;

// ─── Point-dans-polygone (ray casting) ───────────────────────────────────────
// Coordonnées x/y en % (0-100), pointsStr au format "x1,y1 x2,y2 ..."
function isPointInPolygon(x: number, y: number, pointsStr: string): boolean {
  const pts = pointsStr.trim().split(/\s+/).map((p) => {
    const [px, py] = p.split(",").map(Number);
    return { x: px, y: py };
  });
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// ─── Zoom CSS sur la bounding-box de la zone ─────────────────────────────────
function getBounds(points: string) {
  const coords = points.trim().split(/\s+/).map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });
  const xs = coords.map((c) => c.x);
  const ys = coords.map((c) => c.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
}

function ZoneZoom({ points }: { points: string }) {
  const bounds = getBounds(points);
  const containerW = 380;
  const containerH = Math.round(containerW / IMAGE_ASPECT_RATIO);
  const scaledW = (containerW * 100) / bounds.w;
  const scaledH = scaledW / IMAGE_ASPECT_RATIO;

  return (
    <div
      className="rounded-2xl overflow-hidden border-2 border-amber-700 w-full"
      style={{
        height: containerH,
        backgroundImage: "url(/Carte.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${scaledW}px ${scaledH}px`,
        backgroundPosition: `${-((bounds.x / 100) * scaledW)}px ${-((bounds.y / 100) * scaledH)}px`,
      }}
    />
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function InteractiveMap() {
  const router = useRouter();
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  useEffect(() => {
    console.log("[InteractiveMap] composant monté — React hydraté OK");
  }, []);

  function getHitZone(clientX: number, clientY: number, rect: DOMRect) {
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    console.log(`[InteractiveMap] coords % → x:${x.toFixed(1)} y:${y.toFixed(1)}`);
    const hit = ZONES.find((z) => isPointInPolygon(x, y, z.points)) ?? null;
    console.log(`[InteractiveMap] zone détectée → ${hit?.id ?? "aucune"}`);
    return hit;
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    console.log("[InteractiveMap] onTouchStart déclenché");
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const hit = getHitZone(touch.clientX, touch.clientY, rect);
    if (hit) setActiveZone(hit);
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    console.log("[InteractiveMap] onClick déclenché");
    const rect = e.currentTarget.getBoundingClientRect();
    const hit = getHitZone(e.clientX, e.clientY, rect);
    if (hit) setActiveZone(hit);
  }

  return (
    <>
      <div
        className="relative mx-auto"
        style={{ aspectRatio: `${750 / 440}`, maxHeight: "100%", maxWidth: "100%" }}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Carte.jpg"
          alt="Carte de Paris"
          className="w-full h-full"
          draggable={false}
        />

        {/* SVG : rôle visuel uniquement — pas d'event handlers, mais pointer-events
            actifs pour que le hover CSS fonctionne sur PC. Les événements bubblent
            naturellement jusqu'au onPointerDown de la div parente. */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {ZONES.map((zone) => (
            <polygon
              key={zone.id}
              points={zone.points}
              fill="rgba(0,0,0,0.001)"
              className="hover:fill-amber-400/25 transition-colors duration-150"
            />
          ))}
        </svg>
      </div>

      {activeZone && (
        <MapModal onClose={() => setActiveZone(null)}>
          <h2 className="text-2xl font-bold text-amber-900 text-center">
            {activeZone.label}
          </h2>
          <ZoneZoom points={activeZone.points} />
          <p className="text-stone-700 text-lg text-center leading-relaxed">
            {activeZone.description}
          </p>
          <button
            onClick={() => router.push(`/story/${activeZone.id}`)}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xl font-bold py-4 rounded-2xl shadow transition-transform"
          >
            Jouer !
          </button>
        </MapModal>
      )}
    </>
  );
}
