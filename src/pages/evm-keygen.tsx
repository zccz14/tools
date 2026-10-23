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
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, FieldLabel } from "../components/ui/card"
import { CopyButton } from "../components/ui/copy-button"
import { Textarea } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { buildKeyFile, generateWallet, walletFromPrivateKey, type Wallet } from "../lib/evm"
import { useI18n } from "../lib/i18n"

export function EvmKeygenPage() {
  const { t } = useI18n()

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
            {t("keygen.title")}
          </h1>
          <Badge className="border-accent/25 bg-accent-soft text-accent">
            <ShieldCheck className="size-3" />
            {t("keygen.status")}
          </Badge>
        </div>
        <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-muted">
          {t("keygen.subtitle")}
        </p>
      </div>

      <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_296px]">
        <Card className="rise overflow-hidden" style={{ animationDelay: "60ms" }}>
          <div className="p-5 pb-0 sm:p-6 sm:pb-0">
            <Tabs defaultValue="generate">
              <TabsList>
                <TabsTrigger data-testid="tab-generate" value="generate">
                  <KeyRound />
                  {t("keygen.tab.generate")}
                </TabsTrigger>
                <TabsTrigger data-testid="tab-derive" value="derive">
                  <Search />
                  {t("keygen.tab.derive")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="pt-5">
                <GeneratePanel />
              </TabsContent>
              <TabsContent value="derive" className="pt-5">
                <DerivePanel />
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
              <p className="text-[12.5px] leading-relaxed text-muted">{t("about.body")}</p>
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

function GeneratePanel() {
  const { t } = useI18n()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  const regenerate = useCallback(() => {
    setWallet(generateWallet())
    setShowKey(false)
    setShowQr(false)
  }, [])

  useEffect(() => {
    regenerate()
  }, [regenerate])

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
      .catch(() => setQrDataUrl(null))
    return () => {
      alive = false
    }
  }, [showQr, wallet])

  function download() {
    if (!wallet) return
    const blob = new Blob([buildKeyFile(wallet)], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `evm-key-${wallet.address.slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const masked = useMemo(() => "•".repeat(64), [])

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
            <FieldLabel>{t("keygen.address")}</FieldLabel>
            <p
              data-testid="address"
              className="mt-1.5 font-mono text-[15px] leading-relaxed font-medium break-all text-ink"
            >
              {wallet.address}
            </p>
            <p className="mt-1.5 text-[11px] text-muted">{t("keygen.address.meta")}</p>
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
            <FieldLabel>{t("keygen.key")}</FieldLabel>
            <p className="mt-1 text-[11px] text-muted">
              {t(showKey ? "keygen.key.meta.shown" : "keygen.key.meta.hidden")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              data-testid="reveal-key"
              variant="ghost"
              size="iconSm"
              onClick={() => setShowKey((v) => !v)}
              title={showKey ? t("common.hide") : t("common.reveal")}
            >
              {showKey ? <EyeOff /> : <Eye />}
            </Button>
            <CopyButton value={`0x${wallet.privateKey}`} />
          </div>
        </div>

        <p
          data-testid="private-key"
          className={`mt-3 rounded-lg bg-elevated/70 px-3 py-2.5 font-mono text-[12.5px] leading-relaxed ${
            showKey ? "break-all text-ink select-auto" : "truncate text-muted/50 select-none"
          }`}
        >
          {showKey ? `0x${wallet.privateKey}` : `0x${masked}`}
        </p>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button data-testid="regenerate" size="sm" onClick={regenerate}>
          <RefreshCw />
          {t("keygen.generate")}
          <kbd className="ml-0.5 hidden rounded border border-accent-ink/25 px-1 py-px font-mono text-[10px] opacity-70 sm:inline">
            G
          </kbd>
        </Button>
        <Button variant="secondary" size="sm" onClick={download}>
          <Download />
          {t("keygen.save")}
        </Button>
        <span className="ml-auto text-[11px] text-muted">
          {t("keygen.created")}{" "}
          <time className="font-mono">{new Date(wallet.createdAt).toLocaleTimeString()}</time>
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- derive */

function DerivePanel() {
  const { t } = useI18n()
  const [input, setInput] = useState("")
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function run() {
    setError(null)
    setAddress(null)
    if (!input.trim()) {
      setError("keygen.derive.empty")
      return
    }
    setBusy(true)
    try {
      setAddress(walletFromPrivateKey(input).address)
    } catch {
      setError("keygen.derive.bad")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold tracking-tight">{t("keygen.derive.title")}</h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{t("keygen.derive.desc")}</p>
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
          setAddress(null)
        }}
        placeholder={t("keygen.derive.placeholder")}
        className="resize-y"
      />

      <div className="flex items-center gap-2">
        <Button data-testid="derive-run" size="sm" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <KeyRound />}
          {t("keygen.derive.run")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setInput("")
            setError(null)
            setAddress(null)
          }}
        >
          {t("keygen.derive.clear")}
        </Button>
      </div>

      {error ? (
        <p className="flex items-start gap-2 rounded-lg bg-danger/8 px-3 py-2.5 text-[12.5px] text-danger">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          {t(error)}
        </p>
      ) : null}

      {address ? (
        <div className="rounded-xl border border-line bg-elevated/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <FieldLabel>{t("keygen.derive.result")}</FieldLabel>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-[10.5px] text-success">
                <Check className="size-3" />
                {t("keygen.derive.ok")}
              </span>
              <CopyButton value={address} />
            </div>
          </div>
          <p
            data-testid="derive-address"
            className="mt-2 font-mono text-[14.5px] leading-relaxed break-all text-ink"
          >
            {address}
          </p>
        </div>
      ) : null}
    </div>
  )
}
