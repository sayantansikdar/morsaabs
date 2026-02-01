import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, MapPin, Phone, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

export default function OrderModal({ isOpen, onClose, cart, updateQuantity, removeFromCart, clearCart }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("delivery");
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: ""
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === "delivery" ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (orderType === "delivery" && !formData.address) {
      toast.error("Please provide delivery address");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        total: total,
        order_type: orderType,
        address: orderType === "delivery" ? formData.address : null
      };

      await axios.post(API + "/orders", orderData);
      
      const itemsList = cart.map(item => "• " + item.name + " x" + item.quantity + " - ₹" + (item.price * item.quantity)).join("\n");
      const whatsappMessage = encodeURIComponent(
        "🍽️ *New Order from Morsaab's Website*\n\n*Name:* " + formData.customer_name + "\n*Phone:* " + formData.phone + "\n*Order Type:* " + (orderType === "delivery" ? "Delivery" : "Pickup") + (orderType === "delivery" ? "\n*Address:* " + formData.address : "") + "\n\n*Items:*\n" + itemsList + "\n\n*Subtotal:* ₹" + subtotal + (orderType === "delivery" ? "\n*Delivery:* ₹" + deliveryFee : "") + "\n*Total:* ₹" + total
      );
      
      window.open("https://wa.me/919211997724?text=" + whatsappMessage, "_blank");
      
      toast.success("Order placed successfully!", {
        description: "You'll receive confirmation on WhatsApp"
      });
      
      clearCart();
      onClose();
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white p-0">
        <div className="bg-yellow-500 text-black p-6 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: "Playfair Display, serif" }}>
              <ShoppingBag className="w-6 h-6" />
              Your Order
            </DialogTitle>
            <p className="text-black/70 mt-2">
              {cart.length} item{cart.length !== 1 ? "s" : ""} in cart
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-500 text-sm mt-2">Add items from our menu to get started</p>
              <Button onClick={onClose} className="mt-6 rounded-full bg-green-800 hover:bg-green-900">
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white rounded-full border px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.name, item.quantity - 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.name, item.quantity + 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="w-16 text-right font-semibold text-green-700">
                            ₹{item.price * item.quantity}
                          </span>
                          <button onClick={() => removeFromCart(item.name)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <p className="font-medium text-gray-800 mb-3">Order Type</p>
                    <RadioGroup value={orderType} onValueChange={setOrderType} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="cursor-pointer">Delivery (+₹40)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="cursor-pointer">Pickup</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {orderType === "delivery" && (
                      <div className="flex justify-between text-gray-500">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
                      <span>Total</span>
                      <span className="text-green-700">₹{total}</span>
                    </div>
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full rounded-full bg-green-800 hover:bg-green-900 py-6">
                    Proceed to Checkout
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                      <User className="w-4 h-4 text-yellow-600" />
                      Full Name *
                    </label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.customer_name}
                      onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                      <Phone className="w-4 h-4 text-yellow-600" />
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>

                  {orderType === "delivery" && (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                        <MapPin className="w-4 h-4 text-yellow-600" />
                        Delivery Address *
                      </label>
                      <Textarea
                        placeholder="Enter your full address"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="rounded-lg resize-none"
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-2">Order Summary</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      {cart.map(item => (
                        <p key={item.name}>{item.name} x{item.quantity}</p>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-800 pt-3 mt-3 border-t">
                      <span>Total</span>
                      <span className="text-green-700">₹{total}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-full">
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {loading ? "Placing Order..." : "Order via WhatsApp"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
