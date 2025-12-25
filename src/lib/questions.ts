import { RAW_QUESTIONS } from "./questions.raw";
import { Question, TypeKey } from "./types";

const KEYS: TypeKey[] = ["A", "B", "C", "D", "E", "F"];

export const QUESTIONS: Question[] = RAW_QUESTIONS.map((q) => ({
  id: q.id,
  title: q.title,
  choices: q.choices.map((c) => {
    const fullScore = Object.fromEntries(
      KEYS.map((k) => [k, 0])
    ) as Record<TypeKey, number>;

    for (const k of Object.keys(c.score) as TypeKey[]) {
      fullScore[k] = c.score[k] ?? 0;
    }

    return { label: c.label, score: fullScore };
  }),
}));
