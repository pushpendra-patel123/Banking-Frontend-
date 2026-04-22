import axios from "axios";
import React, { useEffect, useState } from "react";

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Download helper (works for all URLs)
  const handleDownload = async (url, filename = "document") => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get`
        );

        if (res?.data?.success) {
          setCareers(res.data.data?.careers || []);
        }
      } catch (err) {
        console.error("Error fetching careers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Careers
      </h1>

      {/* ✅ Loading State */}
      {loading ? (
        <p className="text-center text-gray-500">Loading careers...</p>
      ) : careers.length === 0 ? (
        <p className="text-center text-gray-500">No openings available.</p>
      ) : (
        <div className="space-y-8">
          {careers.map((career, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md p-6 shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {career.title}
              </h2>

              <p className="text-gray-700 mb-2">
                {career.desc || "No description available."}
              </p>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                {career.contactPerson && (
                  <p>
                    <strong>Contact Person:</strong> {career.contactPerson}
                  </p>
                )}
                {career.location && (
                  <p>
                    <strong>Location:</strong> {career.location}
                  </p>
                )}
                {career.email && (
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${career.email}`}
                      className="text-blue-600 underline"
                    >
                      {career.email}
                    </a>
                  </p>
                )}
              </div>

              <p className="mt-4 text-gray-700 font-medium">
                Please send your CV to our email.
              </p>

              {/* ✅ Download button FIXED */}
              {career.docs && (
                <button
                  onClick={() =>
                    handleDownload(
                      career.docs,
                      `${career.title || "career"}.pdf`
                    )
                  }
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                >
                  Download Notification
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Careers;