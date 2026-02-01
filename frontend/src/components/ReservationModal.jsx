import { useState } from "react";
import { CalendarDays, Clock, Users, Phone, User, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { format, isBefore, startOfDay } from "date-fns";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

export default function ReservationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(undefined);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    guests: 2,
    special_requests: ""
  });

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
    "8:00 PM", "9:00 PM", "10:00 PM"
  ];

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleSubmit = async () => {
    if (!date || !formData.time || !formData.name || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API + "/reservations", {
        ...formData,
        date: format(date, "yyyy-MM-dd")
      });
      toast.success("Reservation confirmed!", {
        description: "Table for " + formData.guests + " on " + format(date, "PPP") + " at " + formData.time
      });
      
      const whatsappMessage = encodeURIComponent(
        "Hi Morsaab's! I'd like to confirm my reservation:\n\nName: " + formData.name + "\nDate: " + format(date, "PPP") + "\nTime: " + formData.time + "\nGuests: " + formData.guests + (formData.special_requests ? "\nSpecial Requests: " + formData.special_requests : "")
      );
      window.open("https://wa.me/919211997724?text=" + whatsappMessage, "_blank");
      
      onClose();
    } catch (error) {
      toast.error("Failed to make reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (d) => {
    return isBefore(d, startOfDay(new Date()));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white p-0">
        <div className="bg-green-800 text-white p-6 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>
              Reserve Your Table
            </DialogTitle>
            <p className="text-white/70 mt-2">
              Experience premium vegetarian dining at Morsaab's
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium " + (step >= s ? "bg-green-800 text-white" : "bg-gray-200 text-gray-500")}>
                  {s}
                </div>
                {s < 2 && <div className={"w-20 h-1 mx-2 rounded " + (step > s ? "bg-green-800" : "bg-gray-200")} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-3">
                  <CalendarDays className="w-4 h-4 text-yellow-600" />
                  Select Date
                </label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={isDateDisabled}
                    className="rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-3">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, time })}
                      className={"px-3 py-2 text-sm rounded-lg border transition-all " + (formData.time === time ? "bg-green-800 text-white border-green-800" : "border-gray-200 hover:border-green-800")}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-3">
                  <Users className="w-4 h-4 text-yellow-600" />
                  Number of Guests
                </label>
                <div className="flex flex-wrap gap-2">
                  {guestOptions.map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, guests: num })}
                      className={"w-10 h-10 rounded-full text-sm font-medium " + (formData.guests === num ? "bg-green-800 text-white" : "bg-gray-100 hover:bg-gray-200")}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!date || !formData.time}
                className="w-full rounded-full bg-green-800 hover:bg-green-900 py-6"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-500">Your Reservation</p>
                <p className="font-semibold text-gray-800">
                  {date && format(date, "EEEE, MMMM d, yyyy")} at {formData.time}
                </p>
                <p className="text-sm text-gray-500">{formData.guests} Guest{formData.guests > 1 ? "s" : ""}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                  <User className="w-4 h-4 text-yellow-600" />
                  Full Name *
                </label>
                <Input
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
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

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                  <Mail className="w-4 h-4 text-yellow-600" />
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                  <MessageSquare className="w-4 h-4 text-yellow-600" />
                  Special Requests (Optional)
                </label>
                <Textarea
                  placeholder="Any dietary requirements or special occasions?"
                  value={formData.special_requests}
                  onChange={e => setFormData({ ...formData, special_requests: e.target.value })}
                  rows={3}
                  className="rounded-lg resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-full"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.name || !formData.phone}
                  className="flex-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {loading ? "Confirming..." : "Confirm & WhatsApp"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
