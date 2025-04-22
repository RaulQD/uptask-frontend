import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from '@floating-ui/react';
import { Popover, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Fragment, useRef } from 'react';

interface DeleteNotePopoverProps {
    onDelete: () => void;
}

export default function DeletePopover({
    onDelete,
}: DeleteNotePopoverProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const { refs, floatingStyles } = useFloating({
        placement: 'bottom-end',
        middleware: [offset({
            mainAxis: 4,
            // crossAxis: 40,
        }), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });
    return (
        <Popover className='relative '>
            {({ open, close }) => (
                <>
                    <Popover.Button
                        ref={(node) => {
                            refs.setReference(node);
                            buttonRef.current = node;
                        }}
                        className='text-xs text-gray-600 cursor-pointer hover:underline block'>
                        Eliminar
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        show={open}
                        enter='transition ease-out duration-200'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-200'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'>
                        <Popover.Panel
                            ref={(node) => {
                                refs.setFloating(node);
                                panelRef.current = node;
                            }}
                            style={floatingStyles}
                            className='absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-[350px]'>
                            <div className='relative'>
                                <h3 className=' font-semibold text-gray-600 text-center mr-4'>
                                    ¿Deseas eliminar este comentario?
                                </h3>
                                <button
                                    type='button'
                                    className=' absolute -top-0.5 right-1 hover:bg-gray-100 p-1 rounded-md'
                                    onClick={() => close()}>
                                    <XMarkIcon className='h-5 w-5 text-gray-400 ' />
                                </button>
                            </div>
                          
                            <p className='text-sm text-gray-600 mt-2'>
                                Eliminar un comentario es permanente. No es
                                posible deshacer la operación.
                            </p>
                            <div className='mt-4 '>
                                <button
                                    className='bg-red-600 text-white px-3 py-1.5 text-sm rounded hover:bg-red-700 w-full'
                                    onClick={() => {
                                        onDelete(), close();
                                    }}>
                                    Elimnar nota
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
