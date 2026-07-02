// Single source of truth for /developer-australia: the cities list, extracted
// VERBATIM from the original page. Imported by BOTH page.tsx (sr-only crawlable copy)
// and DeveloperAustraliaExperience.tsx (the space-dive stops). The Article + FAQPage
// JSON-LD stay in page.tsx (they are built from static literal text, not cities).
// Pure module.

export interface City {
  name: string;
  state: string;
  desc: string;
}

export const cities: City[] = [
  { name: "Perth", state: "WA", desc: "Primary base — same-day meetings, deep knowledge of WA mining and government sectors" },
  { name: "Sydney", state: "NSW", desc: "Remote delivery with regular timezone overlap. Experience with Sydney fintech and enterprise clients" },
  { name: "Melbourne", state: "VIC", desc: "Remote collaboration with VIC startups and SaaS companies. Competitive rates vs Melbourne agencies" },
  { name: "Brisbane", state: "QLD", desc: "Remote services for QLD businesses. Experience with education and healthcare technology projects" },
  { name: "Adelaide", state: "SA", desc: "Remote development for SA businesses. Defence and government sector experience" },
  { name: "Canberra", state: "ACT", desc: "Government portal development expertise. Compliance with Australian Government Digital Service Standard" },
  { name: "Darwin", state: "NT", desc: "Remote services for NT businesses. Mining and resources sector experience relevant to NT operations" },
  { name: "Hobart", state: "TAS", desc: "Remote development for Tasmanian businesses. Tourism and small business web application expertise" },
  { name: "Gold Coast", state: "QLD", desc: "Remote services for Gold Coast businesses. E-commerce and hospitality technology solutions" },
  { name: "Newcastle", state: "NSW", desc: "Remote development for Hunter Valley businesses. Industrial and manufacturing system experience" },
];
