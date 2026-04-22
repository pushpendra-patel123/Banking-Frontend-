import axios from "axios";
import React, { useEffect, useState } from "react";
import { Download, FileText, ExternalLink, Shield, AlertCircle } from "lucide-react";

const LegalDocuments = () => {
  const [legalDocs, setlegalDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchmes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get`
        );
        if (res.data.success) {
          setlegalDocs(res.data.data.legalDocs);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchmes();
  }, []);

  const isPDF = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith(".pdf") || url.includes("/raw/upload/");
  };

  const isImage = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
    return imageExtensions.some((ext) => lowerUrl.endsWith(ext));
  };

  const handleDownload = (url, title) => {
    if (!url) return;
    try {
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document. Please try again.');
    }
  };

  const handleDownloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || "file";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download failed", err);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-10">
            <div className="flex items-center gap-3">
              {/* <Shield className="w-8 h-8 text-blue-600" /> */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Legal Documents</h2>
                <p className="text-lg text-gray-600 font-medium">कायदेशीर कागदपत्रे</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading legal documents...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 md:px-10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-100 via-yellow-200 to-[#f4ebe2] rounded-2xl shadow-2xl p-8 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              {/* <Shield className="w-10 h-10 text-text-red-600" /> */}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-black mb-1 drop-shadow-lg">Legal Documents</h2>
              <p className="text-xl text-red-600 font-medium">कायदेशीर कागदपत्रे</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/10 rounded-full -mb-16"></div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {legalDocs?.map((doc, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Card gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Title */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1 leading-tight">{doc.title}</h3>
                  {/* File type badge */}
                  {doc.docs && (
                    <div className="ml-2">
                      {isImage(doc.docs) && (
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                          Image
                        </span>
                      )}
                      {isPDF(doc.docs) && (
                        <span className="bg-gradient-to-r from-red-400 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                          PDF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Image Display */}
                {isImage(doc.docs) && (
                  <div className="w-full h-56 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                    <img
                      src={doc.docs}
                      alt={doc.title}
                      className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                      onClick={() => window.open(doc.docs, '_blank')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex-col items-center justify-center text-gray-500">
                      <svg className="w-16 h-16 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Image not available</span>
                    </div>
                  </div>
                )}

                {/* PDF Display */}
                {isPDF(doc.docs) && (
                  <div className="w-full h-56 mb-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-red-200 hover:border-red-400 transition-all duration-300 group-hover:shadow-lg">
                    <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-20 h-20" />
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-sm font-bold text-gray-800 mb-1">PDF Document</p>
                      <p className="text-xs text-gray-600">Click below to view or download</p>
                    </div>
                  </div>
                )}

                {/* Fallback for unknown file types */}
                {!isImage(doc.docs) && !isPDF(doc.docs) && doc.docs && (
                  <div className="w-full h-56 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                    <FileText className="w-20 h-20 text-gray-400 mb-4" />
                    <p className="text-sm font-bold text-gray-700 mb-2">Document Available</p>
                  </div>
                )}

                {/* No document available */}
                {!doc.docs && (
                  <div className="w-full h-56 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                    <AlertCircle className="w-20 h-20 text-gray-400 mb-4" />
                    <p className="text-sm font-medium text-gray-500">Document not available</p>
                  </div>
                )}

                {/* Action Buttons */}
             {doc.docs && (
  <div className="flex gap-3">
    
    {/* PDF */}
    {isPDF(doc.docs) && (
      <button
        onClick={() => handleDownloadFile(doc.docs, doc.title + ".pdf")}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Download className="w-5 h-5" />
        Download
      </button>
    )}

    {/* IMAGE → NOW DOWNLOAD INSTEAD OF OPEN */}
    {isImage(doc.docs) && (
      <button
        onClick={() => handleDownloadFile(doc.docs, doc.title + ".jpg")}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Download className="w-5 h-5" />
        Download
      </button>
    )}

    {/* OTHER FILES → DOWNLOAD */}
    {!isImage(doc.docs) && !isPDF(doc.docs) && (
      <button
        onClick={() => handleDownloadFile(doc.docs, doc.title)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Download className="w-5 h-5" />
        Download
      </button>
    )}

  </div>
)}
              </div>
            </div>
          ))}
        </div>

        {/* No documents message */}
        {!loading && legalDocs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <FileText className="w-24 h-24 mx-auto" />
              </div>
              <p className="text-gray-600 text-xl font-semibold mb-2">No legal documents found</p>
              <p className="text-gray-500 text-sm">Documents will appear here once they are uploaded</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalDocuments;