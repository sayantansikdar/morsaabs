import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ShoppingBag, Phone, ArrowUp } from "lucide-react";

const FloatingButtons = ({ onReserveClick, cartCount, onCartClick }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" data-testid="floating-buttons">
      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
            data-testid="scroll-to-top-btn"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Call Button */}
      <motion.a
        href="tel:+919211997724"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        data-testid="call-btn"
      >
        <Phone className="w-5 h-5" />
      </motion.a>

      {/* Cart Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onCartClick}
        className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#1A1A1A] flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative"
        data-testid="floating-cart-btn"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E85D04] text-white text-xs rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </motion.button>

      {/* Reserve Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onReserveClick}
        className="w-14 h-14 rounded-full bg-[#1A4D2E] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        data-testid="floating-reserve-btn"
      >
        <CalendarDays className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default FloatingButtons;
