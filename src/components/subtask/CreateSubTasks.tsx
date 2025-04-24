import { createSubTask } from '@/api/SubTaskAPI';
import { SubTask, SubTaskFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SubTaskForm from './SubTaskForm';
import { Dispatch } from 'react';

type CreateSubTaskProps = {
    setShowForm: Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateSubTasks({ setShowForm }: CreateSubTaskProps) {
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
        onMutate: async (subtasks) => {
            queryClient.cancelQueries({ queryKey: ['subtasks', taskId] });
            const previousSubTasks = queryClient.getQueryData<SubTask[]>([
                'subtasks',
                taskId,
            ]);
            const optimisticSubTask: SubTask = {
                _id: crypto.randomUUID(),
                name: subtasks.formData.name,
                completed: false,
                task: taskId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            queryClient.setQueryData<SubTask[]>(['subtasks', taskId], (old) => {
                if (!old) return [optimisticSubTask];
                return [...old, optimisticSubTask];
            });
            return { previousSubTasks, optimisticSubTask };
        },
        onSuccess: (subtasks, _variables, context) => {
            queryClient.setQueryData<SubTask[]>(['subtasks', taskId], (old) => {
                if (!old) return [subtasks];
                return old.map((cacheSubtask) =>
                    cacheSubtask._id === context?.optimisticSubTask._id
                        ? subtasks
                        : cacheSubtask
                );
            });
            reset();
        },
        onError: (error, _variables, context) => {
            // Si hay un error, revertimos a los datos anteriores
            queryClient.setQueryData<SubTask[]>(['subtasks', taskId], (old) => {
                if (!old) return [];
                return old.filter(
                    (cacheSubTask) =>
                        cacheSubTask._id !== context?.optimisticSubTask._id
                );
            });
            toast.error(error.message);
        },
        onSettled: () => {
            // Opcional, para refetch por seguridad si lo necesitás
            queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
        },
    });
    const handleSubmitForm = (formData: SubTaskFormData) => {
        const data = { taskId, formData };
        mutate(data);
    };
    return (
        <SubTaskForm
            setShowForm={setShowForm}
            onSubmit={handleSubmitForm}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
        />
    );
}
