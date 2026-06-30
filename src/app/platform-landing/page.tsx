import Link from "next/link";
import { CheckCircle2, ShoppingBag, BarChart3, CreditCard, LayoutTemplate } from "lucide-react";

export default function PlatformLandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Left Links */}
            <div className="flex items-center gap-10">
              <Link href="/" className="text-2xl font-black tracking-tighter text-[#e8006e]">
                Cosmuv.
              </Link>
              <div className="hidden md:flex gap-8">
                <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Features
                </Link>
                <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
              </div>
            </div>

            {/* Right Auth Links */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hidden sm:block"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-white bg-[#e8006e] hover:bg-[#cc0061] px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#e8006e]/20"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
                Selling online has never been easier
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Start your online store in a few clicks and take advantage of our powerful e-commerce tools to build a profitable business from day one.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Easy and intuitive store setup",
                  "No charge until you succeed",
                  "All the e-commerce tools you need in one place"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className="inline-flex items-center justify-center text-base font-semibold text-white bg-[#e8006e] hover:bg-[#cc0061] px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#e8006e]/30 hover:-translate-y-0.5"
              >
                Get Started for Free
              </Link>
            </div>

            {/* Hero Mockup */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-gray-50 border border-gray-100 shadow-2xl p-2 aspect-[4/3] overflow-hidden">
                {/* Decorative Window Controls */}
                <div className="absolute top-4 left-4 flex gap-1.5 z-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                
                {/* Placeholder Mockup Image (can be replaced with actual dashboard screenshot) */}
                <div className="w-full h-full bg-white rounded-xl border border-gray-100 overflow-hidden relative mt-6 flex flex-col">
                  {/* Mock Navbar */}
                  <div className="h-12 border-b border-gray-100 flex items-center px-6">
                    <div className="w-24 h-4 bg-gray-100 rounded-full"></div>
                  </div>
                  {/* Mock Dashboard Body */}
                  <div className="flex-1 p-6 flex gap-6">
                    {/* Sidebar */}
                    <div className="w-32 flex flex-col gap-3">
                      <div className="w-full h-8 bg-gray-100 rounded-md"></div>
                      <div className="w-3/4 h-8 bg-gray-50 rounded-md"></div>
                      <div className="w-5/6 h-8 bg-gray-50 rounded-md"></div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* Stats row */}
                      <div className="flex gap-4">
                        <div className="flex-1 h-24 bg-pink-50 rounded-lg border border-pink-100 flex flex-col justify-center px-4">
                           <div className="w-16 h-3 bg-pink-200 rounded-full mb-3"></div>
                           <div className="w-24 h-6 bg-[#e8006e] rounded-full opacity-80"></div>
                        </div>
                        <div className="flex-1 h-24 bg-gray-50 rounded-lg border border-gray-100"></div>
                      </div>
                      {/* Chart area */}
                      <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Payments</p>
                  <p className="text-sm font-bold text-gray-900">Stripe & COD</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center divide-x divide-gray-200">
            <div>
              <p className="text-4xl font-black text-gray-900 mb-2">+400K</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Stores</p>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 mb-2">+166</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Served Countries</p>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 mb-2">+20%</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#e8006e] mb-16">How does it work?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: LayoutTemplate,
                title: "Create your store",
                desc: "Choose from our beautiful themes and customize your brand instantly."
              },
              {
                icon: ShoppingBag,
                title: "Add your products",
                desc: "Easily upload products, set prices, and manage your inventory."
              },
              {
                icon: CreditCard,
                title: "Accept payments",
                desc: "Integrate with local and global payment gateways in one click."
              },
              {
                icon: BarChart3,
                title: "Track your growth",
                desc: "Monitor your sales and optimize with built-in analytics tools."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-[#e8006e]">
                  <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Footer */}
      <section className="bg-gray-900 py-20 text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to launch your business?</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join thousands of merchants already building their dreams on Cosmuv.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center text-base font-semibold text-gray-900 bg-white hover:bg-gray-100 px-8 py-4 rounded-xl transition-all shadow-lg"
        >
          Create Your Store Now
        </Link>
      </section>
    </div>
  );
}
