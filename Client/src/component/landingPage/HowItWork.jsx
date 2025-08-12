import { CreditCard, Heart, Search } from "lucide-react";

export default function HowItWork() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">
            How Maskan Works
          </h2>
          <p className="text-xl text-stone-600">
            Your journey to authentic Egyptian hospitality in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Search className="w-10 h-10 text-amber-700" />
            </div>
            <h3 className="text-2xl font-semibold text-stone-800 mb-4">
              Search Homes
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Browse through carefully curated homes across Egypt's most
              beautiful cities and hidden gems
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <CreditCard className="w-10 h-10 text-amber-700" />
            </div>
            <h3 className="text-2xl font-semibold text-stone-800 mb-4">
              Book Easily
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Secure your perfect stay with our simple booking process and
              transparent pricing
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
              <Heart className="w-10 h-10 text-amber-700" />
            </div>
            <h3 className="text-2xl font-semibold text-stone-800 mb-4">
              Enjoy Your Stay
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Experience authentic Egyptian hospitality and create memories that
              last a lifetime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
