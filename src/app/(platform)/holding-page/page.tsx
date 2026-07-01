import Link from "next/link";
import { Clock } from "lucide-react";

export default function HoldingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="mx-auto w-full max-w-[480px]">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">
              Cosmuv<span className="text-cyan-400">.</span>
            </h1>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white py-12 px-6 sm:px-10 shadow-sm border border-gray-100 rounded-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50">
            <Clock className="w-8 h-8" />
          </div>
          
          <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
            Your application is under review
          </h2>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-[320px] mx-auto mb-8">
            We are currently reviewing your store details. We will activate your store soon! Keep an eye on your inbox.
          </p>

          <Link
            href="/"
            className="w-full flex items-center justify-center py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[15px] transition-all shadow-sm active:scale-[0.98]"
          >
            Return to Homepage
          </Link>
        </div>
        
      </div>
    </div>
  );
}
