import { Route, Routes } from 'react-router-dom'
import CookieConsent from './components/CookieConsent.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import About from './pages/About.jsx'
import Admin from './pages/Admin.jsx'
import BannedAccount from './pages/BannedAccount.jsx'
import Contact from './pages/Contact.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FAQ from './pages/FAQ.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Home from './pages/Home.jsx'
import ImageDetector from './pages/ImageDetector.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import PhishingAnalyzer from './pages/PhishingAnalyzer.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Register from './pages/Register.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import SecurityPolicy from './pages/SecurityPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950 text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phishing" element={<PhishingAnalyzer />} />
          <Route path="/image-detector" element={<ImageDetector />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/security-policy" element={<SecurityPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/account-banned" element={<BannedAccount />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  )
}
