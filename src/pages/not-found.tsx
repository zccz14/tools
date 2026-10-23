import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useI18n } from "../lib/i18n"

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-5 py-24 sm:px-8">
      <p className="font-mono text-[13px] text-muted">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t("notfound.title")}</h1>
      <p className="text-muted">{t("notfound.desc")}</p>
      <Button asChild variant="secondary" className="mt-2">
        <Link to="/">{t("common.back")}</Link>
      </Button>
    </div>
  )
}
