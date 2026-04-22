import { Suspense } from "react"
import { SitePageLayout } from "@/components/site-page-layout"
import { getSiteById } from "@/lib/sites"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "Bing - ProxyHub",
  description: "代理访问必应搜索",
}

function BingPageContent() {
  const site = getSiteById("bing")!
  return <SitePageLayout site={site} />
}

export default function BingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8" />
        </div>
      }
    >
      <BingPageContent />
    </Suspense>
  )
}
