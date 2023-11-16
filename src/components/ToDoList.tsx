import React, {memo, MouseEvent, useCallback, useMemo} from "react";
import {Task} from "./ Task";
import {AddItemForm} from "./AddItemInput/AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {FilterValuesType} from "../state/todoListsReducer";
import {TaskType} from "../state/tasksReducer";


type PropsType = {
    title: string
    removeToDoList: (id: string) => void
    tasks: Array<TaskType>
    id: string
    filter: FilterValuesType
    changeFilter: (value: FilterValuesType, toDoListId: string) => void
    changeToDoListName: (title: string, toDoListId: string) => void
    addTask: (newTaskTitle: string, toDoListId: string) => void
    removeTask: (id: string, toDoListId: string) => void
    toggleComplete: (id: string, toDoListId: string) => void
    changeTaskName: (title: string, toDoListId: string, taskId: string) => void
}
const ToDoList: React.FC<PropsType> = (
    {
        removeToDoList,
        title,
        tasks,
        filter,
        changeFilter,
        changeToDoListName,
        removeTask,
        toggleComplete,
        addTask,
        changeTaskName,
        ...props
    }) => {
    const filteredTasks = (tasks: TaskType[]): TaskType[] => {
        if (filter === "active")
            return tasks.filter(t => !t.isDone)
        if (filter === "completed")
            return tasks.filter(t => t.isDone)
        return tasks;
    }

    const onChangeFilter = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        changeFilter(e.currentTarget.value as FilterValuesType, props.id)
    },[changeFilter,props])

    const removeTaskHandler = useCallback((taskId: string) => {
        removeTask(taskId, props.id)
    },[removeTask,props])

    const toggleCompleteHandler = useCallback((taskId: string) => {
        toggleComplete(taskId, props.id)
    },[toggleComplete,props])

    const addNewTask = useCallback((title: string) => {
        addTask(title, props.id)
    },[addTask,props])

    const changeToDoListNameHandler = useCallback((title: string) => {
        changeToDoListName(title, props.id)
    },[changeToDoListName,props])

    const changeTaskNameHandler = useCallback((title: string, taskId: string) => {
        changeTaskName(title, taskId, props.id)
    },[changeTaskName,props])

    const currentTasks = filteredTasks(tasks);

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

            <IconButton onClick={() => removeToDoList(props.id)}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm label="Task name"
                     addItem={addNewTask}/>
        {tasks && taskRender}
        <div>
            <Button
                variant={filter === 'all' ? 'outlined' : undefined}
                onClick={onChangeFilter}
                value="all"
                color={'default'}>
                All
            </Button>
            <Button
                variant={filter === 'active' ? 'outlined' : undefined}
                onClick={onChangeFilter}
                value="active"
                color={'primary'}>
                Active
            </Button>
            <Button
                variant={filter === 'completed' ? 'outlined' : undefined}
                onClick={onChangeFilter}
                value="completed"
                color={'secondary'}>
                Completed
            </Button>
        </div>
    </div>
}
export default memo(ToDoList)

