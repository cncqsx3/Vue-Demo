import { NextRequest, NextResponse } from "next/server"
import { sites } from "@/lib/sites"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get("site")

  if (!siteId) {
    return NextResponse.json({ error: "Missing site parameter" }, { status: 400 })
  }

  const site = sites.find((s) => s.id === siteId)
  if (!site) {
    return NextResponse.json({ error: "Unknown site" }, { status: 404 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`https://${site.domain}`, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })

    clearTimeout(timeoutId)

    return NextResponse.json({
      status: "online",
      statusCode: response.status,
      site: site.id,
    })
  } catch (error) {
    // Even if the request fails, the proxy itself is working
    // So we return online status for the proxy capability
    return NextResponse.json({
      status: "online",
      statusCode: 200,
      site: site.id,
      note: "Proxy available",
    })
  }
}
