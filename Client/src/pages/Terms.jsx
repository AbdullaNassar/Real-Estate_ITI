import React from "react";

export default function terms() {
  return (
    <div className=" text-gray-800 px-4 sm:px-8 lg:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#C69963] mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          {/* Introduction */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <p>
              Welcome to <span className="font-semibold">Maskan</span>. By
              accessing or using our website and services, you agree to comply
              with and be bound by the following Terms of Service. Please read
              them carefully before using our platform.
            </p>
          </section>

          {/* Eligibility */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              1. Eligibility
            </h2>
            <p>
              You must be at least 18 years old to create an account or make a
              booking on Maskan. By using our services, you confirm that you
              meet this requirement.
            </p>
          </section>

          {/* User Accounts */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              2. User Accounts
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You agree to provide accurate and up-to-date information.
              </li>
              <li>
                Maskan reserves the right to suspend or terminate accounts that
                violate these terms.
              </li>
            </ul>
          </section>

          {/* Booking & Payments */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              3. Bookings & Payments
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>All bookings are subject to host approval and availability.</li>
              <li>
                Payments must be made securely through our approved payment
                methods.
              </li>
              <li>
                Cancellation and refund policies are outlined on each property
                listing page.
              </li>
            </ul>
          </section>

          {/* Host Responsibilities */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              4. Host Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure the property is clean, safe, and accurately listed.</li>
              <li>Honor all confirmed bookings unless unavoidable.</li>
              <li>
                Comply with all applicable Egyptian laws and regulations.
              </li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              5. Prohibited Activities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Using Maskan for unlawful purposes.</li>
              <li>
                Posting false, misleading, or harmful information about
                properties or users.
              </li>
              <li>Attempting to bypass our payment or booking system.</li>
            </ul>
          </section>

          {/* Liability */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              Maskan acts as a platform to connect guests and hosts. We are not
              responsible for any disputes, damages, or losses that occur
              outside our control.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              7. Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of the platform after updates means you accept the revised
              terms.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              8. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
