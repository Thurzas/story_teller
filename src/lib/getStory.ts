import fs from "fs";
import path from "path";
import { Story } from "@/types/story";

export async function getStory(id: string): Promise<Story | null> {
  const narrationsDir = path.join(process.cwd(), "narrations");

  // Cherche le fichier JSON correspondant à l'id (insensible à la casse)
  let files: string[];
  try {
    files = fs.readdirSync(narrationsDir);
  } catch {
    return null;
  }

  const match = files.find(
    (f) => f.replace(/\.json$/i, "").toLowerCase() === id.toLowerCase()
  );

  if (!match) return null;

  const filePath = path.join(narrationsDir, match);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Story;
}