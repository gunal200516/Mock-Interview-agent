"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Award,
  Lightbulb,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  courseCurriculumData,
  CourseDetail,
  Lesson,
} from "@/lib/course-curriculum-data";

interface CoursePlayerModalProps {
  courseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCourseProgress: (
    courseId: string,
    progress: number,
    completed: boolean
  ) => void;
}

interface LessonContentProps {
  lesson: Lesson;
  totalLessons: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  canNext: boolean;
  canPrev: boolean;
}

function LessonContent({
  lesson,
  totalLessons,
  isCompleted,
  onToggleComplete,
  onNext,
  onPrev,
  canNext,
  canPrev,
}: LessonContentProps) {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#0b0b0e] overflow-hidden">
      <ScrollArea className="flex-1 p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Lesson Header Banner */}
          <div className="space-y-2 border-b border-[#242019] pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#d0a040] uppercase tracking-wider">
                Lesson {lesson.number} of {totalLessons}
              </span>
              <Badge
                variant="outline"
                className="border-[#2c2c36] text-zinc-400 text-xs"
              >
                <Clock className="h-3 w-3 mr-1" />
                {lesson.durationMinutes} min read
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {lesson.title}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {lesson.summary}
            </p>
          </div>

          {/* Lesson Overview Box */}
          <div className="p-4 rounded-xl bg-[#14141a] border border-[#242019] space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Concept Overview
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {lesson.content.overview}
            </p>
          </div>

          {/* Key Concepts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#d0a040]" />
              Core Investment Banking Takeaways
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {lesson.content.keyConcepts.map((concept, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#14141a]/60 border border-[#22222a] text-sm text-zinc-300"
                >
                  <div className="h-5 w-5 rounded-full bg-[#d0a040]/10 text-[#d0a040] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="leading-snug">{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formula / Framework Highlight Card */}
          {lesson.content.formulaOrFramework && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#1c1810] to-[#14141a] border border-[#d0a040]/30 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#d0a040]">
                  {lesson.content.formulaOrFramework.title}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  Formula / Framework
                </span>
              </div>
              <div className="p-3 bg-[#0d0d10] rounded-lg border border-[#2e2617] font-mono text-sm md:text-base font-semibold text-amber-300 overflow-x-auto">
                {lesson.content.formulaOrFramework.formula}
              </div>
              {lesson.content.formulaOrFramework.notes && (
                <p className="text-xs text-zinc-400 italic">
                  {lesson.content.formulaOrFramework.notes}
                </p>
              )}
            </div>
          )}

          {/* Detailed Breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-white">
              Step-by-Step Breakdown
            </h3>
            <div className="space-y-2">
              {lesson.content.detailedBreakdown.map((step, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-[#121217] border border-[#202028] text-sm text-zinc-300 leading-relaxed"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Wall Street Interview Pro Tip */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <Lightbulb className="h-4 w-4" />
              Wall Street Interview Nuance
            </div>
            <p className="text-xs md:text-sm text-amber-200/90 leading-relaxed">
              {lesson.content.interviewTip}
            </p>
          </div>

          {/* Interactive Knowledge Check Quiz */}
          <div className="p-5 rounded-xl bg-[#14141b] border border-[#252530] space-y-4">
            <div className="flex items-center justify-between border-b border-[#252530] pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#d0a040]" />
                <h4 className="text-sm font-semibold text-white">
                  Knowledge Check
                </h4>
              </div>
              {hasSubmittedQuiz && (
                <Badge
                  variant="outline"
                  className={
                    selectedQuizOption === lesson.quiz.correctIndex
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  }
                >
                  {selectedQuizOption === lesson.quiz.correctIndex
                    ? "Correct!"
                    : "Needs Review"}
                </Badge>
              )}
            </div>

            <p className="text-sm font-medium text-zinc-200">
              {lesson.quiz.question}
            </p>

            <div className="space-y-2">
              {lesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === lesson.quiz.correctIndex;

                let buttonStyle =
                  "bg-[#1c1c24] border-[#292934] text-zinc-300 hover:bg-[#252530]";
                if (hasSubmittedQuiz) {
                  if (isCorrect) {
                    buttonStyle =
                      "bg-green-500/20 border-green-500/50 text-green-300 font-medium";
                  } else if (isSelected && !isCorrect) {
                    buttonStyle =
                      "bg-red-500/20 border-red-500/50 text-red-300";
                  } else {
                    buttonStyle =
                      "bg-[#15151c] border-[#22222c] text-zinc-500 opacity-60";
                  }
                } else if (isSelected) {
                  buttonStyle =
                    "bg-[#d0a040]/20 border-[#d0a040] text-amber-200";
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSubmittedQuiz}
                    onClick={() => setSelectedQuizOption(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs md:text-sm transition-all flex items-center justify-between ${buttonStyle}`}
                  >
                    <span className="pr-4">{opt}</span>
                    {hasSubmittedQuiz && isCorrect && (
                      <Check className="h-4 w-4 text-green-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {!hasSubmittedQuiz ? (
              <Button
                size="sm"
                disabled={selectedQuizOption === null}
                onClick={() => setHasSubmittedQuiz(true)}
                className="bg-[#d0a040] hover:bg-[#b88c35] text-black font-semibold text-xs mt-2"
              >
                Check Answer
              </Button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-lg bg-[#181822] border border-[#2b2b38] text-xs text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-white block mb-1">
                    Explanation:
                  </span>
                  {lesson.quiz.explanation}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedQuizOption(null);
                    setHasSubmittedQuiz(false);
                  }}
                  className="border-[#333340] text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3 w-3" />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Lesson Navigation Bar */}
      <div className="border-t border-[#242019] px-6 py-3.5 bg-[#141418] shrink-0 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={onPrev}
          className="border-[#2b2b36] hover:bg-[#202028] text-zinc-300 text-xs flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Lesson
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            onClick={onToggleComplete}
            className={
              isCompleted
                ? "border-green-500/40 text-green-400 hover:bg-green-500/10 text-xs"
                : "bg-[#d0a040] hover:bg-[#b88c35] text-black font-semibold text-xs"
            }
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Completed
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark Lesson Complete
              </>
            )}
          </Button>

          {canNext && (
            <Button
              size="sm"
              onClick={onNext}
              className="bg-[#242019] hover:bg-[#322c22] text-[#d0a040] border border-[#d0a040]/30 font-medium text-xs flex items-center gap-1"
            >
              Next Lesson
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CoursePlayerModal({
  courseId,
  isOpen,
  onClose,
  onUpdateCourseProgress,
}: CoursePlayerModalProps) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedMap, setCompletedMap] = useState<Record<string, string[]>>(() => {
    // Initial defaults for DCF and LBO if not set
    return {
      "dcf-fundamentals": ["dcf-1", "dcf-2", "dcf-3", "dcf-4", "dcf-5", "dcf-6", "dcf-7", "dcf-8"],
      "lbo-analysis": ["lbo-1", "lbo-2", "lbo-3", "lbo-4", "lbo-5", "lbo-6"],
    };
  });

  const course: CourseDetail | null = courseId ? courseCurriculumData[courseId] || null : null;

  if (!course) return null;

  const completedList = (courseId && completedMap[courseId]) || [];
  const completedLessonIds = new Set(completedList);

  const activeLesson: Lesson = course.lessons[activeLessonIndex] || course.lessons[0];
  const isCurrentLessonCompleted = completedLessonIds.has(activeLesson.id);
  const totalLessons = course.lessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const getCategoryIcon = (category: CourseDetail["category"]) => {
    switch (category) {
      case "technical":
        return <TrendingUp className="h-4 w-4" />;
      case "behavioral":
        return <Target className="h-4 w-4" />;
      case "market":
        return <Award className="h-4 w-4" />;
    }
  };

  const handleToggleLesson = (lessonId: string) => {
    const currentList = completedMap[course.id] || [];
    let updatedList: string[];
    if (currentList.includes(lessonId)) {
      updatedList = currentList.filter((id) => id !== lessonId);
    } else {
      updatedList = [...currentList, lessonId];
    }

    setCompletedMap((prev) => ({
      ...prev,
      [course.id]: updatedList,
    }));

    const newProgress = Math.min(100, Math.round((updatedList.length / totalLessons) * 100));
    const isCompleted = newProgress === 100;
    onUpdateCourseProgress(course.id, newProgress, isCompleted);
  };

  const handleNextWithAutoMark = () => {
    if (!completedLessonIds.has(activeLesson.id)) {
      handleToggleLesson(activeLesson.id);
    }
    if (activeLessonIndex < totalLessons - 1) {
      setActiveLessonIndex((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[88vh] flex flex-col p-0 gap-0 bg-[#0e0e12] border-[#242019] text-foreground overflow-hidden shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="border-b border-[#242019] px-6 py-4 bg-[#141418] shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="bg-[#d0a040]/10 text-[#d0a040] border-[#d0a040]/30 text-xs font-semibold"
                >
                  {getCategoryIcon(course.category)}
                  <span className="ml-1 capitalize">{course.category}</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs bg-[#1f1f26] text-muted-foreground"
                >
                  {course.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration} mins total
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {course.title}
                {progressPercent === 100 && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" /> Completed
                  </Badge>
                )}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {course.description}
              </p>
            </div>

            {/* Course Progress in Header */}
            <div className="flex flex-col gap-1.5 min-w-[200px] max-w-[240px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {completedCount} of {totalLessons} Lessons
                </span>
                <span className="font-bold text-[#d0a040]">
                  {progressPercent}%
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-2 bg-[#22222a] [&>div]:bg-[#d0a040]"
              />
            </div>
          </div>
        </div>

        {/* Content Body: Sidebar + Player */}
        <div className="flex-1 flex overflow-hidden">
          {/* Syllabus Sidebar */}
          <div className="w-80 shrink-0 border-r border-[#242019] bg-[#111116] flex flex-col">
            <div className="p-3.5 border-b border-[#242019] bg-[#15151b] flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#d0a040]" />
                Course Curriculum
              </span>
              <span className="text-[11px] text-muted-foreground">
                {totalLessons} Lessons
              </span>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {course.lessons.map((lesson, idx) => {
                  const isDone = completedLessonIds.has(lesson.id);
                  const isActive = idx === activeLessonIndex;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                        isActive
                          ? "bg-[#1f1b13] border border-[#d0a040]/40 text-white shadow-sm"
                          : "hover:bg-[#1a1a22] text-zinc-300 border border-transparent"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : isActive ? (
                          <PlayCircle className="h-4 w-4 text-[#d0a040]" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-zinc-600 flex items-center justify-center text-[9px] text-zinc-400">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium leading-snug line-clamp-2">
                          {lesson.number}. {lesson.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {lesson.durationMinutes}m
                          </span>
                          {isDone && (
                            <span className="text-green-400 font-medium">
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Lesson Main View Area (with key to automatically reset state on lesson change) */}
          <LessonContent
            key={activeLesson.id}
            lesson={activeLesson}
            totalLessons={totalLessons}
            isCompleted={isCurrentLessonCompleted}
            onToggleComplete={() => handleToggleLesson(activeLesson.id)}
            onNext={handleNextWithAutoMark}
            onPrev={() => setActiveLessonIndex((prev) => Math.max(0, prev - 1))}
            canNext={activeLessonIndex < totalLessons - 1}
            canPrev={activeLessonIndex > 0}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
