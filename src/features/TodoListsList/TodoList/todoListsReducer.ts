import {RequestStatusType} from "app/appSlice/appSlice";
import {ResponseTodoListType, todoListsApi} from "api/todolistApi";
import {createAction} from "@reduxjs/toolkit";
import {createAsyncSlice} from "middleware/createAsyncSlice";


export type FilterValuesType = "all" | "active" | "completed"

export type TodoListType = ResponseTodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type TodoListsStateT = {
    [key: string]: TodoListType
}


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
        changeTodoListFilter: create.reducer<{ id: string, filter: FilterValuesType }>(
            (state, action) => {
                state[action.payload.id] = {
                    ...state[action.payload.id],
                    filter: action.payload.filter
                }
            }),
        fetchTodoLists: create.asyncThunk(
            async (_: void, {dispatch}) => {
                const res = await todoListsApi.getLists()
                dispatch(setTodoListsAC(res.data))
                return res.data
            },
            {
                fulfilled: (state, action) => {
                    action.payload.map(tl => (
                        state[tl.id] = {
                            ...tl,
                            filter: 'all',
                            entityStatus: "succeeded"
                        }))
                }
            }
        ),
        deleteTodoList: create.asyncThunk(
            async (id: string, {dispatch}) => {
                dispatch(changeTodoListEntityStatus({id, entityStatus: "loading"}))
                const res = await todoListsApi.deleteList(id)
                if (res.resultCode === 0) {
                    dispatch(deleteTodoListAC(id))
                    return id
                } else {
                    dispatch(changeTodoListEntityStatus({id, entityStatus: "succeeded"}))
                    throw new Error(res.messages[0])
                }
            }),
        updateTodoListTitle: create.asyncThunk(
            async (payload: { id: string, title: string }) => {
                const res = await todoListsApi.updateListTitle(payload.id, payload.title)
                if (res.resultCode === 0) {
                    return payload
                } else {
                    throw new Error(res.messages[0])
                }
            }, {
                fulfilled: (s, a) => {
                    s[a.payload.id].title = a.payload.title
                }
            }),
        createTodoList: create.asyncThunk(
            async (title: string, {dispatch}) => {
                const res = await todoListsApi.createList(title)
                const neededDate = res.data.item
                if (res.resultCode === 0) {
                    dispatch(createTodoListAC(neededDate))
                    return neededDate
                } else {
                    throw new Error(res.messages[0])
                }
            }, {
                fulfilled: (s, a) => {
                    s[a.payload.id] = {
                        ...a.payload,
                        filter: 'all',
                        entityStatus: "succeeded"
                    }
                }
            }),
    }),
    extraReducers: (builder) =>
        builder
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
    changeTodoListEntityStatus, changeTodoListFilter,
    fetchTodoLists, updateTodoListTitle, createTodoList, deleteTodoList,
} = todoListsSlice.actions

