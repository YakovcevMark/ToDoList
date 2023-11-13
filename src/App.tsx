import React, {useCallback, useMemo, useState} from 'react';
import './App.css';
import {ToDoList} from "./components/ToDoList";
import {AddItemForm} from "./components/AddItemInput/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {v1} from "uuid";
import {FilterValuesType, ToDoListType} from "./state/todoListsReducer";
import {TasksStateT} from "./state/tasksReducer";

export type ErrorType = string | null

function App() {
    const toDoListId1 = v1();
    const toDoListId2 = v1();

    const [todoLists, setToDoLists] = useState<ToDoListType[]>([
        {id: toDoListId1, title: "What to learn", filter: "All"},
        {id: toDoListId2, title: "What to buy", filter: "All"},
    ])
    const [tasks, setTasks] = useState<TasksStateT>({
        [toDoListId1]: [
            {id: v1(), title: "Css", isDone: true},
            {id: v1(), title: "Ts", isDone: false},
            {id: v1(), title: "ReactJS", isDone: true},
            {id: v1(), title: "RestAPI", isDone: false},
            {id: v1(), title: "GraphQL", isDone: true},
        ],
        [toDoListId2]: [
            {id: v1(), title: "Css", isDone: true},
            {id: v1(), title: "Ts", isDone: false},
            {id: v1(), title: "ReactJS", isDone: true},
            {id: v1(), title: "RestAPI", isDone: false},
            {id: v1(), title: "GraphQL", isDone: true},
        ]
    })
    const removeToDoList = useCallback((id: string) => {
        setToDoLists(todoLists.filter(tl => tl.id !== id))
        delete tasks[id]
        setTasks({...tasks})
    },[tasks,todoLists])
    const changeFilter = useCallback((value: FilterValuesType, toDoListId: string) => {
        setToDoLists(todoLists.map(tl => {
            if (tl.id === toDoListId) tl.filter = value
            return tl
        }))
    },[todoLists])

    const toggleComplete = useCallback((id: string, toDoListId: string) => {
        setTasks({...tasks, [toDoListId]: tasks[toDoListId].map(t => t.id === id ? {...t, isDone: !t.isDone} : t)})
    },[tasks])

    const addTask = useCallback((title: string, toDoListId: string) => {
        const newTask = {id: v1(), title, isDone: false};
        setTasks({...tasks, [toDoListId]: [newTask, ...tasks[toDoListId]]});
    },[tasks])

    const removeTask = useCallback((id: string, toDoListId: string) => {
        setTasks({...tasks, [toDoListId]: tasks[toDoListId].filter(t => t.id !== id)})
    },[tasks])

    const createNewToDoList = useCallback((title: string) => {
        const newId = v1();
        setToDoLists([{id: newId, title, filter: "All"}, ...todoLists])
        setTasks({[newId]: [], ...tasks})
    },[tasks,todoLists])
    const changeToDoListName = useCallback((title: string, toDoListId: string) => {
        setToDoLists(todoLists.map(t => t.id === toDoListId
            ? {
                ...t,
                title
            } : t
        ))
    },[todoLists])
    const changeTaskName = (title: string, taskId: string, toDoListId: string,) => {
        setTasks({
            [toDoListId]: tasks[toDoListId].map(t => t.id === taskId
                ? {
                    ...t,
                    title
                } : t
            ), ...tasks
        })

    }


    const todoListsRender = useMemo(() => {
        return todoLists.map(tl =>
            <Grid item key={tl.id}>
                <Paper style={{padding: "10px"}}>
                    <ToDoList title={tl.title}
                              removeToDoList={removeToDoList}
                              tasks={tasks[tl.id]}
                              addTask={addTask}
                              removeTask={removeTask}
                              toggleComplete={toggleComplete}
                              id={tl.id}
                              filter={tl.filter}
                              changeFilter={changeFilter}
                              changeToDoListName={changeToDoListName}
                              changeTaskName={changeTaskName}/>
                </Paper>
            </Grid>)
    }, [todoLists, tasks])

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
                    <AddItemForm addItem={createNewToDoList}/>
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

export default App;
