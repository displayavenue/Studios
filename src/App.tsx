import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Packages } from "./pages/Packages";
import { PackageDetail } from "./pages/PackageDetail";
import { Pricing } from "./pages/Pricing";
import { Portfolio } from "./pages/Portfolio";
import { PortfolioDetail } from "./pages/PortfolioDetail";
import { Industries } from "./pages/Industries";
import { IndustryDetail } from "./pages/IndustryDetail";
import { Locations, LocationDetail } from "./pages/Locations";
import { Blog, BlogPost } from "./pages/Blog";
import { FAQs } from "./pages/FAQs";
import { BookNow } from "./pages/BookNow";
import { Contact } from "./pages/Contact";
import { AllPages } from "./pages/AllPages";
import { CaseStudies, CaseStudyDetail } from "./pages/CaseStudies";
import { Careers } from "./pages/Careers";
import { ClientGallery } from "./pages/ClientGallery";
import { Availability } from "./pages/Availability";
import { HireIndex, HireCityService } from "./pages/Hire";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:slug" element={<PackageDetail />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="industries" element={<Industries />} />
          <Route path="industries/:slug" element={<IndustryDetail />} />
          <Route path="locations" element={<Locations />} />
          <Route path="locations/:slug" element={<LocationDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="careers" element={<Careers />} />
          <Route path="client-gallery" element={<ClientGallery />} />
          <Route path="availability" element={<Availability />} />
          <Route path="hire" element={<HireIndex />} />
          <Route path="hire/:city/:serviceSlug" element={<HireCityService />} />
          <Route path="book-now" element={<BookNow />} />
          <Route path="contact" element={<Contact />} />
          <Route path="pages" element={<AllPages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
