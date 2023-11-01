import React, {MouseEvent} from "react";
import {FilterValuesType, TaskType} from "../App";
import {Task} from "./ Task";
import s from "./ToDoList.module.css"
import {AddItemInput} from "./AddItemInput/AddItemInput";
import EditableSpan from "./EditableSpan";


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
export const ToDoList: React.FC<PropsType> = ({
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
    return <>
        <h3><EditableSpan value={title} setValue={changeToDoListNameHandler}></EditableSpan>
            <button onClick={() => removeToDoList(props.id)}>X</button>
        </h3>
        <AddItemInput addItem={addNewTask}/>
        <ul>
            {tasks && filteredTasks(tasks).map(t => <Task task={t}
                                                          removeTask={removeTaskHandler}
                                                          toggleComplete={toggleCompleteHandler}
                                                          changeTaskName={changeTaskNameHandler}
            />)}
        </ul>
        <div>
            <button
                className={filter === "All" ? s.activeFilter : ""}
                onClick={onChangeFilter}
                value="All">
                All
            </button>
            <button
                className={filter === "Active" ? s.activeFilter : ""}
                onClick={onChangeFilter}
                value="Active">
                Active
            </button>
            <button className={filter === "Completed" ? s.activeFilter : ""}
                    onClick={onChangeFilter}
                    value="Completed">
                Completed
            </button>
        </div>
    </>
}


