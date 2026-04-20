"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { sites, type IconName } from "@/lib/sites"
import { Home, Settings, Globe } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { SiteIcon } from "./site-icon"

interface NavItem {
  href: string
  label: string
  labelEn: string
  iconType: "lucide" | "site"
  iconName?: IconName
  LucideIcon?: typeof Home
}

const navItems: NavItem[] = [
  { href: "/", label: "仪表盘", labelEn: "Dashboard", iconType: "lucide", LucideIcon: Home },
  ...sites.map((site) => ({
    href: `/${site.id}`,
    label: site.nameCn,
    labelEn: site.name,
    iconType: "site" as const,
    iconName: site.iconName,
  })),
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
          <Globe className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">ProxyHub</h1>
          <p className="text-xs text-muted-foreground">网络代理仪表盘</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              {item.iconType === "lucide" && item.LucideIcon ? (
                <item.LucideIcon className="w-5 h-5 flex-shrink-0" />
              ) : item.iconName ? (
                <SiteIcon name={item.iconName} className="w-5 h-5 flex-shrink-0" />
              ) : null}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span>主题</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
