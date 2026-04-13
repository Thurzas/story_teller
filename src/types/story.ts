export type Sequence = {
  id: number;
  title?: string;
  text: string;
  audio?: string;
  image?: string;
};

export type Story = {
  id: string;
  title: string;
  sequences: Sequence[];
};