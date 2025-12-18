import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/navigation/ProtectedRoute'
import { ROUTES } from '@/constants/routes'
import { GeneratedContentPage } from '@/pages/content/GeneratedContentPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { FlashcardsPage } from '@/pages/flashcards/FlashcardsPage'
import { ProgressPage } from '@/pages/progress/ProgressPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { PlansPage } from '@/pages/settings/PlansPage'
import { StudyPlanPage } from '@/pages/study-plan/StudyPlanPage'
import { UploadCenterPage } from '@/pages/upload/UploadCenterPage'
import { SignInPage } from '@/pages/auth/SignInPage'
import { SignUpPage } from '@/pages/auth/SignUpPage'
import { LandingPage } from '@/pages/landing/LandingPage'

export const router = createBrowserRouter([
  {
    path: ROUTES.landing,
    element: <LandingPage />,
  },
  {
    path: ROUTES.signin,
    element: <SignInPage />,
  },
  {
    path: ROUTES.signup,
    element: <SignUpPage />,
  },
  {
    path: ROUTES.app,
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'upload', element: <UploadCenterPage /> },
          { path: 'documents/:documentId', element: <GeneratedContentPage /> },
          { path: 'study-plan', element: <StudyPlanPage /> },
          { path: 'flashcards', element: <FlashcardsPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'plans', element: <PlansPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.dashboard} replace />,
  },
])
