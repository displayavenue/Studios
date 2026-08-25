import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Industries } from "./pages/Industries";
import { IndustrySolutions } from "./pages/IndustrySolutions";
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
import { LegalPage } from "./pages/LegalPage";
import { Awards } from "./pages/Awards";
import { Certifications } from "./pages/Certifications";
import { RoiCalculator } from "./pages/tools/RoiCalculator";
import { SeoChecklist } from "./pages/tools/SeoChecklist";
import { LocalSeoScore } from "./pages/tools/LocalSeoScore";
import { CitationDirectory } from "./pages/tools/CitationDirectory";
import { IndustryReport } from "./pages/tools/IndustryReport";
import { LocationCityPage, LocationServicePage } from "./pages/LocationService";
import { LocationsHub } from "./pages/Locations";
import { DigitalMarketingAgencyMumbai } from "./pages/DigitalMarketingAgencyMumbai";
import { BusinessCard } from "./pages/BusinessCard";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { TalentBranding } from "./pages/TalentBranding";
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
  IndustryServiceCombo,
} from "./pages/CatalogDetails";

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
  return (
    <BrowserRouter basename={basename === "/" ? undefined : basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="industries" element={<Industries />} />
          <Route path="industry-solutions" element={<IndustrySolutions />} />
          <Route path="industries/:industry/:service" element={<IndustryServiceCombo />} />
          <Route path="industries/:slug" element={<IndustryDetail />} />
          <Route path="locations" element={<LocationsHub />} />
          <Route path="locations/:city/:service" element={<LocationServicePage />} />
          <Route path="locations/:city" element={<LocationCityPage />} />
          <Route path="digital-marketing-agency-mumbai" element={<DigitalMarketingAgencyMumbai />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:slug" element={<PackageDetail />} />
          <Route path="free-tools" element={<FreeTools />} />
          <Route path="free-tools/roi-calculator" element={<RoiCalculator />} />
          <Route path="free-tools/seo-checklist" element={<SeoChecklist />} />
          <Route path="free-tools/local-seo-score" element={<LocalSeoScore />} />
          <Route path="free-tools/citation-directory" element={<CitationDirectory />} />
          <Route path="free-tools/:slug" element={<ToolCategoryDetail />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="resources" element={<Resources />} />
          <Route
            path="resources/india-sme-digital-growth-report"
            element={<IndustryReport />}
          />
          <Route path="resources/:slug" element={<ResourceDetail />} />
          <Route path="why-displayavenue" element={<WhyDisplayAvenue />} />
          <Route path="ai-platform" element={<AiPlatform />} />
          <Route path="ai-platform/:slug" element={<AiSuiteDetail />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="solutions/:slug" element={<SolutionDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="card" element={<BusinessCard />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="talent-branding" element={<TalentBranding />} />
          <Route path="awards" element={<Awards />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="privacy" element={<LegalPage type="privacy" />} />
          <Route path="terms" element={<LegalPage type="terms" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
