"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Upload, 
  Download,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Eye
} from 'lucide-react';

interface ResumeFeedback {
  type: 'success' | 'warning' | 'error';
  category: string;
  message: string;
  suggestion?: string;
}

interface ResumeMetrics {
  atsScore: number;
  overallScore: number;
  wordCount: number;
  bulletPoints: number;
  keywords: number;
  readabilityScore: number;
}

const mockResumeFeedback: ResumeFeedback[] = [
  {
    type: 'success',
    category: 'ATS Optimization',
    message: 'Strong keyword coverage for investment banking roles',
    suggestion: 'Consider adding "financial modeling" and "pitch deck" keywords'
  },
  {
    type: 'warning',
    category: 'Content Structure',
    message: 'Experience bullets could be more quantified',
    suggestion: 'Add specific numbers: deal sizes, percentages, timeframes'
  },
  {
    type: 'success',
    category: 'Industry Language',
    message: 'Excellent use of banking terminology',
    suggestion: 'Continue using sector-specific language'
  },
  {
    type: 'error',
    category: 'Length',
    message: 'Resume exceeds one page - trim content',
    suggestion: 'Remove older experiences or consolidate bullet points'
  },
  {
    type: 'warning',
    category: 'Skills Section',
    message: 'Missing technical skills relevant to IBD',
    suggestion: 'Add: Excel, PowerPoint, Bloomberg Terminal, Capital IQ'
  }
];

const mockMetrics: ResumeMetrics = {
  atsScore: 87,
  overallScore: 78,
  wordCount: 425,
  bulletPoints: 12,
  keywords: 23,
  readabilityScore: 85
};

const keywordSuggestions = [
  'Financial Modeling', 'DCF Analysis', 'LBO Modeling', 'Pitch Deck Creation',
  'Due Diligence', 'Valuation Analysis', 'M&A Transactions', 'Capital Markets',
  'Client Presentation', 'Deal Execution', 'Market Research', 'Financial Analysis'
];

export function ResumeInterface() {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowFeedback(true);
    }, 2000);
  };

  const handleOptimize = () => {
    // AI optimization simulation
    const optimizedText = resumeText + "\n\n[AI-optimized content would appear here with improved bullet points, stronger action verbs, and better quantification]";
    setResumeText(optimizedText);
  };

  const getFeedbackIcon = (type: ResumeFeedback['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getFeedbackColor = (type: ResumeFeedback['type']) => {
    switch (type) {
      case 'success': return 'border-green-500/20 bg-green-500/5';
      case 'warning': return 'border-amber-500/20 bg-amber-500/5';
      case 'error': return 'border-red-500/20 bg-red-500/5';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      {showFeedback && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className={`text-2xl font-bold ${getScoreColor(mockMetrics.overallScore)}`}>
                {mockMetrics.overallScore}
              </div>
              <p className="text-xs text-muted-foreground">Overall Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className={`text-2xl font-bold ${getScoreColor(mockMetrics.atsScore)}`}>
                {mockMetrics.atsScore}
              </div>
              <p className="text-xs text-muted-foreground">ATS Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold">{mockMetrics.wordCount}</div>
              <p className="text-xs text-muted-foreground">Words</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold">{mockMetrics.bulletPoints}</div>
              <p className="text-xs text-muted-foreground">Bullets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold">{mockMetrics.keywords}</div>
              <p className="text-xs text-muted-foreground">Keywords</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className={`text-2xl font-bold ${getScoreColor(mockMetrics.readabilityScore)}`}>
                {mockMetrics.readabilityScore}
              </div>
              <p className="text-xs text-muted-foreground">Readability</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Interface */}
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Resume Editor</TabsTrigger>
          <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resume Content
                </CardTitle>
                <CardDescription>
                  Paste your resume text or upload a file for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!resumeText.trim() || isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Optimization Tools
                </CardTitle>
                <CardDescription>
                  Enhance your resume with AI-powered improvements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleOptimize}
                    disabled={!resumeText.trim()}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Optimize Bullet Points
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={!resumeText.trim()}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enhance Action Verbs
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={!resumeText.trim()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Banking Language Check
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={!resumeText.trim()}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    ATS Optimization
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {showFeedback ? (
            <div className="space-y-4">
              {mockResumeFeedback.map((feedback, index) => (
                <Card key={index} className={`p-4 ${getFeedbackColor(feedback.type)}`}>
                  <div className="flex items-start gap-3">
                    {getFeedbackIcon(feedback.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{feedback.category}</h4>
                        <Badge variant="outline" className="text-xs">
                          {feedback.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {feedback.message}
                      </p>
                      {feedback.suggestion && (
                        <p className="text-sm text-primary">
                          💡 {feedback.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">No Analysis Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Add your resume content in the Editor tab and click "AI Analyze" to get detailed feedback and suggestions.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IBD Keywords Optimization</CardTitle>
              <CardDescription>
                Essential keywords for investment banking resumes and ATS optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Recommended Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {keywordSuggestions.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => {
                          if (resumeText) {
                            setResumeText(prev => prev + ` ${keyword}`);
                          }
                        }}
                      >
                        + {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-medium mb-2">Technical Skills</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Excel (Advanced)</li>
                      <li>• PowerPoint</li>
                      <li>• Bloomberg Terminal</li>
                      <li>• Capital IQ</li>
                      <li>• FactSet</li>
                      <li>• Refinitiv</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Core Competencies</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Financial Modeling</li>
                      <li>• Valuation Analysis</li>
                      <li>• Due Diligence</li>
                      <li>• Client Presentations</li>
                      <li>• Market Research</li>
                      <li>• Deal Execution</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}