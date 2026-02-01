import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ onReserveClick, onOrderClick, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
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
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#FDFBF7]/95 backdrop-blur-md shadow-lg py-3" 
          : "bg-transparent py-5"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollToSection("#home"); }}
            className="flex flex-col"
            data-testid="navbar-logo"
          >
            <span 
              className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                isScrolled ? "text-[#1A4D2E]" : "text-white"
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Morsaab's
            </span>
            <span 
              className={`text-sm transition-colors duration-300 ${
                isScrolled ? "text-[#D4AF37]" : "text-[#D4AF37]"
              }`}
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              मोरसाब्स
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className={`font-medium transition-colors duration-300 hover:text-[#D4AF37] ${
                  isScrolled ? "text-[#2D2D2D]" : "text-white"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              className={`rounded-full border-2 transition-all duration-300 ${
                isScrolled 
                  ? "border-[#1A4D2E] text-[#1A4D2E] hover:bg-[#1A4D2E] hover:text-white" 
                  : "border-white text-white hover:bg-white hover:text-[#1A4D2E]"
              }`}
              onClick={onReserveClick}
              data-testid="nav-reserve-btn"
            >
              Reserve Table
            </Button>
            <Button
              className="rounded-full bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#c9a432] relative"
              onClick={onOrderClick}
              data-testid="nav-order-btn"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Order
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E85D04] text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-[#1A4D2E]" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-[#1A4D2E]" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg"
            data-testid="mobile-menu"
          >
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="py-3 px-4 text-[#2D2D2D] font-medium hover:text-[#1A4D2E] hover:bg-gray-50 rounded-lg"
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="rounded-full border-2 border-[#1A4D2E] text-[#1A4D2E]"
                  onClick={() => { onReserveClick(); setIsMobileMenuOpen(false); }}
                  data-testid="mobile-reserve-btn"
                >
                  Reserve Table
                </Button>
                <Button
                  className="rounded-full bg-[#D4AF37] text-[#1A1A1A]"
                  onClick={() => { onOrderClick(); setIsMobileMenuOpen(false); }}
                  data-testid="mobile-order-btn"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order {cartCount > 0 && `(${cartCount})`}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
