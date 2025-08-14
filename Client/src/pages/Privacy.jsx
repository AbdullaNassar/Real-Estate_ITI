
// import React from "react";

// export default function Privacy() {
//   return (
//     <div className="bg-gray-50 text-gray-800 px-4 sm:px-8 lg:px-20 py-12">
//       <div className="max-w-5xl mx-auto">
//         {/* Page Title */}
//         <h1 className="text-3xl sm:text-4xl font-bold text-[#C69963] mb-6">
//           Privacy Policy
//         </h1>
//         <p className="text-sm text-gray-500 mb-10">
//           Last updated: {new Date().toLocaleDateString()}
//         </p>

//         {/* Introduction */}
//         <section className="mb-8">
//           <p>
//             Welcome to <span className="font-semibold">Maskan</span> — your
//             trusted local platform for finding and booking apartments in Egypt.
//             This Privacy Policy explains how we collect, use, and protect your
//             personal information when you use our website or mobile
//             application.
//           </p>
//         </section>

//         {/* Information Collection */}
//         <section className="mb-8">
//           <h2 className="text-xl font-semibold text-[#C69963] mb-3">
//             1. Information We Collect
//           </h2>
//           <ul className="list-disc list-inside space-y-2">
//             <li>
//               Personal details such as name, phone number, email address, and
//               payment information.
//             </li>
//             <li>
//               Booking and listing details including dates, locations, and
//               property preferences.
//             </li>
//             <li>
//               Technical data like IP address, browser type, and device
//               information.
//             </li>
//           </ul>
//         </section>

//         {/* How We Use It */}
//         <section className="mb-8">
//           <h2 className="text-xl font-semibold text-[#C69963] mb-3">
//             2. How We Use Your Information
//           </h2>
//           <ul className="list-disc list-inside space-y-2">
//             <li>To process bookings and manage listings.</li>
//             <li>To improve our services and user experience.</li>
//             <li>To communicate important updates and offers.</li>
//             <li>To ensure platform security and prevent fraud.</li>
//           </ul>
//         </section>

//         {/* Sharing Data */}
//         <section className="mb-8">
//           <h2 className="text-xl font-semibold text-[#C69963] mb-3">
//             3. Sharing of Information
//           </h2>
//           <p>
//             We only share your information with hosts, guests, and service
//             providers when necessary to complete bookings, comply with the law,
//             or improve our services. We never sell your personal data.
//           </p>
//         </section>

//         {/* Data Security */}
//         <section className="mb-8">
//           <h2 className="text-xl font-semibold text-[#C69963] mb-3">
//             4. Data Security
//           </h2>
//           <p>
//             We use secure technologies and follow industry standards to protect
//             your information. However, no method of transmission over the
//             internet is 100% secure.
//           </p>
//         </section>

//         {/* Your Rights */}
//         <section className="mb-8">
//           <h2 className="text-xl font-semibold text-[#C69963] mb-3">
//             5. Your Rights
//           </h2>
//           <ul className="list-disc list-inside space-y-2">
//             <li>Access and update your personal information.</li>
//             <li>Request deletion of your data.</li>
//             <li>Opt out of promotional communications.</li>
//           </ul>
//         </section>

//         {/* Contact */}
//         <section>
//           <h2 className="text-xl font-semibold text-[#C69963] mb-3">
//             6. Contact Us
//           </h2>
//           <p>
//             If you have questions about this Privacy Policy or your personal
//             data, please contact us.
//           </p>
          
//         </section>
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function Privacy() {
  return (
    <div className=" text-gray-800 px-4 sm:px-8 lg:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#C69963] mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Card Wrapper for Each Section */}
        <div className="space-y-6 text-sm leading-relaxed">
          {/* Intro */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <p>
              Welcome to <span className="font-semibold">Maskan</span> — your
              trusted local platform for finding and booking apartments in
              Egypt. This Privacy Policy explains how we collect, use, and
              protect your personal information when you use our platform.
            </p>
          </section>

          {/* Info We Collect */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              1. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Personal details such as name, phone number, email address, and
                payment information.
              </li>
              <li>
                Booking and listing details including dates, locations, and
                property preferences.
              </li>
              <li>
                Technical data like IP address, browser type, and device
                information.
              </li>
            </ul>
          </section>

          {/* How We Use */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To process bookings and manage listings.</li>
              <li>To improve our services and user experience.</li>
              <li>To communicate important updates and offers.</li>
              <li>To ensure platform security and prevent fraud.</li>
            </ul>
          </section>

          {/* Sharing */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              3. Sharing of Information
            </h2>
            <p>
              We only share your information with hosts, guests, and service
              providers when necessary to complete bookings, comply with the
              law, or improve our services. We never sell your personal data.
            </p>
          </section>

          {/* Security */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              4. Data Security
            </h2>
            <p>
              We use secure technologies and follow industry standards to
              protect your information. However, no method of transmission over
              the internet is 100% secure.
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              5. Your Rights
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Access and update your personal information.</li>
              <li>Request deletion of your data.</li>
              <li>Opt out of promotional communications.</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              6. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or your personal
              data, please contact us.
            </p>
           
          </section>
        </div>
      </div>
    </div>
  );
}
