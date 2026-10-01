"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Target,
  Zap,
  Award,
  ChevronRight,
  Star
} from 'lucide-react';
import { CoursePlayerModal } from '@/components/learn/course-player-modal';

interface Course {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'behavioral' | 'market';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // minutes
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  lessons: number;
}

interface FlashCard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastReviewed?: Date;
}

const courses: Course[] = [
  {
    id: 'dcf-fundamentals',
    title: 'DCF Modeling Fundamentals',
    description: 'Learn to build comprehensive DCF models from scratch with real-world examples',
    category: 'technical',
    difficulty: 'Intermediate',
    duration: 120,
    progress: 100,
    status: 'completed',
    lessons: 8
  },
  {
    id: 'lbo-analysis',
    title: 'LBO Analysis Deep Dive', 
    description: 'Master leveraged buyout modeling and analysis techniques',
    category: 'technical',
    difficulty: 'Advanced',
    duration: 180,
    progress: 100,
    status: 'completed',
    lessons: 12
  },
  {
    id: 'behavioral-mastery',
    title: 'Behavioral Interview Mastery',
    description: 'STAR method and banking-specific behavioral questions',
    category: 'behavioral',
    difficulty: 'Beginner',
    duration: 90,
    progress: 75,
    status: 'in_progress',
    lessons: 6
  },
  {
    id: 'ma-transactions',
    title: 'M&A Transaction Analysis',
    description: 'Understand M&A processes, valuation, and deal structures',
    category: 'technical',
    difficulty: 'Intermediate',
    duration: 150,
    progress: 60,
    status: 'in_progress',
    lessons: 10
  },
  {
    id: 'accretion-dilution',
    title: 'Accretion/Dilution Analysis',
    description: 'Master EPS accretion and dilution calculations in M&A scenarios',
    category: 'technical',
    difficulty: 'Advanced',
    duration: 90,
    progress: 0,
    status: 'not_started',
    lessons: 7
  },
  {
    id: 'market-knowledge',
    title: 'Investment Banking Market Knowledge',
    description: 'Current market trends, league tables, and industry insights',
    category: 'market',
    difficulty: 'Intermediate',
    duration: 110,
    progress: 25,
    status: 'in_progress',
    lessons: 9
  }
];

const flashCards: FlashCard[] = [
  {
    id: 'dcf-wacc',
    question: 'What are the components of WACC?',
    answer: 'WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))\nWhere E = Equity value, D = Debt value, V = E + D, Re = Cost of equity, Rd = Cost of debt, Tc = Tax rate',
    category: 'DCF Modeling',
    difficulty: 'Medium'
  },
  {
    id: 'lbo-returns',
    question: 'How do you calculate IRR in an LBO?',
    answer: 'IRR = (Exit Value / Initial Investment)^(1/holding period) - 1\nExit Value = Exit Multiple × Exit EBITDA\nInitial Investment = Equity contribution at entry',
    category: 'LBO Analysis',
    difficulty: 'Hard'
  },
  {
    id: 'behavioral-weakness',
    question: 'How do you answer "What\'s your greatest weakness?" in banking interviews?',
    answer: 'Choose a real weakness that won\'t disqualify you, show self-awareness, and demonstrate concrete steps you\'re taking to improve. Example: "I used to struggle with delegation, but I\'ve been practicing by..."',
    category: 'Behavioral',
    difficulty: 'Easy'
  }
];

export function LearningInterface() {
  const [courseList, setCourseList] = useState<Course[]>(courses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFlashCard, setCurrentFlashCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizMode, setQuizMode] = useState(false);

  const completedCourses = courseList.filter(c => c.status === 'completed').length;
  const totalCourses = courseList.length;
  const overallProgress = (completedCourses / totalCourses) * 100;

  const handleUpdateCourseProgress = (courseId: string, newProgress: number, isCompleted: boolean) => {
    setCourseList((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            progress: newProgress,
            status: isCompleted ? 'completed' : newProgress > 0 ? 'in_progress' : 'not_started',
          };
        }
        return c;
      })
    );
  };

  const getCategoryIcon = (category: Course['category']) => {
    switch (category) {
      case 'technical': return <TrendingUp className="h-4 w-4" />;
      case 'behavioral': return <Target className="h-4 w-4" />;
      case 'market': return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Course['category']) => {
    switch (category) {
      case 'technical': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'behavioral': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'market': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-amber-400';
      case 'Advanced': return 'text-red-400';
    }
  };

  const nextFlashCard = () => {
    setCurrentFlashCard((prev) => (prev + 1) % flashCards.length);
    setShowAnswer(false);
  };

  const prevFlashCard = () => {
    setCurrentFlashCard((prev) => (prev - 1 + flashCards.length) % flashCards.length);
    setShowAnswer(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedCourses}/{totalCourses} Completed</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Practice Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="text-xl font-bold">7 Days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-green-500" />
              Quiz Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-500">78%</span>
              <Badge variant="secondary" className="text-xs">+12% this week</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IBD Prep Courses</CardTitle>
              <CardDescription>
                Comprehensive courses covering technical skills, behavioral prep, and market knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseList.map((course) => (
                  <Card key={course.id} className="hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-sm leading-tight">{course.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getCategoryColor(course.category)}`}
                            >
                              {getCategoryIcon(course.category)}
                              <span className="ml-1 capitalize">{course.category}</span>
                            </Badge>
                            <span className={`text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                              {course.difficulty}
                            </span>
                          </div>
                        </div>
                        {course.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {course.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}min
                          </span>
                          <span>{course.lessons} lessons</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full"
                          variant={course.status === 'completed' ? 'outline' : 'default'}
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsModalOpen(true);
                          }}
                        >
                          {course.status === 'not_started' && (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Start Course
                            </>
                          )}
                          {course.status === 'in_progress' && (
                            <>
                              Continue
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </>
                          )}
                          {course.status === 'completed' && (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Review
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Practice Flashcards</CardTitle>
                  <CardDescription>
                    Spaced-repetition flashcards for technical and behavioral prep
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuizMode(!quizMode)}
                  >
                    {quizMode ? 'Study Mode' : 'Quiz Mode'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl mx-auto">
                <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Card {currentFlashCard + 1} of {flashCards.length}</span>
                  <Badge variant="outline">
                    {flashCards[currentFlashCard].category}
                  </Badge>
                </div>

                <Card className="mb-4">
                  <CardContent className="p-6">
                    <div className="min-h-[200px] flex flex-col justify-center">
                      <h3 className="text-lg font-medium mb-4">
                        {flashCards[currentFlashCard].question}
                      </h3>
                      
                      {showAnswer && (
                        <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                          <p className="text-sm whitespace-pre-line">
                            {flashCards[currentFlashCard].answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" onClick={prevFlashCard}>
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="px-8"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </Button>
                  
                  <Button variant="outline" onClick={nextFlashCard}>
                    Next
                  </Button>
                </div>

                {showAnswer && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-sm text-muted-foreground mr-2">How did you do?</span>
                    <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300">
                      Hard
                    </Button>
                    <Button size="sm" variant="outline" className="text-amber-400 hover:text-amber-300">
                      Medium
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-400 hover:text-green-300">
                      Easy
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CoursePlayerModal
        courseId={selectedCourse?.id || null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateCourseProgress={handleUpdateCourseProgress}
      />
    </div>
  );
}