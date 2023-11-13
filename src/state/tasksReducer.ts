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
        case "REMOVE_TODO_LIST":{
            delete state[action.todoListId]
            return {...state}
        }
        case "ADD_TODO_LIST":
            return {...state, [action.todoListId]: []}
        default:
            return state
    }
}

export const changeTaskStatus = (taskId: string, status: boolean, todoListId: string) =>
    ({type: "CHANGE_TASK_STATUS", taskId, status, todoListId} as const)
export const addTask = (newTaskTitle: string, todoListId: string) =>
    ({type: "ADD_TASK", newTaskTitle, todoListId} as const)
export const removeTask = (taskId: string, todoListId: string) =>
    ({type: "REMOVE_TASK", taskId, todoListId} as const)
export const changeTaskTitle = (todoListId: string, taskId: string, newTaskTitle: string) =>
    ({type: "CHANGE_TASK_TITLE", todoListId, taskId, newTaskTitle} as const)

