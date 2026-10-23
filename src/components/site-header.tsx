import { Check, Globe } from "lucide-react"
import { Link } from "react-router-dom"
import { useI18n, type Lang } from "../lib/i18n"
import { GithubIcon } from "./icons"
import { Logo } from "./logo"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const LANGS: { value: Lang; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
]

export function SiteHeader() {
  const { t, lang, setLang } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <Logo className="size-8 transition-transform duration-300 group-hover:rotate-6" />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">{t("app.name")}</span>
            <span className="mt-1 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
              tools.zccz14.com
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <a href="https://github.com/zccz14/tools" target="_blank" rel="noreferrer noopener">
              <GithubIcon className="size-4" />
              {t("nav.source")}
            </a>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("nav.lang")} title={t("nav.lang")}>
                <Globe />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGS.map((item) => (
                <DropdownMenuItem key={item.value} onSelect={() => setLang(item.value)}>
                  <span>{item.label}</span>
                  {lang === item.value ? <Check className="size-3.5 text-accent" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
