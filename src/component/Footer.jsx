import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import logo from "../assets/logo2.png";

const Footer = () => {
  return (
    <footer className="bg-yellow-400 text-gray-800">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 py-12 border-b border-yellow-500">
        {/* Company Info with Logo */}
        <div className="flex flex-col items-start">
          <img src={logo} alt="Bank Logo" className="w-28 mb-4" />
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b-2 border-yellow-600 inline-block pb-1">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-gray-900 flex items-center gap-2"
              >
                <MdKeyboardArrowRight /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                className="hover:text-gray-900 flex items-center gap-2"
              >
                <MdKeyboardArrowRight /> About Us
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="hover:text-gray-900 flex items-center gap-2"
              >
                <MdKeyboardArrowRight /> FAQs
              </Link>
            </li>
            <li>
              <Link
                to="/applicationForms"
                className="hover:text-gray-900 flex items-center gap-2"
              >
                <MdKeyboardArrowRight /> Loan Application Forms
              </Link>
            </li>
            <li>
              <Link
                to="/careers"
                className="hover:text-gray-900 flex items-center gap-2"
              >
                <MdKeyboardArrowRight /> Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b-2 border-yellow-600 inline-block pb-1">
            Connect With Us
          </h2>
          <p className="text-sm mb-2 ">
            Gandhi Ward, Manohar Chowk, Amgaon Road, Near Pratap Lawn, In Front
            of Centure Bar, Gondia, Maharashtra – India
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&to=maaanusaya5@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm mb-2 text-gray-900 hover:underline"
          >
            Email: maaanusaya5@gmail.com
          </a>
          <br />
          <a href="tel:+918766081543" className="text-sm mb-4">Phone: +91 8766081543</a>

          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-blue-900">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-sky-500">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-pink-600">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-900">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-900 text-gray-400 text-center py-4 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-yellow-400 font-semibold">Anusaya Urban</span>. All
        rights reserved. |
        <span className="hover:text-yellow-400 cursor-pointer ml-2">
          Privacy Policy
        </span>{" "}
        |
        <span className="hover:text-yellow-400 cursor-pointer ml-2">
          Terms & Conditions
        </span>
      </div>
    </footer>
  );
};

export default Footer;
