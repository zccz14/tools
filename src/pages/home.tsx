import { ArrowUpRight, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "../components/ui/badge"
import { useI18n } from "../lib/i18n"
import { TOOLS } from "../lib/tools"

export function HomePage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      <section className="rise pt-16 pb-10 sm:pt-24 sm:pb-14">
        <Badge className="border-accent/25 bg-accent-soft text-accent">
          <Sparkles className="size-3" />
          {t("home.eyebrow")}
        </Badge>
        <h1 className="mt-6 max-w-2xl text-[2rem] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[2.75rem]">
          {t("home.hero.title")}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
          {t("home.hero.subtitle")}
        </p>
      </section>

      <section className="pb-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
            {t("home.section.tools")}
          </h2>
          <span className="font-mono text-[11px] text-muted">
            {t("home.count", { n: TOOLS.length })}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool, index) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.id}
                to={tool.path}
                style={{ animationDelay: `${80 + index * 60}ms` }}
                className="rise group relative flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_12px_32px_-12px_rgba(79,70,229,0.35)] focus-visible:outline-none sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                    <Icon className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-[15px] font-semibold tracking-tight">{t(tool.titleKey)}</h3>
                  <p className="text-[13px] leading-relaxed text-muted">{t(tool.descKey)}</p>
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-elevated px-2 py-1 font-mono text-[10.5px] tracking-tight text-muted"
                    >
                      {t(tag)}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}

          <div className="flex min-h-[188px] flex-col justify-center gap-2 rounded-2xl border border-dashed border-line/80 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold tracking-tight text-muted">
                {t("home.more.title")}
              </h3>
              <span className="rounded-md bg-elevated px-2 py-1 font-mono text-[10.5px] text-muted/80">
                {t("home.more.tag")}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-muted/80">{t("home.more.desc")}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
