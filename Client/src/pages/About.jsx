import React from "react";

export default function About() {
  return (
    <div className=" text-gray-800 px-4 sm:px-8 lg:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#C69963] mb-2">
          About Maskan
        </h1>
        <p className="text-xs text-gray-500 mb-8">
          Connecting Egypt, One Home at a Time
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          {/* Our Story */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              Our Story
            </h2>
            <p>
              <span className="font-semibold">Maskan</span> was created with a
              simple goal: to make it easier for people across Egypt to find
              comfortable and trustworthy places to stay. Inspired by the
              concept of community and hospitality, we built a platform that
              brings together hosts and guests in a safe, transparent, and
              convenient way.
            </p>
          </section>

          {/* What We Do */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              What We Do
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Connect travelers and locals with unique stays across Egypt.
              </li>
              <li>
                Provide hosts with tools to manage listings, bookings, and
                payments easily.
              </li>
              <li>
                Ensure every booking is backed by secure transactions and clear
                communication.
              </li>
            </ul>
          </section>

          {/* Why Choose Us */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              Why Choose Maskan?
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-medium">Local Expertise:</span> We know
                Egypt and its neighborhoods inside out.
              </li>
              <li>
                <span className="font-medium">Verified Listings:</span> Every
                property is reviewed for safety and accuracy.
              </li>
              <li>
                <span className="font-medium">Secure Payments:</span> Your
                transactions are protected from start to finish.
              </li>
            </ul>
          </section>

          {/* Our Vision */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              Our Vision
            </h2>
            <p>
              We aim to be Egypt’s most trusted platform for local travel and
              stays — a place where people feel at home wherever they go. Our
              mission is to strengthen communities, support local hosts, and
              help travelers experience the authentic side of Egypt.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              Get in Touch
            </h2>
            <p>
              Have questions, feedback, or ideas? We’d love to hear from you.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
