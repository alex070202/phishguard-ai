import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { t } = useTranslation()
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return <div className="panel p-6 text-sm text-slate-400">{t('errorsPages.checkingSession')}</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
