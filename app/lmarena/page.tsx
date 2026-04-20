import { Suspense } from "react"
import { SitePageLayout } from "@/components/site-page-layout"
import { getSiteById } from "@/lib/sites"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "LM Arena - ProxyHub",
  description: "代理访问 LM Arena 大模型排行榜与聊天平台",
}

function LMArenaPageContent() {
  const site = getSiteById("lmarena")!
  return <SitePageLayout site={site} />
}

export default function LMArenaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8" />
        </div>
      }
    >
      <LMArenaPageContent />
    </Suspense>
  )
}
