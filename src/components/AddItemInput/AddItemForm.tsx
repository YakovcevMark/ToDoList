import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type ErrorType = null | string
type AddItemInputPropsType = {
    addItem: (title: string) => void
    label?: string
    disabled?: boolean
}
const AddItemForm: React.FC<AddItemInputPropsType> = (
    {
        addItem,
        label,
        disabled
    }) => {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<ErrorType>(null);

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value);
        setError(null);
    }

    function addNewTask() {
        const titleTrim = title.trim()
        if (titleTrim) {
            if (titleTrim.length < 100) {
                addItem(titleTrim)
                setTitle("");
            } else {
                setError("Max length 100 symbols")
            }
        }
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter")
            addNewTask()
    }

    return <>
        <div>
            <TextField
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                onBlur={addNewTask}
                error={!!error}
                label={label}
                variant="outlined"
                helperText={error}
                disabled={disabled}
            />
            <IconButton
                color="primary"
                onClick={addNewTask}
                disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    </>
}
export default memo(AddItemForm)