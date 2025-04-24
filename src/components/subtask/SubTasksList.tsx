import { deleteSubTasks, updateSubTaskStatus } from '@/api/SubTaskAPI';
import { SubTask } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SubTaskMenu from '../SubTaskMenu';
import UpdateSubTask from './UpdateSubTask';

type subTaskProps = {
    subtask: SubTask[];
};

export default function SubTasksList({ subtask }: subTaskProps) {
    const [editingSubTask, setEditingSubTask] = useState<SubTask['_id'] | null>(
        null
    );
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const taskId = searchParams.get('viewTask')!;

    const { mutate } = useMutation({
        mutationFn: updateSubTaskStatus,
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['subtasks', taskId] });
            const previousSubTasks = queryClient.getQueryData<SubTask[]>([
                'subtasks',
                taskId,
            ]);
            // Optimistic update: actualizamos la subtarea en la cache antes de que el servidor responda
            queryClient.setQueryData<SubTask[]>(
                ['subtasks', taskId],
                (oldData) =>
                    oldData?.map((subTask) =>
                        subTask._id === data.subTaskId
                            ? { ...subTask, completed: data.completed }
                            : subTask
                    )
            );
            return { previousSubTasks };
        },
        onError: (error, _data, context) => {
            // Si hay un error, revertimos a los datos anteriores
            queryClient.setQueryData(
                ['subtasks', taskId],
                context?.previousSubTasks
            );
            toast.error(error.message);
        },
        onSettled: () => {
            // Opcional, para refetch por seguridad
            queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
        },
    });
    const { mutate: removeSubTasks } = useMutation({
        mutationFn: deleteSubTasks,
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['subtasks', taskId] });

            const previousSubTasks = queryClient.getQueryData<SubTask[]>([
                'subtasks',
                taskId,
            ]);
            // Optimistic update: eliminamos la subtarea de la cache antes de que el servidor responda
            queryClient.setQueryData<SubTask[]>(
                ['subtasks', taskId],
                (old = []) => old.filter((sub) => sub._id !== data.subTaskId)
            );

            return { previousSubTasks };
        },
        onError: (err, _data, context) => {
            // Si hay un error, revertimos a los datos anteriores
            queryClient.setQueryData(
                ['subtasks', taskId],
                context?.previousSubTasks
            );
            toast.error(err.message);
        },
        onSettled: () => {
            // Opcional, para refetch por seguridad
            queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
        },
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const completed = e.target.checked;
        const subTaskId = e.target.value;
        const data = { taskId, subTaskId, completed };
        mutate(data);
    };
    const handleDeleteSubTasks = (subTaskId: string) => {
        const data = {
            taskId,
            subTaskId,
        };
        removeSubTasks(data);
    };
    const handleShowForm = (subTaskId: string) => {
        setEditingSubTask(subTaskId);
    };

    return (
        <ul className='mb-2'>
            {subtask.map((item) => (
                <li key={item._id} className='flex gap-2 items-start '>
                    <input
                        type='checkbox'
                        defaultChecked={item.completed}
                        value={item._id}
                        onChange={handleChange}
                        className={`w-4 h-4 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500 shrink-0 ${
                            editingSubTask === item._id
                                ? 'mt-1 self-start'
                                : 'self-center'
                        }`}
                    />
                    <div className='w-full'>
                        {editingSubTask === item._id ? (
                            <div className='bg-[#E4E6EA] py-3 px-2 rounded-xl w-full'>
                                <UpdateSubTask
                                    subtask={item}
                                    setEditingSubTask={setEditingSubTask}
                                />
                            </div>
                        ) : (
                            <div
                                className='group hover:bg-[#E4E6EA] py-1.5 px-2  rounded-xl flex items-center justify-between w-full transition-colors cursor-pointer'
                                onClick={() => handleShowForm(item._id)}>
                                <p
                                    className={`${
                                        item.completed === true
                                            ? 'line-through opacity-50'
                                            : ' no-underline'
                                    } text-slate-700 text-sm`}>
                                    {item.name}
                                </p>
                                <SubTaskMenu
                                    onDelete={handleDeleteSubTasks}
                                    subTaskId={item._id}
                                />
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
