import { NoteFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../ErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/api/NoteAPI';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function AddNoteForm() {
    const [isEditing, setIsEditing] = useState(false);

    const params = useParams();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const projectId = params.projectId!;
    const taskId = queryParams.get('viewTask')!;

    const initialValues: NoteFormData = {
        content: '',
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: createNote,

        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            //para refetch por seguridad si lo necesitás
            queryClient.invalidateQueries({
                queryKey: ['notes', projectId, taskId],
            });
        },
    });
    const handleAddNote = (formData: NoteFormData) => {
        mutate({ projectId, taskId, formData });
        setIsEditing(false);
        reset();
    };

    return (
        <div className='space-y-3'>
            <h3 className='text-xl font-medium flex items-center gap-2 text-slate-600'>
                <ClipboardDocumentListIcon className='w-6 h-6' />
                Notas
            </h3>
            {!isEditing ? (
                <div className='pl-8'>
                    <div
                        className='bg-white text-black p-3 rounded-md border-black shadow cursor-pointer hover:bg-gray-50'
                        onClick={() => setIsEditing(true)}>
                        <p className='text-sm text-gray-400 '>
                            Agregar un comentario o una nota a la tarea.
                        </p>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(handleAddNote)}
                    className='space-y-3 pl-8'
                    noValidate>
                    <textarea
                        id='content'
                        disabled={isPending}
                        placeholder='Escribe una nota'
                        className='w-full border border-gray-300 rounded-md text-sm resize-none'
                        rows={3}
                        {...register('content', {
                            required: 'El Contenido de la nota es obligatorio',
                        })}
                    />
                    {errors.content && (
                        <ErrorMessage>{errors.content.message}</ErrorMessage>
                    )}
                    <div className='flex gap-2'>
                        <button
                            type='submit'
                            disabled={isPending}
                            className='text-sm bg-fuchsia-600 hover:bg-purple-700 rounded-md px-4 py-2 text-white'>
                            {isPending ? 'Cargando...' : 'Guardar nota'}
                        </button>
                        <button
                            type='button'
                            onClick={() => {
                                setIsEditing(false);
                                reset();
                            }}
                            className='text-sm bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
