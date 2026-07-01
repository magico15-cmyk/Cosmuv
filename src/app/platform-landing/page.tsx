import Link from "next/link";
import { ArrowRight, Wand2, LineChart, Truck, Globe, Zap, LayoutTemplate, Headphones, Blocks, Wrench, Users, Plus, Smartphone, CreditCard, Sliders, Package, Search, Target, ShoppingCart } from "lucide-react";

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

      {/* High-Converting Features Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-3xl lg:text-[2.5rem] font-normal text-slate-900 mb-16 tracking-tight">Everything you need to scale</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-12 lg:gap-y-16">
            
            {/* Item 1 */}
            <div className="flex flex-col">
              <Smartphone className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Mobile Optimized</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Ensure every customer enjoys a flawless shopping experience with automatically responsive, mobile-first storefronts.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col">
              <Zap className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Lightning Fast</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Optimized infrastructure ensures your storefront loads instantly for every customer.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col">
              <LineChart className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Advanced Analytics</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Track sales, monitor traffic, and understand your audience with real-time data.
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col">
              <LayoutTemplate className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Customizable Themes</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Easily adapt your brand's look and feel with flexible, easy-to-edit storefront designs.
              </p>
            </div>

            {/* Item 5 */}
            <div className="flex flex-col">
              <CreditCard className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Frictionless Checkout</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Enable customers to purchase seamlessly, reducing steps and boosting overall conversion rates.
              </p>
            </div>

            {/* Item 6 */}
            <div className="flex flex-col">
              <Package className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Product Bundles</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Scale your revenue seamlessly and maximize average order value by grouping complementary products into irresistible packages.
              </p>
            </div>

            {/* Item 7 */}
            <div className="flex flex-col">
              <Search className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">SEO Optimization</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Climb the search rankings and drive consistent, free organic traffic with built-in tools.
              </p>
            </div>

            {/* Item 8 */}
            <div className="flex flex-col">
              <ShoppingCart className="w-8 h-8 text-slate-800 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">Cart Recovery</h3>
              <p className="text-slate-500 font-normal leading-relaxed text-[15px]">
                Automatically re-engage shoppers who left items behind with targeted, high-converting sequences.
              </p>
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
