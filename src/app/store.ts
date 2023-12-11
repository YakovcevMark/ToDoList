import {applyMiddleware, combineReducers, createStore} from "redux";
import {TodoListsActionsType, todoListsReducer} from "../features/TodoListsList/TodoList/todoListsReducer";
import {TasksActionsType, tasksReducer} from "../features/TodoListsList/Task/tasksReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk"
import {appReducer, AppReducerActionsType} from "./appReducer";
import {authReducer, AuthReducerActionsType} from "../features/Login/authReducer";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunk))

type AppActionsType =
    TasksActionsType |
    TodoListsActionsType |
    AppReducerActionsType |
    AuthReducerActionsType
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppActionsType>
// @ts-ignore
window.store = store