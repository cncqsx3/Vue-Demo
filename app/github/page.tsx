import { Suspense } from "react"
import { SitePageLayout } from "@/components/site-page-layout"
import { getSiteById } from "@/lib/sites"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "GitHub - ProxyHub",
  description: "代理访问 GitHub 代码托管平台",
}

function GitHubPageContent() {
  const site = getSiteById("github")!
  return <SitePageLayout site={site} />
}

export default function GitHubPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8" />
        </div>
      }
    >
      <GitHubPageContent />
    </Suspense>
  )
}
