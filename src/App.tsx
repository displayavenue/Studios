import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Packages } from "./pages/Packages";
import { Pricing } from "./pages/Pricing";
import { Portfolio } from "./pages/Portfolio";
import { PortfolioDetail } from "./pages/PortfolioDetail";
import { Industries } from "./pages/Industries";
import { Locations, LocationDetail } from "./pages/Locations";
import { Blog, BlogPost } from "./pages/Blog";
import { FAQs } from "./pages/FAQs";
import { BookNow } from "./pages/BookNow";
import { Contact } from "./pages/Contact";

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
          <Route path="pricing" element={<Pricing />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="industries" element={<Industries />} />
          <Route path="locations" element={<Locations />} />
          <Route path="locations/:slug" element={<LocationDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="book-now" element={<BookNow />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
