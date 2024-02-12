import {v1} from "uuid";
import {
    changeTodoListFilter,
    // changeTodoListTitle,
    // createTodoListAC,
    // deleteTodoListAC,
    FilterValuesType,
    todoListsReducer,
    TodoListsStateT
} from "./todoListsReducer";

let todolistId1: string
let todolistId2: string
let startState: TodoListsStateT
beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = {
        [todolistId1]: {
            id: todolistId1,
            title: "What to learn",
            addedDate: "lol",
            order: 1,
            filter: "all",
            entityStatus: "succeeded"
        },
        [todolistId2]: {
            id: todolistId2,
            title: "What to buy",
            addedDate: "kek",
            order: 2,
            filter: "all",
            entityStatus: "succeeded"
        }
    }
})

// test('correct todolist should be removed', () => {
//
//     const endState = todoListsReducer(startState, deleteTodoListAC(todolistId1))
//
//     expect(endState.length).toBe(1);
//     expect(endState[0].id).toBe(todolistId2);
// });
//
//
// test('correct todolist should be added', () => {
//
//     const newTodolistTitle = "MyToDOs"
//     const endState = todoListsReducer(startState, createTodoListAC({id: v1(), title: "new todolist", order: 3, addedDate: v1()}))
//
//     expect(endState.length).toBe(3);
//     expect(endState[2].title).toBe(newTodolistTitle);
// });


test('correct filter of todolist should be changed', () => {


    const newFilter: FilterValuesType = "completed"

    const endState = todoListsReducer(startState, changeTodoListFilter({id: todolistId2, filter:newFilter}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});








