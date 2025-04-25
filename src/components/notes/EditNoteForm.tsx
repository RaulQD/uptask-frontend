import { Note, NoteFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../ErrorMessage';
import { updateNote } from '@/api/NoteAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type NoteFormProps = {
    note: Note;
    projectId: string;
    taskId: string;
    onCancel: () => void;
};

export default function EditNoteForm({
    note,
    projectId,
    taskId,
    onCancel,
}: NoteFormProps) {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        reset,
    } = useForm<NoteFormData>({
        defaultValues: {
            content: note.content,
        },
    });
    const { mutate, isPending } = useMutation({
        mutationFn: updateNote,
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['task', taskId] });
            const previusNote = queryClient.getQueryData<Note[]>([
                'notes',
                projectId,
                taskId,
            ]);
            // Optimistic update: actualizamos la nota en la cache antes de que el servidor responda
            queryClient.setQueryData<Note[]>(
                ['notes', projectId, taskId],
                (oldData) => {
                    return oldData?.map((note) =>
                        note._id === data.noteId
                            ? { ...note, content: data.formData.content }
                            : note
                    );
                }
            );
            return { previusNote };
        },
        onError: (error,_data,context) =>{ 
            queryClient.setQueryData<Note[]>(['notes', projectId, taskId], context?.previusNote);
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', projectId, taskId] });
        },
    });
    const content = watch('content');
    const onSubmit = (formData: NoteFormData) => {
        const data = {
            formData,
            projectId,
            taskId,
            noteId: note._id,
        };
        mutate(data);
        reset();
        onCancel();
       
    };

    return (
        <form
            className='space-y-3'
            onSubmit={handleSubmit(onSubmit)}
            noValidate>
            <textarea
                id='content'
                placeholder='Contenido de la nota'
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
                    disabled={!isDirty || content.trim() === '' || isPending}
                    className={`px-4 py-2 rounded-md text-white ${
                        !isDirty || content.trim() === ''
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors'
                    }`}>
                    {isPending ? 'Cargando...' : 'Guardar cambios'}
                </button>
                <button
                    type='button'
                    className='text-sm bg-[#d0d4db] text-[#2D3F5E] font-medium px-3 py-2 rounded hover:bg-[#c4c8d4]'
                    onClick={onCancel}>
                    Descartar cambios
                </button>
            </div>
        </form>
    );
}
