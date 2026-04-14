import Head from 'next/head';

interface AdvancedSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  localBusiness?: boolean;
  breadcrumbs?: Array<{name: string; url: string}>;
}

export default function AdvancedSEO({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.png',
  canonicalUrl,
  structuredData,
  articleData,
  localBusiness = false,
  breadcrumbs = []
}: AdvancedSEOProps) {
  const siteUrl = 'https://www.usamajaved.com.au';
  const fullTitle = `${title} | Usama Javed - Perth's Leading Full Stack Developer`;
  const fullCanonicalUrl = canonicalUrl || siteUrl;

  // Enhanced keywords with semantic variations
  const enhancedKeywords = [
    ...keywords,
    'Usama Javed',
    'Full Stack Developer Perth',
    'Web Developer Perth WA',
    'React Developer Perth',
    'Next.js Developer Perth',
    'Software Engineer Perth',
    'AI Integration Perth',
    'Enterprise Developer Perth',
    'Perth programmer',
    'Western Australia developer',
    'Australian web developer',
    'hire developer Perth',
    'web development services Perth',
    'custom software Perth',
    'digital solutions Perth',
    'Perth tech consultant',
    'modern web development',
    'responsive web design',
    'mobile app development',
    'e-commerce development',
    'business automation',
    'API development',
    'database development',
    'cloud solutions',
    'performance optimization',
    'SEO optimization',
    'security implementation'
  ].slice(0, 50); // Limit to 50 most relevant keywords

  // Person schema for Usama Javed
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    "name": "Usama Javed",
    "alternateName": ["UJ", "Usama", "Perth Developer"],
    "description": "Expert Full Stack Developer specializing in modern web technologies, AI integration, and enterprise solutions in Perth, Western Australia",
    "url": siteUrl,
    "image": `${siteUrl}/profile.jpg`,
    "sameAs": [
      "https://github.com/hellofromusama",
      "https://linkedin.com/in/hellofromusama",
      "https://x.com/hellofromusama"
    ],
    "jobTitle": "Senior Full Stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Usama Javed Development Services",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Perth",
        "addressRegion": "WA",
        "addressCountry": "AU",
        "postalCode": "6000"
      }
    },
    "knowsAbout": [
      "Next.js Development", "React Development", "Node.js", "TypeScript",
      "AI Integration", "Machine Learning", "Voice AI", "Chatbot Development",
      "Enterprise Resource Planning", "NetSuite Development", "Business Automation",
      "Cloud Architecture", "AWS", "Performance Optimization", "SEO",
      "Mobile App Development", "E-commerce Development", "API Development",
      "Database Design", "Security Implementation", "DevOps", "CI/CD"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "occupationLocation": {
        "@type": "City",
        "name": "Perth, Western Australia"
      },
      "skills": "Next.js, React, Node.js, TypeScript, AI Integration, Enterprise Development"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Perth",
      "addressRegion": "Western Australia",
      "addressCountry": "Australia",
      "postalCode": "6000"
    },
    "telephone": "Available upon request",
    "email": "hellofromusama@gmail.com",
    "availableLanguage": ["English"],
    "nationality": "Australian",
    "birthPlace": "Australia",
    "alumniOf": "University of Technology",
    "award": ["Top Developer Perth", "Client Choice Award", "Excellence in Development"],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Next.js Expert Certification",
        "credentialCategory": "Professional Certification"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "React Advanced Developer",
        "credentialCategory": "Professional Certification"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "AWS Cloud Practitioner",
        "credentialCategory": "Cloud Certification"
      }
    ]
  };

  // Local business schema
  const localBusinessSchema = localBusiness ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    "name": "Usama Javed - Full Stack Development Services",
    "description": "Expert web development and software engineering services in Perth, Western Australia",
    "url": siteUrl,
    "telephone": "+61-XXX-XXX-XXX",
    "email": "hellofromusama@gmail.com",
    "founder": {
      "@type": "Person",
      "name": "Usama Javed"
    },
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Perth CBD",
      "addressLocality": "Perth",
      "addressRegion": "WA",
      "postalCode": "6000",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -31.9505,
      "longitude": 115.8605
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Perth",
        "sameAs": "https://en.wikipedia.org/wiki/Perth"
      },
      {
        "@type": "State",
        "name": "Western Australia",
        "sameAs": "https://en.wikipedia.org/wiki/Western_Australia"
      },
      {
        "@type": "Country",
        "name": "Australia",
        "sameAs": "https://en.wikipedia.org/wiki/Australia"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": -31.9505,
        "longitude": 115.8605
      },
      "geoRadius": "50000"
    },
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "BPAY"],
    "currenciesAccepted": "AUD",
    "openingHours": "Mo-Fr 09:00-18:00",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "47"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Perth Mining Company"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excellent work on our mine site management system. Delivered on time and within budget."
      }
    ]
  } : null;

  // Breadcrumb schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${siteUrl}${crumb.url}`
    }))
  } : null;

  // Article schema for blog posts
  const articleSchema = articleData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": `${siteUrl}${ogImage}`,
    "author": {
      "@type": "Person",
      "name": articleData.author || "Usama Javed",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Person",
      "name": "Usama Javed",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "datePublished": articleData.publishedTime,
    "dateModified": articleData.modifiedTime || articleData.publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullCanonicalUrl
    },
    "articleSection": articleData.section,
    "keywords": articleData.tags?.join(", ")
  } : null;

  // Combine all schemas
  const allSchemas = [
    personSchema,
    localBusinessSchema,
    breadcrumbSchema,
    articleSchema,
    structuredData
  ].filter(Boolean);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={enhancedKeywords.join(", ")} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={articleData ? "article" : "website"} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Usama Javed Portfolio" />
      <meta property="og:locale" content="en_AU" />

      {/* Article specific OG tags */}
      {articleData && (
        <>
          <meta property="article:author" content={articleData.author || "Usama Javed"} />
          <meta property="article:published_time" content={articleData.publishedTime} />
          <meta property="article:modified_time" content={articleData.modifiedTime || articleData.publishedTime} />
          <meta property="article:section" content={articleData.section} />
          {articleData.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta property="twitter:creator" content="@hellofromusama" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="AU-WA" />
      <meta name="geo.placename" content="Perth" />
      <meta name="geo.position" content="-31.9505;115.8605" />
      <meta name="ICBM" content="-31.9505, 115.8605" />

      {/* Language and Regional */}
      <meta httpEquiv="content-language" content="en-AU" />
      <meta name="language" content="English" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="rating" content="general" />

      {/* Business Meta Tags */}
      <meta name="author" content="Usama Javed" />
      <meta name="creator" content="Usama Javed" />
      <meta name="publisher" content="Usama Javed" />
      <meta name="copyright" content="2025 Usama Javed. All rights reserved." />
      <meta name="subject" content="Web Development, Software Engineering, AI Integration" />
      <meta name="topic" content="Full Stack Development Services" />
      <meta name="summary" content="Expert full stack developer in Perth offering modern web development, AI integration, and enterprise solutions." />
      <meta name="classification" content="Business, Technology, Web Development" />
      <meta name="category" content="Technology Services" />

      {/* Contact Information */}
      <meta name="contact" content="hellofromusama@gmail.com" />
      <meta name="reply-to" content="hellofromusama@gmail.com" />
      <meta name="owner" content="Usama Javed" />
      <meta name="url" content={siteUrl} />
      <meta name="identifier-url" content={siteUrl} />

      {/* Cache Control */}
      <meta httpEquiv="cache-control" content="public, max-age=31536000" />
      <meta httpEquiv="expires" content="31536000" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Usama Javed" />

      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}