import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getPublishedPolicy, type PolicyVersion } from '@/api/policies';
import { INITIAL_POLICY_SECTIONS, type PolicySection } from '@/lib/policies';
import { usePublicPreferences } from '@/context/PublicPreferences';
import { CONTACT_INFO } from '@/constants/contact';

const bookingEssentials = ['Pay the remaining rent and ₹25,000 security deposit one day before your event.', 'Advance payments are non-refundable.', 'No plastic glasses or plates, food in the function hall, or firecrackers in the compound.', 'Sound programmes and music festivals must finish by 10 pm.'];

export default function TermsAndConditions() {
  const navigate = useNavigate(); const { theme } = usePublicPreferences();
  const [sections, setSections] = useState<PolicySection[]>(INITIAL_POLICY_SECTIONS); const [version, setVersion] = useState<PolicyVersion | null>(null);
  useEffect(() => { void getPublishedPolicy().then(({ version: nextVersion, sections: nextSections }) => { setVersion(nextVersion); setSections(nextSections); }); }, []);
  return <div className="editorial-page public-theme policy-page" data-public-theme={theme}><SEOHead title="Terms & Venue Guidelines | Dream Avenue Event Hall" description="Read Dream Avenue Event Hall booking, safety, catering, parking, and venue-use guidelines before reserving your event." url="https://dream-avenue.in/terms-and-conditions" /><Navbar />
    <main className="policy-main"><header className="policy-hero"><div><p className="policy-kicker">Dream Avenue Event Hall</p><h1>Clear terms for a well-run celebration.</h1><p>Everything your family, planner, and caterer need to know before event day—set out plainly so everyone arrives prepared.</p><div className="policy-hero-actions"><button onClick={() => navigate('/booking')}>Start a reservation <ArrowRight size={17} /></button><a href={CONTACT_INFO.links.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ask the concierge</a></div></div><aside><ShieldCheck size={25} /><strong>Read before you book</strong><span>These rules apply to every confirmed Dream Avenue reservation.</span>{version?.effective_date && <small>Effective {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(version.effective_date))}</small>}</aside></header>
      <section className="policy-essentials" aria-labelledby="policy-essentials-title"><div><p className="policy-kicker">The essentials</p><h2 id="policy-essentials-title">Four things to plan for first</h2></div><ul>{bookingEssentials.map(item => <li key={item}><CheckCircle2 size={18} />{item}</li>)}</ul></section>
      <div className="policy-layout"><nav className="policy-jump-nav" aria-label="Policy sections"><strong>On this page</strong>{sections.map(section => <a key={section.slug} href={`#${section.slug}`}>{section.title}</a>)}</nav><div className="policy-sections">{sections.map(section => <section id={section.slug} key={section.slug} className="policy-section"><h2>{section.title}</h2><ol>{section.rules.map(rule => <li key={rule.id || rule.title}><h3>{rule.title}</h3><p>{rule.body}</p></li>)}</ol></section>)}</div></div>
      <section className="policy-closing"><div><h2>Need help applying a rule to your event?</h2><p>Speak with the venue concierge before finalising catering, sound, parking, or setup arrangements.</p></div><div><a href={CONTACT_INFO.links.whatsapp} target="_blank" rel="noreferrer">WhatsApp concierge</a><Link to="/booking">Continue to booking</Link></div></section>
    </main><Footer /></div>;
}
