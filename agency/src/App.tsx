import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
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
import { DetailStub } from "./pages/DetailStub";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="industries" element={<Industries />} />
          <Route path="industries/:slug" element={<DetailStub kind="Industry" />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:slug" element={<DetailStub kind="Package" />} />
          <Route path="free-tools" element={<FreeTools />} />
          <Route path="free-tools/:slug" element={<DetailStub kind="Tool category" />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:slug" element={<DetailStub kind="Case study" />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<DetailStub kind="Project" />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/:slug" element={<DetailStub kind="Resource" />} />
          <Route path="why-displayavenue" element={<WhyDisplayAvenue />} />
          <Route path="ai-platform" element={<AiPlatform />} />
          <Route path="ai-platform/:slug" element={<DetailStub kind="AI suite" />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="solutions/:slug" element={<DetailStub kind="Solution" />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<DetailStub kind="Service" />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<DetailStub kind="Privacy Policy" />} />
          <Route path="terms" element={<DetailStub kind="Terms" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
