import { Route, Routes } from "react-router-dom"
import { SiteFooter } from "./components/site-footer"
import { SiteHeader } from "./components/site-header"
import { EvmKeygenPage } from "./pages/evm-keygen"
import { HomePage } from "./pages/home"
import { NotFoundPage } from "./pages/not-found"

export default function App() {
  return (
    <div className="aura flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/evm-keygen" element={<EvmKeygenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
