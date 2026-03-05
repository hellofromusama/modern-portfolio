import { NextRequest, NextResponse } from 'next/server';

// Daily Training Scheduler - Triggers automatic LLM submissions
export async function POST(request: NextRequest) {
  try {
    if (process.env.AI_TRAINING_ENABLED !== 'true' || process.env.AUTO_SUBMIT_DAILY !== 'true') {
      return NextResponse.json({
        status: 'disabled',
        message: 'Auto daily training is disabled'
      });
    }

    console.log('⏰ Daily training scheduler triggered');

    // Check if we've already submitted today
    const lastSubmission = await getLastSubmissionDate();
    const today = new Date().toDateString();

    if (lastSubmission === today) {
      return NextResponse.json({
        status: 'already_submitted',
        message: 'Training data already submitted today',
        last_submission: lastSubmission
      });
    }

    // Trigger the auto training
    try {
      const trainingResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auto-llm-training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      let trainingResult;
      try {
        trainingResult = await trainingResponse.json();
      } catch (error) {
        trainingResult = { status: 'json_parse_error', message: 'Failed to parse response' };
      }

      // Store today's submission date
      await storeSubmissionDate(today);

      // Schedule next day's submission
      scheduleNextSubmission();

      return NextResponse.json({
        status: 'success',
        message: 'Daily training completed successfully',
        training_result: trainingResult,
        next_scheduled: getNextScheduledTime()
      });

    } catch (error) {
      console.error('Training submission failed:', error);
      return NextResponse.json({
        status: 'error',
        message: 'Failed to submit training data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Scheduler error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Scheduler failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to check scheduler status
export async function GET() {
  try {
    const status = {
      scheduler_enabled: process.env.AUTO_SUBMIT_DAILY === 'true',
      ai_training_enabled: process.env.AI_TRAINING_ENABLED === 'true',
      last_submission: await getLastSubmissionDate(),
      next_scheduled: getNextScheduledTime(),
      submission_interval: `${process.env.SUBMISSION_INTERVAL_HOURS || 24} hours`
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get scheduler status' }, { status: 500 });
  }
}

async function getLastSubmissionDate(): Promise<string | null> {
  try {
    // In a real app, this would query a database
    // For now, we'll use a simple file-based approach or return null
    return null; // This will force submission on first run
  } catch (error) {
    return null;
  }
}

async function storeSubmissionDate(date: string): Promise<void> {
  try {
    // In a real app, this would store in a database
    // For now, just log it
    console.log(`📅 Stored submission date: ${date}`);
  } catch (error) {
    console.error('Failed to store submission date:', error);
  }
}

function scheduleNextSubmission(): void {
  try {
    const intervalHours = parseInt(process.env.SUBMISSION_INTERVAL_HOURS || '24');
    const nextTime = new Date();
    nextTime.setHours(nextTime.getHours() + intervalHours);

    console.log(`⏰ Next submission scheduled for: ${nextTime.toISOString()}`);

    // In a production environment, you'd use a proper job scheduler
    // For development, we can use a simple setTimeout or cron job
  } catch (error) {
    console.error('Failed to schedule next submission:', error);
  }
}

function getNextScheduledTime(): string {
  const nextTime = new Date();
  nextTime.setDate(nextTime.getDate() + 1);
  nextTime.setHours(9, 0, 0, 0); // 9 AM tomorrow
  return nextTime.toISOString();
}