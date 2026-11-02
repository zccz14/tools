import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  QrCode as QrCodeIcon,
  RefreshCw,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useI18n } from "../lib/i18n"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle, FieldLabel } from "./ui/card"
import { CopyButton } from "./ui/copy-button"
import { Textarea } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

/** Shape both key generators produce. `seed` is optional extra material. */
export type KeygenWallet = {
  address: string
  privateKey: string
  seed?: string
  createdAt: number
  /** i18n key of an optional caveat shown under the derived address */
  noteKey?: string
}

/**
 * Everything that differs between chains. i18n keys are looked up under
 * `prefix` (e.g. `keygen.title`, `solana.title`), so one view serves both.
 */
export type KeygenSpec = {
  prefix: string
  /** Prepended to the private key for display, e.g. "0x". */
  keyPrefix?: string
  generate: () => KeygenWallet
  derive: (input: string) => KeygenWallet
  buildFile: (wallet: KeygenWallet) => string
  fileName: (wallet: KeygenWallet) => string
}

export function KeygenView({ spec }: { spec: KeygenSpec }) {
  const { t } = useI18n()
  const p = spec.prefix

  // Held here, not in the panel: switching tabs must never roll a new key.
  const [wallet, setWallet] = useState<KeygenWallet | null>(null)
  const [showKey, setShowKey] = useState(false)
  const regenerate = useCallback(() => {
    setWallet(spec.generate())
    setShowKey(false)
  }, [spec])

  useEffect(() => {
    regenerate()
  }, [regenerate])

  return (
    <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      <div className="rise pt-8 sm:pt-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          {t("common.back")}
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
            {t(`${p}.title`)}
          </h1>
          <Badge className="border-accent/25 bg-accent-soft text-accent">
            <ShieldCheck className="size-3" />
            {t(`${p}.status`)}
          </Badge>
        </div>
        <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-muted">
          {t(`${p}.subtitle`)}
        </p>
      </div>

      <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_296px]">
        <Card className="rise overflow-hidden" style={{ animationDelay: "60ms" }}>
          <div className="p-5 pb-0 sm:p-6 sm:pb-0">
            <Tabs defaultValue="generate">
              <TabsList>
                <TabsTrigger data-testid="tab-generate" value="generate">
                  <KeyRound />
                  {t(`${p}.tab.generate`)}
                </TabsTrigger>
                <TabsTrigger data-testid="tab-derive" value="derive">
                  <Search />
                  {t(`${p}.tab.derive`)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="pt-5">
                <GeneratePanel
                  spec={spec}
                  wallet={wallet}
                  showKey={showKey}
                  onToggleKey={() => setShowKey((v) => !v)}
                  onRegenerate={regenerate}
                />
              </TabsContent>
              <TabsContent value="derive" className="pt-5">
                <DerivePanel spec={spec} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="h-5 sm:h-6" />
        </Card>

        <aside className="flex flex-col gap-4">
          <Card className="rise" style={{ animationDelay: "120ms" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-[13px]">{t("notes.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-0.5 font-mono text-[10px] text-accent">0{i}</span>
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-ink">{t(`notes.${i}.title`)}</p>
                    <p className="text-[12px] leading-relaxed text-muted">{t(`notes.${i}.body`)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rise" style={{ animationDelay: "180ms" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-[13px]">{t("about.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[12.5px] leading-relaxed text-muted">{t(`${p}.about`)}</p>
              <div className="flex items-center justify-between border-t border-line pt-3">
                <span className="font-mono text-[11px] text-muted">{t("about.build")}</span>
                <a
                  href="https://github.com/zccz14/tools"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[11px] text-accent transition-opacity hover:opacity-80"
                >
                  {__BUILD_SHA__}
                </a>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- generate */

function GeneratePanel({
  spec,
  wallet,
  showKey,
  onToggleKey,
  onRegenerate,
}: {
  spec: KeygenSpec
  wallet: KeygenWallet | null
  showKey: boolean
  onToggleKey: () => void
  onRegenerate: () => void
}) {
  const { t } = useI18n()
  const p = spec.prefix
  const prefix = spec.keyPrefix ?? ""
  const [showQr, setShowQr] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const regenerate = onRegenerate

  // press G to roll a new key
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (event.key.toLowerCase() === "g") {
        event.preventDefault()
        regenerate()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [regenerate])

  useEffect(() => {
    if (!showQr || !wallet) return
    let alive = true
    // loaded on demand: the QR encoder never ships in the initial bundle
    import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(wallet.address, {
          margin: 1,
          width: 320,
          errorCorrectionLevel: "M",
          color: { dark: "#0d1017", light: "#ffffff" },
        }),
      )
      .then((url) => {
        if (alive) setQrDataUrl(url)
      })
      .catch(() => {
        if (alive) setQrDataUrl(null)
      })
    return () => {
      alive = false
    }
  }, [showQr, wallet])

  function download() {
    if (!wallet) return
    const blob = new Blob([spec.buildFile(wallet)], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = spec.fileName(wallet)
    a.click()
    URL.revokeObjectURL(url)
  }

  const masked = useMemo(() => "•".repeat(wallet?.privateKey.length ?? 0), [wallet?.privateKey])

  if (!wallet) {
    return (
      <div className="flex h-64 items-center justify-center text-muted">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* address */}
      <div className="rounded-xl border border-line bg-elevated/60 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <FieldLabel>{t(`${p}.address`)}</FieldLabel>
            <p
              data-testid="address"
              className="mt-1.5 font-mono text-[15px] leading-relaxed font-medium break-all text-ink"
            >
              {wallet.address}
            </p>
            <p className="mt-1.5 text-[11px] text-muted">{t(`${p}.address.meta`)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              data-testid="qr-toggle"
              variant="ghost"
              size="iconSm"
              onClick={() => setShowQr((v) => !v)}
              title={t("common.qr")}
              aria-pressed={showQr}
              className={showQr ? "text-accent" : undefined}
            >
              <QrCodeIcon />
            </Button>
            <CopyButton value={wallet.address} />
          </div>
        </div>
        {showQr && qrDataUrl ? (
          <div className="mt-4 flex justify-center">
            <img
              src={qrDataUrl}
              alt="address qr code"
              className="size-40 rounded-lg border border-line bg-white p-1.5"
            />
          </div>
        ) : null}
      </div>

      {/* private key */}
      <div className="rounded-xl border border-line p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <FieldLabel>{t(`${p}.key`)}</FieldLabel>
            <p className="mt-1 text-[11px] text-muted">
              {t(showKey ? `${p}.key.meta.shown` : `${p}.key.meta.hidden`)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              data-testid="reveal-key"
              variant="ghost"
              size="iconSm"
              onClick={onToggleKey}
              title={showKey ? t("common.hide") : t("common.reveal")}
            >
              {showKey ? <EyeOff /> : <Eye />}
            </Button>
            <CopyButton value={`${prefix}${wallet.privateKey}`} />
          </div>
        </div>

        <p
          data-testid="private-key"
          className={`mt-3 rounded-lg bg-elevated/70 px-3 py-2.5 font-mono text-[12.5px] leading-relaxed ${
            showKey ? "break-all text-ink select-auto" : "truncate text-muted/50 select-none"
          }`}
        >
          {showKey ? `${prefix}${wallet.privateKey}` : `${prefix}${masked}`}
        </p>

        {wallet.seed ? (
          <div className="mt-3 border-t border-line/70 pt-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <FieldLabel>{t(`${p}.seed`)}</FieldLabel>
                <p className="mt-1 text-[11px] text-muted">{t(`${p}.seed.meta`)}</p>
              </div>
              <CopyButton value={wallet.seed} />
            </div>
            <p
              data-testid="seed"
              className={`mt-2 rounded-lg bg-elevated/70 px-3 py-2 font-mono text-[12px] leading-relaxed ${
                showKey ? "break-all text-ink select-auto" : "truncate text-muted/50 select-none"
              }`}
            >
              {showKey ? wallet.seed : "•".repeat(wallet.seed.length)}
            </p>
          </div>
        ) : null}
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button data-testid="regenerate" size="sm" onClick={regenerate}>
          <RefreshCw />
          {t(`${p}.generate`)}
          <kbd className="ml-0.5 hidden rounded border border-accent-ink/25 px-1 py-px font-mono text-[10px] opacity-70 sm:inline">
            G
          </kbd>
        </Button>
        <Button variant="secondary" size="sm" onClick={download}>
          <Download />
          {t(`${p}.save`)}
        </Button>
        <span className="ml-auto text-[11px] text-muted">
          {t(`${p}.created`)}{" "}
          <time className="font-mono">{new Date(wallet.createdAt).toLocaleTimeString()}</time>
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- derive */

function DerivePanel({ spec }: { spec: KeygenSpec }) {
  const { t } = useI18n()
  const p = spec.prefix
  const [input, setInput] = useState("")
  const [wallet, setWallet] = useState<KeygenWallet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function run() {
    setError(null)
    setWallet(null)
    if (!input.trim()) {
      setError(`${p}.derive.empty`)
      return
    }
    setBusy(true)
    try {
      setWallet(spec.derive(input))
    } catch {
      setError(`${p}.derive.bad`)
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    setInput("")
    setError(null)
    setWallet(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold tracking-tight">{t(`${p}.derive.title`)}</h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{t(`${p}.derive.desc`)}</p>
      </div>

      <Textarea
        data-testid="derive-input"
        rows={3}
        value={input}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onChange={(e) => {
          setInput(e.target.value)
          setError(null)
          setWallet(null)
        }}
        placeholder={t(`${p}.derive.placeholder`)}
        className="resize-y"
      />

      <div className="flex items-center gap-2">
        <Button data-testid="derive-run" size="sm" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <KeyRound />}
          {t(`${p}.derive.run`)}
        </Button>
        <Button variant="ghost" size="sm" onClick={reset}>
          {t(`${p}.derive.clear`)}
        </Button>
      </div>

      {error ? (
        <p className="flex items-start gap-2 rounded-lg bg-danger/8 px-3 py-2.5 text-[12.5px] text-danger">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          {t(error)}
        </p>
      ) : null}

      {wallet ? (
        <div className="rounded-xl border border-line bg-elevated/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <FieldLabel>{t(`${p}.derive.result`)}</FieldLabel>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-[10.5px] text-success">
                <Check className="size-3" />
                {t(`${p}.derive.ok`)}
              </span>
              <CopyButton value={wallet.address} />
            </div>
          </div>
          <p
            data-testid="derive-address"
            className="mt-2 font-mono text-[14.5px] leading-relaxed break-all text-ink"
          >
            {wallet.address}
          </p>
          {wallet.noteKey ? (
            <p data-testid="derive-note" className="mt-1.5 text-[11px] text-muted">
              {t(wallet.noteKey)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
