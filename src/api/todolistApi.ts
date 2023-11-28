import axios from "axios";

export type ResponseTodoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}
type UpdateTaskModelType = {
    title?: string
    description?: string
    completed?: boolean
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}
export type ResponseTaskType = UpdateTaskModelType & {
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTasksResponseType = {
    items: ResponseTaskType[]
    totalCount: number
    error: string
}
type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: D
}
const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '8d09abf8-2a50-4564-8e2f-d00a6cf398df'
    }
}
const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists/",
    ...settings
})
export const todoListsApi = {
    getLists() {
        return instance.get<ResponseTodoListType[]>(``)
    },
    createList(title: string) {
        return instance.post<ResponseType<{ item: ResponseTodoListType }>>(``, {title})
    },
    deleteList(todolistId: string) {
        return instance.delete<ResponseType>(`${todolistId}`)
    },
    updateListTitle(todolistId: string, title: string) {
        return instance.put<ResponseType>(`${todolistId}`, {title})
    }
}
export const tasksApi = {
    getTasks(todolistId: string, count: number, page: number) {
        return instance.get<GetTasksResponseType>(`${todolistId}/tasks?count=${count}&page=${page}`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: ResponseTaskType }>>(`${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, task: UpdateTaskModelType) {
        return instance.put<ResponseType>(`${todolistId}/tasks/${taskId}`, {...task})
    }
}
