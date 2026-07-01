import Link from "next/link";
import { ArrowRight, Wand2, LineChart, Truck, Globe, Zap, LayoutTemplate, Headphones, Blocks, Wrench, Users, Plus } from "lucide-react";

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
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Asymmetric Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-slate-100 to-transparent rounded-[100%] blur-3xl opacity-50 -z-10" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">
            
            {/* Left Content (Text) */}
            <div className="flex-1 min-w-0 w-full max-w-2xl lg:max-w-none">
              <h1 className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.25rem] 2xl:text-[3.5rem] font-normal tracking-tight text-slate-900 leading-[1.1] mb-8 break-words">
                The Next Generation of <br className="hidden lg:block" />
                E-Commerce Customization.
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
            <div className="flex-1 min-w-0 w-full max-w-2xl lg:max-w-none relative perspective-[2000px] mt-12 lg:-mt-16 mx-auto">
              <div className="relative w-[90%] mx-auto aspect-[4/3] transform-gpu rotate-y-[-10deg] rotate-x-[5deg] scale-95 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
                
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
                             <div key={i} className="flex-1 bg-slate-200 rounded-t-sm transition-all hover:bg-slate-950" style={{ height: `${height}%` }}></div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Element 1 - Order Notification */}
                <div className="absolute -left-12 top-24 bg-white p-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(15,23,42,0.1)] border border-slate-100 flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="w-20 h-3 bg-slate-200 rounded-full mb-2"></div>
                    <div className="w-12 h-3 bg-slate-100 rounded-full"></div>
                  </div>
                </div>

                {/* Floating Element 2 - Store Toggle */}
                <div className="absolute -right-8 bottom-32 bg-slate-950 p-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(15,23,42,0.2)] flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
                   <div className="w-8 h-8 rounded-full bg-white"></div>
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

      {/* Ecosystem & Support Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-3xl lg:text-[2.5rem] font-normal text-slate-900 mb-16 tracking-tight">Build with help by your side</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            
            {/* Item 1 */}
            <div className="flex flex-col">
              <Headphones className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">24/7 support</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Our support staff and virtual help assistant are here to help.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col">
              <Blocks className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">16K+ apps</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                For whatever extra functionality your business might need.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col">
              <Wrench className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Online courses</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Lessons and tips from experts to help you succeed.
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col">
              <Users className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Cosmuv Partners</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Do more with commerce's largest network of partners.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Get Ready for Shopping Section */}
      <section className="py-24 bg-[#fff5f8] border-t border-pink-100/50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Content (Custom SVG Illustration) */}
            <div className="flex-1 w-full flex justify-center lg:justify-start">
              <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg h-auto drop-shadow-2xl">
                {/* Soft background glow */}
                <circle cx="250" cy="200" r="150" fill="url(#shoppingGlow)" opacity="0.6" />

                {/* Mobile Phone Mockup */}
                <rect x="150" y="40" width="200" height="380" rx="30" fill="#0f172a" stroke="#1e293b" strokeWidth="10" />
                {/* Phone Screen */}
                <rect x="156" y="46" width="188" height="368" rx="24" fill="#ffffff" />
                
                {/* App Header */}
                <rect x="175" y="70" width="100" height="14" rx="7" fill="#f1f5f9" />
                <circle cx="315" cy="77" r="10" fill="#e2e8f0" />
                
                {/* Product Image Area */}
                <rect x="175" y="110" width="150" height="150" rx="16" fill="#f8fafc" />
                {/* Abstract Product (Shoe/Bottle shape) */}
                <path d="M215 220 C 215 170, 285 170, 285 220 Z" fill="url(#shoppingProduct)" />
                <circle cx="250" cy="180" r="16" fill="#cbd5e1" />
                
                {/* Product Details */}
                <rect x="175" y="280" width="90" height="10" rx="5" fill="#94a3b8" />
                <rect x="175" y="300" width="50" height="8" rx="4" fill="#cbd5e1" />
                <rect x="275" y="290" width="50" height="24" rx="12" fill="#0f172a" />
                <rect x="285" y="300" width="30" height="4" rx="2" fill="#ffffff" />
                
                {/* Floating Elements */}
                
                {/* Floating Cart Icon Card */}
                <g transform="translate(60, 160)">
                  <rect width="80" height="80" rx="20" fill="#ffffff" filter="url(#shoppingShadow)" />
                  <circle cx="40" cy="40" r="24" fill="#f8fafc" />
                  <path d="M28 32 L34 32 L38 46 L50 46 L52 36 L36 36" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="40" cy="52" r="3" fill="#ec4899" />
                  <circle cx="48" cy="52" r="3" fill="#ec4899" />
                  {/* Notification Badge */}
                  <circle cx="65" cy="15" r="12" fill="#ef4444" />
                  <text x="65" y="19" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">3</text>
                </g>
                
                {/* Floating Price Tag */}
                <g transform="translate(340, 100)">
                  <rect width="100" height="50" rx="14" fill="#ffffff" filter="url(#shoppingShadow)" />
                  <rect x="15" y="20" width="30" height="10" rx="5" fill="#10b981" opacity="0.2" />
                  <text x="55" y="30" fill="#10b981" fontSize="14" fontFamily="sans-serif" fontWeight="bold">$99</text>
                </g>
                
                {/* Floating Like/Heart */}
                <g transform="translate(320, 250)">
                  <rect width="60" height="60" rx="16" fill="#ffffff" filter="url(#shoppingShadow)" />
                  <path d="M30 22 C30 22 22 14 16 20 C10 26 18 36 30 44 C42 36 50 26 44 20 C38 14 30 22 30 22 Z" fill="#ec4899" />
                </g>

                <defs>
                  <radialGradient id="shoppingGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="shoppingProduct" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <filter id="shoppingShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#0f172a" floodOpacity="0.08" />
                  </filter>
                </defs>
              </svg>
            </div>

            {/* Right Content (Text) */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none text-center lg:text-left">
              <h2 className="text-[3rem] sm:text-[3.5rem] lg:text-[4rem] font-black tracking-[-0.02em] text-slate-950 leading-[1.1] mb-6">
                Get Ready for <br className="hidden lg:block" />
                Shopping
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Experience a seamless transition into the future of commerce. Build, manage, and scale your online presence with tools designed to empower your business.
              </p>
              <button className="bg-[#3e3c56] text-white px-10 py-4 rounded-xl font-medium text-lg hover:bg-[#2d2c3e] transition-colors shadow-xl shadow-[#3e3c56]/20">
                Shop Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col">
            {/* FAQ 1 */}
            <details className="group border-b border-white/10 transition-all duration-200">
              <summary className="flex cursor-pointer items-center justify-between py-6 font-normal text-white select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg">How can I start my own online business?</span>
                <span className="ml-6 flex-shrink-0 transition-transform duration-300 group-open:rotate-45">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#0a0a0a]" strokeWidth={2.5} />
                  </div>
                </span>
              </summary>
              <div className="pb-6 text-slate-400 leading-relaxed font-normal text-[15px] pr-12">
                Cosmuv is built from the ground up for massive scale, providing unprecedented creative freedom to customize your store without rigid templates, alongside built-in intelligent tools specifically designed for local fulfillment and Cash-on-Delivery operations.
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="group border-b border-white/10 transition-all duration-200">
              <summary className="flex cursor-pointer items-center justify-between py-6 font-normal text-white select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg">Can you start a business with no money?</span>
                <span className="ml-6 flex-shrink-0 transition-transform duration-300 group-open:rotate-45">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#0a0a0a]" strokeWidth={2.5} />
                  </div>
                </span>
              </summary>
              <div className="pb-6 text-slate-400 leading-relaxed font-normal text-[15px] pr-12">
                Absolutely. Our seamless migration tools allow you to easily import your products, customers, and order history from major platforms like Shopify or WooCommerce with just a few clicks.
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="group border-b border-white/10 transition-all duration-200">
              <summary className="flex cursor-pointer items-center justify-between py-6 font-normal text-white select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg">When should you start a business?</span>
                <span className="ml-6 flex-shrink-0 transition-transform duration-300 group-open:rotate-45">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#0a0a0a]" strokeWidth={2.5} />
                  </div>
                </span>
              </summary>
              <div className="pb-6 text-slate-400 leading-relaxed font-normal text-[15px] pr-12">
                No coding experience is required. Our intuitive visual builder gives you complete control over your store's design. However, if you are a developer, we provide full access to edit the underlying code for ultimate customization.
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="group border-b border-white/10 transition-all duration-200">
              <summary className="flex cursor-pointer items-center justify-between py-6 font-normal text-white select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg">How does the pricing work?</span>
                <span className="ml-6 flex-shrink-0 transition-transform duration-300 group-open:rotate-45">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#0a0a0a]" strokeWidth={2.5} />
                  </div>
                </span>
              </summary>
              <div className="pb-6 text-slate-400 leading-relaxed font-normal text-[15px] pr-12">
                We offer transparent, straightforward pricing with no hidden fees. You can choose a plan that fits your business size, and we never penalize you for growing with ridiculous transaction percentage fees.
              </div>
            </details>
          </div>
        </div>
      </section>

    </div>
  );
}
