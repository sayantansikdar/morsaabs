import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1621275471769-e6aa344546d5?auto=format&fit=crop&w=800&q=80",
      alt: "Rooftop seating at evening",
      span: "col-span-2 row-span-2"
    },
    {
      url: "https://images.unsplash.com/photo-1742281257687-092746ad6021?auto=format&fit=crop&w=600&q=80",
      alt: "Premium Thali",
      span: "col-span-1 row-span-1"
    },
    {
      url: "https://images.unsplash.com/photo-1653543362907-b9e87d2be5db?auto=format&fit=crop&w=600&q=80",
      alt: "Paneer Butter Masala",
      span: "col-span-1 row-span-1"
    },
    {
      url: "https://images.unsplash.com/photo-1655140026236-9292f2d3d3c6?auto=format&fit=crop&w=600&q=80",
      alt: "Restaurant interior",
      span: "col-span-1 row-span-1"
    },
    {
      url: "https://images.unsplash.com/photo-1681476747916-8a8fc7e2001e?auto=format&fit=crop&w=600&q=80",
      alt: "Desserts",
      span: "col-span-1 row-span-1"
    },
    {
      url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
      alt: "Fresh Pizza",
      span: "col-span-1 row-span-1"
    },
    {
      url: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80",
      alt: "South Indian Dosa",
      span: "col-span-1 row-span-1"
    }
  ];

  return (
    <section 
      id="gallery" 
      className="py-20 md:py-28 bg-white"
      data-testid="gallery-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm">
            Visual Journey
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="gallery-title"
          >
            Our Gallery
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Take a glimpse into our culinary world - from our cozy interiors to our beautifully plated dishes.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${image.span} relative rounded-xl overflow-hidden cursor-pointer group`}
              onClick={() => setSelectedImage(image)}
              data-testid={`gallery-image-${index}`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ minHeight: index === 0 ? "400px" : "200px" }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-start p-4">
                <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  {image.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  data-testid="gallery-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg font-medium">{selectedImage.alt}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
