import {RequestStatusType} from "app/appSlice/appSlice";
import {ResponseTodoListType, todoListsApi} from "api/todolistApi";
import {createAsyncSlice} from "middleware/createAsyncSlice";
import {logout} from "features/Login/authReducer";


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
        changeTodoListFilter: create.reducer<{ id: string, filter: FilterValuesType }>(
            (state, action) => {
                state[action.payload.id] = {
                    ...state[action.payload.id],
                    filter: action.payload.filter
                }
            }),
        fetchTodoLists: create.asyncThunk(
            async (_: void) => {
                const res = await todoListsApi.getLists()
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
            async (id: string) => {
                const res = await todoListsApi.deleteList(id)
                if (res.resultCode === 0) {
                    return
                } else {
                    throw new Error(res.messages[0])
                }

            }, {
                fulfilled: (s, a) => {
                    delete s[a.meta.arg]
                },
                pending: (s, a) => {
                    s[a.meta.arg].entityStatus = "loading"
                },
                rejected: (s, a) => {
                    s[a.meta.arg].entityStatus = "failed"
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
            async (title: string) => {
                const res = await todoListsApi.createList(title)
                const neededDate = res.data.item
                if (res.resultCode === 0) {
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
            .addCase(logout.fulfilled, s => {
                for (let k in s) {
                    delete s[k]
                }
            })

})
export const todoListsReducer = todoListsSlice.reducer
export const {
    changeTodoListFilter,
    fetchTodoLists, updateTodoListTitle, createTodoList, deleteTodoList,
} = todoListsSlice.actions

