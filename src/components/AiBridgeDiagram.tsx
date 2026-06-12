// MCP bridge architecture diagram — static, theme-aware SVG.
// Every stroke/fill uses CSS custom-property tokens so it renders correctly
// in both light and dark themes from a single source of truth.

export default function AiBridgeDiagram() {
  // Six nodes in query-flow order. Each box is 150 wide; rows stack vertically
  // so the diagram stays readable on narrow viewports via the responsive viewBox.
  const nodes = [
    { id: 1, label: "Marketing UI", sub: "natural-language question" },
    { id: 2, label: "MCP Server", sub: "tool routing" },
    { id: 3, label: "OAuth + NetSuite API", sub: "authenticated request" },
    { id: 4, label: "SuiteScript RESTlet", sub: "queries NetSuite DB" },
    { id: 5, label: "Ollama LLM", sub: "formats the answer" },
    { id: 6, label: "Answer in UI", sub: "returned to marketing" },
  ];

  const boxW = 240;
  const boxH = 64;
  const gapY = 36;
  const startX = 30;
  const startY = 24;

  return (
    <svg
      viewBox={`0 0 300 ${startY + nodes.length * (boxH + gapY)}`}
      className="w-full h-auto"
      role="img"
      aria-label="MCP bridge: marketing UI to NetSuite via OAuth and SuiteScript RESTlet, formatted by an Ollama LLM and returned to the UI"
      fontFamily="var(--font-space-grotesk)"
    >
      <defs>
        <marker
          id="ai-bridge-arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent-blue)" />
        </marker>
      </defs>

      {nodes.map((node, i) => {
        const y = startY + i * (boxH + gapY);
        const cx = startX + boxW / 2;
        return (
          <g key={node.id}>
            {/* Connector arrow from the previous box to this one */}
            {i > 0 && (
              <line
                x1={cx}
                y1={y - gapY}
                x2={cx}
                y2={y - 4}
                stroke="var(--accent-blue)"
                strokeWidth="1.5"
                markerEnd="url(#ai-bridge-arrowhead)"
              />
            )}

            {/* Node box */}
            <rect
              x={startX}
              y={y}
              width={boxW}
              height={boxH}
              rx="8"
              fill="var(--bg-card)"
              stroke="var(--border-default)"
              strokeWidth="1"
            />

            {/* Step index badge */}
            <circle
              cx={startX + 16}
              cy={y + boxH / 2}
              r="9"
              fill="var(--accent-violet)"
            />
            <text
              x={startX + 16}
              y={y + boxH / 2 + 3.5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="var(--bg-primary)"
            >
              {node.id}
            </text>

            {/* Labels */}
            <text
              x={startX + 36}
              y={y + boxH / 2 - 4}
              fontSize="11"
              fontWeight="600"
              fill="var(--text-primary)"
            >
              {node.label}
            </text>
            <text
              x={startX + 36}
              y={y + boxH / 2 + 11}
              fontSize="8.5"
              fill="var(--text-tertiary)"
            >
              {node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
