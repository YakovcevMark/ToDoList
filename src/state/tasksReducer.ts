import {v1} from "uuid";
import {addTodoList, removeTodoList, toDoListId1, toDoListId2} from "./todoListsReducer";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


type ActionsType =
    ReturnType<typeof removeTask> |
    ReturnType<typeof addTask> |
    ReturnType<typeof changeTaskStatus> |
    ReturnType<typeof changeTaskTitle> |
    ReturnType<typeof addTodoList> |
    ReturnType<typeof removeTodoList>


export const initialState = {
    [toDoListId1]: [
        {id: v1(), title: "Css", isDone: true},
        {id: v1(), title: "Ts", isDone: false},
        {id: v1(), title: "ReactJS", isDone: true},
        {id: v1(), title: "RestAPI", isDone: false},
        {id: v1(), title: "GraphQL", isDone: true},
    ] as TaskType [],
    [toDoListId2]: [
        {id: v1(), title: "Css", isDone: true},
        {id: v1(), title: "Ts", isDone: false},
        {id: v1(), title: "ReactJS", isDone: true},
        {id: v1(), title: "RestAPI", isDone: false},
        {id: v1(), title: "GraphQL", isDone: true},
    ] as TaskType []
}

export type TasksStateT = typeof initialState

export const tasksReducer = (state: TasksStateT = initialState, action: ActionsType): TasksStateT => {
    switch (action.type) {
        case "CHANGE_TASK_STATUS": {
            const findTask = state[action.todoListId].find(t => t.id === action.taskId)
            if (findTask) {
                findTask.isDone = !findTask.isDone
            }
            return {...state}
        }
        case "ADD_TASK":
            return {
                ...state,
                [action.todoListId]:
                    [
                        {id: v1(), title: action.newTaskTitle, isDone: false},
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
        case "REMOVE_TODOLIST":{
            delete state[action.todoListId]
            return {...state}
        }
        case "ADD_TODOLIST":
            return {...state, [action.todoListId]: []}
        default:
            return state
    }
}

export const changeTaskStatus = (todoListId: string, taskId: string, status: boolean) =>
    ({type: "CHANGE_TASK_STATUS", todoListId, taskId, status} as const)
export const addTask = (todoListId: string, newTaskTitle: string) =>
    ({type: "ADD_TASK", todoListId, newTaskTitle} as const)
export const removeTask = (todoListId: string, taskId: string) =>
    ({type: "REMOVE_TASK", todoListId, taskId} as const)
export const changeTaskTitle = (todoListId: string, taskId: string, newTaskTitle: string) =>
    ({type: "CHANGE_TASK_TITLE", todoListId, taskId, newTaskTitle} as const)


