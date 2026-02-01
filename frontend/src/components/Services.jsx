import { motion } from "framer-motion";
import { Utensils, Car, PackageCheck, CloudSun, Users, Sparkles } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Utensils,
      title: "Dine-In",
      description: "Experience our elegant ambience with impeccable table service"
    },
    {
      icon: Car,
      title: "Drive-Through",
      description: "Quick pickup without leaving your vehicle"
    },
    {
      icon: PackageCheck,
      title: "No-Contact Delivery",
      description: "Safe and hygienic delivery to your doorstep"
    },
    {
      icon: CloudSun,
      title: "Rooftop Seating",
      description: "Open-air dining with stunning city views"
    },
    {
      icon: Users,
      title: "Family & Groups",
      description: "Spacious arrangements for celebrations and gatherings"
    },
    {
      icon: Sparkles,
      title: "Premium Sweets",
      description: "Desi ghee sweets made fresh daily"
    }
  ];

  return (
    <section 
      id="services" 
      className="py-20 md:py-28 bg-[#1A4D2E]"
      data-testid="services-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm">
            What We Offer
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="services-title"
          >
            Our Services
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            We go beyond just great food. Experience hospitality that makes every visit memorable.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
              data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/30 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 
                className="text-xl font-semibold text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {service.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
