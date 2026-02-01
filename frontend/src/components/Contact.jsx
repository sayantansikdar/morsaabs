import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent successfully!", {
        description: "We'll get back to you soon."
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "I-47 & 48, Mohan Garden Extension, Block-I, Gali No. 4, Rama Park Road, Uttam Nagar, New Delhi – 110059",
      action: {
        label: "Get Directions",
        href: "https://www.google.com/maps/place/Morsaab's/@28.6182658,77.0449321,15z"
      }
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 92119 97724",
      action: {
        label: "Call Now",
        href: "tel:+919211997724"
      }
    },
    {
      icon: Clock,
      title: "Opening Hours",
      content: "Opens at 8:00 AM",
      subContent: "Monday - Sunday"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@morsaabs.com",
      action: {
        label: "Send Email",
        href: "mailto:info@morsaabs.com"
      }
    }
  ];

  return (
    <section 
      id="contact" 
      className="py-20 md:py-28 bg-[#FDFBF7]"
      data-testid="contact-section"
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
            Get in Touch
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="contact-title"
          >
            Visit Us Today
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Stop by for a meal or reach out with any questions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-8" data-testid="google-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.7897!2d77.0367727!3d28.6244466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05d3521db1bf%3A0xbf86e89a4a8461eb!2sMorsaab&#39;s!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Morsaab's Location"
              ></iframe>
            </div>

            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                  data-testid={`contact-info-${info.title.toLowerCase()}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1A4D2E]/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-[#1A4D2E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2D2D2D] mb-1">{info.title}</h3>
                      <p className="text-[#64748B] text-sm break-words">{info.content}</p>
                      {info.subContent && (
                        <p className="text-[#64748B] text-sm">{info.subContent}</p>
                      )}
                      {info.action && (
                        <a
                          href={info.action.href}
                          target={info.action.href.startsWith("http") ? "_blank" : undefined}
                          rel={info.action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1 text-[#1A4D2E] text-sm font-medium mt-2 hover:text-[#D4AF37] transition-colors"
                        >
                          {info.action.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <h3 
              className="text-2xl font-bold text-[#2D2D2D] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-lg border-gray-200 focus:border-[#1A4D2E] focus:ring-[#1A4D2E]"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-lg border-gray-200 focus:border-[#1A4D2E] focus:ring-[#1A4D2E]"
                    data-testid="contact-email-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Phone (Optional)</label>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-lg border-gray-200 focus:border-[#1A4D2E] focus:ring-[#1A4D2E]"
                  data-testid="contact-phone-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Message</label>
                <Textarea
                  placeholder="How can we help you?"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="rounded-lg border-gray-200 focus:border-[#1A4D2E] focus:ring-[#1A4D2E] resize-none"
                  data-testid="contact-message-input"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#1A4D2E] hover:bg-[#153d24] text-white py-6 text-lg transition-all duration-300"
                data-testid="contact-submit-btn"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
