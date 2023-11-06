export type FilterValuesType = "All" | "Active" | "Completed"
export type ErrorType = string | null
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type ToDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [key: string]: TaskType[]
}
export type StateType = {
    toDoLists: ToDoListType[]
    tasks: TaskStateType
}


export type RemoveToDoListAT = {
    type: 'REMOVE_TO_DO_LIST',
    toDoListId: string
}
export type ChangeFilterAT = {
    type: 'CHANGE_FILTER',
    filterValue: FilterValuesType,
    toDoListId: string
}
export type ToggleTaskCompleteAT = {
    type: 'TOGGLE_COMPLETE',
    taskId: string,
    toDoListId: string
}
export type AddTaskAT = {
    type: 'ADD_TASK',
    newTaskTitle: string,

    toDoListId: string
}
export type RemoveTaskAT = {
    type: 'REMOVE_TASK',
    taskId: string,
    toDoListId: string
}
export type CreateNewToDoListAT = {
    type: 'CREATE_NEW_TO_DO_LIST',
    newToDoListTitle: string
}
export type ChangeToDoListNameAT = {
    type: 'CHANGE_TO_DO_LIST_NAME',
    newToDoListTitle: string,
    toDoListId: string
}
export type ChangeTaskNameAT = {
    type: 'CHANGE_TASK_NAME',
    taskId: string,
    newTaskTitle: string,
    toDoListId: string
}
export type ActionTypes = RemoveToDoListAT | ChangeFilterAT | ToggleTaskCompleteAT
    | AddTaskAT | RemoveTaskAT | CreateNewToDoListAT
    | ChangeToDoListNameAT | ChangeTaskNameAT



