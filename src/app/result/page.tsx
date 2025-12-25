"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/lib/questions";
import { RESULTS } from "@/lib/results";
import type { TypeKey } from "@/lib/types";

const STORAGE_KEY = "career_test_answers_v1";
const KEYS: TypeKey[] = ["A", "B", "C", "D", "E", "F"];

function computeTop(answers: number[]) {
  const sums: Record<TypeKey, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

  QUESTIONS.forEach((q, qi) => {
    const ci = answers[qi];
    if (ci == null || ci < 0) return;
    const choice = q.choices[ci];
    if (!choice) return;

    KEYS.forEach((k) => {
      sums[k] += choice.score[k] || 0;
    });
  });

  let top: TypeKey = "A";
  KEYS.forEach((k) => {
    if (sums[k] > sums[top]) top = k;
  });

  return { sums, top };
}

export default function ResultPage() {
  const [answers, setAnswers] = useState<number[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setAnswers([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setAnswers(parsed.map((n) => Number(n)));
      else setAnswers([]);
    } catch {
      setAnswers([]);
    }
  }, []);

  const computed = useMemo(() => {
    if (!answers) return null;
    if (answers.length !== QUESTIONS.length || answers.some((a) => a < 0)) return null;
    return computeTop(answers);
  }, [answers]);

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  // 아직 로딩 중
  if (answers === null) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <p className="text-gray-600">결과를 불러오는 중…</p>
        </div>
      </main>
    );
  }

  // 답이 없거나 미완료면 테스트로 유도
  if (!computed) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-xl font-semibold">결과를 만들 수 없어요</h1>
          <p className="mt-2 text-gray-600">
            아직 답변이 저장되지 않았거나, 테스트를 끝까지 완료하지 않았을 수 있어요.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/test"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black"
            >
              테스트 하러 가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const r = RESULTS[computed.top];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-xl font-semibold">결과</h1>
          <p className="mt-2 text-gray-600">당신의 커리어 성장 성향은…</p>
        </header>

        <section className="rounded-2xl border p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">{r.title}</h2>
          <p className="mt-3 text-gray-800">{r.oneLiner}</p>

          <div className="mt-6 grid gap-5">
            <div>
              <h3 className="font-semibold">강점</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
                {r.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">성장 시 주의점</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
                {r.cautions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">지금 필요한 핵심 질문 3개</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700">
                {r.questions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold">오늘 실천할 액션 3가지</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700">
                {r.actions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border p-6">
          <h3 className="font-semibold">점수 보기(참고)</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
            {KEYS.map((k) => (
              <div key={k} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                <span>{k}</span>
                <span className="font-semibold">{computed.sums[k]}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex gap-3">
          <Link
            href="/test"
            onClick={reset}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black"
          >
            다시 하기
          </Link>

          <Link
            href="/test"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            문항 수정하러(테스트 화면)
          </Link>
        </div>
      </div>
    </main>
  );
}
