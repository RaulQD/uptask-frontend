export default function ErrorMessage({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='text-start text-red-600 font-normal text-sm'>
            {children}.
        </div>
    );
}
