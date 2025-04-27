import ProjectForm from './ProjectForm';
import { Link, useNavigate } from 'react-router-dom';
import { Project, ProjectFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '@/api/ProjectAPI';
import { toast } from 'react-toastify';

type EditProjectFormProps = {
    data: ProjectFormData;
    projectId: Project['_id'];
};

export default function EditProjectForm({
    data,
    projectId,
}: EditProjectFormProps) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            projectName: data.projectName,
            clientName: data.clientName,
            description: data.description,
        },
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({
                queryKey: ['editProject', projectId],
            });
            toast.success(data);
            navigate('/');
        },
    });

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId,
        };
        mutate(data);
    };

    return (
        <>
            <div className='max-w-3xl mx-auto '>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-black text-center sm:text-left'>
                    Crear Proyecto
                </h1>
                <p className='text-lg sm:text-xl md:text-2xl font-light text-gray-500 mt-3 sm:mt-5 text-center sm:text-left'>
                    Llena el siguiente formulario para editar un proyecto
                </p>

                <nav className='my-4 sm:my-5 flex justify-center sm:justify-start'>
                    <Link
                        className='bg-purple-400 hover:bg-purple-500 px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-white text-base sm:text-lg md:text-xl font-bold cursor-pointer transition-colors rounded-md'
                        to='/'>
                        Volver a Proyectos
                    </Link>
                </nav>

                <form
                    className='mt-6 sm:mt-8 md:mt-10 bg-white shadow-lg p-5 sm:p-8 md:p-10 rounded-lg'
                    onSubmit={handleSubmit(handleForm)}
                    noValidate>
                    <ProjectForm register={register} errors={errors} />

                    <button
                        type='submit'
                        className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 sm:p-3 text-white font-medium transition-colors rounded-md mt-4 sm:mt-6'>
                        Guardar cambios
                    </button>
                </form>
            </div>
        </>
    );
}
