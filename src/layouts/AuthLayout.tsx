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
            <div className='bg-gray-800 '>
                <div className='py-10 mx-auto w-[450px]'>
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
