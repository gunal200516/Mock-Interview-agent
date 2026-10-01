"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  FileText, 
  Upload, 
  Download,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Eye,
  Loader2
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
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF, DOCX, DOC, or TXT file.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }

    setIsUploading(true);

    try {
      // For PDF and DOCX, we'll extract text content
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
        toast.success('Resume uploaded successfully!');
      } else if (file.type === 'application/pdf') {
        // In a real implementation, you'd use a PDF parsing library
        // For now, we'll show a placeholder
        toast.info('PDF parsing: This would extract text from your PDF resume.');
        setResumeText(`[PDF Content from ${file.name}]\n\nIn production, this would contain the extracted text from your PDF resume using a library like pdf-parse or PDF.js.\n\nFor now, please paste your resume text directly into the textarea.`);
      } else {
        // DOCX/DOC files
        toast.info('Document parsing: This would extract text from your document.');
        setResumeText(`[Document Content from ${file.name}]\n\nIn production, this would contain the extracted text from your Word document using a library like mammoth or docx.\n\nFor now, please paste your resume text directly into the textarea.`);
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowFeedback(true);
      toast.success('Resume analysis complete!');
    }, 2000);
  };

  const handleOptimize = () => {
    console.log('Optimize button clicked');
    setLastAction('Optimizing bullet points...');
    
    if (!resumeText.trim()) {
      toast.error('No resume content to optimize.');
      setLastAction('Error: No content');
      return;
    }
    
    setIsProcessing(true);
    toast.info('Optimizing bullet points...');
    
    // Simulate AI optimization
    setTimeout(() => {
      const optimizedText = resumeText + "\n\n[AI-OPTIMIZED CONTENT]\n• Spearheaded 15+ M&A transactions totaling $2.3B in enterprise value\n• Executed comprehensive DCF and LBO models achieving 95% accuracy vs. actual deal terms\n• Delivered 20+ pitch decks to C-suite executives resulting in 8 closed mandates";
      setResumeText(optimizedText);
      setIsProcessing(false);
      setLastAction('✅ Bullet points optimized!');
      toast.success('Bullet points optimized with quantifiable achievements!');
    }, 1500);
  };

  const handleExportPDF = () => {
    if (!resumeText.trim()) {
      toast.error('No resume content to export.');
      return;
    }

    // Create a text file download (in production, this would generate a PDF)
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Resume exported! In production, this would be a formatted PDF.');
  };

  const handleEnhanceActionVerbs = () => {
    console.log('Enhance action verbs clicked');
    setLastAction('Enhancing action verbs...');
    
    if (!resumeText.trim()) {
      toast.error('No resume content to enhance.');
      setLastAction('Error: No content');
      return;
    }
    
    setIsProcessing(true);
    toast.info('Analyzing and enhancing action verbs...');
    
    // Simulate enhancement
    setTimeout(() => {
      // Replace common weak verbs with stronger alternatives
      let enhanced = resumeText
        .replace(/\bhelped\b/gi, 'facilitated')
        .replace(/\bdid\b/gi, 'executed')
        .replace(/\bmade\b/gi, 'developed')
        .replace(/\bworked on\b/gi, 'spearheaded');
      
      setResumeText(enhanced);
      setIsProcessing(false);
      setLastAction('✅ Action verbs enhanced!');
      toast.success('Action verbs enhanced! Weak verbs replaced with stronger alternatives.');
    }, 1500);
  };

  const handleBankingLanguageCheck = () => {
    console.log('Banking language check clicked');
    setLastAction('Checking banking language...');
    
    if (!resumeText.trim()) {
      toast.error('No resume content to check.');
      setLastAction('Error: No content');
      return;
    }
    
    setIsProcessing(true);
    toast.info('Analyzing banking terminology and industry language...');
    
    setTimeout(() => {
      const text = resumeText.toLowerCase();
      const bankingTerms = ['m&a', 'dcf', 'lbo', 'valuation', 'pitch deck', 'due diligence', 'financial modeling'];
      const foundTerms = bankingTerms.filter(term => text.includes(term));
      
      setIsProcessing(false);
      if (foundTerms.length > 3) {
        setLastAction(`✅ Strong banking language! Found ${foundTerms.length} key terms`);
        toast.success(`Strong banking language! Found ${foundTerms.length} key terms.`);
      } else {
        setLastAction(`⚠️ Found ${foundTerms.length}/7 key terms`);
        toast.warning(`Consider adding more IBD terms. Found ${foundTerms.length}/7 key terms.`);
      }
    }, 1500);
  };

  const handleATSOptimization = () => {
    console.log('ATS optimization clicked');
    setLastAction('Optimizing for ATS...');
    
    if (!resumeText.trim()) {
      toast.error('No resume content to optimize.');
      setLastAction('Error: No content');
      return;
    }
    
    setIsProcessing(true);
    toast.info('Optimizing for ATS (Applicant Tracking Systems)...');
    
    setTimeout(() => {
      const wordCount = resumeText.split(/\s+/).length;
      const hasKeywords = resumeText.toLowerCase().includes('investment banking') || 
                         resumeText.toLowerCase().includes('financial');
      
      setIsProcessing(false);
      if (wordCount > 100 && hasKeywords) {
        setLastAction('✅ ATS Score: 87/100 - Well optimized!');
        toast.success('ATS Score: 87/100 - Resume is well-optimized for ATS systems!');
      } else {
        setLastAction('⚠️ ATS Score: 62/100 - Needs improvement');
        toast.warning('ATS Score: 62/100 - Add more relevant keywords and details.');
      }
    }, 1500);
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!resumeText.trim() || isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                {/* Status Indicator */}
                {lastAction && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                    <div className="flex items-center gap-2">
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      <span>{lastAction}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleOptimize}
                    disabled={!resumeText.trim() || isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Target className="h-4 w-4 mr-2" />
                    )}
                    Optimize Bullet Points
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleEnhanceActionVerbs}
                    disabled={!resumeText.trim() || isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Enhance Action Verbs
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleBankingLanguageCheck}
                    disabled={!resumeText.trim() || isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Banking Language Check
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleATSOptimization}
                    disabled={!resumeText.trim() || isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    ATS Optimization
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full"
                    onClick={handleExportPDF}
                    disabled={!resumeText.trim()}
                  >
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