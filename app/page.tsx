import { sites } from "@/lib/sites"
import { ProxyInput } from "@/components/proxy-input"
import { StatusCard } from "@/components/status-card"
import { Zap, Shield, Globe } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">欢迎使用 ProxyHub</h1>
        <p className="text-muted-foreground">
          一站式网络代理解决方案，畅享全球优质开发资源
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{sites.length}</p>
            <p className="text-sm text-muted-foreground">支持站点</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold">极速</p>
            <p className="text-sm text-muted-foreground">代理响应</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10">
            <Shield className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">安全</p>
            <p className="text-sm text-muted-foreground">加密传输</p>
          </div>
        </div>
      </div>

      {/* Proxy Input */}
      <ProxyInput />

      {/* Site Status Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">站点状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sites.map((site) => (
            <StatusCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </div>
  )
}
