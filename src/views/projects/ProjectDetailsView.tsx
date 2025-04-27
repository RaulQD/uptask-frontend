import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFullProject } from '@/api/ProjectAPI';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskList from '@/components/tasks/TaskList';
import EditTaskData from '@/components/tasks/EditTaskData';
import TaskModalDetails from '@/components/tasks/TaskModalDetails';
import { useAuth } from '@/hooks/useAuth';
import { isManager } from '@/utils/policies';
import { useMemo, useState } from 'react';
import Spinner from '@/components/Spinner';
import { Seo } from '@/components/Seo';

export default function ProjectDetailsView() {
    const [hideElements, setHideElements] = useState(false);
    const { data: user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const params = useParams();
    const projectId = params.projectId!;
    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProject(projectId),
        retry: false,
    });
    const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);
    if (isLoading && authLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Spinner />
            </div>
        );
    }
    if (isError) return <Navigate to='/404' />;
    if (data && user)
        return (
            <>
                <Seo
                    title='Detalles del Proyecto - UpTask'
                    description='Visualiza los detalles de tu proyecto en UpTask, incluyendo tareas y colaboradores.'
                    keywords='uptask, detalles del proyecto, gestión de proyectos, tareas'
                    canonical={`https://raulqd-uptask.netlify.app/projects/${projectId}`}
                />
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-black capitalize text-center md:text-left'>
                    {data.projectName}
                </h1>
                <p className='text-lg sm:text-xl md:text-2xl font-light text-gray-500 mt-3 sm:mt-4 md:mt-5 text-center md:text-left'>
                    {data.description}
                </p>
                {isManager(data.manager, user._id) && (
                    <nav className='my-4 sm:my-5 flex flex-col sm:flex-row gap-3 justify-center md:justify-start'>
                        <button
                            type='button'
                            className='bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-lg font-bold cursor-pointer transition-colors rounded-md'
                            onClick={() =>
                                navigate(location.pathname + '?newTask=true')
                            }>
                            Agregar tarea
                        </button>

                        <Link
                            to={'team'}
                            className='bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-lg font-bold cursor-pointer transition-colors rounded-md text-center'>
                            Colaboradores
                        </Link>
                    </nav>
                )}

                <TaskList tasks={data.tasks} canEdit={canEdit} />
                <AddTaskModal />
                <EditTaskData />
                <TaskModalDetails
                    hideElements={hideElements}
                    setHideElements={setHideElements}
                />
            </>
        );
}
