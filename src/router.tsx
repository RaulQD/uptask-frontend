import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import ProfileLayout from './layouts/ProfileLayout'

const DashboardView = lazy(() => import('@/views/DashboardView'))
const CreateProjectView = lazy(() => import('./views/projects/CreateProjectView'))
const EditProjectView = lazy(() => import('./views/projects/EditProjectView'))
const ProjectDetailsView = lazy(() => import('./views/projects/ProjectDetailsView'))
const LoginView = lazy(() => import('./views/auth/LoginView'))
const RegisterView = lazy(() => import('./views/auth/RegisterView'))
const ConfirmAccountView = lazy(() => import('./views/auth/ConfirmAccountView'))
const RequestNewCodeView = lazy(() => import('./views/auth/RequestNewCodeView'))
const ForgotPasswordView = lazy(() => import('./views/auth/ForgotPasswordView'))
const NewPasswordView = lazy(() => import('./views/auth/NewPasswordView'))
const ProjectTeamView = lazy(() => import('./views/projects/ProjectTeamView'))
const ProfileView = lazy(() => import('./views/profile/ProfileView'))
const ChangePasswordView = lazy(() => import('./views/profile/ChangePasswordView'))
const NotFound = lazy(() => import('./views/404/NotFound'))


// Componente de carga
const LoadingView = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
    </div>
  )
export default function Router() {

    return (
        
        <BrowserRouter>
            <Suspense fallback={<LoadingView />}>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path='/' element={<DashboardView />} index />
                        <Route path='/projects/create' element={<CreateProjectView />} />
                        <Route path='/projects/:projectId' element={<ProjectDetailsView />} />
                        <Route path='/projects/:projectId/edit' element={<EditProjectView />} />
                        <Route path='/projects/:projectId/team' element={<ProjectTeamView />} />
                        <Route element={<ProfileLayout />}>
                            <Route path='/profile' element={<ProfileView />} />
                            <Route path='/profile/password' element={<ChangePasswordView />} />
                        </Route>
                    </Route>

                    <Route element={<AuthLayout />}>
                        <Route path='/auth/login' element={<LoginView />} />
                        <Route path='/auth/register' element={<RegisterView />} />
                        <Route path='/auth/confirm-account' element={<ConfirmAccountView />} />
                        <Route path='/auth/request-code' element={<RequestNewCodeView />} />
                        <Route path='/auth/forgot-password' element={<ForgotPasswordView />} />
                        <Route path='/auth/new-password' element={<NewPasswordView />} />
                    </Route>

                    <Route element={<AuthLayout />}>
                        <Route path='*' element={<NotFound />}  />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}