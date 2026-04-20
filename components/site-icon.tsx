"use client"

import {
  Box,
  Github,
  Brain,
  MessageCircle,
  Trophy,
} from "lucide-react"
import type { IconName } from "@/lib/sites"

const iconMap = {
  box: Box,
  github: Github,
  brain: Brain,
  "message-circle": MessageCircle,
  trophy: Trophy,
}

interface SiteIconProps {
  name: IconName
  className?: string
}

export function SiteIcon({ name, className }: SiteIconProps) {
  const Icon = iconMap[name]
  return <Icon className={className} />
}
