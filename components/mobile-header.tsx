"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { sites, type IconName } from "@/lib/sites"
import { Home, Globe, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { SiteIcon } from "./site-icon"

interface NavItem {
  href: string
  label: string
  iconType: "lucide" | "site"
  iconName?: IconName
  LucideIcon?: typeof Home
}

const navItems: NavItem[] = [
  { href: "/", label: "仪表盘", iconType: "lucide", LucideIcon: Home },
  ...sites.map((site) => ({
    href: `/${site.id}`,
    label: site.nameCn,
    iconType: "site" as const,
    iconName: site.iconName,
  })),
]

export function MobileHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Globe className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">ProxyHub</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <nav className="px-4 py-3 border-t border-border bg-background">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.iconType === "lucide" && item.LucideIcon ? (
                    <item.LucideIcon className="w-5 h-5" />
                  ) : item.iconName ? (
                    <SiteIcon name={item.iconName} className="w-5 h-5" />
                  ) : null}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
