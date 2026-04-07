/**
 * Visible "Last Updated" timestamp for AI freshness signals.
 * Content updated within 30 days gets 3.2x more Perplexity citations.
 */
export default function LastUpdated() {
  return (
    <div className="text-center py-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
      <time
        dateTime="2026-04-07"
        className="text-xs tracking-wide"
        style={{ color: 'var(--text-faint)' }}
      >
        Last updated: April 7, 2026
      </time>
    </div>
  );
}
