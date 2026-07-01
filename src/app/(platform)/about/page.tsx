import Link from "next/link";
import { Paintbrush, TrendingUp, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-slate-900 selection:text-white">
      {/* Premium Minimalist Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="text-3xl font-bold tracking-tight text-slate-950">
              Cosmuv.
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex gap-10">
              <Link href="/platform-landing#features" className="text-base font-normal text-slate-500 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="/platform-landing#pricing" className="text-base font-normal text-slate-500 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
            </div>

            {/* Right Auth Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-base font-normal text-slate-600 hover:text-slate-900 transition-colors hidden sm:block"
              >
                Log In
              </Link>
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-normal text-white transition-all bg-slate-950 rounded-full hover:bg-slate-800 shadow-[0_0_0_4px_rgba(15,23,42,0.05)] hover:shadow-[0_0_0_4px_rgba(15,23,42,0.1)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mission Section (Hero) */}
      <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-transparent rounded-[100%] blur-3xl opacity-50 -z-0" />
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-8 backdrop-blur-md border border-white/10">
            Our Mission
          </div>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-medium tracking-tight text-white leading-[1.1] mb-8 max-w-5xl mx-auto">
            Empowering creative e-commerce and professional COD operators to scale with confidence.
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
            We are building the infrastructure that gives modern merchants absolute creative freedom and performance-driven tools, eliminating the friction of traditional platforms.
          </p>
        </div>
      </section>

      {/* Why Cosmuv Was Built (Storytelling) */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-slate-900 mb-6">
                Why we built Cosmuv
              </h2>
              <div className="space-y-6 text-slate-500 text-lg leading-relaxed font-normal">
                <p>
                  For years, e-commerce professionals have been forced into a corner. Traditional platforms offer rigid, cookie-cutter templates that strip away brand identity. Attempting to customize these platforms often requires expensive third-party apps, messy code overrides, and ultimately results in a slow, disjointed storefront.
                </p>
                <p>
                  Meanwhile, the Cash on Delivery (COD) industry has been largely ignored. Local delivery tools and high-intent conversion features have been treated as an afterthought.
                </p>
                <p>
                  <strong className="text-slate-900 font-medium">We knew there had to be a better way.</strong> Cosmuv breaks these boundaries. We built a platform that combines advanced structural customization with an optimized, lightning-fast architecture. Whether you are a creative brand seeking pixel-perfect design or a professional COD operator focused on high conversion and logistics, Cosmuv provides the definitive solution.
                </p>
              </div>
            </div>
            <div className="flex-1 relative w-full aspect-square max-w-lg lg:max-w-none mx-auto">
              <div className="absolute inset-0 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white shadow-xl rounded-2xl rotate-3 transition-transform hover:rotate-6" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-900 shadow-2xl rounded-2xl -rotate-6 transition-transform hover:-rotate-12 flex items-center justify-center">
                     <span className="text-white text-3xl font-bold tracking-tight">Cosmuv.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-[2.5rem] font-medium tracking-tight text-slate-900 mb-4">
              Our Core Pillars
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              The foundational principles that drive every feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-8">
                <Paintbrush className="w-7 h-7 text-slate-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-4 tracking-tight">Unparalleled Customization</h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Complete creative control over your storefront. We provide the tools to build unique, brand-aligned experiences without being locked into rigid design frameworks.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-8">
                <TrendingUp className="w-7 h-7 text-slate-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-4 tracking-tight">COD Conversion Infrastructure</h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Built for performance and high intent. Our checkout flows are hyper-optimized to capture sales efficiently, particularly tailored for Cash on Delivery operators.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-8">
                <Truck className="w-7 h-7 text-slate-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-4 tracking-tight">Logistics Syncing</h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Seamless tools to manage local operations. Connect your logistics and shipping seamlessly to ensure smart growth and operational efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-slate-950 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-[3rem] font-medium tracking-tight text-white leading-tight mb-6">
            Ready to build your unique brand?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join the next generation of e-commerce professionals scaling their businesses with Cosmuv.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-900 bg-white rounded-full hover:bg-slate-100 transition-colors w-full sm:w-auto"
            >
              Start Your Free Trial
            </Link>
            <Link
              href="/platform-landing#pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/20 rounded-full hover:bg-white/5 transition-colors w-full sm:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 pt-20 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-8 mb-16">
            <div>
              <span className="text-2xl font-bold text-white tracking-tight mb-4 block">Cosmuv.</span>
              <p className="text-slate-400 font-normal leading-relaxed text-[15px] max-w-sm">
                The next generation of e-commerce customization. Build, scale, and manage your online store with ease.
              </p>
            </div>
            
            <div className="flex md:justify-end md:items-end">
              <ul className="flex flex-wrap gap-6 text-[15px] text-slate-400">
                <li><Link href="/platform-landing#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/platform-landing#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors text-white">About Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-slate-500 text-[14px]">
            <p>© {new Date().getFullYear()} Cosmuv. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
