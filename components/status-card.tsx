"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ExternalLink, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { SiteIcon } from "@/components/site-icon"
import type { SiteConfig } from "@/lib/sites"

interface StatusCardProps {
  site: SiteConfig
}

type Status = "checking" | "online" | "offline" | "unknown"

export function StatusCard({ site }: StatusCardProps) {
  const [status, setStatus] = useState<Status>("unknown")
  const [latency, setLatency] = useState<number | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    setIsChecking(true)
    setStatus("checking")
    const startTime = Date.now()

    try {
      const response = await fetch(`/api/ping?site=${site.id}`, {
        method: "GET",
      })
      const endTime = Date.now()

      if (response.ok) {
        setStatus("online")
        setLatency(endTime - startTime)
      } else {
        setStatus("offline")
        setLatency(null)
      }
    } catch {
      setStatus("offline")
      setLatency(null)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusConfig = {
    checking: { label: "检测中", color: "bg-yellow-500" },
    online: { label: "在线", color: "bg-green-500" },
    offline: { label: "离线", color: "bg-red-500" },
    unknown: { label: "未知", color: "bg-gray-500" },
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 border-border/50">
      <div
        className={cn(
          "absolute inset-0 opacity-5 bg-gradient-to-br",
          site.color
        )}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br text-white",
              site.color
            )}
          >
            <SiteIcon name={site.iconName} className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              {site.nameCn}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{site.domain}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5",
              status === "online" && "bg-green-500/10 text-green-600 dark:text-green-400",
              status === "offline" && "bg-red-500/10 text-red-600 dark:text-red-400",
              status === "checking" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
            )}
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full", statusConfig[status].color)}
            />
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {site.descriptionCn}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {latency !== null && status === "online" ? (
              <span>延迟: {latency}ms</span>
            ) : (
              <span>延迟: --</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={checkStatus}
              disabled={isChecking}
            >
              {isChecking ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${site.id}`}>
                <ExternalLink className="h-4 w-4 mr-1.5" />
                访问
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
