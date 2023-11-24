import React, {memo, useCallback, useEffect, useMemo} from 'react';
import './App.css';
import ToDoList from "./components/ToDoList";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoList,
    TodoListsStateT
} from "./state/todoListsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateT} from "./state/store";
import AddItemForm from "./components/AddItemInput/AddItemForm";
import {tasksApi, todoListsApi} from "./api/todolistApi";

function App() {
    useEffect(()=>{
        // todoListsApi.createList("Abrakadabra")
        //     .then(resp => console.log(resp))
        // todoListsApi.getLists()
        //     .then(resp => console.log(resp))
        // todoListsApi.updateListTitle("3fdfbb60-8e44-4230-97a2-28eb2a7a2f5f","Test2")
        //     .then(resp => console.log(resp))
        // todoListsApi.deleteList("7aa71209-59aa-4d90-b5fd-47fee41cf305")
        //     .then(resp => console.log(resp))
    },[])
    useEffect(()=>{

        // tasksApi.getTasks("3fdfbb60-8e44-4230-97a2-28eb2a7a2f5f",3,1)
        //     .then(resp => console.log(resp))
        // tasksApi.updateTask("3fdfbb60-8e44-4230-97a2-28eb2a7a2f5f","0fa60278-ab8d-4526-b423-b25179a97e48",{title:"Kek"})
        //     .then(resp => console.log(resp))
        // tasksApi.deleteTask("3fdfbb60-8e44-4230-97a2-28eb2a7a2f5f","c8eb3a6d-97f6-44cc-b014-bc3f7a20735e")
        //     .then(resp => console.log(resp))
        // tasksApi.createTask("3fdfbb60-8e44-4230-97a2-28eb2a7a2f5f","mySecondTask")
        //     .then(resp => console.log(resp))
    },[])



    const todoLists = useSelector<AppStateT, TodoListsStateT>(state => state.todoLists)
    const dispatch = useDispatch()
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
