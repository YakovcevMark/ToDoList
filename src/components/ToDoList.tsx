import React, {memo, MouseEvent, useCallback, useEffect, useMemo} from "react";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {changeTodoListFilterAC, deleteTodoList, FilterValuesType, updateTodoListTitle} from "../state/todoListsReducer";
import {createTask, deleteTask, fetchTasks, updateTask} from "../state/tasksReducer";
import Task from "./ Task";
import AddItemForm from "./AddItemInput/AddItemForm";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {TaskType, UpdateTaskModelType} from "../api/todolistApi";


type PropsType = {
    title: string
    todolistId: string
    filter: FilterValuesType
}
const ToDoList: React.FC<PropsType> = (
    {
        todolistId,
        title,
        filter
    }) => {
    const tasks = useAppSelector(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTasks(todolistId))
    }, [dispatch, todolistId])


    const filteredTasks = (tasks: TaskType[]): TaskType[] => {
        if (filter === "active")
            return tasks.filter(t => !t.status)
        if (filter === "completed")
            return tasks.filter(t => t.status)
        return tasks;
    }

    const changeFilterHandler = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        dispatch(changeTodoListFilterAC(todolistId, e.currentTarget.value as FilterValuesType))
    }, [dispatch, todolistId])

    const changeToDoListNameHandler = useCallback((title: string) => {
        dispatch(updateTodoListTitle(todolistId, title))
    }, [dispatch, todolistId])

    const onRemoveTodolist = useCallback(() => {
        dispatch(deleteTodoList(todolistId))
    }, [dispatch, todolistId])


    const updateTaskHandler = useCallback((taskId: string, updateTaskModel: UpdateTaskModelType) => {
        dispatch(updateTask(todolistId, taskId, updateTaskModel))
    }, [dispatch, todolistId])

    const createTaskHandler = useCallback((title: string) => {
        dispatch(createTask(todolistId, title))
    }, [dispatch, todolistId])

    const deleteTaskHandler = useCallback((taskId: string) => {
        dispatch(deleteTask(todolistId, taskId))
    }, [dispatch, todolistId])


    const currentTasks = filteredTasks(tasks[todolistId]);

    const taskRender = useMemo(() => {
        return currentTasks.map(t =>
            <Task task={t}
                  key={t.id}
                  deleteTask={deleteTaskHandler}
                  updateTask={updateTaskHandler}
            />)
    }, [
        currentTasks,
        deleteTaskHandler,
        updateTaskHandler
    ])
    return <div>
        <h3><EditableSpan label="List name"
                          value={title}
                          setValue={changeToDoListNameHandler}/>

            <IconButton onClick={onRemoveTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm label="Task name"
                     addItem={createTaskHandler}/>
        {tasks && taskRender}
        <div>
            <Button
                variant={filter === 'all' ? 'outlined' : undefined}
                onClick={changeFilterHandler}
                value="all"
                color={'default'}>
                All
            </Button>
            <Button
                variant={filter === 'active' ? 'outlined' : undefined}
                onClick={changeFilterHandler}
                value="active"
                color={'primary'}>
                Active
            </Button>
            <Button
                variant={filter === 'completed' ? 'outlined' : undefined}
                onClick={changeFilterHandler}
                value="completed"
                color={'secondary'}>
                Completed
            </Button>
        </div>
    </div>
}
export default memo(ToDoList)

