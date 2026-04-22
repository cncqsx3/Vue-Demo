import { NextRequest, NextResponse } from "next/server"
import { sites } from "@/lib/sites"

export const dynamic = "force-static"

export async function generateStaticParams() {
  return sites.map((site) => ({ site: site.id }))
}

// Domain mappings for URL rewriting
const domainMappings: Record<string, string[]> = {
  docker: ["hub.docker.com", "registry.hub.docker.com"],
  github: ["github.com", "raw.githubusercontent.com", "gist.github.com", "objects.githubusercontent.com", "avatars.githubusercontent.com"],
  huggingface: ["huggingface.co", "cdn-lfs.huggingface.co"],
  poe: ["poe.com"],
  lmarena: ["lmarena.ai", "arena.lmsys.org"],
  bing: [
    "bing.com",
    "www.bing.com",
    "cn.bing.com",
    "www2.bing.com",
    "th.bing.com",
    "r.bing.com",
    "business.bing.com",
  ],
}

function rewriteUrls(html: string, siteId: string, baseUrl: string): string {
  const domains = domainMappings[siteId] || []
  let result = html

  // Rewrite absolute URLs to proxy URLs
  for (const domain of domains) {
    // Replace https://domain/path with /api/proxy/site?url=encoded
    const httpsRegex = new RegExp(`https?://${domain.replace(/\./g, "\\.")}(/[^"'\\s<>]*)`, "gi")
    result = result.replace(httpsRegex, (match, path) => {
      const fullUrl = `https://${domain}${path || ""}`
      return `/api/proxy/${siteId}?url=${encodeURIComponent(fullUrl)}`
    })

    // Replace //domain/path (protocol-relative)
    const protocolRelativeRegex = new RegExp(`//${domain.replace(/\./g, "\\.")}(/[^"'\\s<>]*)`, "gi")
    result = result.replace(protocolRelativeRegex, (match, path) => {
      const fullUrl = `https://${domain}${path || ""}`
      return `/api/proxy/${siteId}?url=${encodeURIComponent(fullUrl)}`
    })
  }

  // Rewrite relative URLs (href="/path" or src="/path")
  const baseUrlObj = new URL(baseUrl)
  const origin = baseUrlObj.origin

  // Handle href="/..." and src="/..."
  result = result.replace(/(href|src|action)="\/([^"]*?)"/gi, (match, attr, path) => {
    if (path.startsWith("/api/proxy")) return match // Already proxied
    const fullUrl = `${origin}/${path}`
    return `${attr}="/api/proxy/${siteId}?url=${encodeURIComponent(fullUrl)}"`
  })

  result = result.replace(/(href|src|action)='\/([^']*?)'/gi, (match, attr, path) => {
    if (path.startsWith("/api/proxy")) return match
    const fullUrl = `${origin}/${path}`
    return `${attr}='/api/proxy/${siteId}?url=${encodeURIComponent(fullUrl)}'`
  })

  return result
}

function rewriteCss(css: string, siteId: string, baseUrl: string): string {
  const baseUrlObj = new URL(baseUrl)
  const origin = baseUrlObj.origin
  let result = css

  // Rewrite url() in CSS
  result = result.replace(/url\(['"]?(https?:\/\/[^'")]+)['"]?\)/gi, (match, url) => {
    return `url('/api/proxy/${siteId}?url=${encodeURIComponent(url)}')`
  })

  result = result.replace(/url\(['"]?\/([^'")]+)['"]?\)/gi, (match, path) => {
    if (path.startsWith("api/proxy")) return match
    const fullUrl = `${origin}/${path}`
    return `url('/api/proxy/${siteId}?url=${encodeURIComponent(fullUrl)}')`
  })

  return result
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ site: string }> }
) {
  const { site: siteId } = await params
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  const site = sites.find((s) => s.id === siteId)
  if (!site) {
    return NextResponse.json({ error: "Unknown site" }, { status: 404 })
  }

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let decodedUrl: string
  try {
    decodedUrl = decodeURIComponent(targetUrl)
    new URL(decodedUrl)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(decodedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": request.headers.get("accept") || "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": new URL(decodedUrl).origin,
      },
      redirect: "follow",
    })

    clearTimeout(timeoutId)

    const contentType = response.headers.get("content-type") || ""
    const isHtml = contentType.includes("text/html")
    const isCss = contentType.includes("text/css")
    const isJson = contentType.includes("application/json")
    const isText = contentType.includes("text/")

    // Create response headers
    const responseHeaders = new Headers()
    responseHeaders.set("Access-Control-Allow-Origin", "*")
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    responseHeaders.set("Access-Control-Allow-Headers", "*")
    
    // Preserve content type
    if (contentType) {
      responseHeaders.set("Content-Type", contentType)
    }

    // For binary content, return as-is
    if (!isHtml && !isCss && !isText) {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: responseHeaders,
      })
    }

    let body = await response.text()

    // Rewrite URLs in HTML/CSS content
    if (isHtml) {
      body = rewriteUrls(body, siteId, decodedUrl)
      // Inject base tag for relative URLs
      if (!body.includes("<base")) {
        body = body.replace(/<head([^>]*)>/i, `<head$1><base href="/api/proxy/${siteId}?url=${encodeURIComponent(new URL(decodedUrl).origin)}/">`)
      }
    } else if (isCss) {
      body = rewriteCss(body, siteId, decodedUrl)
    }

    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json(
      { error: "Failed to fetch the requested resource" },
      { status: 502 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ site: string }> }
) {
  const { site: siteId } = await params
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  const site = sites.find((s) => s.id === siteId)
  if (!site) {
    return NextResponse.json({ error: "Unknown site" }, { status: 404 })
  }

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let decodedUrl: string
  try {
    decodedUrl = decodeURIComponent(targetUrl)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  try {
    const body = await request.text()
    
    const response = await fetch(decodedUrl, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Type": request.headers.get("content-type") || "application/json",
        "Referer": new URL(decodedUrl).origin,
      },
      body,
    })

    const contentType = response.headers.get("content-type") || ""
    const responseHeaders = new Headers()
    responseHeaders.set("Access-Control-Allow-Origin", "*")
    if (contentType) {
      responseHeaders.set("Content-Type", contentType)
    }

    const responseBody = await response.text()
    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Proxy POST error:", error)
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 502 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  })
}
