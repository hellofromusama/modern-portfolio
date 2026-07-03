import type { Metadata } from "next";
import { getSpaceMode } from "@/lib/spaceMode";
import BudgetDive from "./BudgetDive";
import BudgetClassic from "./BudgetClassic";

export const metadata: Metadata = {
  title: "Project Budget Calculator | Perth Web Development Cost Estimates",
  description:
    "Get instant estimates for your web development project. Describe your requirements and get detailed cost and timeline information from Perth full stack developer Usama Javed.",
};

export default async function BudgetPage() {
  const space = await getSpaceMode();
  if (!space) return <BudgetClassic />;
  return (
    <>
      {/* Crawlable real-DOM copy of the budget tool — bots read what the canvas hides.
          Space mode only; the classic body is already crawlable. */}
      <div className="sr-only">
        <h1>Project Budget Calculator</h1>
        <p>
          Get instant estimates for your web development project. Describe your requirements and get
          detailed cost and timeline information.
        </p>
        <p>
          ⚡ This is an AI-powered tool for quick estimates. For accurate quotes, please contact
          directly.
        </p>
        <h2>Sample Questions</h2>
        <ul>
          <li>&quot;I need an e-commerce website with payment integration&quot;</li>
          <li>&quot;Build a custom CRM system for my business&quot;</li>
          <li>&quot;Create a mobile app with AI features&quot;</li>
          <li>&quot;Develop a SaaS platform with user authentication&quot;</li>
        </ul>
        <h2>What You&apos;ll Get</h2>
        <ul>
          <li>Detailed cost breakdown</li>
          <li>Project timeline estimate</li>
          <li>Technology recommendations</li>
          <li>Feature analysis &amp; suggestions</li>
        </ul>
        <h2>Need a Detailed Quote?</h2>
        <p>
          For complex projects or personalized consultation, contact me directly at{" "}
          <a href="mailto:hellofromusama@gmail.com">hellofromusama@gmail.com</a> or on{" "}
          <a href="https://wa.me/61433695387">WhatsApp +61 433 695 387</a>.
        </p>
      </div>

      <BudgetDive />
    </>
  );
}
