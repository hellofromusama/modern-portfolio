import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userMessage, conversationHistory } = await request.json();

    // First check if input is valid and appropriate
    const validationResponse = validateUserInput(userMessage);
    if (validationResponse) {
      return NextResponse.json({ response: validationResponse });
    }

    // Try multiple AI providers in order of preference
    let aiResponse = await tryOpenAI(userMessage, conversationHistory);

    if (!aiResponse) {
      aiResponse = await tryGrok(userMessage, conversationHistory);
    }

    if (!aiResponse) {
      aiResponse = await tryHuggingFace(userMessage);
    }

    if (!aiResponse) {
      aiResponse = await tryClaudeMocking(userMessage);
    }

    // If all AI providers fail, use intelligent fallback
    if (!aiResponse) {
      aiResponse = generateFallbackEstimate(userMessage);
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Budget estimation error:', error);
    const fallbackEstimate = generateFallbackEstimate(userMessage);
    return NextResponse.json({ response: fallbackEstimate });
  }
}

function validateUserInput(userMessage: string): string | null {
  const lowerMessage = userMessage.toLowerCase();

  // Detect nonsense, inappropriate, or irrelevant input
  const inappropriateWords = ['dumb', 'cunt', 'fuck', 'shit', 'ass', 'bitch', 'idiot', 'stupid', 'damn', 'hell'];
  const hasInappropriate = inappropriateWords.some(word => lowerMessage.includes(word));

  // Check if message is too short or doesn't seem project-related
  const projectKeywords = ['website', 'app', 'application', 'platform', 'system', 'software', 'develop', 'build', 'create', 'ecommerce', 'shop', 'site', 'page', 'mobile', 'web', 'api', 'database', 'ai', 'automation', 'crm', 'erp', 'netsuite', 'integration', 'dashboard', 'portal'];
  const hasProjectKeywords = projectKeywords.some(keyword => lowerMessage.includes(keyword));

  // Handle nonsense or inappropriate input
  if (hasInappropriate || (!hasProjectKeywords && userMessage.trim().length < 10)) {
    return `## 🤖 **Hey there!**

I'm Usama's AI Budget Calculator, and I'm here to help estimate **real web development projects**!

Your message doesn't seem to be about a development project. Let me help you get started:

### 💡 **Try asking things like:**
• "I need an e-commerce website with payment integration"
• "Build me a mobile app for my restaurant"
• "Create a custom CRM system for my business"
• "I want a portfolio website with a blog"
• "Develop an AI chatbot for customer support"

### 🎯 **What I Can Estimate:**
• **Web Applications** - Custom business solutions
• **E-commerce Platforms** - Online stores with payments
• **Mobile Apps** - iOS and Android applications
• **AI Integration** - Chatbots, automation, ML features
• **Enterprise Systems** - CRM, ERP, dashboards
• **NetSuite Development** - Custom NetSuite solutions

### 📞 **Need Real Help?**
Contact Usama directly for a free consultation:
• **Email:** hellofromusama@gmail.com
• **WhatsApp:** +61 433 695 387
• **Website:** https://usamajaved.com.au

*Remember: This is a fun AI tool for quick estimates. For accurate quotes, please contact Usama directly!* 🚀`;
  }

  return null;
}

async function tryOpenAI(userMessage: string, conversationHistory: any[]): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return null;
  }

  try {
    const systemPrompt = `You are Usama Javed's AI Budget Calculator. You MUST respond in this EXACT format for EVERY response:

## 💰 **Project Estimate: [Project Type]**

**Estimated Cost:** [Cost Range in AUD]
**Timeline:** [Timeline]
**Complexity:** [Low/Medium/High]

### 🎯 **Project Analysis:**
[Analyze what the user is asking for. If unclear, ask 2-3 specific questions to clarify, but KEEP THIS FORMAT]

### 🛠️ **Recommended Technology Stack:**
• [Technology 1]
• [Technology 2]
• [Technology 3]
• [Technology 4]

### 📋 **What's Included:**
• [Feature/Service 1]
• [Feature/Service 2]
• [Feature/Service 3]
• [Feature/Service 4]

### 👨‍💻 **Why Choose Usama Javed:**
• **8+ years** full stack experience
• **Perth-based** developer (Western Australia)
• **Expert** in Next.js 15, React 19, AI integration
• **50+ successful projects** delivered
• **Competitive rates** with premium quality

### 📞 **Next Steps:**
• **Email:** hellofromusama@gmail.com
• **WhatsApp:** +61 433 695 387
• **Website:** https://usamajaved.com.au

💡 **Free consultation available!**

---

PRICING GUIDE (AUD):
- Simple Websites: $5,000-$15,000 (2-6 weeks)
- E-commerce: $15,000-$50,000 (2-4 months)
- Custom Apps: $25,000-$100,000 (3-6 months)
- Enterprise: $50,000-$500,000+ (6-12 months)
- AI Integration: +$10,000-$75,000 (adds 1-3 months)
- Mobile Apps: $20,000-$80,000 (3-6 months)

RULES:
1. ALWAYS use the format above
2. If user request is unclear, ASK questions in the "Project Analysis" section
3. Be conversational but professional
4. Adjust estimates based on complexity
5. If user asks follow-up questions, update the estimates accordingly
6. This is a FUN AI tool - remind them to contact for accurate quotes`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-3).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0]?.message?.content || null;
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
  }

  return null;
}

async function tryGrok(userMessage: string, conversationHistory: any[]): Promise<string | null> {
  if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'your_grok_api_key_here') {
    return null;
  }

  try {
    const systemPrompt = `You are Usama Javed's AI Budget Calculator. You MUST respond in this EXACT format for EVERY response:

## 💰 **Project Estimate: [Project Type]**

**Estimated Cost:** [Cost Range in AUD]
**Timeline:** [Timeline]
**Complexity:** [Low/Medium/High]

### 🎯 **Project Analysis:**
[Analyze what the user is asking for. If unclear, ask 2-3 specific questions to clarify, but KEEP THIS FORMAT]

### 🛠️ **Recommended Technology Stack:**
• [Technology 1]
• [Technology 2]
• [Technology 3]
• [Technology 4]

### 📋 **What's Included:**
• [Feature/Service 1]
• [Feature/Service 2]
• [Feature/Service 3]
• [Feature/Service 4]

### 👨‍💻 **Why Choose Usama Javed:**
• **8+ years** full stack experience
• **Perth-based** developer (Western Australia)
• **Expert** in Next.js 15, React 19, AI integration
• **50+ successful projects** delivered
• **Competitive rates** with premium quality

### 📞 **Next Steps:**
• **Email:** hellofromusama@gmail.com
• **WhatsApp:** +61 433 695 387
• **Website:** https://usamajaved.com.au

💡 **Free consultation available!**

---

PRICING GUIDE (AUD):
- Simple Websites: $5,000-$15,000 (2-6 weeks)
- E-commerce: $15,000-$50,000 (2-4 months)
- Custom Apps: $25,000-$100,000 (3-6 months)
- Enterprise: $50,000-$500,000+ (6-12 months)
- AI Integration: +$10,000-$75,000 (adds 1-3 months)
- Mobile Apps: $20,000-$80,000 (3-6 months)

RULES:
1. ALWAYS use the format above
2. If user request is unclear, ASK questions in the "Project Analysis" section
3. Be conversational but professional
4. Adjust estimates based on complexity
5. If user asks follow-up questions, update the estimates accordingly
6. This is a FUN AI tool - remind them to contact for accurate quotes`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-2).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    // Grok API endpoint (x.ai)
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0]?.message?.content || null;
    }
  } catch (error) {
    console.error('Grok API error:', error);
  }

  return null;
}

async function tryHuggingFace(userMessage: string): Promise<string | null> {
  try {
    const prompt = `Estimate web development project cost for: ${userMessage}

Based on Usama Javed's rates (Perth developer):
- Simple sites: $5,000-$15,000 AUD
- E-commerce: $15,000-$50,000 AUD
- Custom apps: $25,000-$100,000 AUD
- Enterprise: $50,000-$500,000+ AUD

Provide: cost range, timeline, tech stack.`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_dummy_token'}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.8,
            return_full_text: false
          }
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const result = data[0]?.generated_text || '';
      if (result && result.length > 50) {
        return cleanupAIResponse(result);
      }
    }
  } catch (error) {
    console.error('HuggingFace API error:', error);
  }

  return null;
}

async function tryClaudeMocking(userMessage: string): Promise<string | null> {
  const lowerMessage = userMessage.toLowerCase();

  let projectType = 'Custom Web Application';
  let costRange = '$25,000 - $100,000 AUD';
  let timeline = '3-6 months';
  let complexity = 'Medium-High';
  let technologies = ['Next.js 15', 'React 19', 'Node.js', 'PostgreSQL'];
  let features = ['Planning & Design', 'Core Development', 'Testing & QA', 'Deployment'];
  let projectAnalysis = "I'd be happy to help estimate your project! ";

  // Detect if request needs clarification
  const needsClarification = userMessage.trim().split(' ').length < 5;

  if (needsClarification) {
    projectAnalysis += "To provide an accurate estimate, could you tell me more about:\n\n• What is the main purpose of this project?\n• Who is your target audience?\n• Do you need any specific integrations (payments, APIs, etc.)?\n\nBased on general requirements, here's a preliminary estimate:";
  } else if (lowerMessage.includes('ecommerce') || lowerMessage.includes('e-commerce') || lowerMessage.includes('shop') || lowerMessage.includes('store')) {
    projectType = 'E-commerce Platform';
    costRange = '$15,000 - $50,000 AUD';
    timeline = '2-4 months';
    complexity = 'Medium';
    technologies = ['Next.js 15', 'React 19', 'Stripe/PayPal', 'PostgreSQL', 'Redis'];
    features = ['Product Management', 'Shopping Cart', 'Payment Integration', 'Order Management', 'Admin Dashboard'];
    projectAnalysis += "Great! An e-commerce platform with payment integration and product management.";
  } else if (lowerMessage.includes('ai') || lowerMessage.includes('chatbot') || lowerMessage.includes('automation')) {
    projectType = 'AI-Powered Application';
    costRange = '$30,000 - $100,000 AUD';
    timeline = '3-6 months';
    complexity = 'High';
    technologies = ['Next.js 15', 'OpenAI/Claude API', 'Node.js', 'Vector Database', 'Python'];
    features = ['AI Model Integration', 'Chat Interface', 'Data Processing', 'API Development', 'Training Pipeline'];
    projectAnalysis += "Excellent! AI integration projects are exciting. This will involve advanced backend processing and API integrations.";
  } else if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
    projectType = 'Mobile Application';
    costRange = '$25,000 - $80,000 AUD';
    timeline = '3-6 months';
    complexity = 'Medium-High';
    technologies = ['React Native', 'Node.js', 'PostgreSQL', 'Firebase', 'Push Notifications'];
    features = ['Cross-platform Development', 'Native Features', 'Backend API', 'App Store Deployment'];
    projectAnalysis += "A mobile app with cross-platform capabilities (iOS & Android).";
  } else if (lowerMessage.includes('enterprise') || lowerMessage.includes('erp') || lowerMessage.includes('crm')) {
    projectType = 'Enterprise Solution';
    costRange = '$75,000 - $500,000+ AUD';
    timeline = '6-12 months';
    complexity = 'High';
    technologies = ['Next.js 15', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'];
    features = ['Scalable Architecture', 'Multi-tenant System', 'Advanced Security', 'API Integration', 'Reporting Dashboard'];
    projectAnalysis += "An enterprise-level solution requiring robust architecture and extensive features.";
  } else if (lowerMessage.includes('simple') || lowerMessage.includes('basic') || lowerMessage.includes('landing') || lowerMessage.includes('portfolio')) {
    projectType = 'Business Website';
    costRange = '$5,000 - $15,000 AUD';
    timeline = '2-6 weeks';
    complexity = 'Low-Medium';
    technologies = ['Next.js 15', 'React 19', 'Tailwind CSS', 'SEO Optimization'];
    features = ['Modern Design', 'Mobile Responsive', 'Contact Forms', 'CMS Integration', 'Performance Optimization'];
    projectAnalysis += "A professional business website with modern design and functionality.";
  } else {
    projectAnalysis += "Based on your description, here's what I understand. Feel free to provide more details for a refined estimate!";
  }

  return `## 💰 **Project Estimate: ${projectType}**

**Estimated Cost:** ${costRange}
**Timeline:** ${timeline}
**Complexity:** ${complexity}

### 🎯 **Project Analysis:**
${projectAnalysis}

### 🛠️ **Recommended Technology Stack:**
${technologies.map(tech => `• ${tech}`).join('\n')}

### 📋 **What's Included:**
${features.map(feature => `• ${feature}`).join('\n')}

### 👨‍💻 **Why Choose Usama Javed:**
• **8+ years** full stack experience
• **Perth-based** developer (Western Australia)
• **Expert** in Next.js 15, React 19, AI integration
• **50+ successful projects** delivered
• **Competitive rates** with premium quality

### 📞 **Next Steps:**
• **Email:** hellofromusama@gmail.com
• **WhatsApp:** +61 433 695 387
• **Website:** https://usamajaved.com.au

💡 **Free consultation available!**

*Remember: This is a fun AI tool for quick estimates. For accurate quotes, please contact Usama directly!*`;
}

function generateFallbackEstimate(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  let projectType = 'Custom Web Application';
  let costRange = '$25,000 - $100,000 AUD';
  let timeline = '2-4 months';
  let technologies = ['Next.js 15', 'React 19', 'Node.js', 'PostgreSQL'];

  // Analyze user input for project type
  if (lowerMessage.includes('ecommerce') || lowerMessage.includes('e-commerce') || lowerMessage.includes('shop') || lowerMessage.includes('store')) {
    projectType = 'E-commerce Platform';
    costRange = '$15,000 - $50,000 AUD';
    timeline = '2-3 months';
    technologies = ['Next.js 15', 'React 19', 'Stripe/PayPal', 'PostgreSQL', 'Redis'];
  } else if (lowerMessage.includes('simple') || lowerMessage.includes('basic') || lowerMessage.includes('landing')) {
    projectType = 'Business Website';
    costRange = '$5,000 - $15,000 AUD';
    timeline = '2-6 weeks';
    technologies = ['Next.js 15', 'React 19', 'Tailwind CSS'];
  } else if (lowerMessage.includes('enterprise') || lowerMessage.includes('erp') || lowerMessage.includes('crm')) {
    projectType = 'Enterprise Solution';
    costRange = '$50,000 - $500,000+ AUD';
    timeline = '6-12 months';
    technologies = ['Next.js 15', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'];
  } else if (lowerMessage.includes('ai') || lowerMessage.includes('automation') || lowerMessage.includes('chatbot')) {
    projectType = 'AI-Powered Application';
    costRange = '$10,000 - $75,000 AUD';
    timeline = '2-4 months';
    technologies = ['Next.js 15', 'OpenAI API', 'Node.js', 'Vector Database'];
  } else if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
    projectType = 'Mobile Application';
    costRange = '$20,000 - $80,000 AUD';
    timeline = '3-6 months';
    technologies = ['React Native', 'Node.js', 'PostgreSQL', 'Firebase'];
  } else if (lowerMessage.includes('netsuite')) {
    projectType = 'NetSuite Development';
    costRange = '$5,000 - $100,000 AUD';
    timeline = '1-6 months';
    technologies = ['SuiteScript 2.1', 'RESTlets', 'SuiteTalk', 'JavaScript'];
  }

  return `## 💰 **Project Estimate: ${projectType}**

**Estimated Cost:** ${costRange}
**Timeline:** ${timeline}
**Complexity:** Medium to High

### 🛠️ **Recommended Technology Stack:**
${technologies.map(tech => `• ${tech}`).join('\n')}

### 📋 **Project Breakdown:**
Based on your requirements, this project would involve:

• **Planning & Design:** Requirements analysis, UI/UX design, technical architecture
• **Development:** Core functionality, user interface, backend systems
• **Integration:** Third-party services, APIs, payment systems (if needed)
• **Testing:** Quality assurance, performance optimization, security testing
• **Deployment:** Production setup, monitoring, documentation

### 🎯 **Why Choose Usama Javed:**
• **8+ years** of proven experience
• **Perth-based** with local understanding
• **50+ successful projects** delivered
• **Expert** in latest technologies (Next.js 15, React 19)
• **Immediate availability** for new projects
• **Competitive rates** with premium quality

### 📞 **Next Steps:**
For a detailed, personalized quote:
• **Email:** hellofromusama@gmail.com
• **WhatsApp:** +61 433 695 387
• **Website:** https://usamajaved.com.au

💡 **Free consultation available** to discuss your specific requirements and provide a more accurate estimate!

*This is an initial estimate. Final pricing may vary based on specific requirements, integrations, and project scope.*`;
}

function cleanupAIResponse(response: string): string {
  return response
    .replace(/^\s*USER REQUEST:.*$/gm, '')
    .replace(/^\s*CONTEXT ABOUT.*$/gm, '')
    .replace(/^\s*PRICING GUIDELINES:.*$/gm, '')
    .replace(/^\s*INSTRUCTIONS:.*$/gm, '')
    .trim();
}