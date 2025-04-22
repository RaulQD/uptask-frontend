import { PencilSquareIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import SubTaskForm from './SubTaskForm';
import SubTasksList from './SubTasksList';
import ProgressBar from '../ProgressBar';
import { useQuery } from '@tanstack/react-query';
import { getSubTasksByTaksId } from '@/api/SubTaskAPI';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../Spinner';

export default function SubTaskPanel() {
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('viewTask')!;
    const [isCreating, setIsCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { data: subTasks, isLoading } = useQuery({
        queryKey: ['subtasks', taskId],
        queryFn: () => getSubTasksByTaksId(taskId),
        retry: false,
    });
    // const canDelete = useMemo( () => data?_id === )
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
                        <div className='flex items-center justify-between mb-3'>
                            <h3 className='text-xl font-medium text-slate-600 flex items-center gap-2'>
                                <PencilSquareIcon className='w-5 h-5' />
                                Subtarea
                            </h3>
                            <button
                                className='text-sm bg-[#d0d4db] text-[#2D3F5E] font-medium px-3 py-2 rounded hover:bg-[#c4c8d4]'
                                onClick={() => {
                                    setIsCreating(false);
                                    setShowForm(false);
                                }}>
                                Eliminar
                            </button>
                        </div>
                        <ProgressBar subtask={subTasks} />
                        <SubTasksList subtask={subTasks} />
                        {showForm ? (
                            <SubTaskForm setShowForm={setShowForm} />
                        ) : (
                            <button
                                type='button'
                                className='text-sm bg-[#d0d4db] text-[#2D3F5E] font-medium px-3 py-2 rounded hover:bg-[#c4c8d4]'
                                onClick={() => setShowForm(true)}>
                                Añader un elemento.
                            </button>
                        )}
                    </>
                )}
            </>
        );
}
