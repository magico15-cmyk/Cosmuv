import Link from "next/link";
import { ArrowRight, Wand2, LineChart, Truck, Globe, Zap, LayoutTemplate } from "lucide-react";

export default function PlatformLandingPage() {
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
              <Link href="#features" className="text-base font-normal text-slate-500 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-base font-normal text-slate-500 hover:text-slate-900 transition-colors">
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
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Asymmetric Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-slate-100 to-transparent rounded-[100%] blur-3xl opacity-50 -z-10" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Content (Text) */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none">
              <h1 className="text-[3.5rem] lg:text-[5rem] font-black tracking-[-0.03em] text-slate-950 leading-[1.05] mb-8">
                The Next Generation of <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-700 to-slate-950">
                  E-Commerce Customization.
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-500 mb-10 leading-relaxed font-normal max-w-xl">
                Break free from rigid templates. Build, scale, and optimize your global storefront with unparalleled creative control and intelligent local delivery tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all bg-slate-950 rounded-2xl hover:bg-slate-900 shadow-xl shadow-slate-900/20 hover:-translate-y-0.5"
                >
                  Create Your Unique Store
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-normal text-slate-600 transition-all bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50"
                >
                  Explore Features
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img src={`/avatar-${i}.jpg`} alt={`Customer ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-normal text-slate-500">
                  Trusted by <span className="text-slate-900 font-medium">10,000+</span> ambitious brands
                </div>
              </div>
            </div>

            {/* Right Content (Abstract Dashboard Mockup) */}
            <div className="flex-1 w-full relative perspective-[2000px]">
              <div className="relative w-full aspect-[4/3] transform-gpu rotate-y-[-10deg] rotate-x-[5deg] scale-105 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
                
                {/* Main Abstract Panel */}
                <div className="absolute inset-0 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.1)] overflow-hidden flex flex-col">
                  {/* Mock Navbar */}
                  <div className="h-14 border-b border-slate-100 flex items-center px-6 gap-6 bg-slate-50/50">
                    <div className="w-3 h-3 rounded-full bg-slate-300/50"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300/50"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300/50"></div>
                    <div className="ml-auto flex gap-3">
                      <div className="w-20 h-6 bg-slate-100 rounded-full"></div>
                      <div className="w-8 h-8 bg-slate-950 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Mock Body */}
                  <div className="flex-1 p-8 flex gap-8">
                    {/* Sidebar Area */}
                    <div className="w-48 flex flex-col gap-4">
                      <div className="w-full h-10 bg-slate-100 rounded-xl"></div>
                      <div className="w-3/4 h-10 bg-slate-50 rounded-xl"></div>
                      <div className="w-5/6 h-10 bg-slate-50 rounded-xl"></div>
                      <div className="w-2/3 h-10 bg-slate-50 rounded-xl"></div>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col gap-6">
                      {/* Metric Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-28 bg-slate-950 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 translate-y-8"></div>
                          <div className="w-12 h-4 bg-white/20 rounded-full"></div>
                          <div className="w-24 h-8 bg-white rounded-lg"></div>
                        </div>
                        <div className="h-28 bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
                          <div className="w-12 h-4 bg-slate-100 rounded-full"></div>
                          <div className="w-24 h-8 bg-slate-900 rounded-lg opacity-90"></div>
                        </div>
                      </div>
                      
                      {/* Chart Area */}
                      <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col justify-end relative overflow-hidden">
                        <div className="absolute top-5 left-5 w-32 h-4 bg-slate-100 rounded-full"></div>
                        <div className="flex items-end gap-2 h-32 mt-auto w-full opacity-60">
                           {[40, 70, 45, 90, 65, 100, 80].map((height, i) => (
                             <div key={i} className="flex-1 bg-slate-200 rounded-t-sm transition-all hover:bg-blue-500" style={{ height: `${height}%` }}></div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Element 1 - Order Notification */}
                <div className="absolute -left-12 top-24 bg-white p-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(15,23,42,0.1)] border border-slate-100 flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="w-20 h-3 bg-slate-200 rounded-full mb-2"></div>
                    <div className="w-12 h-3 bg-slate-100 rounded-full"></div>
                  </div>
                </div>

                {/* Floating Element 2 - Store Toggle */}
                <div className="absolute -right-8 bottom-32 bg-slate-950 p-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(15,23,42,0.2)] flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500"></div>
                   <div className="flex flex-col gap-1.5">
                     <div className="w-16 h-2.5 bg-white/80 rounded-full"></div>
                     <div className="w-10 h-2 bg-white/40 rounded-full"></div>
                   </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-slate-100 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-3xl mb-8">
             <Globe className="w-8 h-8 text-slate-900" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-950 mb-6">Empower Your Vision. Sell Global.</h2>
          <p className="text-xl text-slate-500 font-normal mb-10">Join the platform redefining modern commerce.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-medium text-white transition-all bg-slate-950 rounded-2xl hover:bg-slate-900 shadow-2xl shadow-slate-900/30 hover:scale-105"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  );
}
