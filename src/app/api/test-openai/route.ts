import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API key not configured'
      });
    }

    // Test OpenAI API with a simple request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Say "API test successful" if you can respond'
          }
        ],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: 'success',
        message: 'OpenAI API is working',
        response: data.choices[0]?.message?.content || 'No response',
        keyUsed: process.env.OPENAI_API_KEY.substring(0, 10) + '...',
      });
    } else {
      const error = await response.text();
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API request failed',
        error: error,
        statusCode: response.status,
      });
    }

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}