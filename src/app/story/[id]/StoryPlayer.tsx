"use client";

import { useState } from "react";
import { Story } from "@/types/story";
import SequenceView from "@/components/SequenceView";

type Props = {
  story: Story;
};

export default function StoryPlayer({ story }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentSequence = story.sequences[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === story.sequences.length - 1;

  function handleNext() {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handlePrev() {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="w-full h-full bg-linear-to-b from-blue-900 to-stone-900 flex flex-col items-center justify-center gap-8 px-6 text-center">
        <span className="text-9xl">⭐</span>
        <h2 className="text-4xl font-bold text-white">Bravo !</h2>
        <p className="text-2xl text-white/80">Tu as écouté toute l'histoire.</p>
        <button
          onClick={handleRestart}
          className="mt-4 bg-amber-400 hover:bg-amber-500 active:scale-95 text-white text-2xl font-bold py-5 px-10 rounded-full shadow-lg transition-transform"
        >
          🔄 Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex">

      {/* Colonne gauche — illustration (3/4) */}
      <div className="relative w-3/4 h-full">
        <SequenceView sequence={currentSequence} />
      </div>

      {/* Trait pastel blanc — bord organique avec bruit */}
      <svg
        className="absolute inset-y-0 z-10 pointer-events-none"
        style={{ left: "calc(75% - 70px)", width: "90px" }}
        viewBox="0 0 90 1000"
        preserveAspectRatio="none"
        height="100%"
      >
        <defs>
          <filter id="pastel-noise" x="-60%" y="-5%" width="220%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="9"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        {/* Forme blanche : bord gauche organique, remplit vers la droite */}
        <path
          d="M 48,0 C 62,120 34,240 50,360 C 64,480 34,580 50,700 C 62,820 36,900 48,1000 L 90,1000 L 90,0 Z"
          fill="#fffbeb"
          filter="url(#pastel-noise)"
        />
      </svg>

      {/* Colonne droite — contenu (1/4) */}
      <div className="w-1/4 h-full bg-amber-50 flex flex-col px-8 py-8">

        {/* Dots de progression */}
        <div className="flex gap-2 justify-center mb-8">
          {story.sequences.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-amber-400 w-8"
                  : i < currentIndex
                  ? "bg-amber-200 w-4"
                  : "bg-stone-200 w-4"
              }`}
            />
          ))}
        </div>

        {/* Titre de la séquence */}
        {currentSequence.title && (
          <h2 className="text-2xl font-bold text-stone-800 leading-snug mb-4">
            {currentSequence.title}
          </h2>
        )}

        {/* Texte de la séquence */}
        <p className="text-lg text-stone-600 leading-relaxed">
          {currentSequence.text}
        </p>

        <div className="flex-1" />

      </div>

      {/* Bouton Précédent — bord gauche, bas */}
      <button
        onClick={handlePrev}
        disabled={isFirst}
        className="absolute left-4 bottom-8 w-16 h-16 rounded-full bg-white/80 hover:bg-white active:scale-95 disabled:opacity-20 text-2xl shadow-lg transition-transform backdrop-blur-sm"
        aria-label="Séquence précédente"
      >
        ◀
      </button>

      {/* Bouton Suivant — bord droit, bas */}
      <button
        onClick={handleNext}
        className="absolute right-4 bottom-8 w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-95 text-2xl shadow-lg transition-transform"
        aria-label={isLast ? "Terminer" : "Séquence suivante"}
      >
        {isLast ? "⭐" : "▶"}
      </button>

    </div>
  );
}