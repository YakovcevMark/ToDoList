import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {ErrorType} from "../../state/stateTypes";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemInputPropsType = {
    addItem: (title: string) => void
    label?: string
}
export const AddItemForm: React.FC<AddItemInputPropsType> = (
    {
        addItem,
        label
    }) => {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<ErrorType>(null);

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value);
        setError(null);
    }

    function addNewTask() {
        const titleTrim = title.trim()
        if (titleTrim !== "") {
            addItem(titleTrim)
            setTitle("");
        } else {
            setError("Field is required")
        }

    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13)
            addNewTask()
    }

    return <>
        <div>
            <TextField
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyDownHandler}
                onBlur={addNewTask}
                error={!!error}
                label={label}
                variant="outlined"
                helperText={error}
            />
            <IconButton
                color="primary"
                onClick={addNewTask}>
                <AddBox/>
            </IconButton>
        </div>
    </>
}