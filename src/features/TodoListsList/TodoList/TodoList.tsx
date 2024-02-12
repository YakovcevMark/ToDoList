import React, {memo, MouseEvent, useCallback, useEffect, useMemo} from "react";
import EditableSpan from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {changeTodoListFilter, deleteTodoList, FilterValuesType, updateTodoListTitle} from "./todoListsReducer";
import {createTask, fetchTasks, TaskType} from "../Task/tasksReducer";
import Task from "../Task/ Task";
import AddItemForm from "../../../components/AddItemInput/AddItemForm";
import {useAppDispatch, useAppSelector} from "utils/hooks";
import {RequestStatusType} from "app/appSlice/appSlice";


type PropsType = {
    title: string
    id: string
    filter: FilterValuesType
    entityStatus?: RequestStatusType
}
const TodoList: React.FC<PropsType> = (
    {
        id,
        title,
        filter,
        entityStatus
    }) => {
    const tasks = useAppSelector(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTasks(id))
    }, [dispatch, id])


    const filteredTasks = (tasks: TaskType[]): TaskType[] => {
        if (filter === "active")
            return tasks.filter(t => !t.status)
        if (filter === "completed")
            return tasks.filter(t => t.status)
        return tasks;
    }

    const changeFilterHandler = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        dispatch(changeTodoListFilter({id, filter: e.currentTarget.value as FilterValuesType}))
    }, [dispatch, id])

    const changeToDoListNameHandler = useCallback((title: string) => {
        dispatch(updateTodoListTitle({id, title}))
    }, [dispatch, id])

    const onRemoveTodolist = useCallback(() => {
        dispatch(deleteTodoList(id))
    }, [dispatch, id])


    const createTaskHandler = useCallback((title: string) => {
        dispatch(createTask({todoListId: id, title}))
    }, [dispatch, id])

    const isDisabled = entityStatus === 'loading'

    const currentTasks = filteredTasks(tasks[id]);

    const taskRender = useMemo(() => {
        return currentTasks.map(t =>
            <Task task={t}
                  key={t.id}
            />)
    }, [currentTasks])
    return <div>
        <h3><EditableSpan label="List name"
                          value={title}
                          setValue={changeToDoListNameHandler}
                          disabled={isDisabled}/>

            <IconButton onClick={onRemoveTodolist} disabled={isDisabled}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm label="Task name"
                     addItem={createTaskHandler}
                     disabled={isDisabled}/>
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
export default memo(TodoList)

