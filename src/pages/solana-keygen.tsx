import { KeygenView, type KeygenSpec } from "../components/keygen-view"
import { buildKeyFile, generateWallet, walletFromPrivateKey } from "../lib/solana"

const SPEC: KeygenSpec = {
  prefix: "solana",
  generate: generateWallet,
  derive: walletFromPrivateKey,
  buildFile: buildKeyFile,
  fileName: (wallet) => `solana-key-${wallet.address.slice(0, 8)}.txt`,
}

export function SolanaKeygenPage() {
  return <KeygenView spec={SPEC} />
}
