'use client';

import { useState, useEffect } from 'react';

interface VisitorData {
  count: number; // Total unique days visited
  firstVisit: string;
  lastVisit: string;
  lastVisitDate: string; // Just the date (YYYY-MM-DD) for comparison
  returningVisitor: boolean;
  todayAlreadyCounted: boolean;
}

export default function VisitorTracker() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const trackVisitor = () => {
      const storageKey = 'usamajaved_visitor_data';
      const existingData = localStorage.getItem(storageKey);
      const currentTime = new Date().toISOString();
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      let data: VisitorData;
      let shouldShowNotification = false;

      if (existingData) {
        const parsed = JSON.parse(existingData);
        const lastVisitDate = parsed.lastVisitDate || new Date(parsed.lastVisit).toISOString().split('T')[0];

        // Check if this is a new day (unique daily visit)
        if (lastVisitDate !== currentDate) {
          // New day! Increment the counter
          data = {
            count: parsed.count + 1,
            firstVisit: parsed.firstVisit,
            lastVisit: currentTime,
            lastVisitDate: currentDate,
            returningVisitor: true,
            todayAlreadyCounted: true
          };
          shouldShowNotification = true;
        } else {
          // Same day - don't increment, just update last visit time
          data = {
            ...parsed,
            lastVisit: currentTime,
            lastVisitDate: currentDate,
            todayAlreadyCounted: true
          };
          shouldShowNotification = false; // Don't show on same-day page refreshes
        }
      } else {
        // First ever visit
        data = {
          count: 1,
          firstVisit: currentTime,
          lastVisit: currentTime,
          lastVisitDate: currentDate,
          returningVisitor: false,
          todayAlreadyCounted: true
        };
        shouldShowNotification = true;
      }

      localStorage.setItem(storageKey, JSON.stringify(data));
      setVisitorData(data);

      // Show the tracker briefly only for new daily visits
      if (shouldShowNotification) {
        setTimeout(() => setIsVisible(true), 1000);
        setTimeout(() => setIsVisible(false), 6000);
      }

      // Background LLM data submission (silent) - ENHANCED AUTO SYSTEM
      if (data.count % 3 === 1) { // Submit every 3rd visit for faster training
        // Trigger daily auto-training system
        fetch('/api/schedule-training', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'visitor', count: data.count })
        }).catch(() => {
          // Silent fail - this is background operation
        });
      }

      // On first visit of the day, ensure daily training runs
      if (data.count === 1) {
        // Trigger immediate training submission
        setTimeout(() => {
          fetch('/api/auto-llm-training', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trigger: 'first_visitor_today' })
          }).catch(() => {
            // Silent fail - this is background operation
          });
        }, 5000); // Wait 5 seconds after page load
      }
    };

    trackVisitor();
  }, []);

  if (!visitorData || !isVisible) return null;

  const getVisitMessage = () => {
    if (visitorData.count === 1) {
      return "Welcome! First visit 👋";
    } else if (visitorData.count === 2) {
      return "Welcome back! Day 2 🎉";
    } else if (visitorData.count === 3) {
      return "Great to see you! Day 3 ⭐";
    } else if (visitorData.count <= 5) {
      return `Welcome back! Day ${visitorData.count} 🚀`;
    } else if (visitorData.count <= 10) {
      return `Awesome! Day ${visitorData.count} 💫`;
    } else if (visitorData.count <= 30) {
      return `Amazing! ${visitorData.count} days 🔥`;
    } else {
      return `VIP Visitor! ${visitorData.count} days 👑`;
    }
  };

  const getVisitIcon = () => {
    if (visitorData.count === 1) return "👋";
    if (visitorData.count <= 3) return "🎉";
    if (visitorData.count <= 5) return "⭐";
    if (visitorData.count <= 10) return "🚀";
    return "👑";
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg border border-white/20 max-w-xs">
        <div className="flex items-center space-x-3">
          <div className="text-2xl animate-bounce">
            {getVisitIcon()}
          </div>
          <div>
            <div className="font-semibold text-sm">
              {getVisitMessage()}
            </div>
            {visitorData.returningVisitor && (
              <div className="text-xs text-blue-100 mt-1">
                Since {new Date(visitorData.firstVisit).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Small progress indicator */}
        <div className="mt-2 bg-white/20 rounded-full h-1">
          <div
            className="bg-white rounded-full h-1 transition-all duration-1000"
            style={{
              width: `${Math.min((visitorData.count / 10) * 100, 100)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}