export type Zone = {
  id: string;
  label: string;
  description: string;
  color: string;
  // Points du polygone SVG dans un espace viewBox "0 0 100 100"
  // Format : "x1,y1 x2,y2 x3,y3 ..."
  points: string;
};

export const ZONES: Zone[] = [
  {
    id: "Louvre",
    label: "Le Louvre",
    color: "#3b82f6",
    description:
      "Le musée du Louvre, c'est un immense château magique ! Il garde des milliers de trésors et de tableaux merveilleux. Tu as vu la grande pyramide en verre devant ?",
    points: "25.9,21.7 30.6,23.0 34.9,28.3 37.3,33.0 36.3,39.1 32.7,45.5 28.2,58.0 24.9,62.7 16.9,64.5 11.9,57.7 5.8,53.1 6.2,34.6 17.2,24.6",
  },
  {
    id: "opera",
    label: "L'Opéra Garnier",
    color: "#a855f7",
    description:
      "L'Opéra Garnier est comme un château de conte de fées ! Des danseuses et des chanteurs font des spectacles magnifiques sur sa grande scène dorée.",
    points: "69.4,5.0 76.1,15.3 77.8,23.2 83.4,29.3 81.4,33.4 69.5,42.0 60.5,41.5 53.7,36.3 53.5,32.1 55.5,28.8 55.5,17.9 56.9,14.7 63.7,8.5",
  },
  {
    id: "tuileries",
    label: "Les Tuileries",
    color: "#22c55e",
    description:
      "Le jardin des Tuileries, c'est le grand parc au cœur de Paris ! Les enfants viennent y jouer, faire du manège et écouter le bruit des fontaines.",
    points: "58.5,45.4 59.2,52.4 56.9,60.3 52.6,64.9 44.9,69.9 38.9,68.7 33.2,64.5 31.2,55.9 33.6,47.4 37.5,41.8 39.7,35.9 44.3,35.2 49.9,36.0 54.5,39.3",
  },
  {
    id: "catacombes",
    label: "Les Catacombes",
    color: "#ef4444",
    description:
      "Sous les rues de Paris se cachent les catacombes... C'est un long couloir souterrain très mystérieux. Un endroit vraiment très très spécial !",
    points: "77.9,56.4 85.1,53.3 96.4,60.1 98.4,76.6 96.2,89.3 89.8,98.2 75.3,96.9 70.0,91.0 67.4,85.6 68.5,77.0 68.7,71.3 69.5,65.2 72.7,61.6 76.2,59.9",
  },
];
