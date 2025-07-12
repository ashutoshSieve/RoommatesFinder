import React from "react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-indigo-700 text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold mb-2">RoomMateFinder</h2>
          <p className="text-sm text-indigo-200">
            Helping you find the perfect roommate, hassle-free.
          </p>
        </div>

        
        <div>
          <h3 className="font-semibold mb-3 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/profile" className="hover:underline">Setup Profile</a></li>
          </ul>
        </div>

        
        <div>
          <h3 className="font-semibold mb-3 text-lg">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.instagram.com/im.ashu101/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/ashutosh-gupta-198380261/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-indigo-500 text-center text-sm py-4 bg-indigo-800">
        © {new Date().getFullYear()} RoomMateFinder. Made by Ashutosh Gupta.
      </div>
    </footer>
  );
};

export default Footer;
