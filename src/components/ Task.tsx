import {ErrorType, TaskType} from "../App";
import React from "react";
import s from "./Task.module.css"

type TaskPropsType = {
    task: TaskType

    removeTask: (id: string) => void
    toggleComplete: (id: string) => void
}
export const Task: React.FC<TaskPropsType> = ({task, removeTask, toggleComplete}) => {
    const onClickButtonHandler = () => removeTask(task.id);
    const onClickInputHandler = () => toggleComplete(task.id);
    return <li className={task.isDone ? s.done : ""} key={task.id}>
        <input
            type="checkbox"
            checked={task.isDone}
            onClick={onClickInputHandler}/>

        <span>{task.title}</span>
        <button onClick={onClickButtonHandler}>X</button>
    </li>
}