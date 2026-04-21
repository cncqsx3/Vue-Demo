export type IconName = "box" | "github" | "brain" | "message-circle" | "trophy" | "search"

export interface SiteConfig {
  id: string
  name: string
  nameCn: string
  domain: string
  iconName: IconName
  color: string
  description: string
  descriptionCn: string
  examples: string[]
}

export const sites: SiteConfig[] = [
  {
    id: "docker",
    name: "Docker Hub",
    nameCn: "Docker Hub",
    domain: "hub.docker.com",
    iconName: "box",
    color: "from-blue-500 to-blue-600",
    description: "Container image registry",
    descriptionCn: "容器镜像仓库",
    examples: [
      "https://hub.docker.com/_/nginx",
      "https://hub.docker.com/_/node",
      "https://hub.docker.com/r/library/python",
    ],
  },
  {
    id: "github",
    name: "GitHub",
    nameCn: "GitHub",
    domain: "github.com",
    iconName: "github",
    color: "from-gray-700 to-gray-900",
    description: "Code hosting platform",
    descriptionCn: "代码托管平台",
    examples: [
      "https://github.com/vercel/next.js",
      "https://github.com/facebook/react/releases",
      "https://raw.githubusercontent.com/vercel/next.js/main/README.md",
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    nameCn: "Hugging Face",
    domain: "huggingface.co",
    iconName: "brain",
    color: "from-yellow-500 to-orange-500",
    description: "AI models & datasets",
    descriptionCn: "AI 模型与数据集",
    examples: [
      "https://huggingface.co/meta-llama/Llama-2-7b",
      "https://huggingface.co/datasets/squad",
      "https://huggingface.co/spaces/stabilityai/stable-diffusion",
    ],
  },
  {
    id: "poe",
    name: "Poe",
    nameCn: "Poe",
    domain: "poe.com",
    iconName: "message-circle",
    color: "from-green-500 to-emerald-600",
    description: "AI chatbot platform",
    descriptionCn: "AI 聊天平台",
    examples: [
      "https://poe.com",
      "https://poe.com/ChatGPT",
      "https://poe.com/Claude-3.5-Sonnet",
    ],
  },
  {
    id: "lmarena",
    name: "LM Arena",
    nameCn: "LM Arena",
    domain: "lmarena.ai",
    iconName: "trophy",
    color: "from-purple-500 to-pink-500",
    description: "LLM leaderboard & chat",
    descriptionCn: "大模型排行榜与聊天",
    examples: [
      "https://lmarena.ai",
      "https://lmarena.ai/leaderboard",
      "https://lmarena.ai/chat",
    ],
  },
  {
    id: "bing",
    name: "Bing",
    nameCn: "必应",
    domain: "bing.com",
    iconName: "search",
    color: "from-sky-500 to-blue-700",
    description: "Microsoft search engine",
    descriptionCn: "微软搜索引擎",
    examples: [
      "https://www.bing.com",
      "https://www.bing.com/search?q=hello",
      "https://cn.bing.com",
    ],
  },
]

export function getSiteByDomain(url: string): SiteConfig | undefined {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace("www.", "")
    return sites.find(
      (site) =>
        hostname === site.domain ||
        hostname.endsWith(`.${site.domain}`) ||
        (site.id === "github" &&
          (hostname === "raw.githubusercontent.com" ||
            hostname === "github.com" ||
            hostname === "gist.github.com"))
    )
  } catch {
    return undefined
  }
}

export function getSiteById(id: string): SiteConfig | undefined {
  return sites.find((site) => site.id === id)
}
