import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT_INFO } from "../src/constants/contact";

export function Location() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section
      id="location"
      style={{ 
        background: "#FAF8F5", 
        padding: "90px 24px 70px 24px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#537517",
              marginBottom: "10px",
            }}
          >
            <MapPin size={14} style={{ color: "#537517" }} />
            <span>Location & Direct Access</span>
          </div>
          <h2 
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.1rem, 4.2vw, 3.2rem)",
              color: "#1B221B",
              margin: "0 0 14px 0",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Visit Dream Avenue Event Hall
          </h2>
          <p style={{ color: "#737E72", fontSize: "1rem", maxWidth: "660px", margin: "0 auto", lineHeight: 1.6 }}>
            Conveniently situated along the Kozhikode Bypass at Karuvanthiruthy, easily accessible from Calicut Railway Station and the Calicut International Airport.
          </p>
        </div>

        {/* Content Layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {/* Interactive Google Map Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(27, 34, 27, 0.07)",
              height: "440px",
              position: "relative",
              background: "#F4EFEB",
              border: "1px solid #E8E3DA",
            }}
          >
            {/* Fallback Background Layer */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#F8F5EF",
              zIndex: 1,
            }}>
              <MapPin size={38} style={{ color: "#537517", marginBottom: "12px" }} />
              <p style={{ color: "#485247", fontWeight: 600, margin: 0 }}>Dream Avenue Event Hall</p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Dream+Avenue,Feroke+Road,Karuvanthiruthy,Kozhikode,Kerala+673631"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: "12px",
                  padding: "10px 20px",
                  background: "#537517",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  boxShadow: "0 4px 12px rgba(83, 117, 23, 0.25)"
                }}
              >
                Get Driving Directions
              </a>
            </div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8016292.720918528!2d66.59544827499997!3d11.172420200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba651e030f76fb1%3A0xa1febc6ea2f8753d!2sDream%20Avenue!5e0!3m2!1sen!2sin!4v1773984720044!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                position: "relative", 
                zIndex: 2,
                opacity: mapLoaded ? 1 : 0,
                transition: "opacity 0.5s ease"
              }}
              allowFullScreen
              loading="lazy"
              onLoad={() => setMapLoaded(true)}
              referrerPolicy="no-referrer-when-downgrade"
              title="Dream Avenue Event Hall Location Map"
            />
          </motion.div>

          {/* Three Key Contact Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card 1: Address */}
            <div 
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "32px 26px",
                border: "1px solid #E8E3DA",
                boxShadow: "0 4px 16px rgba(27, 34, 27, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              <div>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#FAF4EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#B88B52",
                    marginBottom: "18px",
                  }}
                >
                  <MapPin size={22} />
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1B221B", marginBottom: "8px" }}>
                  Venue Address
                </h4>
                <p style={{ color: "#737E72", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
                  {CONTACT_INFO.address.street}<br />
                  {CONTACT_INFO.address.area}, {CONTACT_INFO.address.city}<br />
                  {CONTACT_INFO.address.state} &ndash; {CONTACT_INFO.address.pincode}<br />
                  <span style={{ fontSize: "0.8125rem", color: "#537517", fontWeight: 600, display: "inline-block", marginTop: "4px" }}>
                    Landmark: Near Punchiri Bus Stop
                  </span>
                </p>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #F0EBE2" }}>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Dream+Avenue,Feroke+Road,Karuvanthiruthy,Kozhikode,Kerala+673631"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#537517",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  <span>Open in Google Maps</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: Phone & WhatsApp */}
            <div 
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "32px 26px",
                border: "1px solid #E8E3DA",
                boxShadow: "0 4px 16px rgba(27, 34, 27, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              <div>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#EDF6DE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#537517",
                    marginBottom: "18px",
                  }}
                >
                  <Phone size={22} />
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1B221B", marginBottom: "8px" }}>
                  Hotline & Enquiries
                </h4>
                <div style={{ color: "#737E72", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  <div>Main: <a href={`tel:${CONTACT_INFO.phones.main}`} style={{ color: "#1B221B", fontWeight: 600, textDecoration: "none" }}>{CONTACT_INFO.phones.main}</a></div>
                  <div>Booking: <a href={`tel:${CONTACT_INFO.phones.booking}`} style={{ color: "#1B221B", fontWeight: 600, textDecoration: "none" }}>{CONTACT_INFO.phones.booking}</a></div>
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #F0EBE2" }}>
                <a
                  href={CONTACT_INFO.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#537517",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Concierge Desk</span>
                </a>
              </div>
            </div>

            {/* Card 3: Email & Desk Hours */}
            <div 
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "32px 26px",
                border: "1px solid #E8E3DA",
                boxShadow: "0 4px 16px rgba(27, 34, 27, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              <div>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#FAF4EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#B88B52",
                    marginBottom: "18px",
                  }}
                >
                  <Mail size={22} />
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1B221B", marginBottom: "8px" }}>
                  Email & Office Desk
                </h4>
                <div style={{ color: "#737E72", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  <div>
                    <a href={`mailto:${CONTACT_INFO.emails.primary}`} style={{ color: "#1B221B", fontWeight: 600, textDecoration: "none" }}>
                      {CONTACT_INFO.emails.primary}
                    </a>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#737E72", marginTop: "4px" }}>
                    Replies within 24 hours
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #F0EBE2", display: "flex", alignItems: "center", gap: "6px", color: "#537517", fontSize: "0.8125rem", fontWeight: 600 }}>
                <Clock size={14} />
                <span>Hours: 9:00 AM &ndash; 8:00 PM (Daily)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
