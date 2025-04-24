import { SubTask, SubTaskFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import SubTaskForm from './SubTaskForm';
import { updateSubTask } from '@/api/SubTaskAPI';
import { Dispatch } from 'react';
import { toast } from 'react-toastify';

type UpdateSubTaskProps = {
    subtask: SubTask;
    setEditingSubTask: Dispatch<React.SetStateAction<string | null>>;
};

export default function UpdateSubTask({
    subtask,
    setEditingSubTask,
}: UpdateSubTaskProps) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('viewTask')!;

    const initialValues: SubTaskFormData = {
        name: subtask.name,
    };
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });
    const { mutate: update } = useMutation({
        mutationFn: updateSubTask,
        onMutate: async (subtask) => {
            await queryClient.cancelQueries({ queryKey: ['subtasks', taskId] });
            const previousSubTasks = queryClient.getQueryData<SubTask[]>([
                'subtasks',
                taskId,
            ]);
            // Optimistic update: actualizamos la subtarea en la cache antes de que el servidor responda
            queryClient.setQueryData<SubTask[]>(
                ['subtasks', taskId],
                (oldData) => {
                    return oldData?.map((subTask) =>
                        subTask._id === subtask.subTaskId
                            ? { ...subTask, name: subtask.formData.name }
                            : subTask
                    );
                }
            );
            return { previousSubTasks };
        },
        onError: (error,_variables,context) => {
            queryClient.setQueryData(['subtasks', taskId], context?.previousSubTasks);
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
            reset(initialValues);
        },  
    });
    const handleSubmitForm = (formData: SubTaskFormData) => {
        const data = {
            formData,
            subTaskId: subtask._id,
            taskId,
        }
        update(data);
        setEditingSubTask(null);
    };

    return (
        <SubTaskForm
            setShowForm={() => setEditingSubTask(null)}
            onSubmit={handleSubmitForm}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
        />
    );
}
