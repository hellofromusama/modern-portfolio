'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import FundMeWidget from './FundMeWidget';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer and widget on fund-kashmir pages
  if (pathname?.startsWith('/fund-kashmir')) {
    return null;
  }

  return (
    <>
      <Footer />
      <FundMeWidget />
    </>
  );
}
