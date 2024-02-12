import {combineReducers} from "redux";
import {todoListsReducer} from "features/TodoListsList/TodoList/todoListsReducer";
import {tasksReducer} from "features/TodoListsList/Task/tasksReducer";
import {appReducer} from "app/appSlice/appSlice";
import {authReducer} from "features/Login/authReducer";
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

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// @ts-ignore
window.store = store