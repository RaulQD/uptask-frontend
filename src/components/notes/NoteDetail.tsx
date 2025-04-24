import { deleteNote } from '@/api/NoteAPI';
import { useAuth } from '@/hooks/useAuth';
import { Note } from '@/types/index';
import { formatDate } from '@/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import EditNoteForm from './EditNoteForm';
import DeletePopover from '../DeletePopover';

type NoteDetailProps = {
    note: Note;
};

export default function NoteDetail({ note }: NoteDetailProps) {
    const { data, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const canDelete = useMemo(
        () => data?._id === note.createdBy._id,
        [data, note.createdBy._id]
    );
    const canEdit = useMemo(
        () => data?._id === note.createdBy._id,
        [data, note.createdBy._id]
    );
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const projectId = params.projectId!;
    const taskId = queryParams.get('viewTask')!;

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
        },
    });

    const handleDeleteNote = () => {
        mutate({ projectId, taskId, noteId: note._id });
    };
    if (isLoading) return 'Cargando...';

    return (
        <div className='flex justify-between items-center py-2'>
            <div className='flex flex-col gap-2 w-full'>
                <p className='font-semibold'>
                    {note.createdBy.name}
                    <span className='text-xs text-slate-500 ml-2'>
                        {formatDate(note.createdAt)}
                    </span>
                </p>

                {isEditing ? (
                    <EditNoteForm
                        note={note}
                        projectId={projectId}
                        taskId={taskId}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <div className=''>
                        <p className='text-sm bg-white text-black p-2 rounded-md border-black shadow'>
                            {note.content}
                        </p>
                        {note.createdBy._id === data?._id && (
                            <div className='flex items-center gap-x-2 mt-2'>
                                <PencilSquareIcon className='w-4 h-4 ' />
                                <div className='h-1 w-1 bg-gray-600 rounded-full' />
                                {canEdit && (
                                    <button
                                        className='text-xs text-gray-600 cursor-pointer hover:underline'
                                        onClick={() => setIsEditing(true)}>
                                        Modificar
                                    </button>
                                )}
                                <div className='h-1 w-1 bg-gray-600 rounded-full' />
                                {canDelete && (
                                    <DeletePopover
                                        onDelete={() => handleDeleteNote()}
                                        buttonClassName='text-xs text-gray-600 cursor-pointer hover:underline block'
                                        title='¿Desea eliminar la nota?'
                                        description='Eliminar la nota es permanente. No es posible deshacer la operación'
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
