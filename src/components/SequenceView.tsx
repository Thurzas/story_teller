"use client";

import { Sequence } from "@/types/story";

type Props = {
  sequence: Sequence;
};

export default function SequenceView({ sequence }: Props) {
  return (
    <div className="relative w-full h-full">
      {/* Image plein écran */}
      <div className="absolute inset-0 bg-stone-900">
        {sequence.image ? (
          <img
            src={sequence.image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-b from-blue-900 to-stone-900" />
        )}
      </div>

      {/* Overlay texte bas */}
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-8 pt-20 pb-8">
        <p className="text-white text-2xl font-semibold text-center leading-relaxed drop-shadow">
          {sequence.text}
        </p>
      </div>
    </div>
  );
}