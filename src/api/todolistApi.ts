import axios from "axios";
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
export type TaskType = UpdateTaskModelType & {
    id: string
    todoListId: string
    order?: number
    addedDate?: string
}
type GetTasksResponseType = {
    items: TaskType[]
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
    getTasks(todolistId: string, count: number = 100, page: number = 1) {
        return instance.get<GetTasksResponseType>(`${todolistId}/tasks?count=${count}&page=${page}`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, task: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`${todolistId}/tasks/${taskId}`, {...task})
    }
}
