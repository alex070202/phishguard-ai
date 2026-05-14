import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import About from './pages/About.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home.jsx'
import ImageDetector from './pages/ImageDetector.jsx'
import PhishingAnalyzer from './pages/PhishingAnalyzer.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phishing" element={<PhishingAnalyzer />} />
          <Route path="/image-detector" element={<ImageDetector />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
