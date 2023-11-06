import {v1} from "uuid";
import {
    ActionTypes,
    AddTaskAT,
    ChangeFilterAT,
    ChangeTaskNameAT,
    ChangeToDoListNameAT,
    CreateNewToDoListAT,
    FilterValuesType,
    RemoveTaskAT,
    RemoveToDoListAT,
    StateType,
    ToDoListType,
    ToggleTaskCompleteAT
} from "./stateTypes";

const toDoListId1 = v1();
const toDoListId2 = v1();
export const initialState: StateType = {
    toDoLists: [
        {id: toDoListId1, title: "What to learn", filter: "All"},
        {id: toDoListId2, title: "What to buy", filter: "All"}
    ],
    tasks: {
        [toDoListId1]: [
            {id: v1(), title: "Css", isDone: true},
            {id: v1(), title: "Ts", isDone: false},
            {id: v1(), title: "ReactJS", isDone: true},
            {id: v1(), title: "RestAPI", isDone: false},
            {id: v1(), title: "GraphQL", isDone: true},
        ],
        [toDoListId2]: [
            {id: v1(), title: "Css", isDone: true},
            {id: v1(), title: "Ts", isDone: false},
            {id: v1(), title: "ReactJS", isDone: true},
            {id: v1(), title: "RestAPI", isDone: false},
            {id: v1(), title: "GraphQL", isDone: true},
        ]
    }
}
export const toDoListsReducer = (state: StateType = initialState, action: ActionTypes): StateType => {
    switch (action.type) {
        case "REMOVE_TO_DO_LIST":
            delete state.tasks[action.toDoListId]
            return {
                ...state,
                toDoLists: state.toDoLists.filter(tl => tl.id !== action.toDoListId)
            }
        case "CHANGE_FILTER":
            return {
                ...state,
                toDoLists: state.toDoLists.map(tl => {
                    if (tl.id === action.toDoListId)
                        tl.filter = action.filterValue
                    return tl
                })
            }
        case "TOGGLE_COMPLETE":
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.toDoListId]:
                        state.tasks[action.toDoListId].map(t =>
                            t.id === action.taskId
                                ? {...t, isDone: !t.isDone}
                                : t)
                }
            }
        case "ADD_TASK":
            const newTask = {id: v1(), title: action.newTaskTitle, isDone: false};
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.toDoListId]:
                        [
                            newTask,
                            ...state.tasks[action.toDoListId]
                        ]
                }
            }
        case "REMOVE_TASK":
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.toDoListId]: state.tasks[action.toDoListId].filter(t => t.id !== action.taskId)
                }
            }
        case "CREATE_NEW_TO_DO_LIST":
            const newId = v1();
            const newToDoList: ToDoListType = {id: newId, title: action.newToDoListTitle, filter: "All"};
            return {
                ...state,
                toDoLists: [
                    newToDoList,
                    ...state.toDoLists
                ],
                tasks: {
                    [newId]: [],
                    ...state.tasks
                }
            }
        case "CHANGE_TO_DO_LIST_NAME":
            return {
                ...state,
                toDoLists: state.toDoLists.map(t =>
                    t.id === action.toDoListId
                        ? {
                            ...t,
                            title: action.newToDoListTitle
                        }
                        : t)
            }
        case "CHANGE_TASK_NAME":
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.toDoListId]:
                        state.tasks[action.toDoListId].map(t =>
                            t.id === action.taskId
                                ? {
                                    ...t,
                                    title: action.newTaskTitle
                                } : t)
                }
            }
        default:
            return state
    }
}
export const removeToDoList = (toDoListId: string): RemoveToDoListAT =>
    ({type: "REMOVE_TO_DO_LIST", toDoListId})
export const changeFilter = (filterValue: FilterValuesType, toDoListId: string): ChangeFilterAT =>
    ({type: "CHANGE_FILTER", filterValue, toDoListId})
export const toggleComplete = (toDoListId: string, taskId: string): ToggleTaskCompleteAT =>
    ({type: "TOGGLE_COMPLETE", taskId, toDoListId})
export const addTask = (toDoListId: string, taskId: string, newTaskTitle: string): AddTaskAT =>
    ({type: "ADD_TASK", newTaskTitle, toDoListId})
export const removeTask = (toDoListId: string, taskId: string): RemoveTaskAT =>
    ({type: "REMOVE_TASK", toDoListId, taskId})
export const createNewToDoList = (newToDoListTitle: string): CreateNewToDoListAT =>
    ({type: "CREATE_NEW_TO_DO_LIST", newToDoListTitle})
export const changeToDoListName = (toDoListId: string, newToDoListTitle: string): ChangeToDoListNameAT =>
    ({type: "CHANGE_TO_DO_LIST_NAME", toDoListId, newToDoListTitle})
export const changeTaskName = (toDoListId: string, taskId: string, newTaskTitle: string): ChangeTaskNameAT =>
    ({type: "CHANGE_TASK_NAME", toDoListId, taskId, newTaskTitle})
