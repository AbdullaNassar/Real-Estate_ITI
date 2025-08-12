import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" bg-gray-200  shadow-md mx-4 md:mx-24 text-gray-700 p-8   text-center">
      <ul className="flex justify-around mb-8  underline">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/terms">Terms of Service</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy Policy</Link>
        </li>
      </ul>

      <h2>&copy; 2025 Maskn. All rights reserved.</h2>
    </footer>
  );
}
