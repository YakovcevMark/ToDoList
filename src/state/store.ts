import {applyMiddleware, combineReducers, createStore} from "redux";
import {TodoListsActionsType, todoListsReducer} from "./todoListsReducer";
import {TasksActionsType, tasksReducer} from "./tasksReducer";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk"

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunk))

type AppActionsType = TasksActionsType | TodoListsActionsType
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppActionsType>
// @ts-ignore
window.store = store