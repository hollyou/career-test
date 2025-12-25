export type TypeKey = "A" | "B" | "C" | "D" | "E" | "F";

export type Choice = {
  label: string;
  score: Partial<Record<TypeKey, number>>;
};

export type Question = {
  id: string;
  title: string;
  choices: Choice[];
};
