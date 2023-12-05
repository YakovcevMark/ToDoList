import {todoListsApi, ResponseTodoListType} from "../api/todolistApi";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type FilterValuesType = "all" | "active" | "completed"


export type TodoListType = ResponseTodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


export type TodoListsActionsType =
    ReturnType<typeof deleteTodoListAC> |
    ReturnType<typeof createTodoListAC> |
    ReturnType<typeof changeTodoListFilterAC> |
    ReturnType<typeof changeTodoListTitleAC> |
    ReturnType<typeof changeTodolistEntityStatusAC> |
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
                filter: "all",
                entityStatus: "succeeded"
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
                filter: 'all',
                entityStatus: "succeeded"
            }))
        }
        case "TODOLIST/CHANGE_ENTITY_STATUS": {
            const toDoList = state.find(tl => tl.id === action.todoListId)
            if (toDoList) {
                toDoList.entityStatus = action.entityStatus
            }
            return [...state]
        }
        default:
            return state
    }
}
export const deleteTodoListAC = (todoListId: string) =>
    ({type: "REMOVE_TODOLIST", todoListId} as const)
export const changeTodoListFilterAC = (todoListId: string, filterValue: FilterValuesType) =>
    ({type: "CHANGE_TODOLIST_FILTER", todoListId, filterValue} as const)
export const createTodoListAC = (newTodoListTitle: string, newTodoListId: string, addedDate: string, order: number) =>
    ({type: "ADD_TODOLIST", newTodoListTitle, newTodoListId, addedDate, order} as const)
export const changeTodoListTitleAC = (todoListId: string, newTodoListTitle: string) =>
    ({type: "CHANGE_TODOLIST_TITLE", todoListId, newTodoListTitle} as const)
export const changeTodolistEntityStatusAC = (todoListId: string, entityStatus: RequestStatusType) =>
    ({type: "TODOLIST/CHANGE_ENTITY_STATUS", todoListId, entityStatus} as const)
export const setTodoListsAC = (todoLists: ResponseTodoListType[]) =>
    ({type: "SET_TODOS", todoLists} as const)

export const fetchTodoLists = (): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC("loading"))
            const res = await todoListsApi.getLists()
            if (res.data.length !== 0) {
                dispatch(setTodoListsAC(res.data))
                dispatch(setAppStatusAC("succeeded"))
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }
export const deleteTodoList = (todoListId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC("loading"))
            dispatch(changeTodolistEntityStatusAC(todoListId, "loading"))

            const res = await todoListsApi.deleteList(todoListId)
            if (res.data.resultCode === 0) {
                dispatch(deleteTodoListAC(todoListId))
                dispatch(setAppStatusAC("succeeded"))
                dispatch(changeTodolistEntityStatusAC(todoListId, "succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeTodolistEntityStatusAC(todoListId, "succeeded"))
        }
    }
export const updateTodoListTitle = (todoListId: string, newTitle: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC("loading"))
            const res = await todoListsApi.updateListTitle(todoListId, newTitle)
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC(todoListId, newTitle))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }
export const createTodoList = (title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC("loading"))
            const res = await todoListsApi.createList(title)
            const neededDate = res.data.data.item
            if (res.data.resultCode === 0) {
                dispatch(createTodoListAC(
                    neededDate.title,
                    neededDate.id,
                    neededDate.addedDate,
                    neededDate.order))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }

