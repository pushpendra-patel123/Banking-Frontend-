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
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ─── Validation Rules ───────────────────────────────────────────────────────

  const validateField = (name, value) => {
    const v = value.trim();

    switch (name) {
      case "name": {
        if (!v) return "Full name is required.";
        if (v.length < 2) return "Name must be at least 2 characters.";
        if (v.length > 50) return "Name cannot exceed 50 characters.";
        if (/\d/.test(v)) return "Name cannot contain numbers.";
        if (!/^[a-zA-Z\u0900-\u097F\s]+$/.test(v))
          return "Name can only contain letters and spaces.";
        return "";
      }

      case "email": {
        if (!v) return "Email address is required.";
        // RFC-5322 inspired — rejects obvious typos like missing TLD
        const emailRegex =
          /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(v)) return "Please enter a valid email address (e.g. abc@example.com).";
        if (v.length > 254) return "Email address is too long.";
        return "";
      }

      case "phone": {
        if (!v) return ""; // optional field
        // Strip spaces, dashes, dots, parentheses for length check
        const digits = v.replace(/[\s\-.()+]/g, "");
        if (/[a-zA-Z]/.test(v)) return "Phone number cannot contain letters.";
        if (!/^\d+$/.test(digits)) return "Phone number can only contain digits, spaces, +, - or ().";
        // Support Indian numbers: 10 digits, optionally prefixed with +91 or 0
        const normalized = digits.replace(/^(\+91|91|0)/, "");
        if (normalized.length !== 10)
          return "Enter a valid 10-digit mobile number (e.g. 9876543210).";
        if (!/^[6-9]/.test(normalized))
          return "Mobile number must start with 6, 7, 8 or 9.";
        return "";
      }

      case "subject": {
        if (!v) return "Subject is required.";
        if (v.length < 3) return "Subject must be at least 3 characters.";
        if (v.length > 100) return "Subject cannot exceed 100 characters.";
        if (/^\d+$/.test(v)) return "Subject cannot be only numbers.";
        return "";
      }

      case "message": {
        if (!v) return "Message is required.";
        if (v.length < 10) return "Message must be at least 10 characters.";
        if (v.length > 5000) return "Message cannot exceed 5000 characters.";
        return "";
      }

      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers being typed into the name field
    if (name === "name" && /\d/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
    setErrorMessage("");

    // Live validation once the field has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Mark all fields as touched so errors show
    const allTouched = Object.keys(formData).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allTouched);

    const newErrors = validateAll();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact/send-mail`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }
      );

      setSuccessMessage("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTouched({});
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response) {
        const { status, data } = error.response;
        if ((status === 400 || status === 422) && data.errors && typeof data.errors === "object") {
          setErrors(data.errors);
          setErrorMessage(data.message || "Please fix the errors below.");
        } else if (status === 429) {
          setErrorMessage("Too many requests. Please wait a moment before trying again.");
        } else if (status === 500) {
          setErrorMessage("Server error. Please try again later.");
        } else {
          setErrorMessage(data.message || "Failed to send message. Please try again.");
        }
      } else if (error.request) {
        setErrorMessage("No response from server. Please check your connection and try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Helper ─────────────────────────────────────────────────────────────────

  const fieldClass = (fieldName) =>
    `w-full border px-4 py-3 focus:outline-none focus:ring-2 transition ${
      errors[fieldName] && touched[fieldName]
        ? "border-red-400 focus:ring-red-300 bg-red-50"
        : "border-gray-300 focus:ring-[#6c9055f5]"
    }`;

  const ErrorMsg = ({ field }) =>
    errors[field] && touched[field] ? (
      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
        <span className="font-bold">!</span> {errors[field]}
      </p>
    ) : null;

  // ─── Render ─────────────────────────────────────────────────────────────────

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
            <span>
              तुमच्या सर्व बँकिंग प्रश्नांमध्ये मदत करण्यासाठी आम्ही येथे आहोत.
            </span>
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

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-5 mt-1 flex-shrink-0 text-gray-600">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <p className="leading-relaxed">
                Gandhi Ward, Manohar Chowk, Amgaon Road, Near Pratap Lawn, In
                Front of Centure Bar, Gondia, Maharashtra – India
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 flex-shrink-0 text-gray-600">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <p>+91 8766081543</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 flex-shrink-0 text-gray-600">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <p>maaanusaya5@gmail.com</p>
            </div>
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

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5" noValidate>
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={50}
                autoComplete="name"
                className={fieldClass("name")}
              />
              <ErrorMsg field="name" />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={254}
                autoComplete="email"
                className={fieldClass("email")}
              />
              <ErrorMsg field="email" />
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={15}
                autoComplete="tel"
                className={fieldClass("phone")}
              />
              {/* Hint shown when not yet in error state */}
              {!(errors.phone && touched.phone) && (
                <p className="text-gray-400 text-xs mt-1">
                  10-digit Indian mobile number (e.g. 9876543210)
                </p>
              )}
              <ErrorMsg field="phone" />
            </div>

            {/* Subject */}
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject *"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={100}
                className={fieldClass("subject")}
              />
              <div className="flex justify-between items-start mt-1">
                <ErrorMsg field="subject" />
                <p className="text-gray-400 text-xs ml-auto">
                  {formData.subject.length}/100
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                placeholder="Your Message... *"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={5000}
                className={`${fieldClass("message")} resize-none`}
              />
              <div className="flex justify-between items-start mt-1">
                <ErrorMsg field="message" />
                <p
                  className={`text-xs ml-auto ${
                    formData.message.length > 4800
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {formData.message.length}/5000
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-white font-medium transition w-fit mx-auto rounded-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-[#6c9055f5] hover:bg-[#687b5b] active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>

            <p className="text-gray-500 text-xs text-center">* Required fields</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;