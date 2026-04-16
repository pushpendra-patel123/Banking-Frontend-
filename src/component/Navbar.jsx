import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo2.png";
import axios from "axios";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    scheme: false,
    legal: false,
    gallery: false,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };



  const [schemes, setschemes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchmes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get`
        );
        if (res.data.success) {
          setschemes(res.data.data.schemes); // adjust key based on backend response
          setGallery(res.data.data.gallery); // adjust key based on backend response
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchmes();
  }, []);



  const menuItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about-us" },
    { name: "SCHEMES", path: "/schemes", isDropdown: true, key: "scheme" },
    { name: "LEGAL", path: "/legalDocs", isDropdown: true, key: "legal" },
    {
      name: "GALLERY",
      path: "/gallery/society/1",
      isDropdown: true,
      key: "gallery",
    },

    { name: "CONTACT US", path: "/contact" },
    { name: "CAREERS", path: "/careers" },
  ];

  const dropdownItems = {
    scheme: schemes?.map((s, idx) => ({
      name: s.name,
      path: `/scheme/${s.name}/${s._id}`,
    })),
    legal: [{ name: "Legal Documents", path: "/legalDocs" }],
    gallery: gallery?.map((g, idx) => ({
      name: g.category || `Gallery ${idx + 1}`,
      path: `/gallery/${g.category}/${g._id}`,
    })),
  };

  const renderDropdown = (items) => (
    <ul className="pl-4 md:absolute md:left-0 md:top-full md:w-56 bg-white md:shadow-md border border-yellow-400 z-50">
      {items.map((sub, idx) => (
        <li key={idx} className="px-4 py-2 text-gray-700 hover:bg-yellow-50">
          <Link to={sub.path}>{sub.name}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-yellow-400 border-t border-b border-yellow-500 relative z-50">
      {/* Top bar with Logo + Menu */}
      <div className="flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          style={{ height: "120px", width: "140px" }} // adjust as needed
          className="object-contain"
        />

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex text-[13px] md:text-sm font-semibold flex-row flex-wrap ml-6`}
        >
          {menuItems.map((item, idx) => {
            const hasDropdown = item.isDropdown;
            const dropdownKey = item.key;

            const isActive =
              location.pathname === item.path ||
              (hasDropdown && location.pathname.startsWith(item.path));

            return (
              <li
                key={idx}
                className={`relative px-4 py-2 border-l border-yellow-300 hover:bg-yellow-200 ${isActive ? "text-red-600" : "text-gray-800"
                  }`}
                onMouseEnter={() => {
                  if (!isMobile && hasDropdown)
                    setDropdowns((prev) => ({ ...prev, [dropdownKey]: true }));
                }}
                onMouseLeave={() => {
                  if (!isMobile && hasDropdown)
                    setDropdowns((prev) => ({ ...prev, [dropdownKey]: false }));
                }}
              >
                {hasDropdown ? (
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => isMobile && toggleDropdown(dropdownKey)}
                  >
                    <span>{item.name}</span>
                    <FaChevronDown className="text-[10px] mt-0.5" />
                  </div>
                ) : (
                  <Link to={item.path}>{item.name}</Link>
                )}

                {hasDropdown &&
                  dropdowns[dropdownKey] &&
                  renderDropdown(dropdownItems[dropdownKey])}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Menu Items (below logo when open) */}
      {/* Mobile Menu Items (below logo when open) */}
      {mobileMenuOpen && (
        <ul className="flex flex-col text-[13px] md:hidden font-semibold border-t border-yellow-300">
          {menuItems.map((item, idx) => {
            const hasDropdown = item.isDropdown;
            const dropdownKey = item.key;

            return (
              <li
                key={idx}
                className="px-4 py-2 border-b border-yellow-300 text-gray-800"
              >
                {hasDropdown ? (
                  <>
                    {/* Toggleable parent */}
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleDropdown(dropdownKey)}
                    >
                      <span>{item.name}</span>
                      <FaChevronDown
                        className={`text-[12px] transform transition-transform ${dropdowns[dropdownKey] ? "rotate-180" : ""
                          }`}
                      />
                    </div>

                    {/* Dropdown items */}
                    {dropdowns[dropdownKey] &&
                      renderDropdown(dropdownItems[dropdownKey])}
                  </>
                ) : (
                  <Link to={item.path}>{item.name}</Link>
                )}
              </li>
            );
          })}
        </ul>
      )}

    </div>
  );
};

export default Navbar;
