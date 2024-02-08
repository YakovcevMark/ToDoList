import {ResponseTodoListType, todoListsApi} from "api/todolistApi";
import {AppThunk} from "app/store";
import {RequestStatusType, setAppStatus} from "app/appSlice";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";

export type FilterValuesType = "all" | "active" | "completed"


export type TodoListType = ResponseTodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


export type TodoListsActionsType =
    | ReturnType<typeof deleteTodoListAC>
    | ReturnType<typeof createTodoListAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListEntityStatusAC>
    | ReturnType<typeof setTodoListsAC>
    | ReturnType<typeof clearTodoListsDataAC>


export const initialState = [] as TodoListType []


export type TodoListsStateT = typeof initialState

export const todoListsReducer = (state: TodoListsStateT = initialState, action: TodoListsActionsType): TodoListsStateT => {
    switch (action.type) {
        case "SET_TODOS": {
            return action.todoLists.map(tl => ({
                ...tl,
                filter: 'all',
                entityStatus: "succeeded"
            }))
        }
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
            return state.map(tl => tl.id === action.todoListId ? {
                ...tl,
                filter: action.filterValue,
            } : tl)
        }
        case "CHANGE_TODOLIST_TITLE": {
            return state.map(tl => tl.id === action.todoListId ? {
                ...tl,
                title: action.newTodoListTitle,
            } : tl)
        }
        case "TODOLIST/CHANGE_ENTITY_STATUS": {
            return state.map(tl => tl.id === action.todoListId ? {
                ...tl,
                entityStatus: action.entityStatus,
            } : tl)
        }
        case "TODOLIST/CLEAR_DATA": {
            return []
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
export const changeTodoListEntityStatusAC = (todoListId: string, entityStatus: RequestStatusType) =>
    ({type: "TODOLIST/CHANGE_ENTITY_STATUS", todoListId, entityStatus} as const)
export const setTodoListsAC = (todoLists: ResponseTodoListType[]) =>
    ({type: "SET_TODOS", todoLists} as const)
export const clearTodoListsDataAC = () =>
    ({type: "TODOLIST/CLEAR_DATA",} as const)

export const fetchTodoLists = (): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatus("loading"))
            const res = await todoListsApi.getLists()
            if (res.data.length !== 0) {
                dispatch(setTodoListsAC(res.data))
                dispatch(setAppStatus("succeeded"))
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }
export const deleteTodoList = (todoListId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatus("loading"))
            dispatch(changeTodoListEntityStatusAC(todoListId, "loading"))

            const res = await todoListsApi.deleteList(todoListId)
            if (res.resultCode === 0) {
                dispatch(deleteTodoListAC(todoListId))
                dispatch(setAppStatus("succeeded"))
                dispatch(changeTodoListEntityStatusAC(todoListId, "succeeded"))
            } else {
                handleServerAppError(res, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeTodoListEntityStatusAC(todoListId, "succeeded"))
        }
    }
export const updateTodoListTitle = (todoListId: string, newTitle: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatus("loading"))
            const res = await todoListsApi.updateListTitle(todoListId, newTitle)
            if (res.resultCode === 0) {
                dispatch(changeTodoListTitleAC(todoListId, newTitle))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(res, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }
export const createTodoList = (title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatus("loading"))
            const res = await todoListsApi.createList(title)
            const neededDate = res.data.item
            if (res.resultCode === 0) {
                dispatch(createTodoListAC(
                    neededDate.title,
                    neededDate.id,
                    neededDate.addedDate,
                    neededDate.order))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(res, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    }

