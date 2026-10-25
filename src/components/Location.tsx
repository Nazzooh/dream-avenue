import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "../src/constants/contact";

export function Location() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section
      id="location"
      style={{ background: "#FAF8F5", padding: "100px 24px", borderBottom: "1px solid #E8E3DA" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div 
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#537517",
              marginBottom: "10px",
            }}
          >
            Location & Access
          </div>
          <h2 
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#1B221B",
              margin: "0 0 16px 0",
              fontWeight: 700,
            }}
          >
            Visit Dream Avenue Event Hall
          </h2>
          <p style={{ color: "#737E72", fontSize: "1.0625rem", maxWidth: "640px", margin: "0 auto", lineHeight: 1.6 }}>
            Conveniently positioned along the Kozhikode Bypass, easily accessible from Calicut Railway Station and the Calicut International Airport.
          </p>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "36px",
          }}
        >
          {/* Map Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(27, 34, 27, 0.08)",
              height: "460px",
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
              <MapPin size={40} style={{ color: "#537517", marginBottom: "12px" }} />
              <p style={{ color: "#485247", fontWeight: 600 }}>Dream Avenue Event Hall</p>
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
              title="Dream Avenue Event Hall Location"
            />
          </motion.div>

          {/* Contact Information Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Address */}
            <div 
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "30px 24px",
                border: "1px solid #E8E3DA",
                boxShadow: "0 4px 16px rgba(27, 34, 27, 0.04)",
              }}
            >
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
                  marginBottom: "16px",
                }}
              >
                <MapPin size={22} />
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1B221B", marginBottom: "8px" }}>
                Venue Address
              </h4>
              <p style={{ color: "#737E72", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
                {CONTACT_INFO.address.street}<br />
                {CONTACT_INFO.address.area}, {CONTACT_INFO.address.city}<br />
                {CONTACT_INFO.address.state} {CONTACT_INFO.address.pincode}<br />
                <span style={{ fontSize: "0.8125rem", color: "#537517", fontWeight: 600 }}>
                  ({CONTACT_INFO.address.location})
                </span>
              </p>
            </div>

            {/* Phone */}
            <div 
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "30px 24px",
                border: "1px solid #E8E3DA",
                boxShadow: "0 4px 16px rgba(27, 34, 27, 0.04)",
              }}
            >
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
                  marginBottom: "16px",
                }}
              >
                <Phone size={22} />
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1B221B", marginBottom: "8px" }}>
                Hotline & Enquiries
              </h4>
              <div style={{ color: "#737E72", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                <div>Main: <a href={`tel:${CONTACT_INFO.phones.main}`} style={{ color: "#1B221B", fontWeight: 600, textDecoration: "none" }}>{CONTACT_INFO.phones.main}</a></div>
                <div>Booking: <a href={`tel:${CONTACT_INFO.phones.booking}`} style={{ color: "#1B221B", fontWeight: 600, textDecoration: "none" }}>{CONTACT_INFO.phones.booking}</a></div>
                <div style={{ marginTop: "10px" }}>
                  <a
                    href={CONTACT_INFO.links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#537517",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div 
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "30px 24px",
                border: "1px solid #E8E3DA",
                boxShadow: "0 4px 16px rgba(27, 34, 27, 0.04)",
              }}
            >
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
                  marginBottom: "16px",
                }}
              >
                <Mail size={22} />
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1B221B", marginBottom: "8px" }}>
                Email Assistance
              </h4>
              <div style={{ color: "#737E72", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                <div>
                  <a href={`mailto:${CONTACT_INFO.emails.primary}`} style={{ color: "#1B221B", fontWeight: 500, textDecoration: "none" }}>
                    {CONTACT_INFO.emails.primary}
                  </a>
                </div>
                <div>
                  <a href={`mailto:${CONTACT_INFO.emails.secondary}`} style={{ color: "#1B221B", fontWeight: 500, textDecoration: "none" }}>
                    {CONTACT_INFO.emails.secondary}
                  </a>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#737E72", marginTop: "8px" }}>
                  Responses typically within 24 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}