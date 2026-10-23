import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Lang = "zh" | "en"

/** Flat key → { zh, en }. No nesting, no lazy loading: completeness is compile-time. */
const MESSAGES: Record<string, { zh: string; en: string }> = {
  "app.name": { zh: "工具箱", en: "Tools" },

  "nav.source": { zh: "源码", en: "Source" },
  "nav.lang": { zh: "语言", en: "Language" },

  "home.eyebrow": { zh: "纯前端 · 无后端 · 无追踪", en: "Client-side only · no backend · no tracking" },
  "home.hero.title": { zh: "只做一件事的工具。", en: "Tools that do one thing." },
  "home.hero.subtitle": {
    zh: "不登录、不埋点、不上传。一半是懒，一半是我自己也用——所以不敢糊弄。",
    en: "No sign-in, no analytics, no uploads. Half laziness, half self-interest: I use these myself, so I can't cut corners.",
  },
  "home.section.tools": { zh: "工具", en: "Tools" },
  "home.count": { zh: "{n} 个", en: "{n} available" },
  "home.more.title": { zh: "想到再写", en: "Written when needed" },
  "home.more.desc": { zh: "这个列表只会变长，不会变成产品。", en: "This list only grows. It will never become a product." },
  "home.more.tag": { zh: "待定", en: "tbd" },

  "tool.keygen.name": { zh: "EVM 私钥生成器", en: "EVM Key Generator" },
  "tool.keygen.desc": {
    zh: "生成 secp256k1 私钥，顺手算出 EIP-55 地址。只有私钥，没有助记词——十二个单词我记不住，也不想记。",
    en: "Generates a secp256k1 private key and its EIP-55 address. Raw key only, no seed phrase — I can't remember twelve words and I refuse to try.",
  },
  "tool.keygen.tag1": { zh: "secp256k1", en: "secp256k1" },
  "tool.keygen.tag2": { zh: "keccak-256", en: "keccak-256" },
  "tool.keygen.tag3": { zh: "离线可用", en: "works offline" },

  "common.copy": { zh: "复制", en: "Copy" },
  "common.copied": { zh: "已复制", en: "Copied" },
  "common.reveal": { zh: "显示", en: "Reveal" },
  "common.hide": { zh: "隐藏", en: "Hide" },
  "common.back": { zh: "返回工具列表", en: "Back to tools" },
  "common.qr": { zh: "二维码", en: "QR" },

  "keygen.title": { zh: "EVM 私钥生成器", en: "EVM Key Generator" },
  "keygen.subtitle": {
    zh: "32 字节熵 → secp256k1 → keccak-256 → EIP-55 地址。全程在这个标签页里，刷新即销毁。",
    en: "32 bytes of entropy → secp256k1 → keccak-256 → EIP-55 address. All of it happens in this tab, and dies on reload.",
  },
  "keygen.status": { zh: "本地运行", en: "local" },
  "keygen.tab.generate": { zh: "生成", en: "Generate" },
  "keygen.tab.derive": { zh: "查地址", en: "Derive" },

  "keygen.address": { zh: "地址", en: "Address" },
  "keygen.address.meta": { zh: "EIP-55 校验格式 · 这个可以直接发人", en: "EIP-55 checksummed · safe to share" },
  "keygen.key": { zh: "私钥", en: "Private key" },
  "keygen.key.meta.hidden": { zh: "别截图，别发微信，别贴进任何网页", en: "No screenshots, no chat apps, no web forms" },
  "keygen.key.meta.shown": { zh: "已显示 · 刷新页面就没了", en: "shown · gone on reload" },
  "keygen.generate": { zh: "换一个", en: "Regenerate" },
  "keygen.generate.hint": { zh: "按 G", en: "press G" },
  "keygen.save": { zh: "存成 .txt", en: "Save .txt" },
  "keygen.created": { zh: "生成于", en: "created" },

  "keygen.derive.title": { zh: "看看这个私钥是谁的", en: "Whose key is this?" },
  "keygen.derive.desc": {
    zh: "粘 64 位十六进制私钥，在本地算出它对应的地址。不上传、不缓存、不记日志——我也没有服务器可以记。",
    en: "Paste a 64-hex private key and derive its address locally. No upload, no cache, no logs — there is no server to log it.",
  },
  "keygen.derive.placeholder": { zh: "0x… 或者直接 64 位十六进制", en: "0x… or plain 64 hex chars" },
  "keygen.derive.run": { zh: "算地址", en: "Derive" },
  "keygen.derive.clear": { zh: "清空", en: "Clear" },
  "keygen.derive.result": { zh: "对应的地址", en: "Resolves to" },
  "keygen.derive.ok": { zh: "私钥合法", en: "valid key" },
  "keygen.derive.empty": { zh: "还没输入。", en: "Nothing entered." },
  "keygen.derive.bad": {
    zh: "这不是合法私钥：要么不是 64 位十六进制，要么超出了 secp256k1 的阶。",
    en: "Not a valid key: either it isn't 64 hex characters, or it's outside the secp256k1 order.",
  },

  "notes.title": { zh: "几句实话", en: "Straight talk" },
  "notes.1.title": { zh: "不联网", en: "No wire" },
  "notes.1.body": {
    zh: "构建时写死 CSP：connect-src none。不是靠我自觉，是浏览器替我拦。",
    en: "The build hard-codes a CSP with connect-src 'none'. That's the browser blocking it, not my good manners.",
  },
  "notes.2.title": { zh: "不引第三方", en: "No third parties" },
  "notes.2.body": {
    zh: "没有 CDN、没有字体服务、没有统计脚本。少一个依赖，少一个背叛你的机会。",
    en: "No CDN, no font service, no analytics. One less dependency is one less thing that can rat you out.",
  },
  "notes.3.title": { zh: "自己算，自己看", en: "Check the code" },
  "notes.3.body": {
    zh: "密码学用 @noble，地址本地推导，代码全在 GitHub 上——不信我就去读。",
    en: "Crypto from @noble, addresses derived locally, code on GitHub. Don't trust me — read it.",
  },
  "notes.4.title": { zh: "别当保险柜", en: "Not a vault" },
  "notes.4.body": {
    zh: "先小额试。大额请上硬件钱包，别把身家押在一个网页生成的明文私钥上。",
    en: "Test small. Use a hardware wallet for real money. Don't park your net worth on a plaintext key a web page made.",
  },

  "about.title": { zh: "关于", en: "About" },
  "about.body": {
    zh: "开源、无服务端，密码学来自 @noble/curves 与 @noble/hashes。",
    en: "Open source, no server. Crypto by @noble/curves and @noble/hashes.",
  },
  "about.build": { zh: "构建", en: "Build" },

  "footer.made": { zh: "由 zccz14 维护", en: "Maintained by zccz14" },
  "footer.note": { zh: "全部代码在 GitHub 上公开", en: "All code is public on GitHub" },

  "notfound.title": { zh: "这里没有工具。", en: "No tool here." },
  "notfound.desc": { zh: "回索引看看。", en: "Try the index." },
}

const STORAGE_KEY = "tools.lang"

type I18nValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "zh" || saved === "en") return saved
  } catch {
    /* ignore */
  }
  const nav = typeof navigator !== "undefined" ? navigator.language : "en"
  return nav.toLowerCase().startsWith("zh") ? "zh" : "en"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const entry = MESSAGES[key]
      let text = entry ? entry[lang] : key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v))
      }
      return text
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider")
  return ctx
}
