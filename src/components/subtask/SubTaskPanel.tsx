import { PencilSquareIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import SubTasksList from './SubTasksList';
import ProgressBar from '../ProgressBar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    deleteAllSubTasksByTaskId,
    getSubTasksByTaksId,
} from '@/api/SubTaskAPI';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../Spinner';
import CreateSubTasks from './CreateSubTasks';
import { SubTask } from '@/types/index';
import { toast } from 'react-toastify';
import DeletePopover from '../DeletePopover';

type SubTaskPanelProps = {
    hideCompleted: boolean;
    setHideCompleted: (value: boolean) => void;
};

export default function SubTaskPanel({
    hideCompleted,
    setHideCompleted,
}: SubTaskPanelProps) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('viewTask')!;
    const [isCreating, setIsCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { data: subTasks, isLoading } = useQuery({
        queryKey: ['subtasks', taskId],
        queryFn: () => getSubTasksByTaksId(taskId),
        retry: false,
    });

    const hasCompleted = subTasks?.some((sub) => sub.completed);
    const visibleSubTasks = hideCompleted
        ? subTasks?.filter((sub) => !sub.completed)
        : subTasks;
    //SUBTAREAS COMPLETADAS
    const completedSubTasks = subTasks?.filter((sub) => sub.completed).length;
    //VERIFICAR SI TODAS LAS SUBTAREAS ESTAN COMPLETADAS
    const allSubTasksCompleted = subTasks?.every((sub) => sub.completed);

    const { mutate: removeAllSubTasks } = useMutation({
        mutationFn: deleteAllSubTasksByTaskId,
        onMutate: async () => {
            //CANCELAMOS LAS QUERIES ACTUALES
            await queryClient.cancelQueries({ queryKey: ['subtasks', taskId] });
            //Guardar los datos anteriores
            const previousSubTasks = queryClient.getQueryData<SubTask[]>([
                'subtasks',
                taskId,
            ]);
            //Optimistic update: eliminamos todas las subtareas de la cache antes de que el servidor responda
            queryClient.setQueryData<SubTask[]>(['subtasks', taskId], []);
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
    const handleDeleteAllSubTasks = () => {
        removeAllSubTasks({ taskId });
        setIsCreating(false);
        setShowForm(false);
    };

    if (isLoading) {
        return (
            <div className='flex justify-center items-center'>
                <Spinner />
            </div>
        );
    }
    if (subTasks)
        return (
            <>
                {subTasks.length === 0 && !isCreating ? (
                    <button
                        className='flex items-center gap-1 text-white font-bold py-2 px-3 rounded-md bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors text-sm'
                        onClick={() => {
                            setIsCreating(true);
                            setShowForm(true);
                        }}>
                        <PlusIcon className='w-5 h-5' />
                        Agregar Subtarea
                    </button>
                ) : (
                    <>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2'>
                            <h3 className='font-semibold text-slate-600 flex items-start gap-2'>
                                <PencilSquareIcon className='w-5 h-5' />
                                Subtarea
                            </h3>
                            <div className='flex flex-wrap gap-2 w-full sm:w-auto justify-end'>
                                {hasCompleted && (
                                    <button
                                        className='text-sm bg-[#d0d4db] text-[#2D3F5E] font-medium px-3 py-2 rounded hover:bg-[#c4c8d4] transition-colors'
                                        onClick={() =>
                                            setHideCompleted(!hideCompleted)
                                        }>
                                        {hideCompleted
                                            ? `Mostrar los elementos completados (${completedSubTasks})`
                                            : 'Ocultar los elementos marcados'}
                                    </button>
                                )}
                                <DeletePopover
                                    onDelete={handleDeleteAllSubTasks}
                                    buttonClassName='text-sm bg-[#d0d4db] text-[#2D3F5E] font-medium px-3 py-2 rounded hover:bg-[#c4c8d4] transition-colors'
                                    title='¿Desea eliminar las subtareas?'
                                    description='Eliminar todas las subtareas es una operación permanente e irreversible.'
                                    textButton='Eliminar las subtareas'
                                />
                            </div>
                        </div>
                        <ProgressBar
                            subtask={subTasks}
                            allSubTasksCompleted={allSubTasksCompleted!}
                        />
                        {hideCompleted && allSubTasksCompleted ? (
                            <p className='text-sm text-slate-500 mb-2 pl-8'>
                                ¡Todas las subtareas han sido completadas.!
                            </p>
                        ) : (
                            <SubTasksList subtask={visibleSubTasks!} />
                        )}
                        <div className='md:pl-8'>
                            {showForm ? (
                                <CreateSubTasks setShowForm={setShowForm} />
                            ) : (
                                <button
                                    type='button'
                                    className='text-sm bg-[#d0d4db] text-[#2D3F5E] font-medium px-3 py-2 rounded hover:bg-[#c4c8d4] transition-colors'
                                    onClick={() => setShowForm(true)}>
                                    Añader un elemento
                                </button>
                            )}
                        </div>
                    </>
                )}
            </>
        );
}
