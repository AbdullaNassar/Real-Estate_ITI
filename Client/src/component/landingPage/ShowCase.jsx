import React from "react";
import { MapPin, Building, Users, Star } from "lucide-react";
import Counter from "../../ui/animated/Counter";

const ShowCase = () => {
  const stats = [
    { icon: Building, number: "100+", label: "Premium Apartments" },
    { icon: MapPin, number: "15+", label: "Cities Covered" },
    { icon: Users, number: "5,000+", label: "Happy Residents" },
    { icon: Star, number: "4.9", label: "Average Rating" },
  ];

  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primarry  to-primarry-hover bg-clip-text text-transparent">
              <Counter
                from={0}
                to={100}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              + Premium Apartments
            </span>
          </h2>

          <h3 className="text-3xl font-bold text-stone-600 mb-4">
            Find Your Perfect Stay in Egypt
          </h3>

          {/* <p className="text-xl text-stone-600 font-semibold max-w-3xl mx-auto leading-relaxed">
            Find Your Perfect Stay in Egypt, From lively apartments to peaceful
            homes by the Nile
          </p> */}

          {/* Decorative line */}
          <div className="mt-8 flex items-center justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="mx-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl max-w-4xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Find Your Dream Home?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied residents who've found their perfect
              apartment through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Browse All Apartments
              </button>
              <button className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Schedule a Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCase;
