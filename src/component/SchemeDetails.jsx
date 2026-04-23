import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SchemeDetails = () => {
  const [schemes, setSchemes] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Mock ID for demo - replace with useParams() in real app
  const { id } = useParams()

  useEffect(() => {
    const fetchSchme = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/schemes/get/${id}`
        );
        if (res.data.success) {
          setSchemes(res.data.data); // adjust key based on backend response
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchme();
  }, [id]);


  const handleDownloadPDF = async () => {
    if (!schemes?.pdf) return;

    setDownloading(true);
    try {
      // Method 1: Simple download (opens in new tab)
      window.open(schemes.pdf, '_blank');

      // Method 2: Force download with custom filename (uncomment if needed)
      const response = await fetch(schemes.pdf);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${schemes.name}-Brochure.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleViewPDF = () => {
    if (schemes?.pdf) {
      window.open(schemes.pdf, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading scheme details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="w-full h-64 md:h-96 relative">
        <img
          src={schemes?.logo}
          alt={schemes?.name || "Scheme Image"}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0  bg-opacity-30"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
            {schemes?.name}
          </h1>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {schemes?.pdf && (
            <>
              <button
                onClick={handleViewPDF}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Brochure
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md ${downloading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {downloading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {downloading ? 'Downloading...' : 'Download Brochure'}
              </button>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Scheme Name */}
          <h2 className="text-3xl font-bold mb-6 text-yellow-600 text-center">
            {schemes?.name}
          </h2>

          {/* Description */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 text-base md:text-lg leading-relaxed space-y-4">
              {schemes?.desc?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Key Features Section */}
          {/* <div className="mt-8 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Key Benefits
            </h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Zero balance savings account
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                RuPay debit card with accident insurance
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Life insurance coverage
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Access to government benefits and subsidies
              </li>
            </ul>
          </div> */}

          {/* Contact Information */}
          {/* <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Need Help?
            </h3>
            <p className="text-gray-700">
              For more information about this scheme or to apply, please contact your nearest bank branch or visit the official website. 
              You can also call the helpline for assistance with the application process.
            </p>
          </div> */}
        </div>

        {/* Download Section */}
        {schemes?.pdf && (
          <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Complete Information Available</h3>
            <p className="mb-4">Download the complete brochure for detailed information about eligibility, application process, and required documents.</p>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="inline-flex items-center px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Download Complete Brochure
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeDetails;