/**
 * AI Mentor Service for Cook'd AI
 * Supports Grok-2 (xAI), Groq, OpenAI, and local banking mentor intelligence.
 */

export interface BankingUserContext {
  name?: string;
  practiceScore: number;
  totalApplications: number;
  upcomingInterviews: number;
  applications: Array<{ company: string; status: string; department?: string }>;
  interviewStage: number;
}

export async function generateMentorResponse(
  userMessage: string,
  userContext: BankingUserContext,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  const grokApiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const systemPrompt = `You are the executive AI Mentor at Cook'd AI, an elite Investment Banking Division (IBD) career prep platform.
You are coaching Alex K. (current user: ${userContext.practiceScore}% practice score, ${userContext.upcomingInterviews} upcoming interviews, ${userContext.totalApplications} total applications).

Key user context:
- Applications in pipeline: ${userContext.applications.map(a => `${a.company} (${a.status})`).join(', ') || 'J.P. Morgan, Goldman Sachs, Morgan Stanley, Lazard'}
- Target firms: Top Bulge Bracket (Goldman, Morgan Stanley, JPM) and Elite Boutiques (Evercore, Lazard, Centerview, Moelis).

Guidelines:
- Deliver sharp, highly technical, and authentic Wall Street investment banking guidance.
- When answering technical questions (DCF, LBO, M&A Accretion/Dilution, Accounting), use precise formulas, interview rules of thumb, and standard Street terminology.
- When answering behavioral questions, coach using the STAR method (Situation, Task, Action, Result) with specific banking nuances.
- Keep tone professional, encouraging, rigorous, and concise. Format responses with clean markdown bullet points and bold headers.`;

  // 1. Try Grok-2 (xAI API) if key is configured
  if (grokApiKey && grokApiKey.trim() !== '') {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokApiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'grok-2-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      } else {
        console.warn('Grok-2 API responded with error status:', response.status);
      }
    } catch (err) {
      console.error('Failed to call Grok-2 API:', err);
    }
  }

  // 2. Try Groq API if key is configured
  if (groqApiKey && groqApiKey.trim() !== '') {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      } else {
        console.warn('Groq API responded with error status:', response.status);
      }
    } catch (err) {
      console.error('Failed to call Groq API:', err);
    }
  }

  // 3. Try OpenAI API if key is configured
  if (openaiApiKey && openaiApiKey.trim() !== '') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      }
    } catch (err) {
      console.error('Failed to call OpenAI API:', err);
    }
  }

  // 4. Intelligent Context-Aware Banking AI Engine (Built-in Fallback)
  return generateBuiltInBankingResponse(userMessage, userContext);
}

function generateBuiltInBankingResponse(
  message: string,
  userContext: BankingUserContext
): string {
  const lower = message.toLowerCase();

  if (lower.includes('dcf') || lower.includes('discounted cash flow')) {
    return `### DCF Modeling & Valuation Strategy

Great question on DCF modeling! With your **${userContext.practiceScore}% practice score** and upcoming interviews, here is how to master this:

1. **Unlevered Free Cash Flow (FCFF)**:
   $$\\text{UFCF} = \\text{EBIT}(1 - t) + \\text{D\\&A} - \\text{CapEx} - \\Delta\\text{NWC}$$
   *Notice*: Excludes interest expenses to value the entire firm before capital structure decisions.

2. **Terminal Value (TV)**:
   - **Gordon Growth**: $\\text{TV} = \\frac{\\text{UFCF}_{n+1}}{\\text{WACC} - g}$ (Ensure $g \\le 2\\text{-}3\\%$).
   - **Exit Multiple**: $\\text{TV} = \\text{EBITDA}_n \\times (\\text{EV/EBITDA multiple})$.

3. **Bridging to Equity Value**:
   $$\\text{Equity Value} = \\text{Enterprise Value} - \\text{Total Debt} + \\text{Cash} - \\text{Minority Interest}$$

💡 **Street Tip**: In your Morgan Stanley and J.P. Morgan technical rounds, be ready for: *"If CapEx increases by $10, what is the exact effect on UFCF and Enterprise Value?"* (Answer: UFCF falls by $10 dollar-for-dollar; EV decreases by the present value of that $10 cash outflow).

Would you like to practice a specific DCF interview question together?`;
  }

  if (lower.includes('lbo') || lower.includes('buyout') || lower.includes('irr')) {
    return `### Leveraged Buyout (LBO) Mastery

LBO analysis is crucial for private equity and top-tier M&A advisory interviews. Here are the core pillars:

1. **Sources & Uses Balance**:
   - **Uses**: Purchase Equity Value + Refinancing Existing Debt + Financing & Advisory Fees.
   - **Sources**: Term Loan A/B (Bank Debt) + Senior Notes + Sponsor Equity (balancing plug).

2. **The 3 Return Drivers**:
   - **Deleveraging**: Paying down debt using company free cash flow.
   - **EBITDA Growth**: Organic expansion and margin improvement.
   - **Multiple Expansion**: Exiting at a higher EV/EBITDA multiple than entry.

3. **Mental Math Benchmarks**:
   - $2.0\\times$ MoIC in 5 years $\\approx$ **15% IRR**
   - $2.5\\times$ MoIC in 5 years $\\approx$ **20% IRR**
   - $3.0\\times$ MoIC in 5 years $\\approx$ **25% IRR**

Would you like to run through a 5-minute Paper LBO scenario?`;
  }

  if (lower.includes('accretion') || lower.includes('dilution') || lower.includes('m&a') || lower.includes('merger')) {
    return `### M&A Accretion / Dilution Analysis

Here is the essential framework for Accretion/Dilution:

1. **Definition**:
   A deal is **accretive** if Pro Forma EPS > Acquirer Standalone EPS. It is **dilutive** if Pro Forma EPS < Acquirer Standalone EPS.

2. **The 100% Stock Rule of Thumb**:
   In an all-stock deal without synergies:
   - If **Acquirer P/E > Target P/E** $\\rightarrow$ **Accretive**
   - If **Acquirer P/E < Target P/E** $\\rightarrow$ **Dilutive**

3. **Combined Net Income Formula**:
   $$\\text{Pro Forma Net Income} = \\text{Acquirer Net Income} + \\text{Target Net Income} + \\text{Synergies}(1-t) - \\text{New Debt Interest}(1-t) + \\text{Foregone Cash Interest}(1-t)$$

Would you like to test a mental math case study?`;
  }

  if (lower.includes('behavioral') || lower.includes('tell me about yourself') || lower.includes('weakness') || lower.includes('why')) {
    return `### Banking Behavioral Coaching (STAR Method)

With your current pipeline (**${userContext.totalApplications} applications**, **${userContext.upcomingInterviews} upcoming interviews**), behavioral performance is the decisive factor:

1. **The 2-Minute Rule**:
   Keep your pitch strictly between 90 and 120 seconds. Never recite resume bullets chronologically.

2. **"Why Investment Banking?" Structure**:
   - **Pillar 1**: Steepest learning curve and quantitative rigor early in your career.
   - **Pillar 2**: Real transactional exposure advising board-level corporate leaders.
   - **Pillar 3**: Proven passion demonstrated through past modeling projects and market tracking.

3. **The Weakness Trap**:
   Choose an authentic tactical weakness (e.g. over-committing or hesitation to delegate early), explain the specific corrective system you built, and cite a recent measurable improvement.

Shall we do a mock simulation of *"Walk me through your resume"* right now?`;
  }

  if (lower.includes('application') || lower.includes('pipeline') || lower.includes('networking') || lower.includes('resume')) {
    return `### Application & Networking Strategy

Looking at your active pipeline:
- **Applications**: ${userContext.totalApplications} submitted (including J.P. Morgan, Goldman Sachs, Morgan Stanley, Lazard)
- **Active Stage**: ${userContext.interviewStage} interviews scheduled

**Action Plan for This Week:**
1. **Targeted Follow-Ups**: Send concise status check-ins to alumni contacts 5 business days after interview completion.
2. **Cold Email Velocity**: Target 3-5 analysts/associates per firm, mentioning recent transactions from their league table.
3. **Firm Specifics**: Prepare 2 bespoke questions about recent group deals (e.g. MS Healthcare M&A or GS TMT).

What firm or topic should we strategize on next?`;
  }

  // Default response
  return `### AI Mentor Guidance

Hello Alex! Based on your profile (**${userContext.practiceScore}% practice score**, **${userContext.upcomingInterviews} scheduled interviews**, **${userContext.totalApplications} applications**), I am here to help you prepare across all IBD verticals:

- 📊 **Technical Valuation**: DCF, Trading Comps, Precedent Transactions, LBO analysis, M&A Accretion/Dilution.
- 🎯 **Behavioral Fit**: "Tell me about yourself", "Why Banking?", "Why this Firm?", STAR story workshops.
- 💼 **Deal Insights & Macro**: Recent M&A announcements, Fed interest rate impacts, league table positioning.
- 🤝 **Networking & Applications**: Cold email strategies, resume tailoring, follow-up timing.

What specific concept or interview round would you like to conquer today?`;
}
