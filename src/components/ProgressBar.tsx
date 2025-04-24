import { SubTask } from '../types';

type ProgressBarProps = {
    subtask: SubTask[];
    allSubTasksCompleted: boolean;
};

export default function ProgressBar({
    subtask,
    allSubTasksCompleted,
}: ProgressBarProps) {
    // Calculate the progress percentage based on completed subtasks
    const total = subtask.length;
    //FILTRAMOS LAS SUBTAREAS QUE ESTAN COMPLETADAS Y CONTAMOS CUANTAS HAY
    const completedSubTask = subtask.filter(
        (subtask) => subtask.completed
    ).length;
    //VERIFICAMOS SI EL TOTAL ES 0, SI NO ES 0, DIVIDIMOS EL TOTAL DE SUBTAREAS COMPLETADAS ENTRE EL TOTAL DE SUBTAREAS Y MULTIPLICAMOS POR 100 PARA OBTENER EL PORCENTAJE
    const progress = total === 0 ? 0 : (completedSubTask / total) * 100;

    return (
        <div className=' flex justify-between items-center gap-2'>
                <span className='text-xs text-gray-500 min-w-8 text-right'>
                    {Math.round(progress)}%
                </span>
            <div className='w-full bg-gray-200 rounded-full h-1.5'>
                <div
                    className={`${
                        allSubTasksCompleted ? 'bg-green-600' : 'bg-gray-600'
                    } h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}
