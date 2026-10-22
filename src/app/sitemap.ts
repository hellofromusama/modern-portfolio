import { MetadataRoute } from 'next'
import { sitemapProjects } from '@/content/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.usamajaved.com.au'
  const currentDate = new Date().toISOString()

  return [
    // Core pages
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/expertise`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tech-stack`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ideas`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/budget`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Resume
    {
      url: `${baseUrl}/Usama-Javed-Resume.pdf`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Project pages
    ...sitemapProjects.map((p) => ({
      url: `${baseUrl}/projects/${p.id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: p.priority,
    })),
  ]
}
