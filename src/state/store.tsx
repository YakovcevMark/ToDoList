import {combineReducers, createStore} from "redux";
import {todoListsReducer} from "./todoListsReducer";
import {tasksReducer} from "./tasksReducer";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer
})
export const store = createStore(rootReducer)
export type AppStateT = ReturnType<typeof rootReducer>
// @ts-ignore
window.store = store