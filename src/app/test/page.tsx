"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/questions";

const STORAGE_KEY = "career_test_answers_v1";

export default function TestPage() {
  const router = useRouter();
  const total = QUESTIONS.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    () => Array(total).fill(-1) // -1이면 아직 선택 안 함
  );

  const current = QUESTIONS[index];
  const selected = answers[index];

  const progress = useMemo(() => {
    const done = answers.filter((a) => a !== -1).length;
    return Math.round((done / total) * 100);
  }, [answers, total]);

  const canGoPrev = index > 0;
  const canGoNext = selected !== -1;

  function choose(choiceIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choiceIndex;
      return next;
    });
  }

  function goPrev() {
    if (!canGoPrev) return;
    setIndex((i) => i - 1);
  }

  function goNext() {
    if (!canGoNext) return;

    if (index < total - 1) {
      setIndex((i) => i + 1);
      return;
    }

    // 마지막 문항이면 저장하고 결과로 이동
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // 로컬스토리지 막힌 경우도 있으니 그냥 진행
    }
    router.push("/result");
  }

  function resetAll() {
    const fresh = Array(total).fill(-1);
    setAnswers(fresh);
    setIndex(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold">커리어 성장 성향 테스트</h1>
            <button
              onClick={resetAll}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            >
              처음부터
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {index + 1} / {total}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-gray-900 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <section className="rounded-2xl border p-6 shadow-sm">
          <h2 className="text-lg font-medium leading-snug">{current.title}</h2>

          <div className="mt-5 grid gap-3">
            {current.choices.map((c, ci) => {
              const active = ci === selected;
              return (
                <button
                  key={ci}
                  onClick={() => choose(ci)}
                  className={[
                    "w-full rounded-2xl border px-4 py-4 text-left transition",
                    "hover:bg-gray-50",
                    active ? "border-gray-900 bg-gray-50" : "border-gray-200"
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={[
                        "mt-1 h-4 w-4 rounded-full border",
                        active ? "border-gray-900 bg-gray-900" : "border-gray-300"
                      ].join(" ")}
                    />
                    <span className="text-base leading-relaxed">{c.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              className={[
                "rounded-xl border px-4 py-2 text-sm",
                canGoPrev ? "hover:bg-gray-50" : "opacity-40"
              ].join(" ")}
            >
              ← 이전
            </button>

            <button
              onClick={goNext}
              disabled={!canGoNext}
              className={[
                "rounded-xl px-4 py-2 text-sm text-white",
                canGoNext ? "bg-gray-900 hover:bg-black" : "bg-gray-300"
              ].join(" ")}
            >
              {index === total - 1 ? "결과 보기" : "다음 →"}
            </button>
          </div>
        </section>

        <p className="mt-6 text-sm text-gray-500">
          * 이 테스트는 참고용이며, 결과는 “현재 상태”를 기준으로 보여줘요.
        </p>
      </div>
    </main>
  );
}
