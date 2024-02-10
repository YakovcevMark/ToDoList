import {
    createTodoList,
    deleteTodoList,
    fetchTodoLists,
    updateTodoListTitle
} from "features/TodoListsList/TodoList/todoListsReducer";
import {isFulfilled, isPending, isRejected, isRejectedWithValue} from "@reduxjs/toolkit";

const pending = isPending(
    fetchTodoLists,
    updateTodoListTitle,
    createTodoList,
    deleteTodoList,
);
const fulfilled = isFulfilled(
    fetchTodoLists,
    updateTodoListTitle,
    createTodoList,
    deleteTodoList,
)
const rejected = isRejected(
    fetchTodoLists,
    updateTodoListTitle,
    createTodoList,
    deleteTodoList,
)
const rejectedWithValue = isRejectedWithValue(
    fetchTodoLists,
    updateTodoListTitle,
    createTodoList,
    deleteTodoList,
)

export {pending, fulfilled, rejected, rejectedWithValue}