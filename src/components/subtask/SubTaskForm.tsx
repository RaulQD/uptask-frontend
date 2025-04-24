import { SubTaskFormData } from '@/types/index';
import {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from '../ErrorMessage';
import { Dispatch } from 'react';

type SubTaskFormProps = {
    setShowForm?: Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (formData: SubTaskFormData) => void;
    handleSubmit: UseFormHandleSubmit<SubTaskFormData, undefined>;
    register: UseFormRegister<SubTaskFormData>;
    errors: FieldErrors<SubTaskFormData>;
};

export default function SubTaskForm({
    setShowForm,
    onSubmit,
    handleSubmit,
    register,
    errors,
}: SubTaskFormProps) {
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className='flex flex-col items-start gap-2'>
                <input
                    id='name'
                    type='text'
                    placeholder='Añadir subtarea'
                    className='border border-gray-300 rounded-md p-2 w-full text-sm'
                    {...register('name', {
                        required: 'El nombre de la subtarea es obligatorio.',
                    })}
                />
                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
                <div className='flex gap-2'>
                    <button
                        type='submit'
                        className='bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors text-white font-medium rounded-md px-4 py-2 text-sm'>
                        Añadir
                    </button>
                    <button
                        type='button'
                        className='bg-transparent hover:hover:bg-[#c4c8d4] text-[#2D3F5E] font-medium rounded-md px-4 py-2 text-sm transition-colors'
                        onClick={() => setShowForm?.(false)}>
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    );
}
