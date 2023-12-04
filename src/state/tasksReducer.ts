import {createTodoListAC, deleteTodoListAC, setTodoListsAC} from "./todoListsReducer";
import {ResponseTodoListType, tasksApi, TaskType, UpdateTaskModelType} from "../api/todolistApi";
import {AppThunk} from "./store";
import {setAppErrorAC, setAppStatusAC} from "./appReducer";


export type TasksActionsType =
    ReturnType<typeof deleteTaskAC> |
    ReturnType<typeof createTaskAC> |
    ReturnType<typeof updateTaskAC> |
    ReturnType<typeof createTodoListAC> |
    ReturnType<typeof deleteTodoListAC> |
    ReturnType<typeof setTasksAC> |
    ReturnType<typeof setTodoListsAC>


export const initialState: TasksStateT = {}

export type TasksStateT = { [todoListId: string]: TaskType[] }

export const tasksReducer = (state: TasksStateT = initialState, action: TasksActionsType): TasksStateT => {
    switch (action.type) {
        case "ADD_TASK":
            return {
                ...state,
                [action.todoListId]:
                    [
                        {...action.task},
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
        case "REMOVE_TODOLIST": {
            delete state[action.todoListId]
            return {...state}
        }
        case "ADD_TODOLIST":
            return {...state, [action.newTodoListId]: []}
        case "SET_TODOS": {
            const stateCopy = {...state}
            action.todoLists.forEach((tl: ResponseTodoListType) => stateCopy[tl.id] = [])
            return stateCopy
        }
        case "SET_TASKS": {
            return {
                ...state,
                [action.todoListId]: [...action.tasks]
            }
        }
        default:
            return state
    }
}


export const createTaskAC = (todoListId: string, task: TaskType) =>
    ({type: "ADD_TASK", todoListId, task} as const)
export const deleteTaskAC = (todoListId: string, taskId: string) =>
    ({type: "REMOVE_TASK", todoListId, taskId} as const)
export const updateTaskAC = (todoListId: string, taskId: string, updateTaskModel: UpdateTaskModelType) =>
    ({type: "UPDATE_TASK", todoListId, taskId, updateTaskModel} as const)
export const setTasksAC = (todoListId: string, tasks: TaskType[]) =>
    ({type: "SET_TASKS", todoListId, tasks} as const)
export const fetchTasks = (todoListId: string): AppThunk =>
    async (dispatch) => {
        dispatch(setAppStatusAC("loading"))
        const res = await tasksApi.getTasks(todoListId)
        dispatch(setTasksAC(todoListId, res.data.items))
        dispatch(setAppStatusAC("succeeded"))
    }
export const createTask = (todoListId: string, title: string): AppThunk =>
    async (dispatch) => {
        dispatch(setAppStatusAC("loading"))

        const res = await tasksApi.createTask(todoListId, title)
        if (res.data.resultCode === 0) {
            dispatch(createTaskAC(todoListId, res.data.data.item))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            if (res.data.messages.length) {
                dispatch(setAppErrorAC(res.data.messages[0]))
            } else {
                dispatch(setAppErrorAC("Some error occurred"))
            }
            dispatch(setAppStatusAC("failed"))
        }
    }
export const deleteTask = (todoListId: string, taskId: string): AppThunk =>
    async (dispatch) => {
        dispatch(setAppStatusAC("loading"))
        const res = await tasksApi.deleteTask(todoListId, taskId)
        if (res.data.resultCode === 0) {
            dispatch(deleteTaskAC(todoListId, taskId))
            dispatch(setAppStatusAC("succeeded"))
        }
    }
export const updateTask = (todoListId: string, taskId: string, updateTaskModel: UpdateTaskModelType): AppThunk =>
    async (dispatch, getState) => {
        dispatch(setAppStatusAC("loading"))
        const tasks = getState().tasks
        const currentTask = tasks[todoListId].find(t => t.id === taskId)

        const res = await tasksApi.updateTask(todoListId, taskId, {
            ...currentTask,
            ...updateTaskModel
        })
        if (res.data.resultCode === 0) {
            dispatch(updateTaskAC(todoListId, taskId, res.data.data.item))
            dispatch(setAppStatusAC("succeeded"))
        }
    }

   

