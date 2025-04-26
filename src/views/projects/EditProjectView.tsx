import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/api/ProjectAPI';
import EditProjectForm from '@/components/projects/EditProjectForm';
import Spinner from '@/components/Spinner';
import { Seo } from '@/components/Seo';

export default function EditProjectView() {
    const params = useParams();
    const projectId = params.projectId!;
    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false,
    });
    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Spinner />
            </div>
        );
    }
    if (isError) return <Navigate to='/404' />;
    if (data)
        return (
            <>
                <Seo
                    title='Editar Proyecto - UpTask'
                    description='Edita los detalles de tu proyecto en UpTask para mantenerlo actualizado y organizado.'
                    keywords='uptask, editar proyecto, gestión de proyectos, tareas'
                    canonical={`https://raulqd-uptask.netlify.app/projects/${projectId}/edit`}
                />
                <EditProjectForm data={data} projectId={projectId} />
            </>
        );
}
