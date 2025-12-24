import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'dream-avenue-cookie-consent';
const GA_ID = 'G-HTHJL3BEBY';

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem(CONSENT_KEY);

        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => setShowBanner(true), 1000);
        } else if (consent === 'accepted') {
            // User previously accepted, load analytics
            loadGoogleAnalytics();
        }
    }, []);

    const loadGoogleAnalytics = () => {
        // Load gtag.js script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        // Initialize gtag
        script.onload = () => {
            (window as any).dataLayer = (window as any).dataLayer || [];
            function gtag(...args: any[]) {
                (window as any).dataLayer.push(args);
            }
            gtag('js', new Date());
            gtag('config', GA_ID);
            (window as any).gtag = gtag;
        };
    };

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        loadGoogleAnalytics();
        setShowBanner(false);
    };

    const handleReject = () => {
        localStorage.setItem(CONSENT_KEY, 'rejected');
        setShowBanner(false);
    };

    const handleAnalyticsOnly = () => {
        localStorage.setItem(CONSENT_KEY, 'analytics-only');
        loadGoogleAnalytics();
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderTop: '1px solid rgba(200, 212, 107, 0.3)',
                        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                        alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
                        gap: '20px',
                        justifyContent: 'space-between',
                    }}>
                        {/* Content */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
                            flex: 1,
                        }}>
                            <Cookie size={24} style={{ color: '#C8D46B', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '700',
                                    color: '#FAF9F6',
                                    margin: '0 0 8px 0',
                                }}>
                                    Cookie Consent
                                </h3>
                                <p style={{
                                    fontSize: '0.9375rem',
                                    color: 'rgba(250, 249, 246, 0.8)',
                                    margin: 0,
                                    lineHeight: '1.6',
                                }}>
                                    We use cookies to enhance your experience and analyze site traffic. You can choose to accept all cookies, only analytics cookies, or reject all.
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            alignItems: 'center',
                        }}>
                            <button
                                onClick={handleReject}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(250, 249, 246, 0.1)',
                                    color: '#FAF9F6',
                                    border: '1px solid rgba(250, 249, 246, 0.2)',
                                    borderRadius: '8px',
                                    fontSize: '0.9375rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(250, 249, 246, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(250, 249, 246, 0.1)';
                                }}
                            >
                                Reject
                            </button>

                            <button
                                onClick={handleAnalyticsOnly}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(200, 212, 107, 0.15)',
                                    color: '#C8D46B',
                                    border: '1px solid rgba(200, 212, 107, 0.3)',
                                    borderRadius: '8px',
                                    fontSize: '0.9375rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(200, 212, 107, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(200, 212, 107, 0.15)';
                                }}
                            >
                                Analytics Only
                            </button>

                            <button
                                onClick={handleAccept}
                                style={{
                                    padding: '10px 24px',
                                    background: 'linear-gradient(135deg, #C8D46B 0%, #B6C55E 100%)',
                                    color: '#1A1A1A',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9375rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(200, 212, 107, 0.3)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(200, 212, 107, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(200, 212, 107, 0.3)';
                                }}
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Export function to revoke consent
export function revokeConsent() {
    localStorage.removeItem(CONSENT_KEY);

    // Disable Google Analytics
    (window as any)[`ga-disable-${GA_ID}`] = true;

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
        document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Reload page to reset
    window.location.reload();
}
