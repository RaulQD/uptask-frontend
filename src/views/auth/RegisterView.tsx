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
            <h1 className='text-4xl font-black text-white'>Crear Cuenta</h1>
            <p className='text-2xl font-light text-white mt-5'>
                Llena el formulario para {''}
                <span className=' text-fuchsia-500 font-bold'>
                    {' '}
                    crear tu cuenta
                </span>
            </p>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className='space-y-4 p-10 bg-white mt-10'
                noValidate>
                <div className='flex flex-col gap-2'>
                    <label className='font-normal text-lg' htmlFor='email'>
                        Correo Electronico
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
                    <label className='font-normal text-lg'>Nombre</label>
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
                    <label className='font-normal text-lg'>Contraseña</label>

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
                    <label className='font-normal text-lg'>
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

                <input
                    type='submit'
                    value='Registrarme'
                    className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-lg cursor-pointer'
                />
            </form>

            <nav className='mt-10 flex flex-col space-y-4'>
                <Link
                    to={'/auth/login'}
                    className='text-center text-gray-300 font-normal'>
                    ¿Ya tienes cuenta?{' '}
                    <span className='text-fuchsia-500 font-medium'>
                        Iniciar Sesión.
                    </span>
                </Link>

                <Link
                    to={'/auth/forgot-password'}
                    className='text-center text-gray-300 font-normal'>
                    ¿Olvidaste tu contraseña?{' '}
                    <span className='text-fuchsia-500 font-medium'>
                        Reestablecer.
                    </span>
                </Link>
            </nav>
        </>
    );
}
