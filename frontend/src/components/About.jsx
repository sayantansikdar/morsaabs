import { motion } from "framer-motion";
import { Award, Leaf, Coffee, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Leaf,
      title: "100% Vegetarian",
      description: "Authentic vegetarian cuisine crafted with fresh ingredients"
    },
    {
      icon: Award,
      title: "Desi Ghee Sweets",
      description: "Premium sweets made with pure desi ghee"
    },
    {
      icon: Coffee,
      title: "Rooftop Café",
      description: "Relaxing ambience with stunning views"
    },
    {
      icon: Users,
      title: "Family Friendly",
      description: "Perfect setting for family gatherings"
    }
  ];

  return (
    <section 
      id="about" 
      className="py-20 md:py-28 bg-[#FDFBF7]"
      data-testid="about-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1655140026236-9292f2d3d3c6?auto=format&fit=crop&w=800&q=80"
                alt="Restaurant interior"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#1A4D2E] text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>4.8</p>
              <p className="text-sm text-white/80">Google Rating</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm">
              Welcome to
            </span>
            <h2 
              className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
              data-testid="about-title"
            >
              Morsaab's
            </h2>
            <p className="text-[#64748B] text-lg leading-relaxed mb-8">
              Nestled in the heart of Uttam Nagar, Morsaab's is a newly opened culinary gem 
              offering an exceptional vegetarian dining experience. Our rooftop café provides 
              the perfect ambience for both intimate dinners and joyful family gatherings.
            </p>
            <p className="text-[#64748B] text-lg leading-relaxed mb-8">
              From authentic North Indian delicacies to delectable sweets made with pure 
              desi ghee, every dish at Morsaab's is crafted with love and the finest ingredients. 
              Experience premium vegetarian dining with warm hospitality.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1A4D2E]/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#1A4D2E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D2D2D]">{feature.title}</h3>
                    <p className="text-sm text-[#64748B]">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
