import { KeyRound, type LucideIcon } from "lucide-react"

export type Tool = {
  id: string
  path: string
  icon: LucideIcon
  titleKey: string
  descKey: string
  tags: string[]
}

export const TOOLS: Tool[] = [
  {
    id: "evm-keygen",
    path: "/evm-keygen",
    icon: KeyRound,
    titleKey: "tool.keygen.name",
    descKey: "tool.keygen.desc",
    tags: ["tool.keygen.tag1", "tool.keygen.tag2", "tool.keygen.tag3"],
  },
]
