import { Suspense } from "react"
import { SitePageLayout } from "@/components/site-page-layout"
import { getSiteById } from "@/lib/sites"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "Poe - ProxyHub",
  description: "代理访问 Poe AI 聊天平台",
}

function PoePageContent() {
  const site = getSiteById("poe")!
  return <SitePageLayout site={site} />
}

export default function PoePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8" />
        </div>
      }
    >
      <PoePageContent />
    </Suspense>
  )
}
