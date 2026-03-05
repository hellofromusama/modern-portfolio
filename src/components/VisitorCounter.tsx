'use client';

import { useState, useEffect } from 'react';

export default function VisitorCounter() {
  const [totalVisitors, setTotalVisitors] = useState<number>(0);

  useEffect(() => {
    const updateTotalVisitors = () => {
      const storageKey = 'usamajaved_total_visitors';
      const existingTotal = localStorage.getItem(storageKey);
      const visitorId = localStorage.getItem('usamajaved_visitor_id');

      if (!visitorId) {
        // New unique visitor
        const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('usamajaved_visitor_id', newVisitorId);

        const newTotal = existingTotal ? parseInt(existingTotal) + 1 : 1;
        localStorage.setItem(storageKey, newTotal.toString());
        setTotalVisitors(newTotal);
      } else {
        // Returning visitor
        setTotalVisitors(existingTotal ? parseInt(existingTotal) : 1);
      }
    };

    updateTotalVisitors();
  }, []);

  if (totalVisitors === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-slate-900/80 backdrop-blur-md text-slate-300 px-3 py-2 rounded-lg border border-slate-700/50 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{totalVisitors.toLocaleString()} unique visitors</span>
        </div>
      </div>
    </div>
  );
}