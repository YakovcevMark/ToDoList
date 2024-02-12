import React, {memo} from "react";
import s from "./Task.module.css"
import EditableSpan from "../../../components/EditableSpan/EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "api/todolistApi";
import {deleteTask, TaskType, updateTask} from "./tasksReducer";
import {useAppDispatch} from "utils/hooks";

type TaskPropsType = {
    task: TaskType
}
const Task: React.FC<TaskPropsType> = (
    {
        task: {
            todoListId,
            title,
            status,
            id,
            entityStatus
        }
    }) => {
    const dispatch = useAppDispatch()
    const deleteTaskHandler = () => dispatch(deleteTask({todoListId, taskId: id}))
    const changeTaskCompletedStatusHandler = () => {
        const newStatus = status ? TaskStatuses.New : TaskStatuses.Completed
        dispatch(updateTask({todoListId, taskId: id, updateTaskModel: {status: newStatus}}))
    }
    const changeTaskNameHandler = (title: string) => {
        dispatch(updateTask({todoListId, taskId: id, updateTaskModel: {title}}))
    }
    const isDisabled = entityStatus === "loading"
    return <>
        <div className={status ? s.done : ""} key={id}>
            <Checkbox
                color="primary"
                checked={!!status}
                onClick={changeTaskCompletedStatusHandler}
                disabled={isDisabled}/>
            <EditableSpan
                value={title || " "}
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