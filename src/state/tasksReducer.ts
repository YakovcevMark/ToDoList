import {v1} from "uuid";
import {addTodoListAC, removeTodoListAC, setTodoListsAC} from "./todoListsReducer";


export type TaskType = {
    id: string
    title: string
    status: boolean
}


export type TasksActionsType =
    ReturnType<typeof removeTaskAC> |
    ReturnType<typeof addTaskAC> |
    ReturnType<typeof changeTaskStatusAC> |
    ReturnType<typeof changeTaskTitleAC> |
    ReturnType<typeof addTodoListAC> |
    ReturnType<typeof removeTodoListAC> |
    ReturnType<typeof setTodoListsAC>


export const initialState = {}

export type TasksStateT = {[p: string]: TaskType[]}

export const tasksReducer = (state: TasksStateT = initialState, action: TasksActionsType): TasksStateT => {
    switch (action.type) {
        case "CHANGE_TASK_STATUS": {
            const findTask = state[action.todoListId].find(t => t.id === action.taskId)
            if (findTask) {
                findTask.status = !findTask.status
            }
            return {...state}
        }
        case "ADD_TASK":
            return {
                ...state,
                [action.todoListId]:
                    [
                        {id: v1(), title: action.newTaskTitle, status: false},
                        ...state[action.todoListId]
                    ]
            }
        case "REMOVE_TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        case "CHANGE_TASK_TITLE": {
            const findTask = state[action.todoListId].find(t => t.id === action.taskId)
            if (findTask) {
                findTask.title = action.newTaskTitle
            }
            return {...state}
        }
        case "REMOVE_TODOLIST": {
            delete state[action.todoListId]
            return {...state}
        }
        case "ADD_TODOLIST":
            return {...state, [action.newTodoListId]: []}
        case "SET_TODOS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => stateCopy[tl.id] = [])
            return stateCopy
        }
        default:
            return state
    }
}

export const changeTaskStatusAC = (todoListId: string, taskId: string, status: boolean) =>
    ({type: "CHANGE_TASK_STATUS", todoListId, taskId, status} as const)
export const addTaskAC = (todoListId: string, newTaskTitle: string) =>
    ({type: "ADD_TASK", todoListId, newTaskTitle} as const)
export const removeTaskAC = (todoListId: string, taskId: string) =>
    ({type: "REMOVE_TASK", todoListId, taskId} as const)
export const changeTaskTitleAC = (todoListId: string, taskId: string, newTaskTitle: string) =>
    ({type: "CHANGE_TASK_TITLE", todoListId, taskId, newTaskTitle} as const)
// export const setTasksAC = (tasks:)

