import React from "react";
import Animation from "../../ui/animated/Animation";
import { useNavigate } from "react-router-dom";

export default function Cta() {
  const navigate = useNavigate();
  return (
    <Animation>
      <section className="py-20 bg-gradient-to-r from-primarry to-primarry-hover">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-50 mb-6">
            Join Our Community Today
          </h2>
          <p className="text-xl text-amber-100 mb-10 leading-relaxed">
            Whether you're looking for your next adventure or wanting to share
            your home with fellow travelers, Maskan is your gateway to authentic
            Egyptian experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/listings")}
              className="bg-gray-100 hover:cursor-pointer text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 font-semibold"
            >
              Find Your Stay
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="border-2 hover:cursor-pointer border-white text-gray-50 px-8 py-4 rounded-xl hover:bg-gray-100 hover:text-gray-800 transition-all hover:scale-105 font-semibold"
            >
              Become a Host
            </button>
          </div>
        </div>
      </section>
    </Animation>
  );
}
