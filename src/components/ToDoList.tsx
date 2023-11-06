import React, {MouseEvent, useMemo} from "react";
import {FilterValuesType, TaskType} from "../state/stateTypes";
import {Task} from "./ Task";
import {AddItemForm} from "./AddItemInput/AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";


type PropsType = {
    title: string
    removeToDoList: (id: string) => void
    tasks: Array<TaskType>
    addTask: (newTaskTitle: string, toDoListId: string) => void
    removeTask: (id: string, toDoListId: string) => void
    toggleComplete: (id: string, toDoListId: string) => void
    id: string
    filter: FilterValuesType
    changeFilter: (value: FilterValuesType, toDoListId: string) => void
    changeToDoListName: (title: string, toDoListId: string) => void
    changeTaskName: (title: string, toDoListId: string, taskId: string) => void
}
export const ToDoList: React.FC<PropsType> = (
    {
        addTask,
        removeToDoList,
        title,
        tasks,
        removeTask,
        toggleComplete,
        filter,
        changeFilter,
        changeToDoListName,
        changeTaskName,
        ...props
    }) => {
    const filteredTasks = (tasks: TaskType[]): TaskType[] => {
        if (filter === "Active")
            return tasks.filter(t => !t.isDone)
        if (filter === "Completed")
            return tasks.filter(t => t.isDone)
        return tasks;
    }

    const onChangeFilter = (e: MouseEvent<HTMLButtonElement>) => {
        changeFilter(e.currentTarget.value as FilterValuesType, props.id)
    }
    const removeTaskHandler = (taskId: string) => {
        removeTask(taskId, props.id)
    }
    const toggleCompleteHandler = (taskId: string) => {
        toggleComplete(taskId, props.id)
    }
    const addNewTask = (title: string) => {
        addTask(title, props.id)
    }
    const changeToDoListNameHandler = (title: string) => {
        changeToDoListName(title, props.id)
    }
    const changeTaskNameHandler = (title: string, taskId: string) => {
        changeTaskName(title, taskId, props.id)
    }
    const currentTasks = filteredTasks(tasks);

    const taskRender = useMemo(()=> {
       return currentTasks.map(t =>
            <Task task={t}
                  key={t.id}
                  removeTask={removeTaskHandler}
                  toggleComplete={toggleCompleteHandler}
                  changeTaskName={changeTaskNameHandler}
            />)
    },[currentTasks])
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
                variant={filter === 'All' ? 'outlined' : undefined}
                onClick={onChangeFilter}
                value="All"
                color={'default'}>
                All
            </Button>
            <Button
                variant={filter === 'Active' ? 'outlined' : undefined}
                onClick={onChangeFilter}
                value="Active"
                color={'primary'}>
                Active
            </Button>
            <Button
                variant={filter === 'Completed' ? 'outlined' : undefined}
                onClick={onChangeFilter}
                value="Completed"
                color={'secondary'}>
                Completed
            </Button>
        </div>
    </div>
}


