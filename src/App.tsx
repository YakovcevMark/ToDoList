import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {ToDoList} from "./components/ToDoList";

export type FilterValuesType = "All" | "Active" | "Completed"
export type ErrorType = string | null
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type ToDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
type TaskStateType = {
    [key: string]: TaskType[]
}

function App() {
    const toDoListId1 = v1();
    const toDoListId2 = v1();

    // const [tasks, setTasks] = useState<TaskType[]>([
    //     {id: v1(), title: "Css", isDone: true},
    //     {id: v1(), title: "Ts", isDone: false},
    //     {id: v1(), title: "ReactJS", isDone: true},
    //     {id: v1(), title: "RestAPI", isDone: false},
    //     {id: v1(), title: "GraphQL", isDone: true},
    // ])
    const [toDoLists, setToDoLists] = useState<ToDoListType[]>([
        {id: toDoListId1, title: "What to learn", filter: "All"},
        {id: toDoListId2, title: "What to buy", filter: "All"},
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
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
    })
    const removeToDoList = (id: string) => {
        setToDoLists(toDoLists.filter(tl => tl.id !== id))
        delete tasks[id]
        setTasks({...tasks})
    }
    const changeFilter = (value: FilterValuesType, toDoListId: string) => {
        setToDoLists(toDoLists.map(tl => {
            if (tl.id === toDoListId) tl.filter = value
            return tl
        }))
    }

    function toggleComplete(id: string, toDoListId: string) {
        setTasks({...tasks, [toDoListId]: tasks[toDoListId].map(t => t.id === id ? {...t, isDone: !t.isDone} : t)})
    }

    function addTask(title: string, toDoListId: string) {
        const newTask = {id: v1(), title, isDone: false};
        setTasks({...tasks, [toDoListId]: [newTask, ...tasks[toDoListId]]});
    }

    function removeTask(id: string, toDoListId: string) {
        setTasks({...tasks, [toDoListId]: tasks[toDoListId].filter(t => t.id !== id)})
    }


    return (
        <div>
            {toDoLists.map(tl => <ToDoList title={tl.title}
                                           removeToDoList={removeToDoList}
                                           tasks={tasks[tl.id]}
                                           addTask={addTask}
                                           removeTask={removeTask}
                                           toggleComplete={toggleComplete}
                                           key={tl.id}
                                           id={tl.id}
                                           filter={tl.filter}
                                           changeFilter={changeFilter}/>)}
            {/*<ToDoList title={"learnTasks"}*/}
            {/*          tasks={filteredTasks(tasks)}*/}
            {/*          addTask={addTask}*/}
            {/*          removeTask={removeTask}*/}
            {/*          changeFilter={setFilter}*/}
            {/*          toggleComplete={toggleComplete}*/}
            {/*          filter={filter}*/}
            {/*/>*/}
        </div>
    );
}

export default App;
