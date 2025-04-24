import AddNoteForm from './AddNoteForm';
import NoteDetail from './NoteDetail';
import { useQuery } from '@tanstack/react-query';
import { getTaskNotes } from '@/api/NoteAPI';
import { useParams, useSearchParams } from 'react-router-dom';


export default function NotesPanel() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('viewTask')!;
    const projectId = params.projectId!;

    const { data: notes, isLoading } = useQuery({
        queryKey: ['notes', projectId, taskId],
        queryFn: () => getTaskNotes(projectId, taskId),
        retry: false,
    });
    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-full'>
                <p className='text-gray-500'>Cargando...</p>
            </div>
        );
    }

    return (
        <>
            <AddNoteForm />
            <div className='divide-y divide-gray-100 mt-5'>
                {notes?.map((note) => (
                    <NoteDetail key={note._id} note={note} />
                ))}
            </div>
        </>
    );
}
