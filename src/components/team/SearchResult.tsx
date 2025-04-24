import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamMember } from '@/types/index';
import { addUserToProject } from '@/api/TeamAPI';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

type SearchResultProps = {
    user: TeamMember[];
    reset: () => void;
};

export default function SearchResult({ user, reset }: SearchResultProps) {
    const navigate = useNavigate();
    const params = useParams();
    const projectId = params.projectId!;

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
            navigate(location.pathname, { replace: true });
            queryClient.invalidateQueries({
                queryKey: ['projectTeam', projectId],
            });
        },
    });

    const handleAddUserToProject = (userId: string) => {
        const data = {
            projectId,
            id: userId,
        };
        mutate(data);
    };

    return (
        <>
            <ul className='flex flex-col justify-between '>
                {user.map((user) => (
                    <li key={user._id} className='flex justify-between items-center'>
                        <p>{user.name}</p>
                        <button
                            className='text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer'
                            onClick={() => handleAddUserToProject(user._id)}>
                            Agregar al Proyecto
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}
