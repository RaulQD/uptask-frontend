import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserRegistrationForm } from '@/types/index';
import ErrorMessage from '@/components/ErrorMessage';
import { createAccount } from '@/api/AuthAPI';
import { toast } from 'react-toastify';
import { Seo } from '../../components/Seo';

export default function RegisterView() {
    const initialValues: UserRegistrationForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    };

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
        },
    });

    const password = watch('password');

    const handleRegister = (formData: UserRegistrationForm) => mutate(formData);

    return (
        <>
            <Seo
                title='Crear Cuenta - UpTask'
                description='Crea tu cuenta en UpTask y comienza a gestionar tus proyectos de manera eficiente.'
                keywords='crear cuenta, registro, uptask, gestión de proyectos'
                canonical='https://raulqd-uptask.netlify.app/auth/register'
            />
            <h1 className='text-3xl sm:text-4xl font-black text-white text-center md:text-left'>
                Crear Cuenta
            </h1>
            <p className='text-xl sm:text-2xl font-light text-white mt-3 sm:mt-5 text-center md:text-left'>
                Llena el formulario para {''}
                <span className='text-fuchsia-500 font-bold block md:inline'>
                    {' '}
                    crear tu cuenta
                </span>
            </p>
            <form
                onSubmit={handleSubmit(handleRegister)}
                className='space-y-4 p-5 sm:p-8 md:p-10 bg-white mt-6 sm:mt-8 md:mt-10 rounded-md '
                noValidate>
                <div className='flex flex-col gap-2'>
                    <label
                        className='font-normal text-gray-700'
                        htmlFor='email'>
                        Correo Electrónico
                    </label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Email de Registro'
                        className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('email', {
                            required: 'El Email de registro es obligatorio',
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
                    <label className='font-normal  text-gray-700'>
                        Nombre
                    </label>
                    <input
                        type='name'
                        placeholder='Nombre de Registro'
                        className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('name', {
                            required: 'El Nombre de usuario es obligatorio',
                        })}
                    />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='font-normal  text-gray-700'>
                        Contraseña
                    </label>

                    <input
                        type='password'
                        placeholder='Contraseña de Registro'
                        className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('password', {
                            required: 'La contraseña es obligatorio',
                            minLength: {
                                value: 8,
                                message:
                                    'La contraseña debe ser mínimo de 8 caracteres',
                            },
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='font-normal  text-gray-700'>
                        Repetir Contraseña
                    </label>

                    <input
                        id='password_confirmation'
                        type='password'
                        placeholder='Repite contraseña de Registro'
                        className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('password_confirmation', {
                            required: 'Repetir contraseña es obligatorio',
                            validate: (value) =>
                                value === password ||
                                'Los Passwords no son iguales',
                        })}
                    />

                    {errors.password_confirmation && (
                        <ErrorMessage>
                            {errors.password_confirmation.message}
                        </ErrorMessage>
                    )}
                </div>

                <button
                    type='submit'
                    className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 sm:p-3 text-white font-bold text-base sm:text-lg cursor-pointer rounded-md transition-colors duration-300 mt-4'>
                    Registrarme
                </button>
            </form>

            <nav className='mt-5 sm:mt-8 md:mt-10 flex flex-col space-y-3 sm:space-y-4'>
                <Link
                    to={'/auth/login'}
                    className='text-center text-gray-300 hover:text-white transition-colors font-normal'>
                    ¿Ya tienes cuenta?{' '}
                    <span className='text-white font-medium'>
                        Iniciar Sesión.
                    </span>
                </Link>

                <Link
                    to={'/auth/forgot-password'}
                    className='text-center text-gray-300 hover:text-white transition-colors font-normal'>
                    ¿Olvidaste tu contraseña?{' '}
                    <span className='text-white font-medium'>
                        Reestablecer.
                    </span>
                </Link>
            </nav>
        </>
    );
}
