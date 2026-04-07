import { NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'usamajaved-indexnow-key-2026'
const SITE_URL = 'https://usamajaved.com.au'

// All pages to submit to IndexNow (Bing + Copilot)
const ALL_URLS = [
  '/',
  '/services',
  '/expertise',
  '/tech-stack',
  '/contact',
  '/blog',
  '/ideas',
  '/team',
  '/budget',
  '/projects/n8n-automation',
  '/projects/voice-ai-agent',
  '/projects/erp-system',
  '/projects/netsuite-integration',
  '/projects/cloud-infrastructure',
  '/projects/modern-portfolio',
  '/projects/kashmir-fund',
  '/llms.txt',
  '/llms-full.txt',
  '/feed.xml',
]

export async function POST() {
  try {
    const urlList = ALL_URLS.map(path => `${SITE_URL}${path}`)

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'usamajaved.com.au',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    })

    return NextResponse.json({
      success: true,
      status: response.status,
      urlsSubmitted: urlList.length,
      message: `Submitted ${urlList.length} URLs to IndexNow (Bing + Copilot AI)`,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'IndexNow API - Usama Javed Portfolio',
    description: 'Push content updates instantly to Bing and Copilot AI',
    usage: 'POST /api/indexnow to submit all pages',
    urlCount: ALL_URLS.length,
  })
}
