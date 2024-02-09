import {clearTodoListsDataAC, createTodoListAC, deleteTodoListAC, setTodoListsAC} from "../TodoList/todoListsReducer";
import {ResponseTaskType, ResponseTodoListType, tasksApi, UpdateTaskModelType} from "api/todolistApi";
import {RequestStatusType, setAppStatus} from "app/appSlice";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AppThunk} from "app/store";


export type TasksActionsType =
    | ReturnType<typeof deleteTaskAC>
    | ReturnType<typeof createTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof createTodoListAC>
    | ReturnType<typeof deleteTodoListAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskEntityStatusAC>
    | ReturnType<typeof setTodoListsAC>
    | ReturnType<typeof clearTodoListsDataAC>

export const initialState: TasksStateT = {}
export type TaskType = ResponseTaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateT = { [todoListId: string]: TaskType[] }

export const tasksReducer = (state: TasksStateT = initialState, action: TasksActionsType): TasksStateT => {
    switch (action.type) {
        case "ADD_TASK":
            return {
                ...state,
                [action.todoListId]:
                    [
                        {...action.task, entityStatus: "succeeded"},
                        ...state[action.todoListId]
                    ]
            }
        case "REMOVE_TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        case "UPDATE_TASK": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => {
                    return t.id === action.taskId
                        ? {
                            ...t,
                            ...action.updateTaskModel
                        }
                        : {
                            ...t,
                        }
                })
            }
        }

        case "SET_TASKS": {
            return {
                ...state,
                [action.todoListId]:
                    action.tasks.map(t => ({...t, entityStatus: "succeeded"}))
            }
        }
        case "TASKS/CHANGE_ENTITY_STATUS": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
                            ...t,
                            entityStatus: action.entityStatus
                        } : t )
            }
        }
        case "REMOVE_TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.payload]
            return {...stateCopy}
        }
        case "ADD_TODOLIST":
            return {...state, [action.payload.id]: []}
        case "SET_TODOS": {
            const stateCopy = {...state}
            action.payload.forEach((tl: ResponseTodoListType) => stateCopy[tl.id] = [])
            return stateCopy
        }
        case "CLEAR_DATA": {
            return {}
        }
        default:
            return state
    }
}


export const createTaskAC = (todoListId: string, task: ResponseTaskType) =>
    ({type: "ADD_TASK", todoListId, task} as const)
export const deleteTaskAC = (todoListId: string, taskId: string) =>
    ({type: "REMOVE_TASK", todoListId, taskId} as const)
export const updateTaskAC = (todoListId: string, taskId: string, updateTaskModel: UpdateTaskModelType) =>
    ({type: "UPDATE_TASK", todoListId, taskId, updateTaskModel} as const)
export const setTasksAC = (todoListId: string, tasks: ResponseTaskType[]) =>
    ({type: "SET_TASKS", todoListId, tasks} as const)
export const changeTaskEntityStatusAC = (todoListId: string, taskId: string, entityStatus: RequestStatusType) =>
    ({type: "TASKS/CHANGE_ENTITY_STATUS", todoListId, taskId, entityStatus} as const)


export const fetchTasks = (todoListId: string): AppThunk =>
    async (dispatch) => {
        dispatch(setAppStatus("loading"))
        const res = await tasksApi.getTasks(todoListId)
        dispatch(setTasksAC(todoListId, res.items))
        dispatch(setAppStatus("succeeded"))
    }
export const createTask = (todoListId: string, title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatus("loading"))
            const res = await tasksApi.createTask(todoListId, title)
            if (res.resultCode === 0) {
                dispatch(createTaskAC(todoListId, res.data.item))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(res, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }

    }
export const deleteTask = (todoListId: string, taskId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatus("loading"))
            dispatch(changeTaskEntityStatusAC(todoListId, taskId, "loading"))

            const res = await tasksApi.deleteTask(todoListId, taskId)
            if (res.resultCode === 0) {
                dispatch(deleteTaskAC(todoListId, taskId))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(res, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }
export const updateTask = (todoListId: string, taskId: string, updateTaskModel: UpdateTaskModelType): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(setAppStatus("loading"))
            dispatch(changeTaskEntityStatusAC(todoListId, taskId, "loading"))
            const tasks = getState().tasks
            const currentTask = tasks[todoListId].find(t => t.id === taskId)

            const res = await tasksApi.updateTask(todoListId, taskId, {
                ...currentTask,
                ...updateTaskModel
            })
            if (res.resultCode === 0) {
                dispatch(updateTaskAC(todoListId, taskId, res.data.item))
                dispatch(setAppStatus("succeeded"))
                dispatch(changeTaskEntityStatusAC(todoListId, taskId, "succeeded"))
            } else {
                handleServerAppError(res, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }

   

