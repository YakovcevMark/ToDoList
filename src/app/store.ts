import {combineReducers} from "redux";
import {todoListsReducer} from "features/TodoListsList/TodoList/todoListsReducer";
import {TasksActionsType, tasksReducer} from "features/TodoListsList/Task/tasksReducer";
import {ThunkAction} from "redux-thunk"
import {appReducer, AppReducerActionsType} from "app/appSlice";
import {authReducer, AuthReducerActionsType} from "features/Login/authReducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})
export const store = configureStore({
    reducer: rootReducer
})

type AppActionsType =
    TasksActionsType |
    // TodoListsActionsType |
    AppReducerActionsType |
    AuthReducerActionsType
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppActionsType>
// @ts-ignore
window.store = store