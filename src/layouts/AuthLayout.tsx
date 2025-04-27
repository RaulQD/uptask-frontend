import Logo from '@/components/Logo';
import { Seo } from '@/components/Seo';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout() {
    return (
        <>  
        <Seo
            title='Iniciar Sesión - UpTask'
            description='Inicia sesión en tu cuenta de UpTask para gestionar tus proyectos y tareas de manera eficiente.'
            keywords='uptask, gestión de proyectos, tareas, iniciar sesión'
        />
            <div className='bg-gray-800 min-h-screen flex items-center justify-center px-4 py-12'>
                <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
                    <Logo />
                    <div className='mt-[60px]'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
    );
}
