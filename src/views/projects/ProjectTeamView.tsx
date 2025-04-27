import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AddMemberModal from '@/components/team/AddMemberModal';
import { getProjectTeam, removeUserFromProject } from '@/api/TeamAPI';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import { Seo } from '@/components/Seo';

export default function ProjectTeamView() {
    const navigate = useNavigate();
    const params = useParams();
    const projectId = params.projectId!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['projectTeam', projectId],
        queryFn: () => getProjectTeam(projectId),
        retry: false,
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: removeUserFromProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({
                queryKey: ['projectTeam', projectId],
            });
        },
    });

    if (isLoading) {
        <div className='flex justify-center items-center h-screen'>
            <Spinner />
        </div>;
    }
    if (isError) return <Navigate to={'/404'} />;
    if (data)
        return (
            <>
                <Seo
                    title='Administrar Equipo - UpTask'
                    description='Administra el equipo de trabajo para tu proyecto en UpTask.'
                    keywords='uptask, administrar equipo, gestión de proyectos, colaboradores'
                    canonical={`https://raulqd-uptask.netlify.app/projects/${projectId}/team`}
                />
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-black text-center sm:text-left'>
                    Administrar equipo
                </h1>
                <p className='text-lg sm:text-xl md:text-2xl font-light text-gray-500 mt-3 sm:mt-5 text-center sm:text-left'>
                    Administra el equipo de trabajo para este proyecto
                </p>

                <nav className='my-4 sm:my-5 flex flex-col sm:flex-row gap-3 justify-center md:justify-start'>
                    <button
                        type='button'
                        className='bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 md:px-10 py-3 text-white font-bold cursor-pointer transition-colors rounded-md text-base'
                        onClick={() =>
                            navigate(location.pathname + '?addMember=true')
                        }>
                        Agregar Colaborador
                    </button>

                    <Link
                        to={`/projects/${projectId}`}
                        className='bg-fuchsia-600 hover:bg-fuchsia-700 px-6 sm:px-8 md:px-10 py-3 text-white font-bold cursor-pointer transition-colors rounded-md text-base text-center'>
                        Volver a Proyecto
                    </Link>
                </nav>

                <h2 className=' text-xl md:text-2xl lg:text-3xl font-black text-center sm:text-left my-8'>
                    Miembros actuales
                </h2>
                {data.length ? (
                    <ul className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                        {data?.map((member) => (
                            <li key={member._id}>
                                <div className='flex justify-between items-start gap-x-6 px-5 py-5 border-gray-100 bg-white shadow-md rounded-md'>
                                    <div className='flex min-w-0 gap-x-4'>
                                        <div className='min-w-0 flex-auto space-y-2'>
                                            <p className='text-lg font-black text-gray-600'>
                                                {member.name}
                                            </p>
                                            <p className='text-sm text-gray-400'>
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex shrink-0 items-center gap-x-6'>
                                        <Menu
                                            as='div'
                                            className='relative flex-none'>
                                            <Menu.Button className='-m-1.5 block p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'>
                                                <span className='sr-only'>
                                                    opciones
                                                </span>
                                                <EllipsisVerticalIcon
                                                    className='h-5 w-5'
                                                    aria-hidden='true'
                                                />
                                            </Menu.Button>
                                            <Transition
                                                as={Fragment}
                                                enter='transition ease-out duration-100'
                                                enterFrom='transform opacity-0 scale-95'
                                                enterTo='transform opacity-100 scale-100'
                                                leave='transition ease-in duration-75'
                                                leaveFrom='transform opacity-100 scale-100'
                                                leaveTo='transform opacity-0 scale-95'>
                                                <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                                                    <Menu.Item>
                                                        <button
                                                            type='button'
                                                            className='block px-3 py-1 text-sm leading-6 text-red-500'
                                                            onClick={() =>
                                                                mutate({
                                                                    projectId,
                                                                    userId: member._id,
                                                                })
                                                            }>
                                                            Eliminar del
                                                            Proyecto
                                                        </button>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-center py-20'>
                        No hay miembros en este equipo
                    </p>
                )}

                <AddMemberModal />
            </>
        );
}
