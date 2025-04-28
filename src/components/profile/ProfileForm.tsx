import { useForm } from 'react-hook-form';
import ErrorMessage from '../ErrorMessage';
import { User, UserProfileForm } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/api/ProfileAPI';
import { toast } from 'react-toastify';

type ProfileFormProps = {
    data: User;
};

export default function ProfileForm({ data }: ProfileFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserProfileForm>({ defaultValues: data });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    const handleEditProfile = (formData: UserProfileForm) => mutate(formData);

    return (
        <>
            <div className='mx-auto max-w-3xl '>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-black text-center sm:text-left'>
                    Mi Perfil
                </h1>
                <p className='text-base sm:text-lg font-light text-gray-500 mt-3 sm:mt-5 text-center sm:text-left'>
                    Aquí puedes actualizar tu información
                </p>

                <form
                    onSubmit={handleSubmit(handleEditProfile)}
                    className='mt-6 sm:mt-8 space-y-4 sm:space-y-5 bg-white shadow-lg p-5 sm:p-8 md:p-10 rounded-lg'
                    noValidate>
                    <div className='mb-4 sm:mb-5 space-y-2 sm:space-y-3'>
                        <label className='text-sm font-medium text-slate-700' htmlFor='name'>
                            Nombre
                        </label>
                        <input
                            id='name'
                            type='text'
                            placeholder='Tu Nombre'
                            className='w-full p-2 md:p-3 border border-gray-200 rounded-md text-sm'
                            {...register('name', {
                                required: 'Nombre de usuario es obligatoro',
                            })}
                        />
                        {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                        )}
                    </div>

                    <div className='mb-4 sm:mb-5 space-y-2 sm:space-y-3'>
                        <label
                            className='text-sm font-medium text-slate-700'
                            htmlFor='password'>
                            Correo electronico
                        </label>
                        <input
                            id='text'
                            type='email'
                            placeholder='ejemplo@ejemplo.com'
                            className='w-full p-2 md:p-3 border border-gray-200 rounded-md text-sm'
                            {...register('email', {
                                required: 'El correo electronico es obligatorio',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Correo electronico no válido.',
                                },
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                    <input
                        type='submit'
                        value='Guardar Cambios'
                        className='bg-fuchsia-600 w-full p-3 text-white  font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors rounded-sm'
                    />
                </form>
            </div>
        </>
    );
}
