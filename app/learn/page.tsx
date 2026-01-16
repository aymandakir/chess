"use client";

import { useRouter } from "next/navigation";
import { Home, Trophy, Lock, CheckCircle2, Circle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { lessonCategories } from "@/lib/lessons";
import { useProgress } from "@/lib/useProgress";

export default function LearnPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { completedLessons, currentElo } = useProgress();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'intermediate': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'advanced': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'expert': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'master': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-neutral-100 dark:bg-neutral-800';
    }
  };

  const isLessonUnlocked = (lesson: any) => {
    return currentElo >= lesson.eloRequirement;
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              Chess Academy
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Your journey from beginner to grandmaster
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Home</span>
            </a>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6" />
                <h2 className="text-2xl font-bold font-display">Your Progress</h2>
              </div>
              <p className="text-primary-100">
                Current Rating: <span className="font-bold text-2xl">{currentElo}</span> ELO
              </p>
              <p className="text-sm text-primary-100 mt-1">
                {completedLessons.length} lessons completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-primary-100 mb-1">Your Level</div>
              <div className="text-2xl font-bold">
                {currentElo < 800 ? 'Beginner' :
                 currentElo < 1400 ? 'Intermediate' :
                 currentElo < 2000 ? 'Advanced' :
                 currentElo < 2400 ? 'Expert' : 'Master'}
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Categories */}
        <div className="space-y-8">
          {lessonCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
                    {category.name}
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {category.lessons.map((lesson, index) => {
                  const unlocked = isLessonUnlocked(lesson);
                  const completed = isLessonCompleted(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => unlocked && router.push(`/learn/${lesson.id}`)}
                      disabled={!unlocked}
                      className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                        unlocked
                          ? 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md cursor-pointer'
                          : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700/50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            completed 
                              ? 'bg-green-500 dark:bg-green-600' 
                              : unlocked 
                              ? 'bg-primary-500 dark:bg-primary-600' 
                              : 'bg-neutral-300 dark:bg-neutral-700'
                          }`}>
                            {completed ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : unlocked ? (
                              <Circle className="w-6 h-6 text-white" />
                            ) : (
                              <Lock className="w-5 h-5 text-neutral-500 dark:text-neutral-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                              {lesson.title}
                            </h3>
                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium border mt-1 ${getDifficultyColor(lesson.difficulty)}`}>
                              {lesson.difficulty}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        {lesson.description}
                      </p>

                      {!unlocked && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                          <Lock className="w-4 h-4" />
                          <span>Requires {lesson.eloRequirement} ELO</span>
                        </div>
                      )}

                      {unlocked && lesson.objectives && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-3">
                          {lesson.objectives.length} objectives
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-3">
            💡 Learning Tips
          </h3>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
            <li>• Complete lessons in order to build solid foundations</li>
            <li>• Practice against the bot at your current level</li>
            <li>• Each completed lesson increases your rating by 50 ELO</li>
            <li>• Review lessons to reinforce concepts</li>
            <li>• Take your time - mastery comes with practice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
