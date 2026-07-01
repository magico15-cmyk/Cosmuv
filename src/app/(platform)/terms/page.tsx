import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-slate-900 selection:text-white">
      {/* Premium Minimalist Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/cosmuv-logo.png" alt="Cosmuv" className="h-10 w-auto object-contain" />
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
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 mb-6">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="space-y-8 text-lg leading-relaxed text-slate-600 font-normal">
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Cosmuv platform, website, and services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Services. Cosmuv reserves the right to update or modify these Terms at any time without prior notice, and your continued use of the Services constitutes your acceptance of such changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Services</h2>
              <p>
                Cosmuv provides an e-commerce infrastructure platform that enables merchants to build, customize, and manage online storefronts. The Services include, but are not limited to, website hosting, design templates, local fulfillment tools, Cash on Delivery (COD) management, and other related services. You acknowledge that Cosmuv is a platform provider and is not a party to any transactions between you and your customers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
              <p className="mb-4">
                To access certain features of the Services, you must register for an account. By registering, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during the registration process.</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                <li>Promptly notify us if you discover or suspect any security breaches related to your account.</li>
                <li>Take full responsibility for all activities that occur under your account.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="mb-4">
                You agree not to use the Services in any way that is unlawful, harmful, or violates the rights of others. Specifically, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sell or promote illegal, fraudulent, or strictly regulated products or services.</li>
                <li>Transmit any viruses, malware, or other malicious code.</li>
                <li>Attempt to gain unauthorized access to our systems or networks.</li>
                <li>Infringe upon the intellectual property rights of Cosmuv or any third party.</li>
                <li>Engage in any activity that could disable, overburden, or impair the proper working of the Services.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Fees and Payment</h2>
              <p>
                You agree to pay all applicable fees related to your use of the Services as described on our pricing page or in a separate agreement. Fees are non-refundable except as required by law. We reserve the right to change our pricing upon reasonable notice, which may be communicated via email or posted on our website. Failure to pay fees may result in the suspension or termination of your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
              <p>
                Cosmuv retains all right, title, and interest in and to the Services, including all associated intellectual property rights. You retain all rights to the content, products, and customer data you upload to your storefront. By uploading content, you grant Cosmuv a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content solely for the purpose of operating and providing the Services to you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Termination</h2>
              <p>
                We may suspend or terminate your access to the Services at any time, with or without cause, and without prior notice or liability. You may terminate your account at any time by contacting support. Upon termination, your right to use the Services will immediately cease, and we may delete your account and data in accordance with our data retention policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Cosmuv and its affiliates, directors, employees, or agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Services; (b) any conduct or content of any third party on the Services; or (c) unauthorized access, use, or alteration of your transmissions or content.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Cosmuv operates, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in that jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Information</h2>
              <p>
                If you have any questions or concerns about these Terms of Service, please contact us at legal@cosmuv.com.
              </p>
            </div>
            
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
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-slate-500 text-[14px]">
            <p>© {new Date().getFullYear()} Cosmuv. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
