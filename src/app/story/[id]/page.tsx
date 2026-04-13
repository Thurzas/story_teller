import { getStory } from "@/lib/getStory";
import StoryPlayer from "./StoryPlayer";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const story = await getStory(id);

  if (!story) notFound();

  return (
    <main className="w-screen h-screen overflow-hidden">
      <StoryPlayer story={story} />
    </main>
  );
}