import { ed25519 } from "@noble/curves/ed25519.js"
import { base58 } from "@scure/base"

/**
 * ed25519 only knows a 32-byte seed. The "expanded" 64-byte secret key is
 * `seed ‖ publicKey`, which is what Phantom and solana-keygen hand you.
 */
const SEED_LENGTH = 32
const SECRET_LENGTH = 64

export type Wallet = {
  /** base58 public key — the Solana address */
  address: string
  /** base58 of the 64-byte expanded secret key (seed ‖ publicKey) */
  privateKey: string
  /** base58 of the 32-byte seed, for tools that want only that */
  seed?: string
  createdAt: number
  /** i18n key for a caveat the UI should show next to the result */
  noteKey?: string
}

function equals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false
  return true
}

function walletFromSeed(seed: Uint8Array): Wallet {
  const publicKey = ed25519.getPublicKey(seed)
  const expanded = new Uint8Array(SECRET_LENGTH)
  expanded.set(seed, 0)
  expanded.set(publicKey, SEED_LENGTH)
  return {
    address: base58.encode(publicKey),
    privateKey: base58.encode(expanded),
    seed: base58.encode(seed),
    createdAt: Date.now(),
  }
}

/** Fresh seed from the platform CSPRNG — every 32 bytes is a valid ed25519 key. */
export function generateWallet(): Wallet {
  const seed = new Uint8Array(SEED_LENGTH)
  crypto.getRandomValues(seed)
  return walletFromSeed(seed)
}

/** `solana-keygen` keypair files are a JSON array of 64 byte values. */
function decodeJsonBytes(text: string): Uint8Array | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return null
  }
  if (!Array.isArray(parsed)) return null
  const bytes = new Uint8Array(parsed.length)
  for (let i = 0; i < parsed.length; i += 1) {
    const n: unknown = parsed[i]
    if (typeof n !== "number" || !Number.isInteger(n) || n < 0 || n > 255) return null
    bytes[i] = n
  }
  return bytes
}

/**
 * Parse & validate a pasted private key: base58 seed (32B), base58 expanded
 * secret (64B), or a solana-keygen JSON byte array.
 *
 * `seedOnly` records the ambiguous case — an address is also 32-byte base58,
 * so the UI warns instead of silently pretending it was a private key.
 */
function readPrivateKey(input: string): { seed: Uint8Array; seedOnly: boolean } {
  const text = input.trim()
  if (!text) throw new Error("BAD_PRIVATE_KEY")

  let raw: Uint8Array | null
  if (text.startsWith("[")) {
    raw = decodeJsonBytes(text)
  } else {
    try {
      raw = base58.decode(text)
    } catch {
      raw = null
    }
  }
  if (!raw) throw new Error("BAD_PRIVATE_KEY")

  if (raw.length === SEED_LENGTH) return { seed: raw, seedOnly: true }
  if (raw.length === SECRET_LENGTH) {
    const seed = raw.subarray(0, SEED_LENGTH)
    const publicKey = raw.subarray(SEED_LENGTH)
    // the trailing half must be the public key, or the blob is corrupt
    if (!equals(ed25519.getPublicKey(seed), publicKey)) throw new Error("BAD_PRIVATE_KEY")
    return { seed: Uint8Array.from(seed), seedOnly: false }
  }
  throw new Error("BAD_PRIVATE_KEY")
}

export function parsePrivateKey(input: string): Uint8Array {
  return readPrivateKey(input).seed
}

export function walletFromPrivateKey(input: string): Wallet {
  const { seed, seedOnly } = readPrivateKey(input)
  const wallet = walletFromSeed(seed)
  return seedOnly ? { ...wallet, noteKey: "solana.derive.seedNote" } : wallet
}

/** Plain-text key file, for people who really want a file. */
export function buildKeyFile(wallet: {
  address: string
  privateKey: string
  seed?: string
  createdAt: number
}): string {
  return [
    "SOLANA PRIVATE KEY — DO NOT SHARE",
    "=================================",
    `created    : ${new Date(wallet.createdAt).toISOString()}`,
    `network    : Solana`,
    "",
    `address    : ${wallet.address}`,
    `privatekey : ${wallet.privateKey}`,
    `seed       : ${wallet.seed ?? ""}`,
    "",
    "=================================",
    "Whoever holds this key owns every asset at this address.",
    "Import it into a wallet now, then delete this file from disk.",
    "",
  ].join("\n")
}
