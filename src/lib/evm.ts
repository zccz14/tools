import { secp256k1 } from "@noble/curves/secp256k1.js"
import { keccak_256 } from "@noble/hashes/sha3.js"

/** secp256k1 group order n — a private key must sit in (0, n). */
const CURVE_ORDER = BigInt(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
)

export type Wallet = {
  address: string
  privateKey: string
  createdAt: number
}

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")

const toBigInt = (bytes: Uint8Array): bigint => {
  let value = 0n
  for (const byte of bytes) value = (value << 8n) | BigInt(byte)
  return value
}

/** EIP-55 mixed-case checksum encoding. */
export function toChecksumAddress(address: string): string {
  const body = address.replace(/^0x/i, "").toLowerCase()
  const hash = keccak_256(new TextEncoder().encode(body))
  let out = "0x"
  for (let i = 0; i < body.length; i += 1) {
    const nibble = (hash[i >> 1] >> (i % 2 === 0 ? 4 : 0)) & 0x0f
    out += nibble >= 8 ? body[i].toUpperCase() : body[i]
  }
  return out
}

/** uncompressed pubkey (65B) → keccak-256 → last 20 bytes */
export function addressFromPrivateKey(privateKey: Uint8Array): string {
  const publicKey = secp256k1.getPublicKey(privateKey, false)
  return toChecksumAddress(toHex(keccak_256(publicKey.subarray(1)).subarray(12)))
}

function walletFromBytes(privateKey: Uint8Array): Wallet {
  return {
    address: addressFromPrivateKey(privateKey),
    privateKey: toHex(privateKey),
    createdAt: Date.now(),
  }
}

/** Fresh key from the platform CSPRNG (crypto.getRandomValues). */
export function generateWallet(): Wallet {
  for (;;) {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    const value = toBigInt(bytes)
    if (value > 0n && value < CURVE_ORDER) return walletFromBytes(bytes)
  }
}

/** Parse & validate a pasted private key. */
export function parsePrivateKey(input: string): Uint8Array {
  const hex = input.trim().replace(/^0x/i, "")
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error("BAD_PRIVATE_KEY")
  const value = BigInt(`0x${hex}`)
  if (value <= 0n || value >= CURVE_ORDER) throw new Error("BAD_PRIVATE_KEY")
  const bytes = new Uint8Array(32)
  for (let i = 0; i < 32; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

export function walletFromPrivateKey(input: string): Wallet {
  return walletFromBytes(parsePrivateKey(input))
}

/** Plain-text key file, for people who really want a file. */
export function buildKeyFile(wallet: Wallet): string {
  return [
    "EVM PRIVATE KEY — DO NOT SHARE",
    "=============================",
    `created    : ${new Date(wallet.createdAt).toISOString()}`,
    `network    : any EVM chain`,
    "",
    `address    : ${wallet.address}`,
    `privatekey : 0x${wallet.privateKey}`,
    "",
    "=============================",
    "Whoever holds this key owns every asset at this address.",
    "Import it into a wallet now, then delete this file from disk.",
    "",
  ].join("\n")
}
