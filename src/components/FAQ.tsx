import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, UtensilsCrossed, Palette, FileText, Sparkles, ShieldCheck, Leaf, Zap } from 'lucide-react';

const faqs = [
  {
    icon: Sparkles,
    question: 'What is the mandatory floor cleaning fee?',
    answer: 'A mandatory floor cleaning service fee of ₹3,000 is included with every booking. This ensures our dedicated housekeeping staff performs industrial-grade sanitation, deep cleaning, and trash clearance before and immediately after your event so the hall is pristine.',
  },
  {
    icon: Leaf,
    question: 'What is your eco-friendly zero-plastic policy?',
    answer: 'Dream Avenue Event Hall strictly prohibits single-use plastic bottles, disposables, and non-biodegradable decorations. We provide water dispensers and encourage sustainable celebration practices to protect our local environment.',
  },
  {
    icon: UtensilsCrossed,
    question: 'Do you offer sustainable plate rentals?',
    answer: 'Yes! To support zero-plastic dining, we offer high-grade reusable ceramic/melamine plates for rent directly at the venue: Large dining plates at ₹3.50 each and Small dessert/snack plates at ₹2.50 each.',
  },
  {
    icon: Palette,
    question: 'Can we bring external caterers and decorators?',
    answer: 'Absolutely. You are welcome to hire external catering teams and decorators of your choice. Our venue includes a dedicated food preparation area with running water and service counters to assist your culinary team.',
  },
  {
    icon: Zap,
    question: 'Is continuous power backup provided?',
    answer: 'Yes. We operate a heavy-duty industrial generator backup system ensuring zero disruption to lighting, audio staging, and air-conditioning systems throughout your entire event.',
  },
  {
    icon: ShieldCheck,
    question: 'How do I confirm my reservation after booking online?',
    answer: 'Once you submit your booking request online, an instant Digital Booking Pass is generated. You can tap the direct WhatsApp Concierge link to finalize timings, package specifics, and security deposit with our venue manager.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" style={{ background: '#F8F5EF', padding: '100px 24px', borderBottom: '1px solid #E8E3DA' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div 
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#537517',
              marginBottom: '10px',
            }}
          >
            Clear & Transparent
          </div>
          <h2 
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#1B221B',
              margin: '0 0 16px 0',
              fontWeight: 700,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#737E72', fontSize: '1.0625rem', lineHeight: 1.6 }}>
            Everything you need to know about booking, venue guidelines, and transparent inclusions.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: isOpen ? '1px solid #537517' : '1px solid #E8E3DA',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isOpen ? '0 8px 24px rgba(83, 117, 23, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: '100%',
                    padding: '22px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: isOpen ? '#EDF6DE' : '#FAF4EB',
                        color: isOpen ? '#537517' : '#B88B52',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span 
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#1B221B',
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: isOpen ? '#537517' : '#737E72', flexShrink: 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div 
                        style={{
                          padding: '0 24px 22px 74px',
                          color: '#485247',
                          fontSize: '0.9375rem',
                          lineHeight: 1.65,
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}