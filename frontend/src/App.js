import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Components
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/MenuSection";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import OrderModal from "@/components/OrderModal";
import FloatingButtons from "@/components/FloatingButtons";

const Home = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => 
          i.name === item.name 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemName) => {
    setCart(prev => prev.filter(i => i.name !== itemName));
  };

  const updateQuantity = (itemName, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemName);
      return;
    }
    setCart(prev => prev.map(i => 
      i.name === itemName ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen">
      <Navbar 
        onReserveClick={() => setIsReservationOpen(true)}
        onOrderClick={() => setIsOrderOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      
      <main>
        <Hero 
          onReserveClick={() => setIsReservationOpen(true)}
          onOrderClick={() => setIsOrderOpen(true)}
        />
        <About />
        <Menu addToCart={addToCart} />
        <Services />
        <Reviews />
        <Gallery />
        <Contact />
      </main>

      <Footer />

      <FloatingButtons 
        onReserveClick={() => setIsReservationOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsOrderOpen(true)}
      />

      {isReservationOpen && (
        <ReservationModal 
          isOpen={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
        />
      )}

      {isOrderOpen && (
        <OrderModal 
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
