import React, {memo} from "react";
import s from "./Task.module.css"
import EditableSpan from "./EditableSpan/EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "../api/todolistApi";
import {deleteTask, TaskType, updateTask} from "../state/tasksReducer";
import {useAppDispatch} from "../state/hooks";

type TaskPropsType = {
    task: TaskType
}
const Task: React.FC<TaskPropsType> = (
    {
        task
    }) => {
    const dispatch = useAppDispatch()
    const deleteTaskHandler = () =>  dispatch(deleteTask(task.todoListId, task.id))
    const changeTaskCompletedStatusHandler = () => {
        const status = task.status ? TaskStatuses.New : TaskStatuses.Completed
        dispatch(updateTask(task.todoListId, task.id, {status}))
    }
    const changeTaskNameHandler = (title: string) => {
        dispatch(updateTask(task.todoListId, task.id, {title}))
    }
    const isDisabled = task.entityStatus === "loading"
    return <>
        <div className={task.status ? s.done : ""} key={task.id}>
            <Checkbox
                color="primary"
                checked={!!task.status}
                onClick={changeTaskCompletedStatusHandler}
                disabled={isDisabled}/>
            <EditableSpan
                value={task.title || " "}
                setValue={changeTaskNameHandler}
                disabled={isDisabled}/>
            <IconButton
                size="small"
                onClick={deleteTaskHandler}
                disabled={isDisabled}>
                <Delete fontSize="small"/>
            </IconButton>
        </div>
    </>

}
export default memo(Task)