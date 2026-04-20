import { Suspense } from "react"
import { SitePageLayout } from "@/components/site-page-layout"
import { getSiteById } from "@/lib/sites"
import { Spinner } from "@/components/ui/spinner"

export const metadata = {
  title: "Hugging Face - ProxyHub",
  description: "代理访问 Hugging Face AI 模型与数据集平台",
}

function HuggingFacePageContent() {
  const site = getSiteById("huggingface")!
  return <SitePageLayout site={site} />
}

export default function HuggingFacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8" />
        </div>
      }
    >
      <HuggingFacePageContent />
    </Suspense>
  )
}
