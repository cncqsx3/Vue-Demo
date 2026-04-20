"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Globe, ArrowRight, AlertCircle, Copy, Check } from "lucide-react"
import { getSiteByDomain, sites } from "@/lib/sites"
import { SiteIcon } from "@/components/site-icon"
import { cn } from "@/lib/utils"

export function ProxyInput() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [proxyUrl, setProxyUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleProxy = () => {
    setError("")
    setProxyUrl("")

    if (!url.trim()) {
      setError("请输入要代理的 URL")
      return
    }

    let fullUrl = url.trim()
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = "https://" + fullUrl
    }

    try {
      new URL(fullUrl)
    } catch {
      setError("请输入有效的 URL")
      return
    }

    const site = getSiteByDomain(fullUrl)
    if (!site) {
      setError(
        `不支持的网站。目前支持：${sites.map((s) => s.domain).join("、")}`
      )
      return
    }

    setIsLoading(true)

    // Generate proxy URL
    const encodedUrl = encodeURIComponent(fullUrl)
    const generatedProxyUrl = `/api/proxy/${site.id}?url=${encodedUrl}`
    setProxyUrl(generatedProxyUrl)

    // Navigate to site page with URL
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/${site.id}?url=${encodedUrl}`)
    }, 500)
  }

  const copyProxyUrl = async () => {
    if (!proxyUrl) return
    const fullProxyUrl = window.location.origin + proxyUrl
    await navigator.clipboard.writeText(fullProxyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleProxy()
    }
  }

  return (
    <Card className="relative overflow-hidden border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <CardHeader className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Globe className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">快速代理</CardTitle>
            <p className="text-sm text-muted-foreground">
              粘贴任意支持的 URL，一键代理访问
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="粘贴 URL，如 https://github.com/vercel/next.js"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-12 text-base bg-background"
          />
          <Button
            onClick={handleProxy}
            disabled={isLoading}
            className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isLoading ? (
              <Spinner className="w-5 h-5" />
            ) : (
              <>
                立即代理
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {proxyUrl && !error && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between gap-3">
              <code className="text-sm text-muted-foreground truncate flex-1">
                {typeof window !== "undefined" && window.location.origin}
                {proxyUrl}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyProxyUrl}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-muted-foreground">支持的网站：</span>
          {sites.map((site) => (
            <span
              key={site.id}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-gradient-to-r text-white",
                site.color
              )}
            >
              <SiteIcon name={site.iconName} className="w-3 h-3" />
              {site.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
