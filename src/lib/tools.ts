import { KeyRound, Wallet, type LucideIcon } from "lucide-react"

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
  {
    id: "solana-keygen",
    path: "/solana-keygen",
    icon: Wallet,
    titleKey: "tool.solana.name",
    descKey: "tool.solana.desc",
    tags: ["tool.solana.tag1", "tool.solana.tag2", "tool.solana.tag3"],
  },
]
