import React, {memo, useCallback, useMemo} from 'react';
import './App.css';
import ToDoList from "./components/ToDoList";
import {AddItemForm} from "./components/AddItemInput/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoList,
    changeTodoListFilter, changeTodoListTitle,
    FilterValuesType,
    removeTodoList,
    TodoListsStateT
} from "./state/todoListsReducer";
import {addTask, changeTaskStatus, changeTaskTitle, removeTask, TasksStateT} from "./state/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateT} from "./state/store";


function App() {
    // const toDoListId1 = v1();
    // const toDoListId2 = v1();
    //
    // const [todoLists, setToDoLists] = useState<ToDoListType[]>([
    //     {id: toDoListId1, title: "What to learn", filter: "all"},
    //     {id: toDoListId2, title: "What to buy", filter: "all"},
    // ])
    // const [tasks, setTasks] = useState<TasksStateT>({
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
    // const removeToDoList = useCallback((id: string) => {
    //     setToDoLists(todoLists.filter(tl => tl.id !== id))
    //     delete tasks[id]
    //     setTasks({...tasks})
    // },[tasks,todoLists])
    // const changeFilter = useCallback((value: FilterValuesType, toDoListId: string) => {
    //     setToDoLists(todoLists.map(tl => {
    //         if (tl.id === toDoListId) tl.filter = value
    //         return tl
    //     }))
    // },[todoLists])
    //
    // const toggleComplete = useCallback((id: string, toDoListId: string) => {
    //     setTasks({...tasks, [toDoListId]: tasks[toDoListId].map(t => t.id === id ? {...t, isDone: !t.isDone} : t)})
    // },[tasks])
    //
    // const addTask = useCallback((title: string, toDoListId: string) => {
    //     const newTask = {id: v1(), title, isDone: false};
    //     setTasks({...tasks, [toDoListId]: [newTask, ...tasks[toDoListId]]});
    // },[tasks])
    //
    // const removeTask = useCallback((id: string, toDoListId: string) => {
    //     setTasks({...tasks, [toDoListId]: tasks[toDoListId].filter(t => t.id !== id)})
    // },[tasks])
    //
    // const createNewToDoList = useCallback((title: string) => {
    //     const newId = v1();
    //     setToDoLists([{id: newId, title, filter: "all"}, ...todoLists])
    //     setTasks({[newId]: [], ...tasks})
    // },[tasks,todoLists])
    // const changeToDoListName = useCallback((title: string, toDoListId: string) => {
    //     setToDoLists(todoLists.map(t => t.id === toDoListId
    //         ? {
    //             ...t,
    //             title
    //         } : t
    //     ))
    // },[todoLists])
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

    const todoLists = useSelector<AppStateT, TodoListsStateT>(state => state.todoLists)
    const tasks = useSelector<AppStateT, TasksStateT>(state => state.tasks)
    const dispatch = useDispatch()
    console.log(tasks)
    const onRemoveToDoList = useCallback((id: string) => {
        dispatch(removeTodoList(id))
    }, [dispatch])
    const onChangeFilter = useCallback((value: FilterValuesType, toDoListId: string) => {
        dispatch(changeTodoListFilter(toDoListId, value))
    }, [dispatch])

    const onToggleComplete = useCallback((id: string, toDoListId: string) => {
        const task = tasks[toDoListId].find(t => t.id === id)
        if (task) {
            dispatch(changeTaskStatus(toDoListId, id, !tasks.isDone))
        }
    }, [dispatch, tasks])

    const onAddTask = useCallback((title: string, toDoListId: string) => {
        dispatch(addTask(toDoListId, title))
    }, [dispatch])

    const onRemoveTask = useCallback((id: string, toDoListId: string) => {
        dispatch(removeTask(toDoListId, id))
    }, [dispatch])

    const onCreateNewToDoList = useCallback((title: string) => {
        dispatch(addTodoList(title))
    }, [dispatch])
    const onChangeToDoListName = useCallback((title: string, toDoListId: string) => {
       dispatch(changeTodoListTitle(toDoListId,title))
    }, [dispatch])
    const onChangeTaskName = useCallback((title: string, taskId: string, toDoListId: string) => {
       dispatch(changeTaskTitle(toDoListId,taskId,title))
    },[dispatch])

    const todoListsRender = useMemo(() => {
        return todoLists.map(tl =>
            <Grid item key={tl.id}>
                <Paper style={{padding: "10px"}}>
                    <ToDoList title={tl.title}
                              removeToDoList={onRemoveToDoList}
                              tasks={tasks[tl.id]}
                              id={tl.id}
                              filter={tl.filter}
                              changeFilter={onChangeFilter}
                              changeToDoListName={onChangeToDoListName}
                              addTask={onAddTask}
                              removeTask={onRemoveTask}
                              toggleComplete={onToggleComplete}
                              changeTaskName={onChangeTaskName}
                    />
                </Paper>
            </Grid>)
    }, [todoLists,
        tasks,
        onAddTask,
        onChangeTaskName,
        onChangeToDoListName,
        onChangeFilter,
        onRemoveTask,
        onRemoveToDoList,
        onToggleComplete
    ])

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
