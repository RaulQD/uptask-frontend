import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import ErrorMessage from '../ErrorMessage';
import { findUserByEmailAndName } from '@/api/TeamAPI';
import SearchResult from './SearchResult';
import Spinner from '../Spinner';

type SearchInput = {
    query: string;
};

export default function AddMemberForm() {
    const initialValues: SearchInput = {
        query: '',
    };
    const params = useParams();
    const projectId = params.projectId!;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const mutation = useMutation({
        mutationFn: findUserByEmailAndName,
    });

    const handleSearchUser = async (formData: SearchInput) => {
        const query = formData.query.trim();
        //VERIFICAR SI ES UN EMAIL O UN NOMBRE
        const isEmail = /\S+@\S+\.\S+/.test(query);

        const data = {
            projectId,
            formData: isEmail ? { email: query } : { name: query },
        };

        mutation.mutate(data);
    };

    const resetData = () => {
        reset(), mutation.reset();
    };

    return (
        <>
            <form
                className='mt-5 space-y-5'
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate>
                <div className='flex flex-col gap-3'>
                    <label className='font-normal ' htmlFor='name'>
                        Correo electronico del usuario
                    </label>
                    <input
                        id='query'
                        type='text'
                        autoComplete='off'
                        placeholder='Correo electronico o nombre'
                        className='w-full p-3 border-gray-300 border rounded-md outline-none'
                        {...register('query')}
                    />
                    {errors.query && (
                        <ErrorMessage>{errors.query.message}</ErrorMessage>
                    )}
                </div>

                <button
                    type='submit'
                    className=' bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  cursor-pointer rounded-md transition-colors'>
                    Buscar Usuario
                </button>
            </form>

            <div className='mt-10'>
                {mutation.isPending && (
                    <div className='flex justify-center'>
                        <Spinner />
                    </div>
                )}
                {mutation.error && (
                    <p className='text-center text-red-500'>
                        {mutation.error.message}
                    </p>
                )}
                {mutation.data && (
                    <SearchResult user={mutation.data} reset={resetData} />
                )}
            </div>
        </>
    );
}
