# tools

Small, single-purpose browser tools. No backend, no tracking, no data leaves your device.

**https://tools.zccz14.com**

## Tools

| Tool | What it does |
| --- | --- |
| EVM Key Generator | Generate a secp256k1 private key and derive its EIP-55 address — entirely in the browser. Raw keys only: no seed phrases. |
| Solana Key Generator | Generate an ed25519 keypair and show its base58 public key plus the 64-byte extended private key (seed ‖ pubkey, the format Phantom exports) — entirely in the browser. Raw keys only: no seed phrases. |

## Development

```bash
pnpm install
pnpm dev
```

Built with Vite + React + TypeScript + Tailwind, deployed to GitHub Pages by GitHub Actions.
