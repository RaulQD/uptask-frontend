import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { RequestConfirmationCodeForm } from '../../types';
import ErrorMessage from '@/components/ErrorMessage';
import { requestConfirmationCode } from '@/api/AuthAPI';
import { toast } from 'react-toastify';
import { Seo } from '@/components/Seo';

export default function RegisterView() {
    const initialValues: RequestConfirmationCodeForm = {
        email: '',
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const { mutate,isPending } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
        },
    });

    const handleRequestCode = (formData: RequestConfirmationCodeForm) =>
        mutate(formData);

    return (
        <>
            <Seo
                title='Solicitar Código de Confirmación - UpTask'
                description='Solicita un nuevo código de confirmación para acceder a tu cuenta en UpTask.'
                keywords='código de confirmación, uptask, gestión de proyectos'
                canonical='https://raulqd-uptask.netlify.app/auth/request-code'
            />
            <h1 className='text-3xl sm:text-4xl font-black text-white text-center md:text-left'>
                Solicitar Código de Confirmación
            </h1>
            <p className='text-xl sm:text-2xl font-light text-white mt-3 sm:mt-5 text-center md:text-left'>
                Coloca tu e-mail para recibir {''}
                <span className='text-fuchsia-500 font-bold block md:inline'>
                    {' '}
                    un nuevo código
                </span>
            </p>

            <form
                onSubmit={handleSubmit(handleRequestCode)}
                className='space-y-4 p-5 sm:p-8 md:p-10 bg-white mt-6 sm:mt-8 md:mt-10 rounded-md '
                noValidate>
                <div className='flex flex-col gap-5'>
                    <label
                        className='font-normal  text-gray-700'
                        htmlFor='email'>
                        Email
                    </label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Email de Registro'
                         className='w-full p-2 border-gray-300 border rounded-md'
                        {...register('email', {
                            required: 'El correo electronico de registro es obligatorio.',
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
                    className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer'>
                    {isPending ? 'Enviando...' : 'Enviar Instrucciones'}
                </button>
            </form>

            <nav className='mt-10 flex flex-col space-y-4'>
                <Link
                    to='/auth/login'
                    className='text-center text-gray-300 font-normal'>
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>
                <Link
                    to='/auth/forgot-password'
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
