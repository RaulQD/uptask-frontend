import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ProjectForm from '@/components/projects/ProjectForm';
import { ProjectFormData } from '@/types/index';
import { createProject } from '@/api/ProjectAPI';
import { Seo } from '@/components/Seo';

export default function CreateProjectView() {
    const navigate = useNavigate();
    const initialValues: ProjectFormData = {
        projectName: '',
        clientName: '',
        description: '',
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            navigate('/');
        },
    });

    const handleForm = (formData: ProjectFormData) => mutate(formData);

    return (
        <>
            <Seo
                title='Crear Proyecto - UpTask'
                description='Crea un nuevo proyecto en UpTask'
                keywords='crear proyecto, gestión de proyectos, UpTask'
                canonical='https://raulqd-uptask.netlify.app/projects/create'
            />
            <div className='max-w-3xl mx-auto '>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-black text-center sm:text-left'>
                    Crear Proyecto
                </h1>
                <p className='text-lg sm:text-xl md:text-2xl font-light text-gray-500 mt-3 sm:mt-5 text-center sm:text-left'>
                    Llena el siguiente formulario para crear un proyecto
                </p>

                <nav className='my-4 sm:my-5 flex justify-center sm:justify-start'>
                    <Link
                        className='bg-purple-400 hover:bg-purple-500 px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-white text-base sm:text-lg md:text-xl font-bold cursor-pointer transition-colors rounded-md'
                        to='/'>
                        Volver a Proyectos
                    </Link>
                </nav>

                <form
                    className='space-y-4 p-5 sm:p-8 md:p-10 mt-6 sm:mt-8 md:mt-10 bg-white rounded-md'
                    onSubmit={handleSubmit(handleForm)}
                    noValidate>
                    <ProjectForm register={register} errors={errors} />

                    <button
                        type='submit'
                        className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 sm:p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-md '>
                        Crear Proyecto
                    </button>
                </form>
            </div>
        </>
    );
}
