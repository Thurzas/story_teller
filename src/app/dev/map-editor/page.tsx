"use client";

import { useState, useRef, useCallback } from "react";
import { ZONES as SOURCE_ZONES } from "@/data/zones";

// ─── Types ────────────────────────────────────────────────────────────────────

type Point = { x: number; y: number };

type Zone = {
  id: string;
  label: string;
  color: string;
  points: Point[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parse(str: string): Point[] {
  return str.trim().split(/\s+/).map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });
}

function serialize(pts: Point[]): string {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function svgCoords(e: React.MouseEvent, svg: SVGSVGElement): Point {
  const rect = svg.getBoundingClientRect();
  return {
    x: parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1)),
    y: parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1)),
  };
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function MapEditor() {
  const [zones, setZones] = useState<Zone[]>(() =>
    SOURCE_ZONES.map((z) => ({ ...z, points: parse(z.points) }))
  );
  const [selectedId, setSelectedId] = useState<string>("Louvre");
  const [copied, setCopied] = useState(false);

  // Drag state
  const dragging = useRef<{ zoneId: string; pointIndex: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedZone = zones.find((z) => z.id === selectedId)!;

  // ── Mise à jour d'un point ─────────────────────────────────────────────────
  const updatePoint = useCallback(
    (zoneId: string, index: number, pos: Point) => {
      setZones((prev) =>
        prev.map((z) =>
          z.id !== zoneId
            ? z
            : {
                ...z,
                points: z.points.map((p, i) => (i === index ? pos : p)),
              }
        )
      );
    },
    []
  );

  // ── Handlers SVG ──────────────────────────────────────────────────────────
  function handleSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!dragging.current || !svgRef.current) return;
    const pos = svgCoords(e, svgRef.current);
    updatePoint(dragging.current.zoneId, dragging.current.pointIndex, pos);
  }

  function handleSvgMouseUp() {
    dragging.current = null;
  }

  // Clic sur le fond SVG (pas sur un vertex) → ajoute un point à la zone sélectionnée
  function handleSvgClick(e: React.MouseEvent<SVGSVGElement>) {
    // Ignore si on vient de relâcher un drag
    if (e.target !== svgRef.current && (e.target as SVGElement).tagName !== "polygon") return;
    if (!svgRef.current) return;
    const pos = svgCoords(e, svgRef.current);
    setZones((prev) =>
      prev.map((z) =>
        z.id !== selectedId ? z : { ...z, points: [...z.points, pos] }
      )
    );
  }

  // Début du drag d'un vertex
  function handleVertexMouseDown(
    e: React.MouseEvent,
    zoneId: string,
    index: number
  ) {
    e.stopPropagation();
    dragging.current = { zoneId, pointIndex: index };
  }

  // Clic droit sur un vertex → suppression
  function handleVertexContextMenu(
    e: React.MouseEvent,
    zoneId: string,
    index: number
  ) {
    e.preventDefault();
    e.stopPropagation();
    setZones((prev) =>
      prev.map((z) =>
        z.id !== zoneId
          ? z
          : { ...z, points: z.points.filter((_, i) => i !== index) }
      )
    );
  }

  // ── Copie ─────────────────────────────────────────────────────────────────
  function handleCopy() {
    const output = zones
      .map((z) => `// ${z.label}\npoints: "${serialize(z.points)}"`)
      .join("\n\n");
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ─── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col gap-4 p-4 select-none">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-white font-bold text-lg">Éditeur de zones</h1>

        {/* Sélecteur de zone */}
        <div className="flex gap-2">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedId(z.id)}
              style={{
                borderColor: z.color,
                backgroundColor:
                  selectedId === z.id ? z.color + "33" : "transparent",
                color: z.color,
              }}
              className="border-2 rounded-lg px-3 py-1 text-sm font-semibold transition-colors"
            >
              {z.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="ml-auto bg-amber-500 hover:bg-amber-400 text-white font-bold px-4 py-1 rounded-lg text-sm transition-colors"
        >
          {copied ? "Copié ✓" : "Copier tous les points"}
        </button>
      </div>

      {/* Légende */}
      <p className="text-stone-400 text-xs">
        <span className="text-white font-semibold">Drag</span> pour déplacer un sommet ·{" "}
        <span className="text-white font-semibold">Clic sur la carte</span> pour ajouter un point à la zone active ·{" "}
        <span className="text-white font-semibold">Clic droit</span> sur un sommet pour le supprimer
      </p>

      {/* SVG editor */}
      <div
        className="relative mx-auto w-full"
        style={{ aspectRatio: "750/440", maxHeight: "80vh" }}
      >
        <img
          src="/Carte.jpg"
          alt="Carte de Paris"
          className="w-full h-full"
          draggable={false}
        />

        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={handleSvgMouseUp}
          onClick={handleSvgClick}
        >
          {zones.map((zone) => {
            const isSelected = zone.id === selectedId;
            return (
              <g key={zone.id}>
                {/* Polygone */}
                <polygon
                  points={serialize(zone.points)}
                  fill={zone.color + (isSelected ? "33" : "18")}
                  stroke={zone.color}
                  strokeWidth={isSelected ? 0.6 : 0.3}
                  strokeDasharray={isSelected ? undefined : "1,1"}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(zone.id);
                  }}
                />

                {/* Sommets */}
                {isSelected &&
                  zone.points.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={1.4}
                      fill="white"
                      stroke={zone.color}
                      strokeWidth={0.5}
                      className="cursor-grab active:cursor-grabbing"
                      onMouseDown={(e) => handleVertexMouseDown(e, zone.id, i)}
                      onContextMenu={(e) =>
                        handleVertexContextMenu(e, zone.id, i)
                      }
                    />
                  ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Points en cours pour la zone sélectionnée */}
      <div className="bg-stone-800 rounded-xl p-3">
        <span className="text-stone-400 text-xs font-mono mr-2">
          {selectedZone.label} →
        </span>
        <span
          className="text-amber-300 text-xs font-mono break-all"
          style={{ color: selectedZone.color }}
        >
          {serialize(selectedZone.points)}
        </span>
      </div>
    </div>
  );
}
