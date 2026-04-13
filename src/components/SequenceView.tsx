"use client";

import { Sequence } from "@/types/story";

type Props = {
  sequence: Sequence;
};

export default function SequenceView({ sequence }: Props) {
  return (
    <div className="w-full h-full bg-stone-900">
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
  );
}