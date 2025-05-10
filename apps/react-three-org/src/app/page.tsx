"use client"

import { useState } from "react"
import { PackageCard } from "@/components/package-card"
import { ProjectConfigurator } from "@/components/project-configurator"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { packages } from "@/lib/packages"
import { BackgroundAnimation } from "@/components/background-animation"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])

  const togglePackage = (packageId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId) ? prev.filter((id) => id !== packageId) : [...prev, packageId],
    )
  }

  return (
    <main className="relative min-h-screen flex flex-col pb-36">
      <BackgroundAnimation />
      <div className="container mx-auto px-4 py-8 z-10 flex-1">
        <div className="flex flex-col items-center justify-center mb-6 mt-8">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 tracking-tighter">React Three</h1>
          <p className="text-lg md:text-xl text-white/70 text-center max-w-2xl mb-6">
            A powerful ecosystem for building 3D experiences with React
          </p>
          <NavBar />
        </div>

        {/* Visual separator */}
        <div className="relative mb-10 mt-4">
          <Separator className="bg-white/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent h-px" />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-white/90">Ecosystem Packages</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              isSelected={selectedPackages.includes(pkg.id)}
              onToggle={() => togglePackage(pkg.id)}
            />
          ))}
        </div>

        <ProjectConfigurator selectedPackages={selectedPackages} />
      </div>
      <Footer />
    </main>
  )
}
