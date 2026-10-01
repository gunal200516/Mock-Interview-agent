"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Bot, 
  Send,
  Copy,
  RefreshCw,
  Users,
  Mail,
  Phone,
  Building,
  MessageSquare,
  Clock,
  Target,
  TrendingUp,
  Loader2
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'responded' | 'meeting_scheduled';
  lastContact: string;
  source: string;
}

interface EmailTemplate {
  id: string;
  type: 'cold_outreach' | 'follow_up' | 'informational_interview';
  subject: string;
  content: string;
  personalized: boolean;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Vice President',
    company: 'Goldman Sachs',
    email: 'sarah.chen@gs.com',
    phone: '+1 (212) 555-0123',
    status: 'responded',
    lastContact: '2 days ago',
    source: 'LinkedIn'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'Managing Director',
    company: 'JPMorgan Chase',
    email: 'michael.rodriguez@jpmorgan.com',
    status: 'contacted',
    lastContact: '1 week ago',
    source: 'Alumni Network'
  },
  {
    id: '3',
    name: 'Emily Watson',
    title: 'Associate',
    company: 'Morgan Stanley',
    email: 'emily.watson@morganstanley.com',
    status: 'meeting_scheduled',
    lastContact: '3 days ago',
    source: 'Referral'
  }
];

const emailTemplates: EmailTemplate[] = [
  {
    id: '1',
    type: 'cold_outreach',
    subject: 'IBD Summer Analyst Interest - [Your Name]',
    content: `Dear [Name],

I hope this email finds you well. My name is [Your Name], and I'm a [Year/Major] at [University]. I'm writing to express my strong interest in investment banking, particularly in [Specific Group] at [Company].

I've been following [Company]'s recent work on [Recent Deal/Achievement], and I'm impressed by the firm's leadership in [Specific Area]. Your background in [Relevant Experience] particularly caught my attention.

Would you have 15-20 minutes for a brief informational interview? I'd love to learn more about your career path and the current landscape in [Relevant Area].

Thank you for your time, and I look forward to hearing from you.

Best regards,
[Your Name]`,
    personalized: false
  },
  {
    id: '2',
    type: 'follow_up',
    subject: 'Following up - IBD Interest',
    content: `Dear [Name],

I hope you're doing well. I wanted to follow up on my email from [Date] regarding a potential informational interview about your experience in investment banking at [Company].

I understand you must be incredibly busy, so I wanted to reiterate that I'd be grateful for even 10-15 minutes of your time. I'm particularly interested in learning about [Specific Topic/Group].

Please let me know if there's a convenient time in the coming weeks.

Thank you again for your consideration.

Best regards,
[Your Name]`,
    personalized: false
  },
  {
    id: '3',
    type: 'informational_interview',
    subject: 'Thank you - Next steps',
    content: `Dear [Name],

Thank you so much for taking the time to speak with me yesterday about your experience in [Group] at [Company]. Your insights about [Specific Topic Discussed] were incredibly valuable.

As discussed, I've attached my resume for your review. I'm particularly excited about the [Specific Opportunity/Program] you mentioned and would welcome any additional thoughts you might have.

I'll be sure to keep you updated on my progress, and I hope to stay in touch as I continue exploring opportunities in investment banking.

Thank you again for your time and guidance.

Best regards,
[Your Name]`,
    personalized: false
  }
];

export function NetworkingInterface() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [personalizationData, setPersonalizationData] = useState({
    targetName: '',
    targetTitle: '',
    targetCompany: '',
    targetGroup: '',
    yourName: '',
    yourSchool: '',
    yourMajor: '',
    connectionPoint: ''
  });

  const handleGenerateEmail = () => {
    if (!selectedTemplate) {
      toast.error('Please select an email template first.');
      return;
    }

    if (!personalizationData.yourName || !personalizationData.targetName) {
      toast.warning('Please provide at least your name and target name for better personalization.');
    }

    setIsGenerating(true);
    toast.info('Generating personalized email...');
    
    // Simulate AI generation
    setTimeout(() => {
      const template = selectedTemplate;
      let personalizedContent = template.content;
      
      // Simple personalization simulation
      personalizedContent = personalizedContent
        .replace(/\[Name\]/g, personalizationData.targetName || '[Name]')
        .replace(/\[Company\]/g, personalizationData.targetCompany || '[Company]')
        .replace(/\[Your Name\]/g, personalizationData.yourName || '[Your Name]')
        .replace(/\[University\]/g, personalizationData.yourSchool || '[University]')
        .replace(/\[Year\/Major\]/g, personalizationData.yourMajor ? `${personalizationData.yourMajor} student` : '[Year/Major]')
        .replace(/\[Specific Group\]/g, personalizationData.targetGroup || '[Specific Group]')
        .replace(/\[Target Title\]/g, personalizationData.targetTitle || '[Title]');

      // Add custom instructions context if provided
      if (customPrompt.trim()) {
        personalizedContent += `\n\n[Note: This email incorporates your custom instructions: "${customPrompt}"]`;
      }

      setGeneratedEmail(personalizedContent);
      setIsGenerating(false);
      toast.success('Email generated successfully!');
    }, 2000);
  };

  const handleCopyEmail = () => {
    if (!generatedEmail) {
      toast.error('No email to copy.');
      return;
    }

    navigator.clipboard.writeText(generatedEmail).then(() => {
      toast.success('Email copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy email.');
    });
  };

  const handleRegenerateEmail = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first.');
      return;
    }
    
    toast.info('Regenerating with variations...');
    handleGenerateEmail();
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'meeting_scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'new': return 'New';
      case 'contacted': return 'Contacted';
      case 'responded': return 'Responded';
      case 'meeting_scheduled': return 'Meeting Scheduled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Email Generator</TabsTrigger>
          <TabsTrigger value="contacts">Contact Tracker</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Personalization Details
                  </CardTitle>
                  <CardDescription>
                    Provide details for AI-powered email personalization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Your Name"
                      value={personalizationData.yourName}
                      onChange={(e) => setPersonalizationData({...personalizationData, yourName: e.target.value})}
                    />
                    <Input
                      placeholder="Your School"
                      value={personalizationData.yourSchool}
                      onChange={(e) => setPersonalizationData({...personalizationData, yourSchool: e.target.value})}
                    />
                  </div>
                  <Input
                    placeholder="Your Major"
                    value={personalizationData.yourMajor}
                    onChange={(e) => setPersonalizationData({...personalizationData, yourMajor: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Target Name"
                      value={personalizationData.targetName}
                      onChange={(e) => setPersonalizationData({...personalizationData, targetName: e.target.value})}
                    />
                    <Input
                      placeholder="Target Company"
                      value={personalizationData.targetCompany}
                      onChange={(e) => setPersonalizationData({...personalizationData, targetCompany: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Target Group/Division"
                      value={personalizationData.targetGroup}
                      onChange={(e) => setPersonalizationData({...personalizationData, targetGroup: e.target.value})}
                    />
                    <Input
                      placeholder="Connection Point"
                      value={personalizationData.connectionPoint}
                      onChange={(e) => setPersonalizationData({...personalizationData, connectionPoint: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Type</CardTitle>
                  <CardDescription>Select the type of outreach email</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {emailTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        {template.type === 'cold_outreach' && <Mail className="h-4 w-4 mr-2" />}
                        {template.type === 'follow_up' && <RefreshCw className="h-4 w-4 mr-2" />}
                        {template.type === 'informational_interview' && <MessageSquare className="h-4 w-4 mr-2" />}
                        {template.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Instructions</CardTitle>
                  <CardDescription>Additional context or specific requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., Mention their recent deal on Company X, emphasize my quantitative background, keep it under 150 words..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={handleGenerateEmail}
                    disabled={isGenerating || !selectedTemplate}
                    className="w-full mt-4"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? 'Generating...' : 'Generate Personalized Email'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Generated Email
                </CardTitle>
                <CardDescription>
                  AI-generated, personalized outreach email
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedEmail ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          <span className="text-muted-foreground">Subject:</span> {selectedTemplate?.subject}
                        </div>
                        <hr />
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                          {generatedEmail}
                        </pre>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleCopyEmail}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Email
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleRegenerateEmail}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">No Email Generated Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Select an email type, fill in personalization details, and click "Generate" to create your personalized outreach email.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Contact Tracker</h3>
              <p className="text-sm text-muted-foreground">
                Track your networking outreach and follow-ups
              </p>
            </div>
            <Button
              onClick={() => {
                toast.info('Add Contact modal would open here. Feature coming soon!');
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          <div className="grid gap-4">
            {mockContacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {contact.company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(contact.status)}>
                        {getStatusText(contact.status)}
                      </Badge>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {contact.lastContact}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (contact.email) {
                          window.location.href = `mailto:${contact.email}`;
                          toast.success(`Opening email to ${contact.name}`);
                        }
                      }}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                    {contact.phone && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(contact.phone!);
                          toast.success(`Phone number copied: ${contact.phone}`);
                        }}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast.info(`Follow-up reminder set for ${contact.name}`);
                      }}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Follow Up
                    </Button>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {contact.source}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="space-y-4">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {template.type === 'cold_outreach' && <Target className="h-5 w-5 text-blue-500" />}
                      {template.type === 'follow_up' && <RefreshCw className="h-5 w-5 text-amber-500" />}
                      {template.type === 'informational_interview' && <TrendingUp className="h-5 w-5 text-green-500" />}
                      {template.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        toast.success(`Template "${template.type.replace('_', ' ')}" selected! Go to Email Generator tab to personalize.`);
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                  <CardDescription>Subject: {template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {template.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}