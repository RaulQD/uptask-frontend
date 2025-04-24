import api from "@/lib/axios";
import { SubTask, SubTaskFormData, subTaskListSchema, Task } from "../types";
import { isAxiosError } from "axios";

type SubTaskAPIType = {
  formData: SubTaskFormData
  taskId: Task['_id']
  subTaskId: SubTask['_id'],
  completed: SubTask['completed']
}



export async function createSubTask({ formData, taskId }: Pick<SubTaskAPIType, 'taskId' | 'formData'>) {
  try {
    const { data } = await api.post(`/tasks/${taskId}/subtasks`, formData)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
export async function getSubTasksByTaksId(taskId: Task['_id']) {
  try {
    const url = `/tasks/${taskId}/subtasks`
    const { data } = await api.get(url);
    const response = subTaskListSchema.safeParse(data);
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error;
  }
}
export async function updateSubTaskStatus({ taskId, subTaskId, completed }: Pick<SubTaskAPIType, 'taskId' | 'subTaskId' | 'completed'>) {
  try {

    const url = `/tasks/${taskId}/subtasks/${subTaskId}/completed`
    const { data } = await api.patch(url, { completed })
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
export async function updateSubTask({ taskId, subTaskId, formData }: Pick<SubTaskAPIType, 'taskId' | 'subTaskId' | 'formData'>) {
  try {
    const { data } = await api.put(`/tasks/${taskId}/subtasks/${subTaskId}`, formData)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
export async function deleteSubTasks({ taskId, subTaskId }: Pick<SubTaskAPIType, 'taskId' | 'subTaskId'>) {

  try {
    const url = `/tasks/${taskId}/subtasks/${subTaskId}`
    const { data } = await api.delete(url);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
export async function deleteAllSubTasksByTaskId({ taskId }: Pick<SubTaskAPIType, 'taskId'>) {
  try {
    const url = `/tasks/${taskId}/subtasks/all`
    const { data } = await api.delete(url);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

