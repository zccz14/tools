import { KeygenView, type KeygenSpec } from "../components/keygen-view"
import { buildKeyFile, generateWallet, walletFromPrivateKey } from "../lib/evm"

const SPEC: KeygenSpec = {
  prefix: "keygen",
  keyPrefix: "0x",
  generate: generateWallet,
  derive: walletFromPrivateKey,
  buildFile: buildKeyFile,
  fileName: (wallet) => `evm-key-${wallet.address.slice(0, 10)}.txt`,
}

export function EvmKeygenPage() {
  return <KeygenView spec={SPEC} />
}
