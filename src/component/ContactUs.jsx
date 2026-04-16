import React, { useEffect, useState } from "react";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function ContactUs() {
  useEffect(() => {
    document.title = "Jain Trade Links | Contact";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Please enter a valid phone number (at least 10 digits)";
      }
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    } else if (formData.subject.trim().length > 100) {
      newErrors.subject = "Subject cannot exceed 100 characters";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = "Message cannot exceed 5000 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Clear success/error messages when user modifies form
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact/send-mail`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }
      );

      // Success handling
      setSuccessMessage("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error sending message:", error);

      // Handle different error types
      if (error.response) {
        // Backend returned an error response
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          // Validation error from backend
          if (data.errors && typeof data.errors === "object") {
            setErrors(data.errors);
            setErrorMessage("Please fix the errors below.");
          } else if (data.message) {
            setErrorMessage(data.message);
          } else {
            setErrorMessage("Invalid input. Please check your entries.");
          }
        } else if (status === 422) {
          // Unprocessable entity
          if (data.errors && typeof data.errors === "object") {
            setErrors(data.errors);
          }
          setErrorMessage(data.message || "Failed to validate your message.");
        } else if (status === 500) {
          setErrorMessage("Server error. Please try again later.");
        } else if (status === 429) {
          setErrorMessage("Too many requests. Please wait a moment before trying again.");
        } else {
          setErrorMessage(data.message || "Failed to send message. Please try again.");
        }
      } else if (error.request) {
        // Request made but no response received
        setErrorMessage("No response from server. Please check your connection and try again.");
      } else {
        // Error in request setup
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fc] text-gray-700 font-sans">
      {/* Banner */}
      <div className="h-64 md:h-80 bg-gradient-to-r from-[#E8DACD] to-[#f7c948] flex items-center px-6 md:px-12 lg:px-32">
        <div className="text-black">
          <h1 className="text-3xl md:text-4xl lg:text-[4rem] font-bold">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-red-600 font-semibold mt-1">
            संपर्कात रहा
          </p>
          <p className="text-[#6c9055f5] flex flex-col text-base md:text-lg mt-4">
            We're here to assist you with all your banking queries
            <span>तुमच्या सर्व बँकिंग प्रश्नांमध्ये मदत करण्यासाठी आम्ही येथे आहोत.</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row justify-center gap-10 py-16 px-4">
        {/* Left: Contact Info */}
        <div className="flex-1 max-w-md space-y-4 mx-auto">
          <h2 className="text-[#6c9055f5] font-medium text-2xl md:text-4xl mb-6 text-left">
            Contact Information
          </h2>

          <div className="space-y-4">
            <p className="flex items-start gap-2">
              <span className="w-6 flex justify-center">
                <FontAwesomeIcon icon={faLocationDot} className="text-base" />
              </span>
              <span>
                Gandhi Ward, Manohar Chowk, Amgaon Road, Near Pratap Lawn, In
                Front of Centure Bar, Gondia, Maharashtra – India
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-6 flex justify-center">
                <FontAwesomeIcon icon={faPhone} className="text-base" />
              </span>
              <span>+91 8766081543</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-6 flex justify-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-base" />
              </span>
              <span>maaanusaya5@gmail.com</span>
            </p>
          </div>

          {/* Map */}
          <div style={{ width: "100%", height: "400px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3713.3684420852405!2d80.19624307526844!3d21.45405528030386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDI3JzE0LjYiTiA4MMKwMTEnNTUuNyJF!5e0!3m2!1sen!2sin!4v1760685077755!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="flex-1 max-w-lg bg-white p-6 md:p-8 shadow-md mx-auto">
          <h2 className="text-[#6c9055f5] font-medium text-2xl md:text-4xl mb-6 text-left">
            Send us a Message
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 flex items-center gap-2">
                <span className="text-xl">✓</span>
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 flex items-center gap-2">
                <span className="text-xl">✕</span>
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            {/* Name Field */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.name
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-[#6c9055f5]"
                  }`}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>!</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.email
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-[#6c9055f5]"
                  }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>!</span> {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.phone
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-[#6c9055f5]"
                  }`}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>!</span> {errors.phone}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject *"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.subject
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-[#6c9055f5]"
                  }`}
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>!</span> {errors.subject}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <textarea
                name="message"
                placeholder="Your Message... *"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={`w-full border px-4 py-3 focus:outline-none focus:ring-2 transition resize-none ${errors.message
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-[#6c9055f5]"
                  }`}
              />
              {errors.message && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>!</span> {errors.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.message.length}/5000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-white font-medium transition w-fit mx-auto rounded-md ${loading
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-[#6c9055f5] hover:bg-[#687b5b] active:scale-95"
                }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            <p className="text-gray-600 text-xs text-center">
              * Required fields
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;