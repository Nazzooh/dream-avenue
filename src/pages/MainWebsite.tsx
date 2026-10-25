import { motion } from 'motion/react';
import React, { Suspense, lazy } from 'react';
import { SEOHead } from '../components/SEOHead';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Stats } from '../components/Stats';

// Lazy load below-the-fold sections for optimized performance
const Packages = lazy(() => import('../components/Packages').then(m => ({ default: m.Packages })));
const Facilities = lazy(() => import('../components/Facilities').then(m => ({ default: m.Facilities })));
const Gallery = lazy(() => import('../components/Gallery').then(m => ({ default: m.Gallery })));
const Events = lazy(() => import('../components/Events').then(m => ({ default: m.Events })));
const FAQ = lazy(() => import('../components/FAQ').then(m => ({ default: m.FAQ })));
const Location = lazy(() => import('../components/Location').then(m => ({ default: m.Location })));
const Footer = lazy(() => import('../components/Footer').then(m => ({ default: m.Footer })));

const SectionLoader = () => (
  <div className="w-full py-20 flex justify-center items-center" style={{ minHeight: '300px' }}>
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 rounded-full"
      style={{ border: '3px solid #537517', borderTopColor: 'transparent' }}
    />
  </div>
);

export function MainWebsite() {
  return (
    <div className="editorial-page min-h-screen" style={{ background: '#FAF8F5', color: '#1B221B' }}>
      {/* SEO Meta Tags */}
      <SEOHead />

      {/* Critical above-the-fold content */}
      <Navbar />
      <Hero />
      <Stats />

      {/* Below-the-fold sections */}
      <Suspense fallback={<SectionLoader />}>
        <Facilities />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Packages />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Events />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Gallery />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Location />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
}