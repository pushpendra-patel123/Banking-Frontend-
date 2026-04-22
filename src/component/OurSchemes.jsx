import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation

const OurSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get`
        );
        if (res.data.success) {
          setSchemes(res.data.data.schemes); // adjust key based on backend response
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <div className="relative py-16 px-6 md:px-12 bg-gradient-to-r from-[#fdf2f8] via-[#E3B7B4] to-[#e0f2fe]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-red-600 via-pink-600 to-red-700 text-transparent bg-clip-text drop-shadow-lg tracking-wide mb-12">
          Our Schemes <span className="block text-lg md:text-xl font-semibold text-gray-700 mt-2">आमच्या योजना</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {schemes.length > 0 && schemes.map((scheme, index) => {
            // Description handling
            const descWords = (scheme.desc ?? "").split(" ");
            const shortDesc = descWords.slice(0, 50).join(" ");
            const showReadMore = descWords.length > 50;

            return (
              <div
                key={index}
                className="flex flex-col h-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    src={scheme.logo}
                    alt={scheme.name}
                    className="w-full h-full object-contain transform hover:scale-110 transition duration-500"
                  />
                  {/* Title Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                    <h3 className="text-xl font-semibold text-red-700 text-left">
                      {scheme.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-6">
                  <div className="mb-4 text-gray-600 text-sm text-left">
                    {shortDesc}
                    {showReadMore && (
                      <Link
                        to={`/scheme/${scheme.name}/${scheme._id}`} // Prefer _id if available
                        className="ml-2 text-blue-600 underline hover:text-blue-800 focus:outline-none"
                      >
                        Read more
                      </Link>
                    )}
                  </div>
                  <div className="mt-auto flex justify-center">
                    <a
                      href={scheme.pdf}
                      download
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 hover:scale-105 transition-all duration-300"
                    >
                      <FaFilePdf className="text-lg" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurSchemes;
