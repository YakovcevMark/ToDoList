import React, {ChangeEvent, memo, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    value: string
    setValue: (title: string) => void
    label?: string
    disabled?:boolean
}
const EditableSpan: React.FC<EditableSpanPropsType> = (
    {
        value,
        label,
        setValue,
        disabled
    }) => {
    const [newSpanText, setNewSpanText] = useState<string>(value)
    const [editMode, setEditMode] = useState<boolean>(false)
    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        const newText = newSpanText.trim()
        if (newText && newText !== value) setValue(newText);
        setEditMode(false)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewSpanText(e.currentTarget.value)
    }
    return editMode && !disabled
        ? <TextField
            value={newSpanText}
            onChange={onChangeHandler}
            onBlur={offEditMode}
            autoFocus={true}
            label={label}
            variant="outlined"
        />
        : <span onDoubleClick={onEditMode}>{value}</span>
}

export default memo(EditableSpan);