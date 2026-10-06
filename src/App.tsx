import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Buy, Rent, Commercial } from "./pages/Listings";
import { PropertyDetail } from "./pages/PropertyDetail";
import { Sell } from "./pages/Sell";
import { Redevelopment } from "./pages/Redevelopment";
import { Localities, LocalityDetail } from "./pages/Localities";
import { About } from "./pages/About";
import { Blog, BlogPost } from "./pages/Blog";
import { GuidesIndex, GuideDetail } from "./pages/Guides";
import { SocietiesIndex, SocietyDetail } from "./pages/Societies";
import { FAQs } from "./pages/FAQs";
import { Contact } from "./pages/Contact";
import { PrivacyPolicy, TermsOfService } from "./pages/Legal";

export default function App() {
  const basename = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

  return (
    <BrowserRouter basename={basename === "/" ? undefined : basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="buy" element={<Buy />} />
          <Route path="rent" element={<Rent />} />
          <Route path="commercial" element={<Commercial />} />
          <Route path="property/:slug" element={<PropertyDetail />} />
          <Route path="sell" element={<Sell />} />
          <Route path="redevelopment" element={<Redevelopment />} />
          <Route path="localities" element={<Localities />} />
          <Route path="localities/:slug" element={<LocalityDetail />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="guides" element={<GuidesIndex />} />
          <Route path="guides/:slug" element={<GuideDetail />} />
          <Route path="societies" element={<SocietiesIndex />} />
          <Route path="societies/:slug" element={<SocietyDetail />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
