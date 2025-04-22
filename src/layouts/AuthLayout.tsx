import Logo from '@/components/Logo';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout() {
    return (
        <>
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
