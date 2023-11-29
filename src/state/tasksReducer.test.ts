import {createTaskAC, deleteTaskAC, tasksReducer, TasksStateT, updateTaskAC} from './tasksReducer';
import {createTodoListAC, deleteTodoListAC, todoListsReducer, TodoListsStateT} from "./todoListsReducer";
import {v1} from "uuid";
import {TaskStatuses} from "../api/todolistApi";
let todolistId1:string
let todolistId2:string
let startState: TasksStateT = {}
beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = {
        [todolistId1]: [
            {id: "1", title: "CSS", status: TaskStatuses.New, todoListId:todolistId1},
            {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId:todolistId1},
            {id: "3", title: "React", status: TaskStatuses.New, todoListId:todolistId1}
        ],
        [todolistId2]: [
            {id: "1", title: "bread", status: TaskStatuses.New, todoListId:todolistId2},
            {id: "2", title: "milk", status: TaskStatuses.Completed, todoListId:todolistId2},
            {id: "3", title: "tea", status: TaskStatuses.New, todoListId:todolistId2}
        ]
    }
})
test('correct task should be deleted from correct array', () => {

    const action = deleteTaskAC(todolistId2,"2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        [todolistId1]: [
            {id: "1", title: "CSS", isDone: false},
            {id: "2", title: "JS", isDone: true},
            {id: "3", title: "React", isDone: false}
        ],
        [todolistId2]: [
            {id: "1", title: "bread", isDone: false},
            {id: "3", title: "tea", isDone: false}
        ]
    });

});

test('correct task should be added to correct array', () => {
    const action = createTaskAC(todolistId2,{title:"juce", status:TaskStatuses.New,todoListId:todolistId2,id:v1()});

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(4);
    expect(endState[todolistId2][0].id).toBeDefined();
    expect(endState[todolistId2][0].title).toBe("juce");
    expect(endState[todolistId2][0].status).toBe(TaskStatuses.New);
})
test('status of specified task should be changed', () => {


    const action = updateTaskAC(todolistId2, "2", {status:TaskStatuses.New});

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId2][1].status).toBe(false);
    expect(endState[todolistId1][1].status).toBe(true);
});
test('new array should be added when new todolist is added', () => {


    const action = createTodoListAC("new todolist",v1(),"newTodo",3);

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== todolistId1 && k !== todolistId2);
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('ids should be equals', () => {
    const startTasksState: TasksStateT = {};
    const startTodoListsState: TodoListsStateT = [];

    const action = createTodoListAC("new todolist",v1(),"newTodo",3);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.newTodoListId);
    expect(idFromTodoLists).toBe(action.newTodoListId);
});

test('property with todolistId should be deleted', () => {


    const action = deleteTodoListAC(todolistId2);
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    expect(keys.length).toBe(1);
    expect(endState[todolistId2]).not.toBeDefined();
});







