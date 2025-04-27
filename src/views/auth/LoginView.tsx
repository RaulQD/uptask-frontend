import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserLoginForm } from '@/types/index';
import ErrorMessage from '@/components/ErrorMessage';
import { authenticateUser } from '@/api/AuthAPI';
import { toast } from 'react-toastify';
import { Seo } from '@/components/Seo';

export default function LoginView() {
    const initialValues: UserLoginForm = {
        email: '',
        password: '',
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: authenticateUser,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            navigate('/');
        },
    });

    const handleLogin = (formData: UserLoginForm) => mutate(formData);

    return (
        <>
            <Seo
                title='Iniciar Sesión - UpTask'
                description='Inicia sesión en UpTask y gestiona tus proyectos de manera eficiente.'
                keywords='iniciar sesión, uptask, gestión de proyectos'
                canonical='https://raulqd-uptask.netlify.app/auth/login'
            />
            <h1 className='text-3xl sm:text-4xl font-black text-white text-center md:text-left'>
                Iniciar Sesión
            </h1>
            <p className='text-xl sm:text-2xl font-light text-white mt-3 sm:mt-4 text-center md:text-left'>
                Comienza a planear tus proyectos
                <span className='text-fuchsia-500 font-bold block md:inline'>
                    {' '}
                    iniciando sesión en este formulario
                </span>
            </p>

            <form
                onSubmit={handleSubmit(handleLogin)}
                className='space-y-4 p-5 sm:p-8 md:p-10 mt-6 sm:mt-8 md:mt-10 bg-white rounded-md'
                noValidate>
                <div className='flex flex-col gap-2'>
                    <label className='font-normal text-gray-700'>
                        Correo electrónico
                    </label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Email de Registro'
                        className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('email', {
                            required: 'El correo electronico es obligatorio',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'E-mail no válido',
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='font-normal text-gray-700'>
                        Contraseña
                    </label>

                    <input
                        type='password'
                        placeholder='Password de Registro'
                        className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('password', {
                            required: 'La contraseña es obligatorio',
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <button
                    type='submit'
                    className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white rounded-md font-medium cursor-pointer'>
                    Iniciar Sesión
                </button>
            </form>

            <nav className='mt-5 flex flex-col space-y-3 sm:space-y-4'>
                <Link
                    to={'/auth/register'}
                    className='text-center text-gray-300 hover:text-white transition-colors font-normal'>
                    ¿No tienes cuenta?{' '}
                    <span className='text-white font-medium'>Crear una.</span>
                </Link>

                <Link
                    to={'/auth/forgot-password'}
                    className='text-center text-gray-300 hover:text-white transition-colors font-normal'>
                    ¿Olvidaste tu contraseña?{' '}
                    <span className='text-white font-medium'>
                        {' '}
                        Reestablecer.
                    </span>
                </Link>
            </nav>
        </>
    );
}
