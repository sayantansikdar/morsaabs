import { motion } from "framer-motion";
import { MapPin, Clock, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = ({ onReserveClick, onOrderClick }) => {
  const scrollToMenu = () => {
    const element = document.querySelector("#menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1621275471769-e6aa344546d5?auto=format&fit=crop&w=1920&q=80"
          alt="Rooftop dining ambience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-white text-sm font-medium">4.8 Rating • 71+ Reviews</span>
          </div>

          {/* Restaurant Name */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="hero-title"
          >
            Morsaab's
          </h1>
          <p 
            className="text-2xl md:text-3xl text-[#D4AF37] mb-4"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            मोरसाब्स
          </p>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            A Complete Destination for Vegetarian Food Lovers
          </p>

          {/* Location & Time */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">Uttam Nagar, New Delhi</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">Opens 8:00 AM</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-[#1A4D2E] hover:bg-[#153d24] text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
              onClick={onReserveClick}
              data-testid="hero-reserve-btn"
            >
              Reserve a Table
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-[#D4AF37] hover:bg-[#c9a432] text-[#1A1A1A] px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
              onClick={onOrderClick}
              data-testid="hero-order-btn"
            >
              Order Online
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-white text-white hover:bg-white hover:text-[#1A4D2E] px-8 py-6 text-lg transition-all duration-300"
              onClick={scrollToMenu}
              data-testid="hero-menu-btn"
            >
              View Menu
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <button 
            onClick={scrollToMenu}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
