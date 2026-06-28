import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getTenantFromHost } from '@/lib/tenant';
import { notFound } from 'next/navigation';

export default async function ThankYouPage(props: { params: Promise<{ domain: string }>; searchParams: Promise<{ name?: string; item?: string }> }) {
  const searchParams = await props.searchParams;
  const { name, item } = searchParams;
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  if (!store) {
    notFound();
  }

  const primaryColor = store?.primary_color || '#f899a2';

  return (
    <div dir={store?.language === 'ar' || store?.store_rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#e8f0ed] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center" style={{ maxWidth: '448px' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ width: '80px', height: '80px', backgroundColor: `${primaryColor}33` }}>
          <CheckCircle2 size={40} color={primaryColor} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4" style={{ fontSize: '30px' }}>Order Confirmed!</h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you{name ? `, ${name}` : ''}! Your order {item ? `for ${item} ` : ''}has been successfully received. 
          <br /><br />
          One of our operators will call you shortly to confirm your details before we ship your package via Cash on Delivery.
        </p>
        
        <Link 
          href="/" 
          className="inline-block text-white font-bold px-8 py-4 rounded-lg text-lg shadow-sm transition-colors w-full text-center hover:opacity-90" 
          style={{ backgroundColor: primaryColor, padding: '16px 32px' }}
        >
          Return to Store
        </Link>
      </div>
    </div>
  );
}
