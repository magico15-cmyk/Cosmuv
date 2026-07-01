import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-slate-900 selection:text-white">
      {/* Premium Minimalist Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/cosmuv-logo.png" alt="Cosmuv" className="h-9 w-auto object-contain" />
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

      {/* Simple Content Section */}
      <section className="pt-36 pb-24 lg:pt-48 lg:pb-32 bg-[#FDFDFD] min-h-[70vh]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-slate-800">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 mb-12">
            About Us
          </h1>
          
          <div className="space-y-8 text-lg leading-relaxed text-slate-600 font-normal">
            <p>
              Cosmuv is a premium, next-generation e-commerce infrastructure built specifically for modern e-commerce professionals and digital marketers in the Cash on Delivery (COD) industry.
            </p>
            <p>
              We are completely redefining the standard by offering unparalleled creative freedom, deep conversion optimization, and robust local delivery tools that allow businesses to build and scale global storefronts without rigid restrictions.
            </p>
            <p>
              For years, e-commerce professionals have been forced into a corner. Traditional platforms offer rigid, cookie-cutter templates that strip away brand identity. Attempting to customize these platforms often requires expensive third-party apps, messy code overrides, and ultimately results in a slow, disjointed storefront.
            </p>
            <p>
              Meanwhile, the Cash on Delivery (COD) industry has been largely ignored. Local delivery tools and high-intent conversion features have been treated as an afterthought. We knew there had to be a better way.
            </p>
            <p>
              Cosmuv breaks these boundaries. We built a platform that combines advanced structural customization with an optimized, lightning-fast architecture. Whether you are a creative brand seeking pixel-perfect design or a professional COD operator focused on high conversion and logistics, Cosmuv provides the definitive solution.
            </p>
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
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
