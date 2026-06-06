// page.tsx — Entry point. Loads HomeClient with SSR disabled to prevent hydration mismatch.
import dynamic from 'next/dynamic'

const HomeClient = dynamic(() => import('./HomeClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#030303] text-[#f0f0f0] font-mono relative overflow-hidden select-none">
      {/* Background mesh grid */}
      <div className="absolute inset-0 mesh-grid opacity-60 pointer-events-none" />

      {/* ── Left Sidebar Navbar Skeleton ── */}
      <div className="fixed left-0 top-0 z-40 hidden h-full w-[68px] flex-col items-center border-r border-white/5 bg-[#050505]/70 py-6 backdrop-blur-xl lg:flex">
        <div className="h-10 w-10 rounded-xl bg-white/5 animate-pulse mb-10" />
        <div className="flex flex-col gap-5 w-full px-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-10 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>

      {/* ── Desktop Split-Pane Terminal Skeleton ── */}
      <div className="fixed left-[68px] top-0 h-screen w-[380px] p-5 border-r border-white/10 bg-black/80 hidden lg:flex flex-col gap-4 z-20">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
          </div>
          <div className="w-24 h-3 bg-white/5 rounded animate-pulse" />
          <div className="w-8 h-3 bg-white/5 rounded animate-pulse" />
        </div>
        {/* Terminal Lines */}
        <div className="flex-1 flex flex-col gap-3 pt-2">
          <div className="w-3/4 h-3 bg-white/5 rounded animate-pulse" />
          <div className="w-1/2 h-3 bg-white/5 rounded animate-pulse" />
          <div className="w-5/6 h-3 bg-white/5 rounded animate-pulse" />
          <div className="w-2/3 h-3 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* ── Main Layout Skeleton ── */}
      <div className="lg:pl-[448px] relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-screen-2xl grid grid-cols-1 lg:grid-cols-12 items-center gap-12 py-20 lg:py-0">
          
          {/* Left Side Info */}
          <div className="flex flex-col gap-6 text-left lg:col-span-7">
            {/* Status Badge */}
            <div className="w-56 h-8 rounded-full bg-white/5 border border-white/5 animate-pulse" />
            
            {/* Main Title */}
            <div className="flex flex-col gap-3">
              <div className="w-3/4 h-12 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-1/2 h-12 bg-white/10 rounded-xl animate-pulse" />
            </div>

            {/* Paragraph */}
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-4/5 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-2/3 h-4 bg-white/5 rounded animate-pulse" />
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-3 gap-4 py-4 max-w-lg border-y border-white/5 bg-white/[0.01] p-4 rounded-xl mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 items-center">
                  <div className="w-12 h-6 bg-white/10 rounded animate-pulse" />
                  <div className="w-16 h-3 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mt-2">
              <div className="w-40 h-12 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-36 h-12 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
            </div>
          </div>

          {/* Right Side: Mock Code Editor Skeleton */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="w-full h-80 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col">
              <div className="h-10 bg-black/40 border-b border-white/5 rounded-t-2xl flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
                </div>
                <div className="w-32 h-3 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="flex-1 p-5 flex flex-col gap-3">
                <div className="w-2/3 h-3 bg-white/5 rounded animate-pulse" />
                <div className="w-3/4 h-3 bg-white/5 rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-white/5 rounded animate-pulse" />
                <div className="w-5/6 h-3 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  ),
})

export default function HomePage() {
  return <HomeClient />
}
