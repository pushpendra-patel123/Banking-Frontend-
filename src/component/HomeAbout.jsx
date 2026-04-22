import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
const WelcomeSection = () => {
  const [about, setAbout] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get`
        );
        if (res.data.success) {
          setAbout(res.data.data.aboutsUs);
          console.log(res.data.data.aboutsUs,"jwbwjq") // adjust key based on backend response
        }
      } catch (err) {
        console.error("Error fetching about:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  console.log(about,"about")
  return (
    <div className="max-w-4xl mx-auto px-10 py-10 text-center  ">
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
        Welcome To Maa Anushaya Urban
      </h2>
      <p className="block text-lg md:text-xl font-semibold text-gray-700 mt-2">
        माँ अनुसया अर्बन को-ऑपरेटिव्ह बैंक  आपले हार्दिक स्वागत आहे!
      </p>
      <div
        className="text-gray-700 my-2 text-base text-left leading-relaxed"
        dangerouslySetInnerHTML={{ __html: about?.desc || "N/A" }}
      />
      <Link
        to="/about-us"
        className="mt-6 px-6 py-2 bg-red-600 text-white text-sm rounded-full shadow-md hover:bg-red-700 transition"
      >
        Read More
      </Link>
    </div>
  );
};

export default WelcomeSection;
