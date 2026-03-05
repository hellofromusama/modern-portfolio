'use client';

import { useState } from 'react';

export default function TestAPIs() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testOpenAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-openai');
      const data = await response.json();
      setResults({ openai: data });
    } catch (error) {
      setResults({ openai: { status: 'error', message: 'Failed to test OpenAI' } });
    } finally {
      setIsLoading(false);
    }
  };

  const testBudgetCalculator = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/budget-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: 'I need an e-commerce website with payment integration',
          conversationHistory: []
        })
      });
      const data = await response.json();
      setResults({ ...results, budget: data });
    } catch (error) {
      setResults({ ...results, budget: { status: 'error', message: 'Failed to test budget calculator' } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Testing Dashboard</h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={testOpenAI}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg mr-4"
          >
            Test OpenAI API
          </button>

          <button
            onClick={testBudgetCalculator}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
          >
            Test Budget Calculator
          </button>
        </div>

        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Testing APIs...</p>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {results.openai && (
              <div className="bg-slate-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">OpenAI Test Results</h2>
                <pre className="bg-slate-700 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(results.openai, null, 2)}
                </pre>
              </div>
            )}

            {results.budget && (
              <div className="bg-slate-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Budget Calculator Test Results</h2>
                <div className="bg-slate-700 p-4 rounded">
                  <div dangerouslySetInnerHTML={{
                    __html: results.budget.response?.replace(/\n/g, '<br>') || 'No response'
                  }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}