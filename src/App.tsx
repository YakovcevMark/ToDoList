import React, {useMemo, useReducer, useState} from 'react';
import './App.css';
import {ToDoList} from "./components/ToDoList";
import {AddItemForm} from "./components/AddItemInput/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {v1} from "uuid";
import {initialState, toDoListsReducer} from "./state/use-reducer";
import {FilterValuesType, RemoveToDoListAT} from "./state/stateTypes";
// export type FilterValuesType = "All" | "Active" | "Completed"
// export type ErrorType = string | null
// export type TaskType = {
//     id: string
//     title: string
//     isDone: boolean
// }
// type ToDoListType = {
//     id: string
//     title: string
//     filter: FilterValuesType
// }
// type TaskStateType = {
//     [key: string]: TaskType[]
// }


function App() {
    // const toDoListId1 = v1();
    // const toDoListId2 = v1();
    //
    // const [toDoLists, setToDoLists] = useState<ToDoListType[]>([
    //     {id: toDoListId1, title: "What to learn", filter: "All"},
    //     {id: toDoListId2, title: "What to buy", filter: "All"},
    // ])
    // const [tasks, setTasks] = useState<TaskStateType>({
    //     [toDoListId1]: [
    //         {id: v1(), title: "Css", isDone: true},
    //         {id: v1(), title: "Ts", isDone: false},
    //         {id: v1(), title: "ReactJS", isDone: true},
    //         {id: v1(), title: "RestAPI", isDone: false},
    //         {id: v1(), title: "GraphQL", isDone: true},
    //     ],
    //     [toDoListId2]: [
    //         {id: v1(), title: "Css", isDone: true},
    //         {id: v1(), title: "Ts", isDone: false},
    //         {id: v1(), title: "ReactJS", isDone: true},
    //         {id: v1(), title: "RestAPI", isDone: false},
    //         {id: v1(), title: "GraphQL", isDone: true},
    //     ]
    // })
    // const removeToDoList = (id: string) => {
    //     setToDoLists(toDoLists.filter(tl => tl.id !== id))
    //     delete tasks[id]
    //     setTasks({...tasks})
    // }
    // const changeFilter = (value: FilterValuesType, toDoListId: string) => {
    //     setToDoLists(toDoLists.map(tl => {
    //         if (tl.id === toDoListId) tl.filter = value
    //         return tl
    //     }))
    // }
    //
    // function toggleComplete(id: string, toDoListId: string) {
    //     setTasks({...tasks, [toDoListId]: tasks[toDoListId].map(t => t.id === id ? {...t, isDone: !t.isDone} : t)})
    // }
    //
    // function addTask(title: string, toDoListId: string) {
    //     const newTask = {id: v1(), title, isDone: false};
    //     setTasks({...tasks, [toDoListId]: [newTask, ...tasks[toDoListId]]});
    // }
    //
    // function removeTask(id: string, toDoListId: string) {
    //     setTasks({...tasks, [toDoListId]: tasks[toDoListId].filter(t => t.id !== id)})
    // }
    //
    // const createNewToDoList = (title: string) => {
    //     const newId = v1();
    //     setToDoLists([{id: newId, title, filter: "All"}, ...toDoLists])
    //     setTasks({[newId]: [], ...tasks})
    // }
    // const changeToDoListName = (title: string, toDoListId: string) => {
    //     setToDoLists(toDoLists.map(t => t.id === toDoListId
    //         ? {
    //             ...t,
    //             title
    //         } : t
    //     ))
    // }
    // const changeTaskName = (title: string, taskId: string, toDoListId: string,) => {
    //     setTasks({
    //         [toDoListId]: tasks[toDoListId].map(t => t.id === taskId
    //             ? {
    //                 ...t,
    //                 title
    //             } : t
    //         ), ...tasks
    //     })
    //
    // }
    const [state, dispatch] = useReducer(toDoListsReducer,initialState)
    const removeToDoList = (toDoListId: string) => {
       dispatch({
           type: 'REMOVE_TO_DO_LIST',
           toDoListId
       })
    }
    const changeFilter = (filterValue: FilterValuesType, toDoListId: string) => {
        dispatch({
            type: 'CHANGE_FILTER',
            filterValue,
            toDoListId
        })
    }

    function toggleComplete(taskId: string, toDoListId: string) {
        dispatch({
            type: 'TOGGLE_COMPLETE',
            taskId,
            toDoListId
        })
    }

    function addTask(newTaskTitle: string, toDoListId: string) {
        dispatch({
            type: 'ADD_TASK',
            newTaskTitle,
            toDoListId
        })
    }

    function removeTask(taskId: string, toDoListId: string) {
        dispatch({
            type: 'REMOVE_TASK',
            taskId,
            toDoListId
        })
    }

    const createNewToDoList = (newToDoListTitle: string) => {
        dispatch({
            type: 'CREATE_NEW_TO_DO_LIST',
            newToDoListTitle
        })
    }
    const changeToDoListName = (newToDoListTitle: string, toDoListId: string) => {
        dispatch({
            type: 'CHANGE_TO_DO_LIST_NAME',
            newToDoListTitle,
            toDoListId
        })
    }
    const changeTaskName = (newTaskTitle: string, taskId: string, toDoListId: string,) => {
            dispatch({
                type: 'CHANGE_TASK_NAME',
                taskId,
                newTaskTitle,
                toDoListId
            })

        }

    const toDoLists = useMemo(()=>{
        return state.toDoLists.map(tl =>
            <Grid item key={tl.id}>
                <Paper style={{padding: "10px"}}>
                    <ToDoList title={tl.title}
                              removeToDoList={removeToDoList}
                              tasks={state.tasks[tl.id]}
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
    },[state.toDoLists, state.tasks])

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
                <Grid container style={{padding:"20px"}}>
                    <AddItemForm addItem={createNewToDoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        toDoLists
                    }
                </Grid>
            </Container>
        </div>

    </>
}

export default App;
