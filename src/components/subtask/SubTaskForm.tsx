import { SubTaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../ErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createSubTask } from '@/api/SubTaskAPI';
import { toast } from 'react-toastify';

type SubTaskFormProps = {
    setShowForm: Dispatch<React.SetStateAction<boolean>>;
};

export default function SubTaskForm({ setShowForm }: SubTaskFormProps) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('viewTask')!;

    const initialValues: SubTaskFormData = {
        name: '',
    };
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });
    const { mutate } = useMutation({
        mutationFn: createSubTask,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
            reset();
        },
    });
    const handleSubmitForm = (formData: SubTaskFormData) => {
        const data = { taskId, formData };
        mutate(data);
    };
    return (
        <>
            <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
                <div className='flex flex-col items-start gap-2'>
                    <input
                        id='name'
                        type='text'
                        placeholder='Añadir subtarea'
                        className='border border-gray-300 rounded-md p-2 w-full text-sm'
                        {...register('name', {
                            required:
                                'El nombre de la subtarea es obligatorio.',
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
                            onClick={() => setShowForm(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
