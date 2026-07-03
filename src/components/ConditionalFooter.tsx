'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from './Footer';
import FundMeWidget from './FundMeWidget';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const [inSpace, setInSpace] = useState(false);

  useEffect(() => {
    setInSpace(document.cookie.split('; ').some((c) => c === 'space-mode=on'));
  }, []);

  // Don't show footer and widget on fund-kashmir pages
  if (pathname?.startsWith('/fund-kashmir')) {
    return null;
  }

  // Hide the classic footer + fixed fund-me widget inside the space experience (the
  // /space route, or any route with the space-mode cookie) so the widget never floats
  // over the 3D canvas and the footer height doesn't inflate the dive's scroll driver.
  if (pathname === '/space' || inSpace) {
    return null;
  }

  return (
    <>
      <Footer />
      <FundMeWidget />
    </>
  );
}
