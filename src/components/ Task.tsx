import {TaskType} from "../App";
import React from "react";
import s from "./Task.module.css"
import EditableSpan from "./EditableSpan";

type TaskPropsType = {
    task: TaskType

    removeTask: (id: string) => void
    toggleComplete: (id: string) => void
    changeTaskName: (title: string, taskId: string) => void
}
export const Task: React.FC<TaskPropsType> = ({
                                                  task,
                                                  removeTask,
                                                  toggleComplete,
                                                  changeTaskName
                                              }) => {
    const onClickButtonHandler = () => removeTask(task.id);
    const onClickInputHandler = () => toggleComplete(task.id);
    const changeTaskNameHandler = (title: string) => {
        changeTaskName(title, task.id)
    }

    return <>
        <li className={task.isDone ? s.done : ""} key={task.id}>
            <input
                type="checkbox"
                checked={task.isDone}
                onClick={onClickInputHandler}/>
            <EditableSpan value={task.title} setValue={changeTaskNameHandler}/>
            <button onClick={onClickButtonHandler}>X</button>
        </li>
    </>

}