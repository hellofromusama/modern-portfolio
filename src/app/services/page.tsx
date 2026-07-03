import type { Metadata } from "next";
import { getSpaceMode } from "@/lib/spaceMode";
import { services, processSteps } from "@/content/services";
import ServicesDive from "./ServicesDive";
import ServicesClassic from "./ServicesClassic";

export const metadata: Metadata = {
  title: "Web Development & SEO Services I Provide | Perth Full Stack Developer",
  description: "Professional web development services in Perth: custom web applications, AI integration, e-commerce platforms, mobile apps, and enterprise solutions. Serving Perth metro and all of Australia.",
  keywords: [
    "web development services Perth",
    "custom web applications Perth",
    "AI integration services",
    "e-commerce development Perth",
    "mobile app development Perth",
    "enterprise web solutions",
    "API development Perth",
    "full stack developer services",
    "web app developer Perth",
    "hire developer Perth",
    "custom web solutions Perth",
    "business automation Perth",
    "Perth web development company",
    "software development services Perth"
  ],
  openGraph: {
    title: "Professional Web Development Services | Perth, Australia",
    description: "Expert web development services in Perth: custom applications, AI integration, e-commerce platforms. Serving businesses across Australia with modern solutions.",
  },
};

export default async function ServicesPage() {
  const space = await getSpaceMode();
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Web Development Services Perth",
    "description": "Professional web development and software engineering services in Perth, Western Australia",
    "provider": {
      "@type": "Person",
      "name": "Usama Javed",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Perth",
        "addressRegion": "WA",
        "addressCountry": "AU"
      }
    },
    "areaServed": {
      "@type": "State",
      "name": "Western Australia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Development Services",
      "itemListElement": services.flatMap(category =>
        category.items.map(service => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.name,
            "description": service.description
          }
        }))
      )
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {space ? (
        <>
          {/* Crawlable real-DOM copy of the catalog — bots read what the canvas hides.
              Space mode only; the classic body is already crawlable. */}
          <div className="sr-only">
            <h1>Web Development &amp; SEO Services I Provide</h1>
            <p>
              Expert full stack development services in Perth, Western Australia. Custom web applications,
              AI integration, and enterprise solutions for businesses across Australia.
            </p>
            <h2>What web development services are available in Perth?</h2>
            {services.map((category) => (
              <section key={category.category}>
                <h3>{category.category}</h3>
                <p>{category.description}</p>
                <ul>
                  {category.items.map((service) => (
                    <li key={service.name}>
                      <strong>{service.name}</strong> — {service.description} Key features:{" "}
                      {service.features.join(", ")}. Timeline: {service.timeframe}. From: {service.priceRange}.
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <h2>How do you work with Perth clients?</h2>
            <ol>
              {processSteps.map((step) => (
                <li key={step.step}>
                  <strong>{step.title}</strong> — {step.description}
                </li>
              ))}
            </ol>
            <h2>Ready to start your web development project?</h2>
            <p>
              Get a free consultation and detailed proposal for your Perth business.{" "}
              <a href="/contact">Start Your Project Today</a>.
            </p>
          </div>

          <ServicesDive />
        </>
      ) : (
        <ServicesClassic />
      )}
    </>
  );
}
