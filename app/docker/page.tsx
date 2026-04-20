import { Suspense } from "react"
import { SitePageLayout } from "@/components/site-page-layout"
import { getSiteById } from "@/lib/sites"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "Docker Hub - ProxyHub",
  description: "代理访问 Docker Hub 容器镜像仓库",
}

function DockerPageContent() {
  const site = getSiteById("docker")!
  return <SitePageLayout site={site} />
}

export default function DockerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8" />
        </div>
      }
    >
      <DockerPageContent />
    </Suspense>
  )
}
