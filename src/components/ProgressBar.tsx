import { SubTask } from '../types';

type ProgressBarProps = {
    subtask: SubTask[];
};

export default function ProgressBar({ subtask }: ProgressBarProps) {
    // Calculate the progress percentage based on completed subtasks
    const total = subtask.length;
    //FILTRAMOS LAS SUBTAREAS QUE ESTAN COMPLETADAS Y CONTAMOS CUANTAS HAY
    const completedSubTask = subtask.filter(
        (subtask) => subtask.completed
    ).length;
    //VERIFICAMOS SI EL TOTAL ES 0, SI NO ES 0, DIVIDIMOS EL TOTAL DE SUBTAREAS COMPLETADAS ENTRE EL TOTAL DE SUBTAREAS Y MULTIPLICAMOS POR 100 PARA OBTENER EL PORCENTAJE
    const progress = total === 0 ? 0 : (completedSubTask / total) * 100;

    return (
        <div className=' flex items-center gap-2'>
            <div className='flex justify-between mb-1'>
                
                <span className='text-sm text-gray-500'>
                    {Math.round(progress)}%
                </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                    className='bg-gray-600 h-2 rounded-full transition-all duration-300'
                    style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}
