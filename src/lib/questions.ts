import { RAW_QUESTIONS } from "./questions.raw";
import { Question, TypeKey } from "./types";

const KEYS: TypeKey[] = ["A", "B", "C", "D", "E", "F"];

type RawQuestion = {
  id: string;
  title: string;
  choices: { label: string; score: unknown }[];
};

export const QUESTIONS: Question[] = (RAW_QUESTIONS as unknown as RawQuestion[]).map(
  (q) => ({
    id: q.id,
    title: q.title,
    choices: q.choices.map((c) => {
      const fullScore: Record<TypeKey, number> = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0
      };

      // ✅ 핵심: score를 안전한 형태로 “강제 정규화”
      const score = (c.score ?? {}) as Partial<Record<TypeKey, number>>;

      for (const k of KEYS) {
        fullScore[k] = score[k] ?? 0;
      }

      return { label: c.label, score: fullScore };
    })
  })
);
