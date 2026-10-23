export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <span className={`relative inline-grid place-items-center overflow-hidden rounded-xl ${className}`}>
      <svg viewBox="0 0 64 64" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6366f1" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" fill="url(#logo-g)" />
      </svg>
      <svg viewBox="0 0 64 64" className="relative size-[62%] text-white" aria-hidden>
        <path
          d="M32 14l4.2 11.2L47.5 29l-11.3 3.8L32 44l-4.2-11.2L16.5 29l11.3-3.8z"
          fill="currentColor"
          fillOpacity="0.95"
        />
      </svg>
    </span>
  )
}
