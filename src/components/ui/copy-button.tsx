import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useI18n } from "../../lib/i18n"
import { cn } from "../../lib/utils"
import { Button } from "./button"

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const el = document.createElement("textarea")
      el.value = value
      el.style.position = "fixed"
      el.style.opacity = "0"
      document.body.append(el)
      el.select()
      document.execCommand("copy")
      el.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={label ? "sm" : "iconSm"}
      onClick={copy}
      title={t("common.copy")}
      aria-label={t("common.copy")}
      className={cn(copied && "text-success", className)}
    >
      {copied ? <Check /> : <Copy />}
      {label ? <span>{copied ? t("common.copied") : label}</span> : null}
    </Button>
  )
}
