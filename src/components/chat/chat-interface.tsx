"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff,
  Sparkles,
  TrendingUp,
  BookOpen,
  Target
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

interface QuickPrompt {
  id: string;
  text: string;
  category: 'technical' | 'behavioral' | 'strategy' | 'general';
  icon: any;
}

const quickPrompts: QuickPrompt[] = [
  {
    id: 'dcf-help',
    text: "Help me understand DCF modeling fundamentals",
    category: 'technical',
    icon: TrendingUp
  },
  {
    id: 'behavioral-prep',
    text: "Give me behavioral interview questions for IBD",
    category: 'behavioral', 
    icon: MessageCircle
  },
  {
    id: 'application-strategy',
    text: "How should I prioritize my job applications?",
    category: 'strategy',
    icon: Target
  },
  {
    id: 'lbo-model',
    text: "Walk me through an LBO analysis step by step",
    category: 'technical',
    icon: BookOpen
  }
];

// Predefined AI responses for demo purposes
const aiResponses: Record<string, string> = {
  'dcf-help': `Great question! DCF (Discounted Cash Flow) modeling is fundamental to IBD work. Here's a structured approach:

**Key Components:**
1. **Revenue Projections** - Historical analysis + growth assumptions
2. **Operating Expenses** - Fixed vs variable cost modeling
3. **Free Cash Flow Calculation** - EBITDA → EBIT → NOPAT → FCF
4. **Terminal Value** - Exit multiple or perpetuity growth method
5. **Discount Rate (WACC)** - Cost of equity + cost of debt

**Pro Tips:**
- Always sensitivity test your assumptions (revenue growth ±2%, WACC ±50bps)
- Pay attention to working capital changes - they're often overlooked
- Terminal value typically represents 60-80% of enterprise value

Would you like me to walk through a specific part in more detail, or shall we practice with a case study?`,

  'behavioral-prep': `Excellent! Behavioral interviews are crucial for IBD roles. Here are key questions with the STAR method approach:

**Common IBD Behavioral Questions:**

1. **"Tell me about a time you worked under extreme pressure"**
   - *Situation*: Describe the high-pressure environment
   - *Task*: What needed to be accomplished
   - *Action*: Specific steps you took
   - *Result*: Quantifiable outcome

2. **"Describe a time you had to analyze complex financial data"**
   - Perfect for showcasing analytical skills

3. **"How do you prioritize multiple urgent tasks?"**
   - Critical for managing deal timelines

**IBD-Specific Tips:**
- Emphasize attention to detail (errors in pitch books are costly)
- Show client service orientation
- Demonstrate ability to work 80+ hour weeks
- Highlight teamwork in fast-paced environments

Ready to practice with mock questions? I can simulate a real interview scenario!`,

  'application-strategy': `Smart strategic thinking! Here's a data-driven approach to prioritizing IBD applications:

**Tier 1 Priority (Apply First):**
- **Target Schools Alumni** - 3x higher success rate
- **Networking Connections** - Warm introductions beat cold applications
- **Geographic Preferences** - Where you want to live long-term

**Tier 2 Considerations:**
- **Group Fit** - Match your interests (M&A, RX, Coverage)
- **Deal Flow** - Check league tables for active groups
- **Culture Alignment** - Research through informational interviews

**Application Timeline Strategy:**
1. **Weeks 1-2**: Tier 1 targets (5-7 applications)
2. **Weeks 3-4**: Strong fits with good chances (8-10 applications)  
3. **Weeks 5-6**: Reach targets and backup options

**Pro Tips:**
- Apply Tuesday-Thursday for higher open rates
- Customize cover letters with recent deal references
- Follow up 1 week after application if no response

Want me to help you analyze your current target list?`,

  'lbo-model': `Perfect! LBO modeling is essential for PE interviews and credit analysis. Let me break it down:

**LBO Model Structure:**

**1. Sources & Uses of Funds**
- Sources: Equity contribution + debt financing
- Uses: Purchase price + fees + refinancing existing debt
- Must balance (Sources = Uses)

**2. Debt Schedule**
- Term Loan A (amortizing)
- Term Loan B (bullet payment) 
- Revolving Credit Facility
- Model monthly/quarterly payments

**3. Cash Flow Analysis**
- EBITDA projections
- Less: Interest expense, taxes, capex, working capital changes
- Equals: Free cash flow available for debt paydown

**4. Returns Calculation**
- Entry multiple vs exit multiple
- IRR and cash-on-cash multiple
- Sensitivity analysis on exit assumptions

**Key Metrics to Track:**
- Debt/EBITDA ratios over time
- Interest coverage ratios
- Minimum cash requirements

Would you like me to walk through a specific company example, or practice the returns calculation math?`
};

import { api } from '@/lib/api';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userId] = useState('clz123example456'); // In a real app, get from auth
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load chat history on component mount
    loadChatHistory();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await api.getChatHistory(userId);
      if (response.data && response.data.messages) {
        const formattedMessages = response.data.messages.map((msg: any) => ({
          id: msg.id || Date.now().toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } else {
        // Set welcome message if no history
        setMessages([{
          id: '1',
          role: 'assistant',
          content: "Hi Alex! I'm your IBD prep mentor. I remember your progress - you're doing great with 78% practice score and upcoming Morgan Stanley interview tomorrow! What would you like to work on today?",
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Fallback to welcome message
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your IBD prep mentor. How can I help you today?",
        timestamp: new Date(),
      }]);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send message to API
      const response = await api.sendChatMessage(text, userId);
      
      if (response.data) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback response
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember to review your preparation materials for tomorrow's Morgan Stanley interview!",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    handleSendMessage(prompt.text);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000); // Auto-stop after 3 seconds
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCategoryColor = (category: QuickPrompt['category']) => {
    switch (category) {
      case 'technical': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'behavioral': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'strategy': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'general': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Chat Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Mentor Chat
            <Badge variant="secondary" className="ml-auto">
              Context Aware
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Chat Messages */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Your AI mentor remembers your prep progress and upcoming interviews
              </span>
              <div className="flex items-center gap-2">
                {isTyping && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Bot className="h-3 w-3 animate-pulse" />
                    AI is thinking...
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea 
              className="flex-1 pr-4" 
              ref={scrollAreaRef}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      <div className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {/* Input Area */}
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about IBD prep, technicals, interviews, or strategy..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVoice}
                  className={isListening ? 'bg-red-500/10 border-red-500/20' : ''}
                  disabled={isTyping}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Prompts Sidebar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    className={`w-full justify-start h-auto p-3 text-left hover:bg-accent/50 ${getCategoryColor(prompt.category)}`}
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isTyping}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="text-xs leading-relaxed">{prompt.text}</span>
                    </div>
                  </Button>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Context Info */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="font-medium">Context Aware:</div>
              <ul className="space-y-1 pl-2">
                <li>• 78% practice score</li>
                <li>• MS interview tomorrow</li>
                <li>• 8/24 courses completed</li>
                <li>• 3 mock interviews ready</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}