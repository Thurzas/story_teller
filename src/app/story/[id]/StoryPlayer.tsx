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
      <div className="relative w-full h-full bg-linear-to-b from-blue-900 to-stone-900 flex flex-col items-center justify-center gap-8 px-6 text-center">
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
    <div className="relative w-full h-full">
      {/* Image + texte overlay (prend tout l'espace) */}
      <SequenceView sequence={currentSequence} />

      {/* Indicateur de progression — en haut */}
      <div className="absolute top-6 left-0 right-0 flex gap-2 justify-center">
        {story.sequences.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-white w-8"
                : i < currentIndex
                ? "bg-white/50 w-4"
                : "bg-white/20 w-4"
            }`}
          />
        ))}
      </div>

      {/* Titre de la séquence — sous les dots */}
      {currentSequence.title && (
        <div className="absolute top-14 left-0 right-0 px-8">
          <p className="text-white text-xl font-bold text-center drop-shadow leading-snug">
            {currentSequence.title}
          </p>
        </div>
      )}

      {/* Bouton Précédent — flottant gauche */}
      <button
        onClick={handlePrev}
        disabled={isFirst}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-16 h-16 rotate-45 bg-white/20 hover:bg-white/40 active:scale-95 disabled:opacity-0 backdrop-blur-sm border border-white/30 shadow-lg transition-all flex items-center justify-center"
        aria-label="Séquence précédente"
      >
        <span className="-rotate-45 text-white text-2xl">◀</span>
      </button>

      {/* Bouton Suivant — flottant droite */}
      <button
        onClick={handleNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-16 h-16 rotate-45 bg-white/20 hover:bg-white/40 active:scale-95 backdrop-blur-sm border border-white/30 shadow-lg transition-all flex items-center justify-center"
        aria-label={isLast ? "Terminer" : "Séquence suivante"}
      >
        <span className="-rotate-45 text-white text-2xl">
          {isLast ? "⭐" : "▶"}
        </span>
      </button>
    </div>
  );
}