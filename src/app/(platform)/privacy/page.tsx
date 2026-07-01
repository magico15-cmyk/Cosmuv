import Link from "next/link";

export default function PrivacyPage() {
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

      {/* Simple Content Section */}
      <section className="pt-36 pb-24 lg:pt-48 lg:pb-32 bg-[#FDFDFD] min-h-[70vh]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-slate-800">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="space-y-8 text-lg leading-relaxed text-slate-600 font-normal">
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to Cosmuv. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) or use our e-commerce infrastructure services and tell you about your privacy rights and how the law protects you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. The Data We Collect About You</h2>
              <p className="mb-4">
                Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data). We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Financial Data</strong> includes bank account and payment card details.</li>
                <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How Is Your Personal Data Collected?</h2>
              <p className="mb-4">We use different methods to collect data from and about you including through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Direct interactions.</strong> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise. This includes personal data you provide when you apply for our products or services, create an account on our website, subscribe to our service or publications, request marketing to be sent to you, enter a competition, promotion or survey, or give us feedback or contact us.</li>
                <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using cookies, server logs and other similar technologies.</li>
                <li><strong>Third parties or publicly available sources.</strong> We will receive personal data about you from various third parties and public sources as set out below: Technical Data from analytics providers such as Google, advertising networks, and search information providers.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How We Use Your Personal Data</h2>
              <p className="mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
              <p className="mt-4">
                We use your data to register you as a new customer, process and deliver your orders, manage payments, fees and charges, collect and recover money owed to us, manage our relationship with you, enable you to partake in a prize draw, competition or complete a survey, administer and protect our business and this website, deliver relevant website content and advertisements to you, use data analytics to improve our website, products/services, marketing, customer relationships and experiences, and to make suggestions and recommendations to you about goods or services that may be of interest to you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Disclosures of Your Personal Data</h2>
              <p>
                We may share your personal data with the parties set out below for the purposes set out in Section 4 above.
                We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Your Legal Rights</h2>
              <p className="mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Details</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us by visiting our contact page or emailing support@cosmuv.com.
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
              <Link href="/privacy" className="hover:text-white transition-colors text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
