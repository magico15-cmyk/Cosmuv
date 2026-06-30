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
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                      <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
                <div className="text-sm font-normal text-slate-500">
                  Trusted by <span className="text-slate-900 font-medium">10,000+</span> ambitious brands
                </div>
              </div>
            </div>

            {/* Right Content (Storefront Hero Image with Floating Popups) */}
            <div className="flex-1 w-full relative">
              <div className="relative w-full">
                
                {/* Main Storefront Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_-12px_rgba(15,23,42,0.15)] border border-slate-200/60">
                  <img 
                    src="/hero-storefront.png" 
                    alt="Cosmuv storefront example showing a luxury e-commerce store with products"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Floating Popup 1 - Product Quick View Card (top-right) */}
                <div 
                  className="absolute -right-6 top-8 lg:-right-10 lg:top-12 bg-white p-3 rounded-2xl shadow-[0_20px_40px_-8px_rgba(15,23,42,0.15)] border border-slate-100 z-20"
                  style={{ animation: 'floatUp 3s ease-in-out infinite' }}
                >
                  <div className="w-20 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                    <LayoutTemplate className="w-8 h-8 text-amber-600/40" />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
                      <span className="text-[10px] text-slate-400 font-medium">−</span>
                      <span className="text-[10px] text-slate-700 font-bold px-1">1</span>
                      <span className="text-[10px] text-slate-400 font-medium">+</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-900">$49</div>
                  </div>
                </div>

                {/* Floating Popup 2 - Cart Button (bottom-right) */}
                <div 
                  className="absolute -right-4 bottom-20 lg:-right-8 lg:bottom-28 bg-slate-950 px-5 py-3 rounded-2xl shadow-[0_20px_40px_-8px_rgba(15,23,42,0.25)] flex items-center gap-3 z-20"
                  style={{ animation: 'floatUp 3.5s ease-in-out 0.5s infinite' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span className="text-white text-xs font-semibold">Add to Cart</span>
                  <span className="bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">2</span>
                </div>

                {/* Floating Popup 3 - Color Swatches (bottom-left) */}
                <div 
                  className="absolute -left-4 bottom-12 lg:-left-8 lg:bottom-16 bg-white p-3 rounded-2xl shadow-[0_20px_40px_-8px_rgba(15,23,42,0.12)] border border-slate-100 z-20"
                  style={{ animation: 'floatUp 4s ease-in-out 1s infinite' }}
                >
                  <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Select Color</div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 ring-2 ring-amber-400/30 ring-offset-1"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-900"></div>
                    <div className="w-6 h-6 rounded-full bg-rose-200"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300"></div>
                  </div>
                </div>

                {/* Floating Popup 4 - New Order Notification (top-left) */}
                <div 
                  className="absolute -left-6 top-16 lg:-left-10 lg:top-20 bg-white p-3 rounded-2xl shadow-[0_15px_30px_-5px_rgba(15,23,42,0.1)] border border-slate-100 flex items-center gap-3 z-20"
                  style={{ animation: 'floatUp 3.8s ease-in-out 1.5s infinite' }}
                >
                  <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-900">New Order!</div>
                    <div className="text-[9px] text-slate-400">Just now · $127.00</div>
                  </div>
                </div>

              </div>

              {/* Decorative curved lines behind the image */}
              <svg className="absolute inset-0 -z-10 w-[120%] h-[120%] -left-[10%] -top-[10%] opacity-20" viewBox="0 0 600 500" fill="none">
                <path d="M50 250 C150 100, 450 100, 550 250 C450 400, 150 400, 50 250" stroke="#94a3b8" strokeWidth="1" fill="none"/>
                <path d="M30 250 C130 80, 470 80, 570 250 C470 420, 130 420, 30 250" stroke="#cbd5e1" strokeWidth="0.5" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Grid Features Section */}
      <section id="features" className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">How We Are Different</h2>
            <p className="text-lg text-slate-400 font-normal">Cosmuv is built for scale, offering a meticulously crafted infrastructure that prioritizes aesthetics, analytics, and ultra-fast local fulfillment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 hover:bg-slate-800/80 transition-colors group">
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Creative Freedom</h3>
              <p className="text-slate-400 leading-relaxed font-normal">
                Design without limits. Our powerful engine lets you customize every pixel, ensuring your store is a true reflection of your premium brand identity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 hover:bg-slate-800/80 transition-colors group">
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Growth Analytics</h3>
              <p className="text-slate-400 leading-relaxed font-normal">
                Stop guessing. Make data-driven decisions with real-time conversion metrics, customer journey tracking, and advanced funnel optimization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 hover:bg-slate-800/80 transition-colors group">
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Local Delivery Optimization</h3>
              <p className="text-slate-400 leading-relaxed font-normal">
                Engineered for Cash-on-Delivery and local logistics. Seamlessly manage couriers, track shipments, and optimize your last-mile delivery rates.
              </p>
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
