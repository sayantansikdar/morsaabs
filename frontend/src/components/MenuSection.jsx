import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

export default function MenuSection(props) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API + "/menu")
      .then(res => {
        setCategories(res.data.categories || []);
        if (res.data.categories && res.data.categories.length > 0) {
          setActiveCategory(res.data.categories[0].name);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getActiveItems = () => {
    const cat = categories.find(c => c.name === activeCategory);
    return cat ? cat.items : [];
  };

  const handleAdd = (item) => {
    props.addToCart({ name: item.name, price: item.price, category: activeCategory });
    toast.success(item.name + " added!");
  };

  const getImg = () => {
    const imgs = {
      Starters: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
      "Main Course": "https://images.unsplash.com/photo-1653543362907-b9e87d2be5db?w=400",
      "South Indian": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
      Chinese: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
      Pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      Pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
      Beverages: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
      Desserts: "https://images.unsplash.com/photo-1681476747916-8a8fc7e2001e?w=400",
      Thali: "https://images.unsplash.com/photo-1742281257687-092746ad6021?w=400"
    };
    return imgs[activeCategory] || imgs["Main Course"];
  };

  return (
    <section id="menu" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-yellow-600 font-medium tracking-widest uppercase text-sm">Explore Our</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4" style={{ fontFamily: "Playfair Display, serif" }}>Curated Menu</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">From authentic North Indian delicacies to global favorites.</p>
        </div>

        <div className="mb-10 overflow-x-auto pb-4">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-full gap-1 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={activeCategory === cat.name 
                  ? "px-5 py-2.5 rounded-full text-sm font-medium bg-green-800 text-white"
                  : "px-5 py-2.5 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200"
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getActiveItems().map(item => (
            <div key={item.name} className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={getImg()} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <Button 
                  size="sm" 
                  className="absolute bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => handleAdd(item)}
                >
                  <Plus className="w-4 h-4 mr-1" />Add
                </Button>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                  <span className="text-green-700 font-bold text-lg">₹{item.price}</span>
                </div>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {loading && <div className="text-center py-12"><p className="text-gray-500">Loading menu...</p></div>}
      </div>
    </section>
  );
}
