import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QuizQuestion } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  ArrowLeft,
  Flag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScreenQuizExam: React.FC = () => {
  const {
    activeMissionId,
    currentExamType,
    missions,
    questions,
    currentUser,
    setCurrentScreen,
    recordMissionCompletion,
    kkmThreshold,
  } = useApp();

  const mission = missions.find((m) => m.id === activeMissionId) || missions[0];

  // Determine questions for this exam
  const examQuestions = React.useMemo(() => {
    if (currentExamType === 'mission_quiz') {
      // 5 questions specific to track/level
      const matched = questions.filter(
        (q) => q.track === mission.track || q.track === 'all'
      );
      return matched.slice(0, 5);
    }
    // Pre-test or Post-test: 20 questions
    return questions.slice(0, 20);
  }, [currentExamType, mission.track, questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return mission.targetTimeSeconds || 600;
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedAnswers]);

  const currentQ = examQuestions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const toggleFlagQuestion = (qId: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleUseHint = () => {
    setHintsUsed((prev) => prev + 1);
    setActiveHint(
      `Petunjuk: Perhatikan regulasi Permen LHK No. 68/2016 atau prinsip kerja standar SNI. (-5 Poin Penalti)`
    );
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    const mistakes: string[] = [];

    examQuestions.forEach((q) => {
      const ans = selectedAnswers[q.id];
      if (ans === q.correctIndex) {
        correctCount += 1;
      } else {
        mistakes.push(
          `Soal #${q.id}: Jawaban Anda kurang tepat. Pembahasan: ${q.explanation}`
        );
      }
    });

    const rawScore = Math.round((correctCount / examQuestions.length) * 100);
    // Apply hint penalty: -5 per hint (PRD Bagian 4)
    const finalScore = Math.max(0, rawScore - hintsUsed * 5);

    // Star calculation
    let stars = 0;
    if (finalScore >= 90) stars = 3;
    else if (finalScore >= 75) stars = 2;
    else if (finalScore >= 60) stars = 1;

    // Bonus XP (Bagian 4)
    let bonusRatio = 0;
    if (hintsUsed === 0) bonusRatio += 0.1;
    if (secondsRemaining > 60) bonusRatio += 0.1;

    const baseXP =
      currentExamType === 'pre_test'
        ? 50 // Pre-test fixed 50 XP
        : Math.round((finalScore / 100) * mission.maxXP);

    const bonusXP = Math.round(baseXP * bonusRatio);
    const totalXP = baseXP + bonusXP;

    const unlockedBadges: string[] = [];
    if (currentExamType === 'post_test' && finalScore >= 90) {
      unlockedBadges.push('badge_gemilang');
    }
    if (hintsUsed === 0 && stars >= 2) {
      unlockedBadges.push('badge_tanpa_petunjuk');
    }

    if (finalScore >= 75) {
      confetti({ particleCount: 80, spread: 70 });
    }

    const recommendedReview =
      mistakes.length > 0
        ? `Tinjau kembali topik: ${mistakes[0].slice(0, 80)}...`
        : 'Pemahaman materi sempurna! Pertahankan kualitas ini.';

    recordMissionCompletion({
      missionId: mission.id,
      score: finalScore,
      stars,
      baseXP,
      bonusXP,
      totalXP,
      hintsUsed,
      elapsedSeconds: mission.targetTimeSeconds - secondsRemaining,
      unlockedBadgeIds: unlockedBadges,
      mistakes,
      recommendedReview,
    });
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                {currentExamType === 'pre_test'
                  ? 'Pre-Test Awal'
                  : currentExamType === 'post_test'
                  ? 'Post-Test Evaluasi Akhir'
                  : `Kuis Misi · ${mission.id}`}
              </span>
              <span className="text-xs text-slate-500">
                {examQuestions.length} Soal Pilihan Ganda (A–D)
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{mission.title}</h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Timer countdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-teal-400 font-bold border border-slate-800">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>
                {Math.floor(secondsRemaining / 60)}:
                {(secondsRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {/* Hint button */}
            <button
              onClick={handleUseHint}
              className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 font-semibold cursor-pointer"
            >
              Petunjuk (-5 Poin)
            </button>
          </div>
        </div>

        {/* Question Navigator Strip 1-20 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-700">Navigasi Nomor Soal:</span>
            <span className="text-slate-500">
              Terjawab: <strong className="text-teal-700">{answeredCount}</strong> / {examQuestions.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {examQuestions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              const isFlagged = flaggedQuestions.has(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setActiveHint(null);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all relative cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-600 text-white ring-2 ring-teal-500/30'
                      : isAnswered
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint banner if used */}
        {activeHint && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span>{activeHint}</span>
            <button
              onClick={() => setActiveHint(null)}
              className="text-amber-800 hover:text-amber-950 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Current Question Body */}
        {currentQ && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-teal-800 font-mono bg-teal-50 px-2.5 py-1 rounded-lg">
                SOAL #{currentIndex + 1} DARI {examQuestions.length}
              </span>

              <button
                onClick={() => toggleFlagQuestion(currentQ.id)}
                className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                  flaggedQuestions.has(currentQ.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions.has(currentQ.id) ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Multiple Choice Options A-D */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const optLetter = ['A', 'B', 'C', 'D'][optIdx];
                const isSelected = selectedAnswers[currentQ.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {optLetter}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setActiveHint(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < examQuestions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1));
                    setActiveHint(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Selesai & Kirim Jawaban</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Konfirmasi Pengiriman Jawaban
                </h3>
                <p className="text-slate-500">
                  Anda telah menjawab <strong>{answeredCount}</strong> dari {examQuestions.length} soal.
                  {answeredCount < examQuestions.length && (
                    <span className="text-rose-600 block font-semibold mt-1">
                      Perhatian: Terdapat {examQuestions.length - answeredCount} soal yang belum Anda isi!
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Periksa Kembali
                </button>
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    handleSubmitExam();
                  }}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Ya, Kirim Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
