import { Facebook, Home, Instagram, Mail, Twitter } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-white py-12 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className=" mb-4 w-42">
              <img
                src="./imgs/logoBlack.svg"
                className="w-full h-full"
                alt=""
              />
            </div>
            <p className="text-stone-300 leading-relaxed">
              Your Egyptian Home, Wherever You Are. Connecting travelers with
              authentic home rentals across Egypt.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/listings"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  Find Stays
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  Become a Host
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  Safety
                </a>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  href="#"
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-8 text-center">
          <p className="text-stone-300">
            © 2025 Maskan. All rights reserved. Made with ❤️ for Egyptian
            hospitality.
          </p>
        </div>
      </div>
    </footer>
  );
}
