import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { formatDate } from '@/utils/utils';
import { TaskStatus } from '@/types/index';
import { statusTranslations } from '@/locales/es';
import NotesPanel from '../notes/NotesPanel';
import SubTaskPanel from '../subtask/SubTaskPanel';
import { ListBulletIcon } from '@heroicons/react/20/solid';
import { Bars3BottomLeftIcon, SwatchIcon } from '@heroicons/react/24/outline';

type TaskModalDetailsProps = {
    hideElements: boolean;
    setHideElements: (value: boolean) => void;
};

export default function TaskModalDetails({
    hideElements,
    setHideElements,
}: TaskModalDetailsProps) {
    const [hideCompleted, setHideCompleted] = useState(false);
    const params = useParams();
    const projectId = params.projectId!;
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('viewTask')!;

    const show = taskId ? true : false;

    const { data, isError, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId,
        retry: false,
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TaskStatus;
        const data = { projectId, taskId, status };
        mutate(data);
    };

    if (isError) {
        toast.error(error.message, { toastId: 'error' });
        return <Navigate to={`/projects/${projectId}`} />;
    }

    if (data)
        return (
            <>
                <Transition appear show={show} as={Fragment}>
                    <Dialog
                        as='div'
                        className='relative z-10'
                        onClose={() =>
                            navigate(location.pathname, { replace: true })
                        }>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'>
                            <div className='fixed inset-0 bg-black/60' />
                        </Transition.Child>

                        <div className='fixed inset-0 overflow-y-auto '>
                            <div className='flex min-h-full items-center justify-center p-4 text-center '>
                                <Transition.Child
                                    as={Fragment}
                                    enter='ease-out duration-300'
                                    enterFrom='opacity-0 scale-95'
                                    enterTo='opacity-100 scale-100'
                                    leave='ease-in duration-200'
                                    leaveFrom='opacity-100 scale-100'
                                    leaveTo='opacity-0 scale-95'>
                                    <Dialog.Panel className='w-full max-w-[800px] transform overflow-hidden rounded-2xl bg-[#F1F2F4] text-left align-middle shadow-xl transition-all p-10 '>
                                        <p className='text-sm text-slate-400'>
                                            Agregada el
                                            {formatDate(data.createdAt)}
                                        </p>
                                        <p className='text-sm text-slate-400'>
                                            Última actualización:
                                            {formatDate(data.updatedAt)}
                                        </p>

                                        <Dialog.Title
                                            as='h3'
                                            className='font-black text-2xl text-slate-600 mt-5'>
                                            {data.name}{' '}
                                        </Dialog.Title>
                                        <div className='mt-5 flex flex-col gap-y-3 '>
                                            <h3 className='font-medium text-slate-600 flex items-center gap-2 '>
                                                <Bars3BottomLeftIcon className='w-5 h-5' />
                                                Descripción
                                            </h3>
                                            <p className='pl-8 text-slate-600 mb-6 mt-1'>
                                                {data.description}
                                            </p>
                                        </div>
                                        <SubTaskPanel
                                            hideCompleted={hideCompleted}
                                            setHideCompleted={setHideCompleted}
                                        />
                                        {data.completedBy.length ? (
                                            <>
                                                <div className='flex items-center justify-between mt-5 mb-4'>
                                                    <p className='font-semibold  text-slate-600 flex items-center gap-2'>
                                                        <ListBulletIcon className='w-5 h-5 inline-block' />
                                                        Historial de Cambios
                                                    </p>
                                                    <button
                                                        className='text-sm bg-[#d0d4db] text-[#2D3F5E] font-medium px-3 py-2 rounded hover:bg-[#c4c8d4] transition-colors'
                                                        onClick={() =>
                                                            setHideElements(
                                                                !hideElements
                                                            )
                                                        }>
                                                        {hideElements
                                                            ? 'Ocultar detalles'
                                                            : 'Mostrar detalles'}
                                                    </button>
                                                </div>
                                                {hideElements && (
                                                    <ul className='list-decimal list-inside pl-8'>
                                                        {data.completedBy.map(
                                                            (activityLog) => (
                                                                <li
                                                                    key={
                                                                        activityLog._id
                                                                    }
                                                                    className='mb-1'>
                                                                    <span className='font-bold text-slate-700'>
                                                                        {
                                                                            statusTranslations[
                                                                                activityLog
                                                                                    .status
                                                                            ]
                                                                        }{' '}
                                                                        por:
                                                                    </span>{' '}
                                                                    {
                                                                        activityLog
                                                                            .user
                                                                            .name
                                                                    }
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </>
                                        ) : null}

                                        <div className='my-5 space-y-3'>
                                            <label className='font-semibold  text-slate-600 flex items-center gap-2'>
                                                <SwatchIcon className='w-5 h-5' />
                                                Estado Actual
                                            </label>
                                            <div className='pl-8'>
                                                <select
                                                    className='w-full p-3 bg-white border border-gray-300 text-sm rounded-md '
                                                    defaultValue={data.status}
                                                    onChange={handleChange}>
                                                    {Object.entries(
                                                        statusTranslations
                                                    ).map(([key, value]) => (
                                                        <option
                                                            key={key}
                                                            value={key}>
                                                            {value}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <NotesPanel />
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>
        );
}
