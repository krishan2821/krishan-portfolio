// page.tsx — Entry point. Loads HomeClient with SSR disabled to prevent hydration mismatch.
import dynamic from 'next/dynamic'

const HomeClient = dynamic(() => import('./HomeClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-[#a78bfa] border-t-transparent animate-spin" />
        <span className="text-neutral-600 font-mono text-xs tracking-widest uppercase">Initializing...</span>
      </div>
    </div>
  ),
})

export default function HomePage() {
  return <HomeClient />
}
