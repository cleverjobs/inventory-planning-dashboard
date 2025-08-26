"use client"

import { useState } from "react"
import { Dashboard } from "@/dashboard/ui/dashboard"
import { PageHeader } from "@/core/ui/page-header"

export default function Page() {
  const [mobilePreview, setMobilePreview] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader isMobilePreview={mobilePreview} onViewportModeChange={setMobilePreview} />
      <main className="flex-1 w-full mx-auto max-w-7xl px-0 sm:px-0 md:px-0 py-4 sm:py-6">
        <div
          className={
            mobilePreview
              ? "mx-auto w-[390px] border rounded-xl shadow-lg overflow-hidden bg-background transition-all"
              : "w-full transition-all"
          }
        >
          <Dashboard mobilePreview={mobilePreview} />
        </div>
      </main>
    </div>
  )
}