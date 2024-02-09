import React, {useCallback, useEffect, useMemo} from 'react';
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemInput/AddItemForm";
import {useAppDispatch, useAppSelector} from "utils/hooks";
import {createTodoList, fetchTodoLists} from "./TodoList/todoListsReducer";
import ToDoList from "./TodoList/TodoList";
import {Navigate} from "react-router-dom";
import {appPath} from "middleware/path";

const TodoListsList: React.FC = () => {

    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const todoLists = useAppSelector(state => state.todoLists)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodoLists())
    }, [dispatch, isLoggedIn])

    const onCreateNewToDoList = useCallback((title: string) => {
        dispatch(createTodoList(title))
    }, [dispatch])

    const todoListsRender = useMemo(() => {
        const list = []
        for (let key in todoLists) {
            list.push(<Grid item key={key}>
                <Paper style={{padding: "10px"}}>
                    <ToDoList title={todoLists[key].title}
                              id={todoLists[key].id}
                              filter={todoLists[key].filter}
                              entityStatus={todoLists[key].entityStatus}
                    />
                </Paper>
            </Grid>)
        }
        return list;
    }, [todoLists])
    if (!isLoggedIn) {
        return <Navigate to={`${appPath}/login`}/>
    }
    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={onCreateNewToDoList}/>
        </Grid>
        <Grid container spacing={3}>
            {todoListsRender}
        </Grid>
    </>
};

export default TodoListsList;