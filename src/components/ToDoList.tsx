import React, {ChangeEvent, KeyboardEvent, MouseEvent, useState} from "react";
import {ErrorType, FilterValuesType, TaskType} from "../App";
import {Task} from "./ Task";
import s from "./ToDoList.module.css"


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
                                                  ...props
                                              }) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");
    const [error, setError] = useState<ErrorType>(null);

    const filteredTasks = (tasks: TaskType[]): TaskType[] => {
        if (filter === "Active")
            return tasks.filter(t => !t.isDone)
        if (filter === "Completed")
            return tasks.filter(t => t.isDone)
        return tasks;
    }

    function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        setNewTaskTitle(event.currentTarget.value);
        setError(null);
    }

    function addNewTask() {
        const title = newTaskTitle.trim()
        if (title !== "") {
            addTask(title, props.id)
            setNewTaskTitle("");
        } else {
            setError("Field is required")
        }

    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ENTER")
            addNewTask()
    }
    const onChangeFilter = (e: MouseEvent<HTMLButtonElement>) => {
        changeFilter(e.currentTarget.value as FilterValuesType, props.id)
    }
    const removeTaskHandler = (taskId:string) => {
        removeTask(taskId,props.id)
    }
    const toggleCompleteHandler = (taskId:string) => {
        toggleComplete(taskId,props.id)
    }

    const inputClassName = error ? s.inputError : "";
    return <>
        <h3>{title}
            <button onClick={() => removeToDoList(props.id)}>X</button>
        </h3>


        <div className={inputClassName}>
            <input
                value={newTaskTitle}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}/>
            <button onClick={addNewTask}>+</button>
            <div>
                {error && <span className={s.errorMessage}>{error}</span>}
            </div>

        </div>
        <ul>
            {filteredTasks(tasks).map(t => <Task task={t}
                                                 removeTask={removeTaskHandler}
                                                 toggleComplete={toggleCompleteHandler}
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

