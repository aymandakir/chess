"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getLessonById } from "@/lib/lessons";
import { useProgress } from "@/lib/useProgress";
import { useTheme } from "@/lib/useTheme";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;
  const router = useRouter();
  const { isDark } = useTheme();
  const { completedLessons, completeLesson } = useProgress();

  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Lesson not found
          </h1>
          <button
            onClick={() => router.push('/learn')}
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Back to lessons
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = completedLessons.includes(lessonId);

  const handleComplete = () => {
    if (!isCompleted) {
      completeLesson(lessonId);
    }
    router.push('/learn');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/learn')}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Academy</span>
        </button>

        {/* Lesson Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-3">
                {lesson.title}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                {lesson.description}
              </p>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        {lesson.objectives && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 mb-6">
            <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
              Learning Objectives
            </h2>
            <ul className="space-y-3">
              {lesson.objectives.map((objective, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300"
                >
                  <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Practice Section */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950/30 dark:to-blue-950/30 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800 mb-6">
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-3">
            Ready to Practice?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Test your knowledge by playing against the computer at an appropriate level. 
            Practice makes perfect!
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/bot?elo=${lesson.eloRequirement + 200}`)}
              className="flex-1 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Practice vs Bot
            </button>
            <button
              onClick={handleComplete}
              className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 ${
                isCompleted
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white border-2 border-neutral-200 dark:border-neutral-600'
              }`}
            >
              {isCompleted ? 'Review Lesson' : 'Mark Complete'}
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white mb-3">
            💡 Study Tips
          </h2>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
            <li>• Read through all objectives carefully</li>
            <li>• Practice each concept on the board</li>
            <li>• Play against the bot to test your understanding</li>
            <li>• Review the lesson if you struggle</li>
            <li>• Move to the next lesson when you feel confident</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
