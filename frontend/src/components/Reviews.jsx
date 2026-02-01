import { Star, Quote } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      text: "Flavorful food, top-notch service, cozy ambiance. Morsaab's has become our family's favorite place for special occasions.",
      date: "2 weeks ago"
    },
    {
      name: "Priya Sharma",
      rating: 5,
      text: "Complete destination for food lovers! The rooftop seating is perfect for evening dinners.",
      date: "1 month ago"
    },
    {
      name: "Amit Verma",
      rating: 5,
      text: "Superb food and polite staff. We celebrated my daughter's birthday here and the team made it extra special.",
      date: "3 weeks ago"
    }
  ];

  return (
    <section id="reviews" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-yellow-600 font-medium tracking-widest uppercase text-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
            What Our Guests Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-800">4.8</span>
            <span className="text-gray-500">• 71+ Reviews on Google</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <Quote className="w-8 h-8 text-yellow-500/30 mb-4" />
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={i < review.rating ? "w-4 h-4 text-yellow-500 fill-yellow-500" : "w-4 h-4 text-gray-200"} />
                ))}
              </div>
              <p className="text-gray-500 leading-relaxed mb-6">"{review.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-white font-medium">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
