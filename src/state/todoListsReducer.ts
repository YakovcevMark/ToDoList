import {ResponseTodoListType, todoListsApi} from "../api/todolistApi";
import {AppThunk} from "./store";

export type FilterValuesType = "all" | "active" | "completed"


export type TodoListType = ResponseTodoListType & {
    filter: FilterValuesType
}


export type TodoListsActionsType =
    ReturnType<typeof removeTodoListAC> |
    ReturnType<typeof addTodoListAC> |
    ReturnType<typeof changeTodoListFilterAC> |
    ReturnType<typeof changeTodoListTitleAC> |
    ReturnType<typeof setTodoListsAC>


export const initialState = [] as TodoListType []


export type TodoListsStateT = typeof initialState

export const todoListsReducer = (state: TodoListsStateT = initialState, action: TodoListsActionsType): TodoListsStateT => {
    switch (action.type) {
        case "REMOVE_TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId)
        case "ADD_TODOLIST":
            return [...state, {
                id: action.newTodoListId,
                title: action.newTodoListTitle,
                addedDate: action.addedDate,
                order: action.order,
                filter: "all"
            }]
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
        case "SET_TODOS": {
            return action.todoLists.map(tl => ({
                ...tl,
                filter: 'all'
            }))
        }
        default:
            return state
    }
}
export const removeTodoListAC = (todoListId: string) =>
    ({type: "REMOVE_TODOLIST", todoListId} as const)
export const changeTodoListFilterAC = (todoListId: string, filterValue: FilterValuesType) =>
    ({type: "CHANGE_TODOLIST_FILTER", todoListId, filterValue} as const)
export const addTodoListAC = (newTodoListTitle: string, newTodoListId: string, addedDate: string, order: number) =>
    ({type: "ADD_TODOLIST", newTodoListTitle, newTodoListId, addedDate, order} as const)
export const changeTodoListTitleAC = (todoListId: string, newTodoListTitle: string) =>
    ({type: "CHANGE_TODOLIST_TITLE", todoListId, newTodoListTitle} as const)
export const setTodoListsAC = (todoLists: ResponseTodoListType[]) =>
    ({type: "SET_TODOS", todoLists} as const)

export const fetchTodoLists = (): AppThunk =>
    async (dispatch) => {
        // try {
        const res = await todoListsApi.getLists()
        dispatch(setTodoListsAC(res.data))
        // } catch (e) {
        //     throw new Error(e)
        // }
    }
export const removeTodoLists = (todoListId: string): AppThunk =>
    async (dispatch) => {
        // try {
        await todoListsApi.deleteList(todoListId)
        dispatch(removeTodoListAC(todoListId))
        // } catch (e) {
        //     throw new Error(e)
        // }
    }
export const updateTodoListTitle = (todoListId: string, newTitle: string): AppThunk =>
    async (dispatch) => {
        // try {
        await todoListsApi.updateListTitle(todoListId, newTitle)
        dispatch(changeTodoListTitleAC(todoListId, newTitle))
        // } catch (e) {
        //     throw new Error(e)
        // }
    }
export const addTodoList = (title: string): AppThunk =>
    async (dispatch) => {
        // try {
        const res = await todoListsApi.createList(title)
        const neededDate = res.data.data.item
        dispatch(addTodoListAC(
            neededDate.title,
            neededDate.id,
            neededDate.addedDate,
            neededDate.order))
        // } catch (e) {
        //     throw new Error(e)
        // }
    }

