import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {ErrorType} from "../../App";
import s from "../AddItemInput/AddItemInput.module.css";

type AddItemInputPropsType = {
    addItem: (title: string) => void
}
export const AddItemInput: React.FC<AddItemInputPropsType> = ({addItem}) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");
    const [error, setError] = useState<ErrorType>(null);

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setNewTaskTitle(e.currentTarget.value);
        setError(null);
    }

    function addNewTask() {
        const title = newTaskTitle.trim()
        if (title !== "") {
            addItem(title)
            setNewTaskTitle("");
        } else {
            setError("Field is required")
        }

    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13)
            addNewTask()
    }
    const inputClassName = error ? s.inputError : "";
    return <>
        <div className={inputClassName}>
            <input
                value={newTaskTitle}
                onChange={onChangeHandler}
                onKeyPress={onKeyDownHandler}
                onBlur={addNewTask}/>
            <button onClick={addNewTask}>+</button>
            <div>
                {error && <span className={s.errorMessage}>{error}</span>}
            </div>
        </div>
    </>

}