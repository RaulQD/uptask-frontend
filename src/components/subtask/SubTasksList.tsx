import { deleteSubTasks, updateSubTaskStatus } from '@/api/SubTaskAPI';
import { SubTask } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteSubTaskPopover from '../DeleteSubTaskPopover';

type subTaskProps = {
    subtask: SubTask[];
};

export default function SubTasksList({ subtask }: subTaskProps) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('viewTask')!;

    const { mutate } = useMutation({
        mutationFn: updateSubTaskStatus,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            // queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
            queryClient.setQueryData(
                ['subtasks', taskId],
                (oldData: SubTask[]) => {
                    const updatedSubTasks = oldData.map((subTask: SubTask) =>
                        subTask._id === data.subTaskId
                            ? { ...subTask, completed: data.completed }
                            : subTask
                    );
                    return updatedSubTasks;
                }
            );
        },
    });
    const { mutate: removeSubTasks } = useMutation({
        mutationFn: deleteSubTasks,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
            // queryClient.setQueryData(
            //     ['subtask', taskId],
            //     (oldData: SubTask[]) => {
            //         const deleteSubTasks = oldData.filter(
            //             (subTask: SubTask) => subTask._id !== data.subTaskId
            //         );
            //         return deleteSubTasks;
            //     }
            // );
        },
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const completed = e.target.checked;
        const subTaskId = e.target.value;
        const data = { taskId, subTaskId, completed };
        console.log(data);
        mutate(data);
    };
    const handleDeleteSubTasks = (subTaskId: string) => {
        const data = {
            taskId,
            subTaskId,
        };
        console.log(data);
        removeSubTasks(data);
    };

    return (
        <form>
            <ul className='mb-2'>
                {subtask.map((subtask) => (
                    <li key={subtask._id} className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            defaultChecked={subtask.completed}
                            value={subtask._id}
                            onChange={handleChange}
                            className='w-4 h-4 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500'
                        />
                        <div className='group hover:bg-[#E4E6EA] py-1 px-2 h-[38px] rounded-xl flex items-center justify-between w-full transition-colors'>
                            <p
                                className={`${
                                    subtask.completed === true
                                        ? 'line-through opacity-50'
                                        : ' no-underline'
                                } text-slate-700 text-sm`}>
                                {subtask.name}
                            </p>
                            <DeleteSubTaskPopover
                                onDelete={handleDeleteSubTasks}
                                subTaskId={subtask._id}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </form>
    );
}
