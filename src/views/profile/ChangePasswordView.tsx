import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ErrorMessage';
import { UpdateCurrentUserPasswordForm } from '@/types/index';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { changePassword } from '@/api/ProfileAPI';
import { Seo } from '@/components/Seo';

export default function ChangePasswordView() {
    const initialValues: UpdateCurrentUserPasswordForm = {
        current_password: '',
        password: '',
        password_confirmation: '',
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: changePassword,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => toast.success(data),
    });

    const password = watch('password');
    const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) =>
        mutate(formData);

    return (
        <>
            <Seo
                title='Cambiar Password - UpTask'
                description='Cambia tu password de acceso a UpTask.'
                keywords='uptask, cambiar password, gestión de proyectos'
                canonical='https://raulqd-uptask.netlify.app/profile/password'
            />
            <div className='mx-auto max-w-3xl '>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-black text-center sm:text-left'>
                    Cambiar Password
                </h1>
                <p className='text-base sm:text-lg md:text-xl font-light text-gray-500 mt-3 sm:mt-5 text-center sm:text-left'>
                    Utiliza este formulario para cambiar tu password
                </p>
                <form
                    onSubmit={handleSubmit(handleChangePassword)}
                    className='mt-6 sm:mt-8 space-y-4 sm:space-y-5 bg-white shadow-lg p-6 sm:p-8 md:p-10 rounded-lg'
                    noValidate>
                    <div className='mb-4 sm:mb-5 space-y-2 sm:space-y-3'>
                        <label
                            className='text-sm font-medium text-slate-700'
                            htmlFor='current_password'>
                            Contraseña Actual
                        </label>
                        <input
                            id='current_password'
                            type='password'
                            placeholder='Contraseña actual'
                            className='w-full p-2 border border-gray-200 rounded-md text-sm'
                            {...register('current_password', {
                                required: 'La contraseña actual es obligatorio',
                            })}
                        />
                        {errors.current_password && (
                            <ErrorMessage>
                                {errors.current_password.message}
                            </ErrorMessage>
                        )}
                    </div>

                    <div className="mb-4 sm:mb-5 space-y-2 sm:space-y-3">
                        <label
                            className='text-sm font-medium text-slate-700'
                            htmlFor='password'>
                            Nuevo Password
                        </label>
                        <input
                            id='password'
                            type='password'
                            placeholder='Nueva contraseña'
                            className="w-full p-2 sm:p-3 border border-gray-200 rounded-md text-sm"
                            {...register('password', {
                                required: 'El Nuevo Password es obligatorio',
                                minLength: {
                                    value: 8,
                                    message:
                                        'El Password debe ser mínimo de 8 caracteres',
                                },
                            })}
                        />
                        {errors.password && (
                            <ErrorMessage>
                                {errors.password.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="mb-4 sm:mb-5 space-y-2 sm:space-y-3">
                        <label
                            htmlFor='password_confirmation'
                            className='text-sm font-medium text-slate-700'>
                            Repetir contraseña
                        </label>

                        <input
                            id='password_confirmation'
                            type='password'
                            placeholder='Repetir Contraseña'
                          className="w-full p-2 sm:p-3 border border-gray-200 rounded-md text-sm"
                            {...register('password_confirmation', {
                                required: 'Este campo es obligatorio',
                                validate: (value) =>
                                    value === password ||
                                    'Las contraseñas no son iguales',
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
                        value='Cambiar Password'
                        className="bg-fuchsia-600 w-full p-2 sm:p-3 text-white font-medium hover:bg-fuchsia-700 cursor-pointer transition-colors rounded-md text-sm sm:text-base mt-4"
                    />
                </form>
            </div>
        </>
    );
}
