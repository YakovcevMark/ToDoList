import axios from "axios";
import {FormikValues} from "formik";

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type ResponseTodoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type UpdateTaskModelType = {
    description?: string
    title?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type ResponseTaskType = UpdateTaskModelType & {
    id: string
    todoListId: string
    order?: number
    addedDate?: string
}
type GetTasksResponseType = {
    items: ResponseTaskType[]
    totalCount: number
    error: string
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: D
}
export type SessionUserInfoType = {
    id: number,
    email: string,
    login: string
}
const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '8d09abf8-2a50-4564-8e2f-d00a6cf398df'
    }
}
const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    ...settings
})
export const todoListsApi = {
    getLists() {
        return instance.get<ResponseTodoListType[]>(`todo-lists/`)

    },
    createList(title: string) {
        return instance.post<ResponseType<{ item: ResponseTodoListType }>>(`todo-lists/`, {title})
            .then(res => res.data)

    },
    deleteList(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
            .then(res => res.data)

    },
    updateListTitle(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
            .then(res => res.data)

    }
}
export const tasksApi = {
    getTasks(todolistId: string, count: number = 100, page: number = 1) {
        return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks?count=${count}&page=${page}`)
            .then(res => res.data)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: ResponseTaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
            .then(res => res.data)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
            .then(res => res.data)
    },
    updateTask(todolistId: string, taskId: string, task: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: ResponseTaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, {...task})
            .then(res => res.data)
    }
}
export const authAPI = {
    me() {
        return instance.get<ResponseType<SessionUserInfoType>>("auth/me")
            .then(res => res.data)
    },
    login(userData: FormikValues) {
        return instance.post<ResponseType<{ userId: number }>>("auth/login", {...userData})
            .then(res => res.data)
    },
    logout() {
        return instance.delete<ResponseType>("auth/login")
            .then(res => res.data)
    },

}
