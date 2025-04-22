import { flip, offset, shift } from '@floating-ui/dom';
import { autoUpdate } from '@floating-ui/react';
import { useFloating } from '@floating-ui/react-dom';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Fragment, useRef } from 'react';
import { SubTask } from '../types';

type DeleteSubTasksProps = {
    onDelete: (subTaskId: string) => void;
    subTaskId: SubTask['_id'];
};

export default function DeleteSubTaskPopover({
    onDelete,
    subTaskId,
}: DeleteSubTasksProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const { refs, floatingStyles } = useFloating({
        placement: 'bottom-end',
        middleware: [offset({ mainAxis: 4 }), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });
    return (
        <>
            <Menu as='div' className='relative flex-none'>
                <>
                    <Menu.Button
                        ref={(node) => {
                            refs.setReference(node);
                            buttonRef.current = node;
                        }}
                        className='invisible group-hover:visible p-1 rounded-full bg-[#cdd1d6] hover:bg-[#C5CAD2] transition-colors'>
                        <span className='sr-only'>opciones</span>
                        <EllipsisHorizontalIcon className='w-4 h-4 text-slate-600 hover:text-slate-700' />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'>
                        <Menu.Items
                            ref={(node) => {
                                refs.setFloating(node);
                                panelRef.current = node;
                            }}
                            style={floatingStyles}
                            className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        type='button'
                                        className={`${
                                            active ? 'bg-gray-100' : ''
                                        } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                                        onClick={() => onDelete(subTaskId)}>
                                        <TrashIcon className='w-4 h-4 mr-2 text-red-500' />
                                        Eliminar subtarea
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </>
            </Menu>
        </>
    );
}
