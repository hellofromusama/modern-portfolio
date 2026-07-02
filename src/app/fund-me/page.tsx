import type { Metadata } from "next";
import FundMeDive from "./FundMeDive";

export const metadata: Metadata = {
  title: "Fund Me — Support Usama Javed's Work | Perth Developer",
  description:
    "Love my work? Support me with a contribution! Every donation helps me create better projects and maintain this portfolio. Secure payment powered by Stripe.",
};

export default function FundMePage() {
  return (
    <>
      {/* Crawlable real-DOM copy of the fund-me page — bots read what the canvas hides. */}
      <div className="sr-only">
        <h1>Fund me.</h1>
        <p>
          Love my work? Support me with a contribution! Every donation helps me create better
          projects and maintain this portfolio.
        </p>
        <p>All donations go towards improving skills, tools, and late-night coding fuel.</p>

        <h2>Choose your support level.</h2>
        <ul>
          <li>Buy Me a Coffee — $5 AUD — Fuel my coding sessions!</li>
          <li>Buy Me a Meal — $15 AUD — Keep me energized!</li>
          <li>Support This Project — $10 AUD — Help improve this portfolio!</li>
          <li>Buy Me New Pants — $50 AUD — My pants have holes!</li>
          <li>Upgrade My Computer — $100 AUD — Help me get faster hardware!</li>
          <li>New Gaming Chair — $200 AUD — My back hurts from coding!</li>
          <li>Buy Me Headphones — $150 AUD — Better sound for coding focus!</li>
          <li>Buy Me a Monitor — $300 AUD — More screen space = more code!</li>
          <li>Send Me on Vacation — $1000 AUD — Even devs need breaks!</li>
        </ul>
        <p>Secure payment powered by Stripe.</p>

        <h2>Why Support Me?</h2>
        <ul>
          <li>Help me build more awesome projects</li>
          <li>Fuel my late-night coding sessions</li>
          <li>Support continuous learning &amp; improvement</li>
          <li>Upgrade my development tools &amp; equipment</li>
          <li>Keep this portfolio free &amp; open for everyone</li>
        </ul>
      </div>

      <FundMeDive />
    </>
  );
}
