import { isAxiosError } from "axios";
import { editProjectSchema, Note, NoteFormData, noteListSchema, Project, Task } from "../types";
import api from "@/lib/axios";

type NoteAPIType = {
    formData: NoteFormData
    projectId: Project['_id']
    taskId: Task['_id']
    noteId: Note['_id']
}

export async function createNote({ projectId, taskId, formData }: Pick<NoteAPIType, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getNote({ projectId, taskId, noteId }: Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'>) {
    try {
        const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}/notes/${noteId}`)
        const response = editProjectSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        console.log(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
export async function getTaskNotes(projectId: Project['_id'], taskId: Task['_id']) {
    try {
        const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}/notes`)
        const response = noteListSchema.safeParse(data)
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

export async function updateNote({ projectId, taskId, noteId, formData }: Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId' | 'formData'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
        const { data } = await api.put(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteNote({ projectId, taskId, noteId }: Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}