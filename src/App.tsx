import React, {memo, useCallback, useEffect, useMemo} from 'react';
import './App.css';
import ToDoList from "./components/ToDoList";
import {AppBar, Button, Container, Grid, IconButton, LinearProgress, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {createTodoList, fetchTodoLists} from "./state/todoListsReducer";
import AddItemForm from "./components/AddItemInput/AddItemForm";
import {useAppDispatch, useAppSelector} from "./state/hooks";
import {ErrorSnackbar} from "./components/ErrorSnachbar/ErrorSnachbar";

function App() {
    const todoLists = useAppSelector(state => state.todoLists)
    const status = useAppSelector(state => state.app.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodoLists())
    }, [dispatch])

    const onCreateNewToDoList = useCallback((title: string) => {
        dispatch(createTodoList(title))
    }, [dispatch])

    const todoListsRender = useMemo(() => {
        return todoLists.map(tl =>
            <Grid item key={tl.id}>
                <Paper style={{padding: "10px"}}>
                    <ToDoList title={tl.title}
                              todolistId={tl.id}
                              filter={tl.filter}
                        entityStatus={tl.entityStatus}
                    />
                </Paper>
            </Grid>)
    }, [todoLists])
    return <>
        <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" arial-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={onCreateNewToDoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoListsRender
                    }
                </Grid>
            </Container>
        </div>

    </>
}

export default memo(App);
