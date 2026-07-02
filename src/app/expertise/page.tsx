import type { Metadata } from "next";
import { technicalExpertise, certifications } from "./expertiseData";
import ExpertiseDive from "./ExpertiseDive";

export const metadata: Metadata = {
  title: "Technical Expertise & Specializations | Full Stack Development Mastery",
  description: "Comprehensive overview of Usama Javed's technical expertise: Next.js 15, React 19, AI integration, enterprise solutions, and modern web technologies. 8+ years of proven expertise in Perth, Australia.",
  keywords: [
    "technical expertise Perth",
    "Next.js 15 expert",
    "React 19 specialist",
    "AI integration expert",
    "enterprise development",
    "full stack mastery",
    "modern web technologies",
    "software architecture",
    "performance optimization",
    "scalable solutions"
  ],
};

export default function ExpertisePage() {
  const expertiseSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.usamajaved.com.au/#expertise",
    "name": "Usama Javed",
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Senior Full Stack Developer",
      "skills": Object.values(technicalExpertise).flatMap(category =>
        category.technologies?.map(tech => tech.name) || []
      ).join(", "),
      "yearsOfExperience": "8+"
    },
    "knowsAbout": Object.values(technicalExpertise).flatMap(category =>
      category.technologies?.flatMap(tech => tech.specializations || []) || []
    ),
    "hasCredential": certifications.map(cert => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert.name,
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": cert.issuer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(expertiseSchema) }}
      />

      {/* Crawlable real-DOM copy — bots read what the canvas dive hides. */}
      <div className="sr-only">
        <h1>Technical Expertise &amp; Specializations</h1>
        <p>
          Master-level expertise in modern web technologies, AI integration, and enterprise solutions.
          8+ years of proven experience delivering complex projects across various industries.
        </p>
        <ul>
          <li>50+ Projects Completed</li>
          <li>8+ Years Experience</li>
          <li>20+ Technologies Mastered</li>
          <li>5 Professional Certifications</li>
        </ul>
        {Object.entries(technicalExpertise).map(([key, category]) => (
          <section key={key}>
            <h2>{category.category}</h2>
            <p>{category.description}</p>
            {category.technologies?.map((tech) => (
              <article key={tech.name}>
                <h3>{tech.name}</h3>
                <p>
                  Level: {tech.level}. Experience: {tech.experience}.
                  {tech.projects ? ` Projects: ${tech.projects}.` : ""}
                </p>
                <p>Core specializations: {tech.specializations.join(", ")}.</p>
                {tech.achievements && (
                  <p>Key achievements: {tech.achievements.join(", ")}.</p>
                )}
              </article>
            ))}
            {category.sectors?.map((sector) => (
              <article key={sector.name}>
                <h3>{sector.name}</h3>
                <p>Level: {sector.level}. Experience: {sector.experience}.</p>
                <p>Applications developed: {sector.applications.join(", ")}.</p>
                {sector.achievements && (
                  <p>Success stories: {sector.achievements.join(", ")}.</p>
                )}
              </article>
            ))}
          </section>
        ))}
        <h2>Professional Certifications</h2>
        <ul>
          {certifications.map((cert) => (
            <li key={cert.name}>
              {cert.name} — {cert.issuer} ({cert.year}, {cert.status})
            </li>
          ))}
        </ul>
        <h2>Ready to Leverage This Expertise for Your Project?</h2>
        <p>
          Get a free technical consultation to discuss how my expertise can solve your specific
          challenges. <a href="/contact">Schedule Expert Consultation</a>.
        </p>
      </div>

      <ExpertiseDive />
    </>
  );
}
