import React, {memo, MouseEvent, useCallback, useMemo} from "react";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {changeTodoListFilter, changeTodoListTitle, FilterValuesType, removeTodoList} from "../state/todoListsReducer";
import {addTask, changeTaskStatus, changeTaskTitle, removeTask, TasksStateT, TaskType} from "../state/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateT} from "../state/store";
import Task from "./ Task";
import AddItemForm from "./AddItemInput/AddItemForm";


type PropsType = {
    title: string
    todolistId: string
    filter: FilterValuesType
}
const ToDoList: React.FC<PropsType> = (
    {
        todolistId,
        title,
        filter,
        ...props
    }) => {
    const tasks = useSelector<AppStateT, TasksStateT>(state => state.tasks)
    const dispatch = useDispatch()
    const filteredTasks = (tasks: TaskType[]): TaskType[] => {
        if (filter === "active")
            return tasks.filter(t => !t.isDone)
        if (filter === "completed")
            return tasks.filter(t => t.isDone)
        return tasks;
    }

    const changeFilterHandler = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        dispatch(changeTodoListFilter(todolistId, e.currentTarget.value as FilterValuesType))
    },[dispatch, todolistId])

    const changeToDoListNameHandler = useCallback((title: string) => {
        dispatch(changeTodoListTitle(todolistId, title))
    },[dispatch,todolistId])

    const onRemoveTodolist = useCallback(() => {
       dispatch(removeTodoList(todolistId))
    },[dispatch, todolistId])



    const changeTaskNameHandler = useCallback((title: string, taskId: string) => {
        dispatch(changeTaskTitle(todolistId, taskId, title))
    },[dispatch,todolistId])

    const addNewTask = useCallback((title: string) => {
        dispatch(addTask(todolistId, title))
    },[dispatch,todolistId])

    const removeTaskHandler = useCallback((taskId: string) => {
        dispatch(removeTask(todolistId, taskId))
    },[dispatch,todolistId])

    const toggleCompleteHandler = useCallback((taskId: string) => {
        const task = tasks[todolistId].find(t => t.id === taskId)
        if (task) {
            dispatch(changeTaskStatus(todolistId, taskId, !tasks.isDone))
        }
    },[dispatch,todolistId,tasks])

    const currentTasks = filteredTasks(tasks[todolistId]);

    const taskRender = useMemo(()=> {
       return currentTasks.map(t =>
            <Task task={t}
                  key={t.id}
                  removeTask={removeTaskHandler}
                  toggleComplete={toggleCompleteHandler}
                  changeTaskName={changeTaskNameHandler}
            />)
    },[
        currentTasks,
        removeTaskHandler,
        toggleCompleteHandler,
        changeTaskNameHandler
    ])
    return <div>
        <h3><EditableSpan label="List name"
                          value={title}
                          setValue={changeToDoListNameHandler}/>

            <IconButton onClick={onRemoveTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm label="Task name"
                     addItem={addNewTask}/>
        {tasks && taskRender}
        <div>
            <Button
                variant={filter === 'all' ? 'outlined' : undefined}
                onClick={changeFilterHandler}
                value="all"
                color={'default'}>
                All
            </Button>
            <Button
                variant={filter === 'active' ? 'outlined' : undefined}
                onClick={changeFilterHandler}
                value="active"
                color={'primary'}>
                Active
            </Button>
            <Button
                variant={filter === 'completed' ? 'outlined' : undefined}
                onClick={changeFilterHandler}
                value="completed"
                color={'secondary'}>
                Completed
            </Button>
        </div>
    </div>
}
export default memo(ToDoList)

