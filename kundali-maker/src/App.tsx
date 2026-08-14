import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LanguageProvider } from './hooks/useLanguage'
import { GeneratePage } from './pages/GeneratePage'
import { HomePage } from './pages/HomePage'
import { PaymentPage } from './pages/PaymentPage'
import { RemediesPage } from './pages/RemediesPage'
import { ResultPage } from './pages/ResultPage'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="generate" element={<GeneratePage />} />
            <Route path="pay/:orderId" element={<PaymentPage />} />
            <Route path="result/:orderId" element={<ResultPage />} />
            <Route path="remedies/:orderId" element={<RemediesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}
