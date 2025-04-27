export default function Logo() {
    return (
       <div className="flex justify-center">
         <img
            src='/logo.svg'
            alt='Logotipo UpTask'
            // style={{ width: '100%', height: 'auto' }}
            className='w-full h-auto '
            loading='lazy'
        />
       </div>
    );
}
