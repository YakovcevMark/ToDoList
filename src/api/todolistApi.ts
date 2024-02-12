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
    async createList(title: string) {
        let res = await instance.post<ResponseType<{ item: ResponseTodoListType }>>(`todo-lists/`, {title});
        return res.data;
    },
    async deleteList(todolistId: string) {
        let res = await instance.delete<ResponseType>(`todo-lists/${todolistId}`);
        return res.data;

    },
    async updateListTitle(todolistId: string, title: string) {
        let res = await instance.put<ResponseType>(`todo-lists/${todolistId}`, {title});
        return res.data;

    }
}
export const tasksApi = {
    async getTasks(todolistId: string, count: number = 100, page: number = 1) {
        let res = await instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks?count=${count}&page=${page}`);
        return res.data;
    },
    async createTask(todolistId: string, title: string) {
        let res = await instance.post<ResponseType<{
            item: ResponseTaskType
        }>>(`todo-lists/${todolistId}/tasks`, {title});
        return res.data;
    },
    async deleteTask(todolistId: string, taskId: string) {
        let res = await instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
        return res.data;
    },
    async updateTask(todolistId: string, taskId: string, task: UpdateTaskModelType) {
        let res = await instance.put<ResponseType<{
            item: ResponseTaskType
        }>>(`todo-lists/${todolistId}/tasks/${taskId}`, {...task});
        return res.data;
    }
}
export const authAPI = {
    async me() {
        let res = await instance.get<ResponseType<SessionUserInfoType>>("auth/me");
        return res.data;
    },
    async login(userData: FormikValues) {
        let res = await instance.post<ResponseType<{ userId: number }>>("auth/login", {...userData});
        return res.data;
    },
    async logout() {
        let res = await instance.delete<ResponseType>("auth/login");
        return res.data;
    },

}
