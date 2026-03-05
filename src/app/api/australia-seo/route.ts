import { NextResponse } from 'next/server';

export async function GET() {
  const australianStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://usamajaved.com/#person-australia',
        name: 'Usama Javed',
        alternateName: 'Australia\'s Leading Full Stack Developer',
        url: 'https://usamajaved.com',
        image: 'https://usamajaved.com/profile-australia.jpg',
        sameAs: [
          'https://github.com/usamajaved',
          'https://linkedin.com/in/usamajaved-australia',
          'https://twitter.com/usamajaved'
        ],
        jobTitle: 'Senior Full Stack Developer',
        description: 'Australia\'s premier Full Stack Developer specializing in modern web technologies, enterprise solutions, and government compliance.',
        knowsAbout: [
          'Australian Privacy Act Compliance',
          'Government Contractor Services',
          'Mining Industry Solutions',
          'Financial Services Australia',
          'Australian Payment Systems (BPAY, POLi)',
          'GST and Australian Tax Integration',
          'Cross-timezone Development',
          'Remote Team Management Australia'
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'Usama Javed Development Services',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Perth',
            addressRegion: 'WA',
            addressCountry: 'AU',
            postalCode: '6000'
          }
        },
        address: [
          {
            '@type': 'PostalAddress',
            addressLocality: 'Perth',
            addressRegion: 'Western Australia',
            addressCountry: 'Australia',
            postalCode: '6000'
          }
        ],
        areaServed: [
          {
            '@type': 'State',
            name: 'Western Australia',
            alternateName: 'WA'
          },
          {
            '@type': 'State',
            name: 'New South Wales',
            alternateName: 'NSW'
          },
          {
            '@type': 'State',
            name: 'Victoria',
            alternateName: 'VIC'
          },
          {
            '@type': 'State',
            name: 'Queensland',
            alternateName: 'QLD'
          },
          {
            '@type': 'State',
            name: 'South Australia',
            alternateName: 'SA'
          },
          {
            '@type': 'State',
            name: 'Australian Capital Territory',
            alternateName: 'ACT'
          },
          {
            '@type': 'State',
            name: 'Northern Territory',
            alternateName: 'NT'
          },
          {
            '@type': 'State',
            name: 'Tasmania',
            alternateName: 'TAS'
          },
          {
            '@type': 'Country',
            name: 'Australia'
          }
        ],
        nationality: {
          '@type': 'Country',
          name: 'Australia'
        }
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://usamajaved.com/#business-australia',
        name: 'Usama Javed - Full Stack Development Services Australia',
        description: 'Professional web development and software engineering services across all Australian states and territories',
        url: 'https://usamajaved.com',
        telephone: '+61-XXX-XXX-XXX',
        email: 'contact@usamajaved.com',
        foundingDate: '2020',
        founder: {
          '@type': 'Person',
          name: 'Usama Javed'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Perth CBD',
          addressLocality: 'Perth',
          addressRegion: 'WA',
          postalCode: '6000',
          addressCountry: 'AU'
        },
        geo: [
          {
            '@type': 'GeoCoordinates',
            latitude: -31.9505,
            longitude: 115.8605,
            description: 'Perth, Western Australia'
          },
          {
            '@type': 'GeoCoordinates',
            latitude: -33.8688,
            longitude: 151.2093,
            description: 'Sydney, New South Wales (Remote Services)'
          },
          {
            '@type': 'GeoCoordinates',
            latitude: -37.8136,
            longitude: 144.9631,
            description: 'Melbourne, Victoria (Remote Services)'
          }
        ],
        areaServed: {
          '@type': 'Country',
          name: 'Australia',
          sameAs: 'https://en.wikipedia.org/wiki/Australia'
        },
        serviceArea: [
          {
            '@type': 'State',
            name: 'Western Australia'
          },
          {
            '@type': 'State',
            name: 'New South Wales'
          },
          {
            '@type': 'State',
            name: 'Victoria'
          },
          {
            '@type': 'State',
            name: 'Queensland'
          },
          {
            '@type': 'State',
            name: 'South Australia'
          },
          {
            '@type': 'State',
            name: 'Australian Capital Territory'
          },
          {
            '@type': 'State',
            name: 'Northern Territory'
          },
          {
            '@type': 'State',
            name: 'Tasmania'
          }
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Development Services Australia',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Full Stack Web Development',
                description: 'Complete web application development using modern technologies'
              },
              areaServed: {
                '@type': 'Country',
                name: 'Australia'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Government Contractor Services',
                description: 'Specialized development services for Australian government agencies'
              },
              areaServed: {
                '@type': 'Place',
                name: 'Australian Capital Territory'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Mining Industry Solutions',
                description: 'Custom software solutions for mining and resources companies'
              },
              areaServed: {
                '@type': 'State',
                name: 'Western Australia'
              }
            }
          ]
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '47'
        },
        openingHours: [
          'Mo-Fr 09:00-18:00',
          'Sa 10:00-16:00'
        ],
        paymentAccepted: 'BPAY, Bank Transfer, Credit Card, PayPal',
        currenciesAccepted: 'AUD',
        priceRange: '$$'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://usamajaved.com/#website-australia',
        url: 'https://usamajaved.com',
        name: 'Usama Javed - Australia\'s Leading Full Stack Developer',
        description: 'Professional portfolio and services of Australia\'s premier Full Stack Developer, serving all states and territories',
        publisher: {
          '@type': 'Person',
          name: 'Usama Javed'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://usamajaved.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        },
        inLanguage: 'en-AU',
        isAccessibleForFree: true,
        audience: {
          '@type': 'Audience',
          geographicArea: {
            '@type': 'Country',
            name: 'Australia'
          }
        }
      }
    ]
  };

  return NextResponse.json(australianStructuredData, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'index, follow',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/ld+json',
      'X-Australia-SEO': 'optimized',
    },
  });
}