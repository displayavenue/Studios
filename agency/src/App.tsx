import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LandingLayout } from "./components/LandingLayout";
import { Home } from "./pages/Home";
import { Industries } from "./pages/Industries";
import { Packages } from "./pages/Packages";
import { FreeTools } from "./pages/FreeTools";
import { CaseStudies } from "./pages/CaseStudies";
import { Portfolio } from "./pages/Portfolio";
import { Resources } from "./pages/Resources";
import { WhyDisplayAvenue } from "./pages/WhyDisplayAvenue";
import { AiPlatform } from "./pages/AiPlatform";
import { Solutions } from "./pages/Solutions";
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { Catalogue } from "./pages/Catalogue";
import { Shop } from "./pages/Shop";
import { ShopProductPage } from "./pages/ShopProduct";
import { LegalPage } from "./pages/LegalPage";
import LandingPage from "./pages/LandingPage";
import {
  ServiceDetail,
  IndustryDetail,
  PackageDetail,
  SolutionDetail,
  AiSuiteDetail,
  ToolCategoryDetail,
  CaseStudyDetail,
  ProjectDetail,
  ResourceDetail,
} from "./pages/CatalogDetails";

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
  return (
    <BrowserRouter basename={basename === "/" ? undefined : basename}>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="lp/:slug" element={<LandingPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="industries" element={<Industries />} />
          <Route path="industries/:slug" element={<IndustryDetail />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:slug" element={<PackageDetail />} />
          <Route path="free-tools" element={<FreeTools />} />
          <Route path="free-tools/:slug" element={<ToolCategoryDetail />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/:slug" element={<ResourceDetail />} />
          <Route path="why-displayavenue" element={<WhyDisplayAvenue />} />
          <Route path="ai-platform" element={<AiPlatform />} />
          <Route path="ai-platform/:slug" element={<AiSuiteDetail />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="solutions/:slug" element={<SolutionDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:slug" element={<ShopProductPage />} />
          <Route path="privacy" element={<LegalPage type="privacy" />} />
          <Route path="terms" element={<LegalPage type="terms" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
