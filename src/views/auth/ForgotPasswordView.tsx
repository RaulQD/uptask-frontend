import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordForm } from '../../types';
import ErrorMessage from '@/components/ErrorMessage';
import { forgotPassword } from '@/api/AuthAPI';
import { toast } from 'react-toastify';
import { Seo } from '@/components/Seo';

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = {
        email: '',
    };
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
        },
    });

    const handleForgotPassword = (formData: ForgotPasswordForm) =>
        mutate(formData);

    return (
        <>
            <Seo
                title='Reestablecer Password - UpTask'
                description='Reestablece tu contraseña en UpTask y recupera el acceso a tus proyectos.'
                keywords='reestablecer contraseña, uptask, gestión de proyectos'
                canonical='https://raulqd-uptask.netlify.app/auth/forgot-password'
            />
            <h1 className='text-3xl sm:text-4xl font-black text-white text-center md:text-left'>
                Reestablecer Password
            </h1>
            <p className='text-xl sm:text-2xl font-light text-white mt-3 sm:mt-5 text-center md:text-left'>
                ¿Olvidaste tu password? coloca tu email {''}
                <span className='text-fuchsia-500 font-bold block md:inline'>
                    {' '}
                    y reestable tu password
                </span>
            </p>

            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className='space-y-4 p-5 sm:p-8 md:p-10 bg-white mt-6 sm:mt-8 md:mt-10 rounded-md '
                noValidate>
                <div className='flex flex-col gap-5'>
                    <label
                        className='font-normal text-gray-700'
                        htmlFor='email'>
                        Correo electronico
                    </label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Email de Registro'
                        className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('email', {
                            required:
                                'El correo electronico de registro es obligatorio',
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

                <button
                    type='submit'
                    disabled={isPending}
                    className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 sm:p-3 text-white font-bold text-base sm:text-lg cursor-pointer rounded-md transition-colors duration-300 mt-4'>
                    {isPending ? 'Enviando...' : 'Enviar Instrucciones'}
                </button>
            </form>

            <nav className='mt-10 flex flex-col space-y-4'>
                <Link
                    to='/auth/login'
                    className='text-center text-gray-300 hover:text-white transition-colors font-normal'>
                    ¿Ya tienes cuenta?{' '}
                    <span className='text-white font-medium'>
                        Inicia sesión
                    </span>
                </Link>

                <Link
                    to='/auth/register'
                    className='text-center text-gray-300 hover:text-white transition-colors font-normal'>
                    ¿No tienes cuenta?{' '}
                    <span className='text-white font-medium'>Crea una.</span>
                </Link>
            </nav>
        </>
    );
}
