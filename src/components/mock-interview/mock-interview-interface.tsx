"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square,
  Clock, 
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User,
  Bot
} from 'lucide-react';

interface MockInterview {
  id: string;
  title: string;
  type: 'technical' | 'behavioral' | 'case_study';
  company: string;
  duration: number; // minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'ready' | 'in_progress' | 'completed';
  score?: number;
  questions: string[];
  description: string;
}

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral';
  timeLimit: number; // seconds
  tips: string[];
}

const mockInterviews: MockInterview[] = [
  {
    id: 'ms-technical',
    title: 'Morgan Stanley - Technical Round',
    type: 'technical',
    company: 'Morgan Stanley',
    duration: 45,
    difficulty: 'Advanced',
    status: 'ready',
    questions: [
      'Walk me through a DCF model',
      'How would you value a company in a declining industry?',
      'Explain the difference between asset and stock deals'
    ],
    description: 'Advanced technical interview focusing on valuation methods and M&A concepts'
  },
  {
    id: 'kkr-behavioral',
    title: 'KKR - Behavioral Interview',
    type: 'behavioral',
    company: 'KKR',
    duration: 30,
    difficulty: 'Intermediate',
    status: 'ready',
    questions: [
      'Tell me about yourself',
      'Why private equity?',
      'Describe a time you led a team under pressure'
    ],
    description: 'Behavioral interview for private equity analyst position'
  },
  {
    id: 'evercore-case',
    title: 'Evercore - Restructuring Case',
    type: 'case_study',
    company: 'Evercore',
    duration: 60,
    difficulty: 'Advanced',
    status: 'ready',
    questions: [
      'Company X is facing liquidity issues. How would you approach this?',
      'What are the key factors in a Chapter 11 vs Chapter 7 bankruptcy?',
      'How would you structure a distressed debt investment?'
    ],
    description: 'Complex restructuring case study with financial analysis'
  }
];

const currentQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Tell me about yourself and why you\'re interested in investment banking.',
    type: 'behavioral',
    timeLimit: 120,
    tips: [
      'Keep it to 60-90 seconds',
      'Connect your background to IBD',
      'Show genuine interest, not just prestige',
      'End with why this specific firm'
    ]
  },
  {
    id: 'q2', 
    text: 'Walk me through a DCF model step by step.',
    type: 'technical',
    timeLimit: 300,
    tips: [
      'Start with revenue projections',
      'Explain FCF calculation clearly',
      'Don\'t forget terminal value',
      'Mention sensitivity analysis'
    ]
  },
  {
    id: 'q3',
    text: 'Tell me about a recent deal that interested you.',
    type: 'behavioral',
    timeLimit: 180,
    tips: [
      'Choose a deal from last 6 months',
      'Explain the strategic rationale',
      'Discuss valuation metrics',
      'Show analytical thinking'
    ]
  }
];

export function MockInterviewInterface() {
  const [selectedInterview, setSelectedInterview] = useState<MockInterview | null>(null);
  const [currentMode, setCurrentMode] = useState<'selection' | 'interview' | 'results'>('selection');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);

  const getTypeColor = (type: MockInterview['type']) => {
    switch (type) {
      case 'technical': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'behavioral': return 'bg-green-500/10 text-green-400 border-green-500/20'; 
      case 'case_study': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const getDifficultyColor = (difficulty: MockInterview['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-amber-400';
      case 'Advanced': return 'text-red-400';
    }
  };

  const startInterview = (interview: MockInterview) => {
    setSelectedInterview(interview);
    setCurrentMode('interview');
    setCurrentQuestionIndex(0);
    setTimeRemaining(currentQuestions[0]?.timeLimit || 120);
    setInterviewStarted(false);
    setResponses([]);
  };

  const beginInterview = () => {
    setInterviewStarted(true);
    // Start timer here
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(currentQuestions[currentQuestionIndex + 1]?.timeLimit || 120);
      setIsRecording(false);
    } else {
      // Interview complete
      setCurrentMode('results');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentMode === 'interview' && selectedInterview) {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Interview Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {selectedInterview.title}
                </CardTitle>
                <CardDescription>
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {formatTime(timeRemaining)}
                </Badge>
                <Progress 
                  value={(currentQuestionIndex / currentQuestions.length) * 100} 
                  className="w-32"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">Interviewer</CardTitle>
                <p className="text-foreground leading-relaxed">
                  {currentQuestion.text}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Recording Interface */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-6">
              {!interviewStarted ? (
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium">Ready to begin?</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll have {formatTime(currentQuestion.timeLimit)} to answer this question.
                    Click start when you're ready to begin recording.
                  </p>
                  <Button onClick={beginInterview} className="px-8">
                    <Play className="h-4 w-4 mr-2" />
                    Start Interview
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className={`flex items-center justify-center w-20 h-20 rounded-full ${
                    isRecording ? 'bg-red-500/20 animate-pulse' : 'bg-muted'
                  }`}>
                    <Button
                      size="icon"
                      onClick={toggleRecording}
                      className={`w-12 h-12 rounded-full ${
                        isRecording ? 'bg-red-500 hover:bg-red-600' : ''
                      }`}
                    >
                      {isRecording ? (
                        <Square className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {isRecording ? 'Recording...' : 'Click to start recording'}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatTime(timeRemaining)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentMode('selection')}>
                      Exit Interview
                    </Button>
                    <Button onClick={nextQuestion}>
                      {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Tips for this question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentQuestion.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentMode === 'results') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Interview Complete!
            </CardTitle>
            <CardDescription>
              Great job completing the {selectedInterview?.title} mock interview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">85%</div>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{currentQuestions.length}</div>
                    <p className="text-xs text-muted-foreground">Questions Answered</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">42min</div>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Performance Feedback</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-400">Strong Technical Knowledge</p>
                    <p className="text-muted-foreground">Your DCF explanation was comprehensive and well-structured</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-400">Improve Storytelling</p>
                    <p className="text-muted-foreground">Try to be more concise in behavioral responses - use STAR method</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => setCurrentMode('selection')} variant="outline">
                Back to Interviews
              </Button>
              <Button>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Detailed Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Available Mock Interviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockInterviews.map((interview) => (
          <Card key={interview.id} className="hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getTypeColor(interview.type)}`}
                >
                  <Target className="h-3 w-3 mr-1" />
                  {interview.type.replace('_', ' ')}
                </Badge>
                {interview.status === 'ready' && (
                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400">
                    Ready
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base leading-tight">{interview.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {interview.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {interview.duration}min
                  </span>
                  <span className={`font-medium ${getDifficultyColor(interview.difficulty)}`}>
                    {interview.difficulty}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Sample Questions:</p>
                  <ul className="space-y-1">
                    {interview.questions.slice(0, 2).map((q, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" />
                        <span className="leading-tight">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={() => startInterview(interview)}
                  disabled={interview.status !== 'ready'}
                >
                  <Play className="h-3 w-3 mr-2" />
                  Start Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}