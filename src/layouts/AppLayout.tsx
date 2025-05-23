import { Link, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '@/components/Logo';
import NavMenu from '@/components/NavMenu';
import { useAuth } from '@/hooks/useAuth';
import { Seo } from '@/components/Seo';

export default function AppLayout() {
    const { data, isError } = useAuth();
    
    if (isError) {
        return <Navigate to='/auth/login' />;
    }

    if (data)
        return (
            <>
            <Seo 
                title = 'Dashboard - UpTask'
                description = 'Gestión de proyectos y tareas'
                keywords = 'uptask, gestión de proyectos, tareas, dashboard'
            />
                <header className='bg-gray-800 py-5 px-5'>
                    <div className=' max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between items-center'>
                        <div className='w-64'>
                            <Link to={'/'}>
                                <Logo />
                            </Link>
                        </div>

                        <NavMenu name={data.name} />
                    </div>
                </header>

                <section className='max-w-screen-xl mx-auto mt-10 p-5'>
                    <Outlet />
                </section>

                <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
            </>
        );
}
