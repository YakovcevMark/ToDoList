import {createTodoList, deleteTodoList, fetchTodoLists} from "../TodoList/todoListsReducer";
import {ResponseTaskType, tasksApi, UpdateTaskModelType} from "api/todolistApi";
import {RequestStatusType} from "app/appSlice/appSlice";
import {createAsyncSlice} from "middleware/createAsyncSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {logout} from "features/Login/authReducer";

export type TaskType = ResponseTaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateT = { [todoListId: string]: TaskType[] }

export const initialState: TasksStateT = {}

const tasksSlice = createAsyncSlice({
    name: "tasks",
    initialState,
    selectors: {},
    reducers: create => ({
        changeTaskEntityStatus: create.reducer(
            (s, a: PayloadAction<{
                todoListId: string,
                taskId: string,
                entityStatus: RequestStatusType
            }>) => {
                const lookedTaskId = s[a.payload.todoListId].findIndex(t => t.id === a.payload.taskId)
                if (lookedTaskId)
                    s[a.payload.todoListId][lookedTaskId].entityStatus = a.payload.entityStatus
            }),

        fetchTasks:
            create.asyncThunk(
                async (todoListId: string) => {
                    const res = await tasksApi.getTasks(todoListId)
                    return {todoListId, tasks: res.items}
                },
                {
                    fulfilled: (state, action) => {
                        state[action.payload.todoListId] = action.payload.tasks.map(t => ({
                            ...t,
                            entityStatus: "succeeded"
                        }))
                    }

                }),
        deleteTask:
            create.asyncThunk(
                async ({todoListId, taskId}: {
                    todoListId: string, taskId: string
                }, {dispatch}) => {
                    dispatch(changeTaskEntityStatus({todoListId, taskId, entityStatus: "loading"}))
                    const res = await tasksApi.deleteTask(todoListId, taskId)
                    if (res.resultCode === 0) {
                        return {todoListId, taskId}
                    } else {
                        dispatch(changeTaskEntityStatus({todoListId, taskId, entityStatus: "failed"}))
                        throw new Error(res.messages[0])
                    }
                }, {
                    fulfilled: (s, a) => {
                        const lookedTaskId = s[a.payload.todoListId].findIndex(t => t.id === a.payload.taskId)
                        s[a.payload.todoListId].splice(lookedTaskId, 1)
                    },
                    rejected: (s, a) => {
                        const lookedTaskId = s[a.meta.arg.todoListId].findIndex(t => t.id === a.meta.arg.taskId)
                        if (lookedTaskId)
                            s[a.meta.arg.todoListId][lookedTaskId].entityStatus = "failed"
                    },
                }),
        createTask:
            create.asyncThunk(
                async ({
                           todoListId, title
                       }: { todoListId: string, title: string }) => {

                    const res = await tasksApi.createTask(todoListId, title)
                    if (res.resultCode === 0) {
                        return {todoListId, item: res.data.item}
                    } else {
                        throw new Error(res.messages[0])
                    }
                }, {
                    fulfilled: (s, a) => {
                        s[a.payload.todoListId].push({
                            ...a.payload.item,
                            entityStatus: "succeeded"
                        })
                    }
                }),
        updateTask:
            create.asyncThunk(
                async ({
                           todoListId, taskId, updateTaskModel
                       }: {
                    todoListId: string, taskId: string, updateTaskModel: UpdateTaskModelType
                }, {dispatch, getState}) => {
                    dispatch(changeTaskEntityStatus({todoListId, taskId, entityStatus: "loading"}))

                    const state = getState() as { tasks: TasksStateT }
                    const tasks = state.tasks
                    const currentTask = tasks[todoListId].find(t => t.id === taskId)

                    const res = await tasksApi.updateTask(todoListId, taskId, {
                        ...currentTask,
                        ...updateTaskModel
                    })
                    if (res.resultCode === 0) {
                        dispatch(changeTaskEntityStatus({todoListId, taskId, entityStatus: "succeeded"}))
                        return {todoListId, taskId, item: res.data.item}
                    } else {
                        dispatch(changeTaskEntityStatus({todoListId, taskId, entityStatus: "failed"}))
                        throw new Error(res.messages[0])
                    }

                },
                {
                    fulfilled: (s, a) => {
                        const lookedTaskId = s[a.payload.todoListId].findIndex(t => t.id === a.payload.taskId)
                        s[a.payload.todoListId][lookedTaskId] = {
                            ...a.payload.item,
                            entityStatus: "succeeded"
                        }
                    },
                    rejected: (s, a) => {
                        const lookedTaskId = s[a.meta.arg.todoListId].findIndex(t => t.id === a.meta.arg.taskId)
                        if (lookedTaskId)
                            s[a.meta.arg.todoListId][lookedTaskId].entityStatus = "failed"
                    },
                }),
    }),
    extraReducers: builder => {
        builder
            .addCase(deleteTodoList.fulfilled, (s, a) => {
                delete s[a.meta.arg]
            })
            .addCase(fetchTodoLists.fulfilled, (s, a) => {
                a.payload.forEach(tl => s[tl.id] = [])
            })
            .addCase(createTodoList.fulfilled, (s, a) => {
                s[a.payload.id] = []
            })
            .addCase(logout.fulfilled, s => {
                for (let k in s) delete s[k]
            })
    }
})
export const {
    fetchTasks, deleteTask, updateTask, createTask,
    changeTaskEntityStatus
} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer