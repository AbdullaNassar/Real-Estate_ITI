import { Star, Users } from "lucide-react";
import React from "react";
import Animation from "../../ui/animated/Animation";

export default function Testimonials() {
  return (
    <Animation>
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from real travelers
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-primarry fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-800 mb-6 leading-relaxed">
                "Our stay in Cairo was absolutely magical. The host was
                incredibly welcoming and the home felt like a true Egyptian
                experience. Highly recommend Maskan!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primarry rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-100" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Sarah Ahmed</h4>
                  <p className="text-gray-500 text-sm">Traveler from Germany</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-primarry fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "As a host on Maskan, I've met wonderful people from around the
                world. The platform makes it easy to share our beautiful culture
                with guests."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primarry rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-100" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Mohamed Farid</h4>
                  <p className="text-gray-500 text-sm">Host in Alexandria</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-primarry fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "The booking process was seamless and the home exceeded our
                expectations. We felt safe, comfortable, and truly welcomed
                throughout our stay."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primarry rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-100" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Layla Hassan</h4>
                  <p className="text-gray-500 text-sm">Local Traveler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Animation>
  );
}
