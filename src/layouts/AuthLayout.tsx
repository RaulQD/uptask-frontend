import Logo from '@/components/Logo';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout() {
    return (
        <>
            <div className='bg-gray-800 min-h-creen'>
                <div className='py-8 mx-auto w-[450px]'>
                    <Logo />
                    <div className='mt-5'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
    );
}
