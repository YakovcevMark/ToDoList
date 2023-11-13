import {v1} from "uuid";

export type FilterValuesType = "All" | "Active" | "Completed"


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
    {id: toDoListId1, title: "What to learn", filter: "All"},
    {id: toDoListId2, title: "What to buy", filter: "All"}
] as ToDoListType []


export type TodoListsStateT = typeof initialState

export const todoListsReducer = (state: TodoListsStateT = initialState, action: ActionsType): TodoListsStateT => {
    switch (action.type) {
        case "REMOVE_TODO_LIST":
            return state.filter(tl => tl.id !== action.todoListId)
        case "ADD_TODO_LIST":
            return [...state, {id: action.todoListId, title: action.newTodoListTitle, filter: "All"}]
        case "CHANGE_TODO_LIST_FILTER": {
            const toDoList = state.find(tl => tl.id === action.todoListId)
            if (toDoList) {
                toDoList.filter = action.filterValue
            }
            return [...state]
        }
        case "CHANGE_TODO_LIST_TITLE": {
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
    ({type: "REMOVE_TODO_LIST", todoListId} as const)
export const changeTodoListFilter = (filterValue: FilterValuesType, todoListId: string) =>
    ({type: "CHANGE_TODO_LIST_FILTER", filterValue, todoListId} as const)
export const addTodoList = (newTodoListTitle: string) =>
    ({type: "ADD_TODO_LIST", newTodoListTitle, todoListId: v1()} as const)
export const changeTodoListTitle = (todoListId: string, newTodoListTitle: string) =>
    ({type: "CHANGE_TODO_LIST_TITLE", todoListId, newTodoListTitle} as const)

