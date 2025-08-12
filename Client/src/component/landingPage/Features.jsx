import { Globe, Heart, Home, Leaf, Shield, Users } from "lucide-react";
import React from "react";

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">
            Why Choose Maskan?
          </h2>
          <p className="text-xl text-stone-600">
            Built on values that matter to travelers and hosts alike
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
          <div className="text-center group">
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Users className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Community
            </h3>
            <p className="text-stone-600">
              Join a welcoming community of travelers and hosts who share your
              passion for authentic experiences
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Heart className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Authenticity
            </h3>
            <p className="text-stone-600">
              Every home tells a story, offering you genuine Egyptian
              hospitality and local insights
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Shield className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Trust</h3>
            <p className="text-stone-600">
              Verified hosts, secure payments, and 24/7 support ensure your
              peace of mind
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Globe className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Inclusivity
            </h3>
            <p className="text-stone-600">
              Everyone is welcome in our community, regardless of background or
              travel style
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Leaf className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Sustainability
            </h3>
            <p className="text-stone-600">
              Supporting local communities and promoting responsible travel for
              future generations
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Home className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Comfort
            </h3>
            <p className="text-stone-600">
              Feel at home with carefully selected properties that prioritize
              your comfort and convenience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
