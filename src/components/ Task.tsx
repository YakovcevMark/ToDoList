import React, {memo} from "react";
import s from "./Task.module.css"
import EditableSpan from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskType} from "../state/tasksReducer";

type TaskPropsType = {
    task: TaskType

    removeTask: (id: string) => void
    toggleComplete: (id: string) => void
    changeTaskName: (title: string, taskId: string) => void
}
const Task: React.FC<TaskPropsType> = (
    {
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
        <div className={task.isDone ? s.done : ""} key={task.id}>
            <Checkbox
                color="primary"
                checked={task.isDone}
                onClick={onClickInputHandler}/>
            <EditableSpan value={task.title} setValue={changeTaskNameHandler}/>
            <IconButton size="small" onClick={onClickButtonHandler}>
                <Delete fontSize="small"/>
            </IconButton>
        </div>
    </>

}
export default memo(Task)