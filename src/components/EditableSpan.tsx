import React, {useState, ChangeEvent} from 'react';

type EditableSpanPropsType = {
    value: string
    setValue: (title: string) => void
}
const EditableSpan: React.FC<EditableSpanPropsType> = ({value,setValue}) => {
    const [spanText,setSpanText]=useState<string>(value)
    const [editMode,setEditMode]=useState<boolean>(false)
    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        setValue(spanText);
        setEditMode(false)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSpanText(e.currentTarget.value)
    }
    return editMode
        ? <input type="text"
                 value={spanText}
                 onChange={onChangeHandler}
                 onBlur={offEditMode}
                 autoFocus={true}
        />
        : <span onDoubleClick={onEditMode}>{spanText}</span>
}

export default EditableSpan;