import {v1} from "uuid";

export type FilterValuesType = "all" | "active" | "completed"


export type ToDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}


type ActionsType =
    ReturnType<typeof removeTodoList> |
    ReturnType<typeof addTodoList> |
    ReturnType<typeof changeTodoListFilter> |
    ReturnType<typeof changeTodoListTitle>


export const toDoListId1 = v1();
export const toDoListId2 = v1();
export const initialState = [
    {id: toDoListId1, title: "What to learn", filter: "all"},
    {id: toDoListId2, title: "What to buy", filter: "all"}
] as ToDoListType []


export type TodoListsStateT = typeof initialState

export const todoListsReducer = (state: TodoListsStateT = initialState, action: ActionsType): TodoListsStateT => {
    switch (action.type) {
        case "REMOVE_TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId)
        case "ADD_TODOLIST":
            return [...state, {id: action.todoListId, title: action.newTodoListTitle, filter: "all"}]
        case "CHANGE_TODOLIST_FILTER": {
            const toDoList = state.find(tl => tl.id === action.todoListId)
            if (toDoList) {
                toDoList.filter = action.filterValue
            }
            return [...state]
        }
        case "CHANGE_TODOLIST_TITLE": {
            const toDoList = state.find(tl => tl.id === action.todoListId)
            if (toDoList) {
                toDoList.title = action.newTodoListTitle
            }
            return [...state]
        }
        default:
            return state
    }
}
export const removeTodoList = (todoListId: string) =>
    ({type: "REMOVE_TODOLIST", todoListId} as const)
export const changeTodoListFilter = (todoListId: string, filterValue: FilterValuesType) =>
    ({type: "CHANGE_TODOLIST_FILTER", todoListId, filterValue} as const)
export const addTodoList = (newTodoListTitle: string) =>
    ({type: "ADD_TODOLIST", newTodoListTitle, todoListId: v1()} as const)
export const changeTodoListTitle = (todoListId: string, newTodoListTitle: string) =>
    ({type: "CHANGE_TODOLIST_TITLE", todoListId, newTodoListTitle} as const)

