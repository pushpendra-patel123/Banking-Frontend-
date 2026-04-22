// App.jsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./component/Header";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import AboutUsPage from "./pages/AboutUsPage";
import SchemeDetails from "./component/SchemeDetails";
import SchemePage from "./pages/SchemePage";
import LegalDocuments from "./component/LegalDocuments";
import GalleryDetails from "./component/GalleryDetails";
import Careers from "./component/Careers";
import ContactUs from "./component/ContactUs";
import Faq from "./component/Faq";
import ApplicationFormGrid from "./component/ApplicationFormGrid";
import ScrollToTop from "./component/ScrollToTop";

function App() {
  return (
    <div className="app">
      {" "}
      <Router>
        <ScrollToTop />
        {/* <Header /> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/schemes" element={<SchemePage />} />
          <Route path="/scheme/:name/:id" element={<SchemeDetails />} />
          <Route path="/legalDocs" element={<LegalDocuments />} />
          <Route path="/gallery/:name/:id" element={<GalleryDetails />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/applicationForms" element={<ApplicationFormGrid />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
