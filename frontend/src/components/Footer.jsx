import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#1A4D2E] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Morsaab's
            </h3>
            <p className="text-[#D4AF37] text-lg mb-4" style={{ fontFamily: "'Great Vibes', cursive" }}>
              मोरसाब्स
            </p>
            <p className="text-white/70 leading-relaxed mb-6">
              Premium vegetarian dining experience with authentic Indian taste and warm hospitality.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/morsaabs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                data-testid="footer-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/morsaabs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                data-testid="footer-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="text-white/70 hover:text-[#D4AF37] transition-colors duration-300"
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  I-47 & 48, Mohan Garden Extension, Uttam Nagar, New Delhi – 110059
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href="tel:+919211997724" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  +91 92119 97724
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-white/70">Opens 8:00 AM Daily</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex justify-between text-white/70">
                <span>Monday - Friday</span>
                <span>8 AM - 11 PM</span>
              </li>
              <li className="flex justify-between text-white/70">
                <span>Saturday</span>
                <span>8 AM - 12 AM</span>
              </li>
              <li className="flex justify-between text-white/70">
                <span>Sunday</span>
                <span>8 AM - 11 PM</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-[#D4AF37] text-sm font-medium">Special Events?</p>
              <p className="text-white/60 text-sm">We accommodate private parties and celebrations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} Morsaab's. All rights reserved.
            </p>
            <p className="text-white/50 text-sm">
              Made with ❤️ for food lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
