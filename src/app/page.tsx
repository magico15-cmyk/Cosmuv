import { redirect } from 'next/navigation';

export default function RootSelloPage() {
  // The actual storefront is now rendered dynamically via src/app/[domain]/page.tsx
  // If someone hits the absolute root (bypassing middleware), redirect them to the merchant admin panel
  redirect('/admin');
}