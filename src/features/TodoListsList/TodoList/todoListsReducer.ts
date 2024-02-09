
import {RequestStatusType, setAppStatus} from "app/appSlice";
import {ResponseTodoListType, todoListsApi} from "api/todolistApi";
import {asyncThunkCreator, buildCreateSlice, createAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";


export type FilterValuesType = "all" | "active" | "completed"

export type TodoListType = ResponseTodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type TodoListsStateT = {
    [key: string]: TodoListType
}

export const createAsyncSlice = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator},
})
const initialState = {} as TodoListsStateT
const todoListsSlice = createAsyncSlice({
    name: "TodoListsStateT",
    initialState,
    reducers: (create) => ({
        changeTodoListEntityStatus: create.reducer<{ id: string, entityStatus: RequestStatusType }>(
            (state, action) => {
                state[action.payload.id] = {
                    ...state[action.payload.id],
                    entityStatus: action.payload.entityStatus
                }
            }),
        changeTodoListTitle: create.reducer<{ id: string, title: string }>(
            (state, action) => {
                state[action.payload.id] = {
                    ...state[action.payload.id],
                    title: action.payload.title
                }
            }),
        changeTodoListFilter: create.reducer<{ id: string, filter: FilterValuesType }>(
            (state, action) => {
                state[action.payload.id] = {
                    ...state[action.payload.id],
                    filter: action.payload.filter
                }
            }),
        fetchTodoLists: create.asyncThunk(
            async (_: void, {dispatch}) => {
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
            }),
        deleteTodoList: create.asyncThunk(
            async (id: string, {dispatch}) => {
                try {
                    dispatch(setAppStatus("loading"))
                    dispatch(changeTodoListEntityStatus({id, entityStatus: "loading"}))
                    const res = await todoListsApi.deleteList(id)
                    if (res.resultCode === 0) {
                        dispatch(deleteTodoListAC(id))
                        dispatch(setAppStatus("succeeded"))
                    } else {
                        handleServerAppError(res, dispatch)
                    }
                } catch (e: any) {
                    handleServerNetworkError(e, dispatch)
                    dispatch(changeTodoListEntityStatus({id, entityStatus: "succeeded"}))
                }
            }),
        updateTodoListTitle: create.asyncThunk(
            async (
                {id, title}: { id: string, title: string },
                {dispatch}
            ) => {
                try {
                    dispatch(setAppStatus("loading"))
                    const res = await todoListsApi.updateListTitle(id, title)
                    if (res.resultCode === 0) {
                        dispatch(changeTodoListTitle({id, title}))
                        dispatch(setAppStatus("succeeded"))
                    } else {
                        handleServerAppError(res, dispatch)
                    }
                } catch (e: any) {
                    handleServerNetworkError(e, dispatch)
                }
            }),
        createTodoList: create.asyncThunk(
            async (title: string, {dispatch}) => {
                try {
                    dispatch(setAppStatus("loading"))
                    const res = await todoListsApi.createList(title)
                    const neededDate = res.data.item
                    if (res.resultCode === 0) {
                        dispatch(createTodoListAC(neededDate))
                        dispatch(setAppStatus("succeeded"))
                    } else {
                        handleServerAppError(res, dispatch)
                    }
                } catch (e: any) {
                    handleServerNetworkError(e, dispatch)
                }
            }),
    }),
    extraReducers: (builder) =>
        builder
            .addCase(setTodoListsAC, (state, action) => {
                action.payload.map(tl => (
                    state[tl.id] = {
                        ...tl,
                        filter: 'all',
                        entityStatus: "succeeded"
                    }))
            })
            .addCase(createTodoListAC, (state, action) => {
                state[action.payload.id] = {
                    ...action.payload,
                    filter: 'all',
                    entityStatus: "succeeded"
                }
            })
            .addCase(deleteTodoListAC, (state, action) => {
                delete state[action.payload]
            })
            .addCase(clearTodoListsDataAC, (state) => {
                for (let key in state) {
                    delete state[key]
                }
            })
})

export const deleteTodoListAC = createAction<string, 'REMOVE_TODOLIST'>('REMOVE_TODOLIST')
export const createTodoListAC = createAction<ResponseTodoListType, 'ADD_TODOLIST'>('ADD_TODOLIST')
export const setTodoListsAC = createAction<ResponseTodoListType[], 'SET_TODOS'>('SET_TODOS')
export const clearTodoListsDataAC = createAction<void, 'CLEAR_DATA'>('CLEAR_DATA')
export const todoListsReducer = todoListsSlice.reducer
export const {
    changeTodoListEntityStatus, changeTodoListTitle, changeTodoListFilter,
    fetchTodoLists, updateTodoListTitle, createTodoList, deleteTodoList,
} = todoListsSlice.actions

