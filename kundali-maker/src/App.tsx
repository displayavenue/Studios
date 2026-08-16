import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LanguageProvider } from './hooks/useLanguage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { FeaturesPage } from './pages/FeaturesPage'
import { GeneratePage } from './pages/GeneratePage'
import { HomePage } from './pages/HomePage'
import { LegalPage } from './pages/LegalPage'
import { MilanPage } from './pages/MilanPage'
import { MilanPayPage } from './pages/MilanPayPage'
import { MilanResultPage } from './pages/MilanResultPage'
import { OrdersPage } from './pages/OrdersPage'
import { PaymentPage } from './pages/PaymentPage'
import { PricingPage } from './pages/PricingPage'
import { RemediesPage } from './pages/RemediesPage'
import { ResultPage } from './pages/ResultPage'
import { SamplePage } from './pages/SamplePage'
import { ServicesPage } from './pages/ServicesPage'
import { WhatsInsidePage } from './pages/WhatsInsidePage'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="generate" element={<GeneratePage />} />
            <Route path="sample" element={<SamplePage />} />
            <Route path="milan" element={<MilanPage />} />
            <Route path="milan/pay/:orderId" element={<MilanPayPage />} />
            <Route path="milan/result/:orderId" element={<MilanResultPage />} />
            <Route path="pay/:orderId" element={<PaymentPage />} />
            <Route path="result/:orderId" element={<ResultPage />} />
            <Route path="remedies/:orderId" element={<RemediesPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="whats-inside" element={<WhatsInsidePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="legal" element={<Navigate to="/legal/privacy" replace />} />
            <Route path="legal/:section" element={<LegalPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}
