import { useI18n } from "../lib/i18n"

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="mt-20 border-t border-line/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 px-5 py-8 text-[12px] text-muted sm:flex-row sm:items-center sm:px-8">
        <span>{t("footer.made")}</span>
        <a
          href="https://github.com/zccz14/tools"
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono transition-colors hover:text-accent"
        >
          {t("footer.note")}
        </a>
      </div>
    </footer>
  )
}
