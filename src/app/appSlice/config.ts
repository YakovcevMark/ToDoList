import {
    createTodoList,
    deleteTodoList,
    fetchTodoLists,
    updateTodoListTitle
} from "features/TodoListsList/TodoList/todoListsReducer";
import {login, logout} from "features/Login/authReducer";
import {isFulfilled, isPending, isRejected} from "@reduxjs/toolkit";
import {createTask, deleteTask, fetchTasks, updateTask} from "features/TodoListsList/Task/tasksReducer";


const pending = isPending(
    fetchTodoLists,
    updateTodoListTitle,
    createTodoList,
    deleteTodoList,
    login,
    logout,
    fetchTasks,
    deleteTask,
    updateTask,
    createTask
);
const fulfilled = isFulfilled(
    fetchTodoLists,
    updateTodoListTitle,
    createTodoList,
    deleteTodoList,
    login,
    logout,
    fetchTasks,
    deleteTask,
    updateTask,
    createTask
)
const rejected = isRejected(
    fetchTodoLists,
    updateTodoListTitle,
    createTodoList,
    deleteTodoList,
    login,
    logout,
    fetchTasks,
    deleteTask,
    updateTask,
    createTask
)


export {pending, fulfilled, rejected,
    // rejectedWithValue
}