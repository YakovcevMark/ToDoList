import React, {memo} from "react";
import s from "./Task.module.css"
import EditableSpan from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType, UpdateTaskModelType} from "../api/todolistApi";

type TaskPropsType = {
    task: TaskType
    deleteTask: (id: string) => void
    updateTask:(taskId:string, updateTaskModel:UpdateTaskModelType) => void
}
const Task: React.FC<TaskPropsType> = (
    {
        task,
        deleteTask,
        updateTask
    }) => {
    const deleteTaskHandler = () => deleteTask(task.id);
    const changeTaskCompletedStatusHandler = () => {
        const status = task.status ? TaskStatuses.New : TaskStatuses.Completed
        updateTask(task.id, {status});
    }
    const changeTaskNameHandler = (title: string) => {
        updateTask(task.id,{title})
    }

    return <>
        <div className={task.status ? s.done : ""} key={task.id}>
            <Checkbox
                color="primary"
                checked={!!task.status}
                onClick={changeTaskCompletedStatusHandler}/>
            <EditableSpan value={task.title || " "} setValue={changeTaskNameHandler}/>
            <IconButton size="small" onClick={deleteTaskHandler}>
                <Delete fontSize="small"/>
            </IconButton>
        </div>
    </>

}
export default memo(Task)