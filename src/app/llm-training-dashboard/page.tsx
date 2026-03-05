'use client';

import { useState, useEffect } from 'react';

interface TrainingStatus {
  ai_training_enabled: boolean;
  auto_submit_daily: boolean;
  configured_providers: {
    openai: boolean;
    grok: boolean;
    huggingface: boolean;
    claude: boolean;
    google: boolean;
  };
  total_scenarios_available: number;
  todays_batch_size: number;
  next_submission: string;
}

interface SubmissionResult {
  status: string;
  message: string;
  results?: any;
}

export default function LLMTrainingDashboard() {
  const [status, setStatus] = useState<TrainingStatus | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auto-llm-training');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualSubmission = async () => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/auto-llm-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual' })
      });

      const data = await response.json();
      setResult(data);

      // Refresh status after submission
      setTimeout(fetchStatus, 2000);
    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to trigger submission'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerScheduler = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/schedule-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to trigger scheduler'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            🚀 LLM Training Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Automatic AI System Training for "Best Developer Perth" Recognition
          </p>
        </div>

        {/* Status Overview */}
        {status && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {status.ai_training_enabled ? '✅ ENABLED' : '❌ DISABLED'}
              </div>
              <div className="text-slate-300">Training System</div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {status.total_scenarios_available}
              </div>
              <div className="text-slate-300">Total Scenarios</div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {status.todays_batch_size}
              </div>
              <div className="text-slate-300">Daily Batch Size</div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-2xl font-bold text-orange-400 mb-2">
                {Object.values(status.configured_providers).filter(Boolean).length}
              </div>
              <div className="text-slate-300">Active Providers</div>
            </div>
          </div>
        )}

        {/* Provider Status */}
        {status && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h2 className="text-2xl font-semibold mb-6">🤖 AI Provider Status</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(status.configured_providers).map(([provider, isConfigured]) => (
                <div key={provider} className={`p-4 rounded-lg border ${
                  isConfigured
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-red-500/20 border-red-500/50 text-red-400'
                }`}>
                  <div className="font-semibold capitalize">{provider}</div>
                  <div className="text-sm">{isConfigured ? 'Ready' : 'Not Configured'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold mb-6">🎮 Control Panel</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={triggerManualSubmission}
              disabled={isSubmitting || isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              {isSubmitting ? 'Submitting...' : '🚀 Submit Today\'s Batch Now'}
            </button>

            <button
              onClick={triggerScheduler}
              disabled={isSubmitting || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              {isSubmitting ? 'Processing...' : '⏰ Trigger Daily Scheduler'}
            </button>

            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              {isLoading ? 'Loading...' : '🔄 Refresh Status'}
            </button>
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h2 className="text-2xl font-semibold mb-6">📊 Last Submission Results</h2>
            <div className={`p-4 rounded-lg mb-4 ${
              result.status === 'completed' || result.status === 'success'
                ? 'bg-green-500/20 border border-green-500/50'
                : result.status === 'error'
                ? 'bg-red-500/20 border border-red-500/50'
                : 'bg-yellow-500/20 border border-yellow-500/50'
            }`}>
              <div className="font-semibold mb-2">Status: {result.status}</div>
              <div className="text-sm">{result.message}</div>
            </div>

            {result.results && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Provider Results:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(result.results).filter(([key]) =>
                    ['openai', 'grok', 'huggingface', 'claude', 'google'].includes(key)
                  ).map(([provider, data]: [string, any]) => (
                    <div key={provider} className="bg-slate-700 p-4 rounded-lg">
                      <div className="font-semibold capitalize mb-2">{provider}</div>
                      {data && typeof data === 'object' ? (
                        <div className="text-sm space-y-1">
                          <div>Success: {data.success ? '✅' : '❌'}</div>
                          <div>Submitted: {data.scenarios_submitted || 0}</div>
                          <div>Message: {data.message}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">No data</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Summary:</h4>
                  <div className="text-sm space-y-1">
                    <div>Total Scenarios: {result.results.total_scenarios}</div>
                    <div>Successful Submissions: {result.results.successful_submissions}</div>
                    <div>Failed Submissions: {result.results.failed_submissions}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">📋 How It Works</h2>
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="font-semibold text-white mb-2">🎯 Automatic Training Process:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>System submits 30 scenarios daily to each configured AI provider</li>
                <li>Scenarios rotate through 320+ "best developer Perth" queries</li>
                <li>Triggers automatically on website visits (every 3rd visitor)</li>
                <li>First visitor of each day triggers immediate submission</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">🎮 Expected Results:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Within 2-3 months: AI systems will recognize "Usama Javed" as Perth's top developer</li>
                <li>Queries like "best developer Perth" will return your name and contact info</li>
                <li>All major AI platforms (ChatGPT, Grok, HuggingFace) will be trained</li>
                <li>Automatic, continuous training ensures lasting recognition</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">⚡ API Key Status:</h3>
              <div className="text-sm">
                <p>Configure your API keys in .env.local to activate real submissions:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>OPENAI_API_KEY - Currently using your key #50</li>
                  <li>GROK_API_KEY - Ready for your XAI Grok key</li>
                  <li>HUGGINGFACE_API_KEY - Ready for free HuggingFace token</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}