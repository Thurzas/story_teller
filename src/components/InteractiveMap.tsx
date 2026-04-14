"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapModal from "./MapModal";

// Rapport d'aspect de Carte.jpg — sert au calcul du zoom
const IMAGE_ASPECT_RATIO = 750 / 440;

type Zone = {
  id: string;
  label: string;
  description: string;
  // Points du polygone SVG dans un espace viewBox "0 0 100 100"
  // Format : "x1,y1 x2,y2 x3,y3 ..."
  points: string;
};

const ZONES: Zone[] = [
  {
    id: "Louvre",
    label: "Le Louvre",
    description:
      "Le musée du Louvre, c'est un immense château magique ! Il garde des milliers de trésors et de tableaux merveilleux. Tu as vu la grande pyramide en verre devant ?",
    points: "2,8 12,5 32,5 37,12 37,62 26,68 5,65 2,50",
  },
  {
    id: "opera",
    label: "L'Opéra Garnier",
    description:
      "L'Opéra Garnier est comme un château de conte de fées ! Des danseuses et des chanteurs font des spectacles magnifiques sur sa grande scène dorée.",
    points: "55,3 88,3 91,16 89,50 62,52 52,42 52,12",
  },
  {
    id: "tuileries",
    label: "Les Tuileries",
    description:
      "Le jardin des Tuileries, c'est le grand parc au cœur de Paris ! Les enfants viennent y jouer, faire du manège et écouter le bruit des fontaines.",
    points: "28,52 56,50 63,58 60,80 36,82 24,72 27,55",
  },
  {
    id: "catacombes",
    label: "Les Catacombes",
    description:
      "Sous les rues de Paris se cachent les catacombes... C'est un long couloir souterrain très mystérieux. Un endroit vraiment très très spécial !",
    points: "63,57 86,55 100,60 100,100 65,100 60,76",
  },
];

// Calcule la bounding-box d'un polygone à partir de ses points SVG
function getBounds(points: string): { x: number; y: number; w: number; h: number } {
  const coords = points.trim().split(/\s+/).map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });
  const xs = coords.map((c) => c.x);
  const ys = coords.map((c) => c.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    w: Math.max(...xs) - minX,
    h: Math.max(...ys) - minY,
  };
}

// Zoom CSS sur la bounding-box de la zone cliquée
function ZoneZoom({ points }: { points: string }) {
  const bounds = getBounds(points);
  const containerW = 380;
  const containerH = Math.round(containerW / IMAGE_ASPECT_RATIO);

  const scaledW = (containerW * 100) / bounds.w;
  const scaledH = scaledW / IMAGE_ASPECT_RATIO;

  const bgX = -((bounds.x / 100) * scaledW);
  const bgY = -((bounds.y / 100) * scaledH);

  return (
    <div
      className="rounded-2xl overflow-hidden border-2 border-amber-700 w-full"
      style={{
        height: containerH,
        backgroundImage: "url(/Carte.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${scaledW}px ${scaledH}px`,
        backgroundPosition: `${bgX}px ${bgY}px`,
      }}
    />
  );
}

export default function InteractiveMap() {
  const router = useRouter();
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  function handlePlay() {
    if (activeZone) router.push(`/story/${activeZone.id}`);
  }

  return (
    <>
      {/* Conteneur calé sur le ratio de l'image pour que le SVG s'aligne parfaitement */}
      <div
        className="relative mx-auto"
        style={{ aspectRatio: `${750 / 440}`, maxHeight: "100%", maxWidth: "100%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Carte.jpg"
          alt="Carte de Paris"
          className="w-full h-full"
          draggable={false}
        />

        {/* SVG overlay — viewBox 0 0 100 100 = même espace que les points des zones */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {ZONES.map((zone) => (
            <polygon
              key={zone.id}
              points={zone.points}
              fill="transparent"
              className="hover:fill-amber-400/25 cursor-pointer transition-colors duration-150"
              onClick={() => setActiveZone(zone)}
            />
          ))}
        </svg>
      </div>

      {/* Modale */}
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
            onClick={handlePlay}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xl font-bold py-4 rounded-2xl shadow transition-transform"
          >
            Jouer !
          </button>
        </MapModal>
      )}
    </>
  );
}
