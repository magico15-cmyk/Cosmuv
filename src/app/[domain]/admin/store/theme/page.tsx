import { getTenantFromHost } from '@/lib/tenant';
import { notFound } from 'next/navigation';
import ThemeClient from './ThemeClient';

export default async function ThemePage({ params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  const store = await getTenantFromHost(resolvedParams.domain);
  
  if (!store) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-[calc(100vh-80px)]">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Theme Settings</h2>
      <ThemeClient store={store} />
    </div>
  );
}
