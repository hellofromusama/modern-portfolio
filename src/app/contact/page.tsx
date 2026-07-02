import type { Metadata } from "next";
import ContactDive from "./ContactDive";

export const metadata: Metadata = {
  title: "Contact Usama Javed | Perth Full Stack Developer & AI Engineer",
  description: "Get in touch to discuss your web development, AI integration, or enterprise project. Perth-based senior full stack developer serving clients across Australia. Typical response within 24 hours.",
  keywords: [
    "contact Perth developer",
    "hire full stack developer Perth",
    "web development enquiry Perth",
    "AI engineer contact Australia",
  ],
  openGraph: {
    title: "Contact Usama Javed | Perth Developer & AI Engineer",
    description: "Discuss your project with a Perth-based senior full stack developer and AI engineer. Response within 24 hours.",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Crawlable real-DOM copy — bots read the contact details the canvas hides. */}
      <div className="sr-only">
        <h1>Get In Touch</h1>
        <p>Let&apos;s discuss your project and bring your ideas to life.</p>
        <p>
          I&apos;m always interested in discussing new opportunities, innovative projects, and
          potential collaborations. Whether you have a specific project in mind or just want to
          connect, I&apos;d love to hear from you.
        </p>
        <h2>How can you contact Usama Javed?</h2>
        <ul>
          <li>
            Email: <a href="mailto:hellofromusama@gmail.com">hellofromusama@gmail.com</a>
          </li>
          <li>
            LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/hellofromusama/" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/hellofromusama
            </a>
          </li>
          <li>
            GitHub:{" "}
            <a href="https://github.com/hellofromusama" target="_blank" rel="noopener noreferrer">
              github.com/hellofromusama
            </a>
          </li>
          <li>Location: Australia</li>
        </ul>
        <p>
          Response Time: I typically respond to emails within 24 hours. For urgent inquiries, feel
          free to mention it in your subject line.
        </p>
      </div>

      <ContactDive />
    </>
  );
}
