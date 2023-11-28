import React, {memo, useCallback, useEffect, useMemo} from 'react';
import './App.css';
import ToDoList from "./components/ToDoList";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoList,
    fetchTodoLists
} from "./state/todoListsReducer";
import AddItemForm from "./components/AddItemInput/AddItemForm";
import {useAppDispatch, useAppSelector} from "./state/hooks";

function App() {
    const todoLists = useAppSelector(state => state.todoLists)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(fetchTodoLists())
    },[dispatch])

    const onCreateNewToDoList = useCallback((title:string) => {
        dispatch(addTodoList(title))
    },[dispatch])

    const todoListsRender = useMemo(() => {
        return todoLists.map(tl =>
            <Grid item key={tl.id}>
                <Paper style={{padding: "10px"}}>
                    <ToDoList title={tl.title}
                              todolistId={tl.id}
                              filter={tl.filter}
                    />
                </Paper>
            </Grid>)
    }, [todoLists])
    return <>
        <div className="App">
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
