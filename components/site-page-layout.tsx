"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import {
  ExternalLink,
  Copy,
  Check,
  Globe,
  ArrowRight,
  RefreshCw,
  Maximize2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SiteIcon } from "@/components/site-icon"
import type { SiteConfig } from "@/lib/sites"

interface SitePageLayoutProps {
  site: SiteConfig
}

export function SitePageLayout({ site }: SitePageLayoutProps) {
  const searchParams = useSearchParams()
  const initialUrl = searchParams.get("url")

  const [url, setUrl] = useState(
    initialUrl ? decodeURIComponent(initialUrl) : ""
  )
  const [proxyUrl, setProxyUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("browser")

  function handleProxy(targetUrl?: string) {
    const urlToProxy = targetUrl || url
    if (!urlToProxy.trim()) return

    let fullUrl = urlToProxy.trim()
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = "https://" + fullUrl
    }

    setIsLoading(true)
    const encodedUrl = encodeURIComponent(fullUrl)
    const generatedProxyUrl = `/api/proxy/${site.id}?url=${encodedUrl}`
    setProxyUrl(generatedProxyUrl)
    setUrl(fullUrl)
    setTimeout(() => setIsLoading(false), 300)
  }

  useEffect(() => {
    if (initialUrl) {
      const timer = window.setTimeout(() => {
        handleProxy(decodeURIComponent(initialUrl))
      }, 0)
      return () => window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleQuickLink = (exampleUrl: string) => {
    setUrl(exampleUrl)
    handleProxy(exampleUrl)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br text-white",
              site.color
            )}
          >
            <SiteIcon name={site.iconName} className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{site.nameCn}</h1>
            <p className="text-muted-foreground">{site.descriptionCn}</p>
          </div>
        </div>
        <Badge variant="outline" className="hidden sm:flex gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          {site.domain}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="browser">浏览器</TabsTrigger>
          <TabsTrigger value="examples">快速链接</TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-4">
          {/* URL Input */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Input
                  placeholder={`输入 ${site.domain} 的 URL...`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-11 bg-background"
                />
                <Button
                  onClick={() => handleProxy()}
                  disabled={isLoading || !url.trim()}
                  className={cn(
                    "h-11 px-5 bg-gradient-to-r text-white hover:opacity-90",
                    site.color
                  )}
                >
                  {isLoading ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <>
                      代理访问
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {proxyUrl && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-muted-foreground shrink-0">
                        代理地址:
                      </span>
                      <code className="text-xs text-foreground truncate">
                        {typeof window !== "undefined" && window.location.origin}
                        {proxyUrl}
                      </code>
                    </div>
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
                      <span className="ml-1.5 hidden sm:inline">复制</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Browser Frame */}
          {proxyUrl && (
            <Card
              className={cn(
                "border-border/50 overflow-hidden transition-all",
                isFullscreen &&
                  "fixed inset-0 z-50 rounded-none border-0 m-0"
              )}
            >
              <CardHeader className="py-3 px-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="ml-3 px-3 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground truncate max-w-md">
                      {url}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleProxy()}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={proxyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className={cn(
                    "bg-white",
                    isFullscreen ? "h-[calc(100vh-57px)]" : "h-[600px]"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full bg-muted/20">
                      <div className="flex flex-col items-center gap-3">
                        <Spinner className="w-8 h-8" />
                        <p className="text-sm text-muted-foreground">
                          正在加载...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={proxyUrl}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      title={`${site.name} Proxy`}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!proxyUrl && (
            <Card className="border-border/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div
                  className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white mb-4",
                    site.color
                  )}
                >
                  <SiteIcon name={site.iconName} className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  输入 URL 开始代理
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  在上方输入 {site.domain} 的任意页面地址，点击代理访问即可通过本服务访问
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">快速链接</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {site.examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickLink(example)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <code className="text-sm text-muted-foreground truncate flex-1">
                      {example}
                    </code>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-3 shrink-0" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Direct Access */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">直接访问</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleQuickLink(`https://${site.domain}`)}
                className={cn(
                  "w-full bg-gradient-to-r text-white hover:opacity-90",
                  site.color
                )}
              >
                <Globe className="w-4 h-4 mr-2" />
                打开 {site.domain} 首页
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
