import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@mui/material/Alert';
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {setAppErrorAC} from "../../app/appReducer";

export function ErrorSnackbar() {
    const error = useAppSelector(state => state.app.error)
    const dispatch = useAppDispatch()

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(setAppErrorAC(null))
    }

    return (
        <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {error}
            </Alert>
        </Snackbar>
    )
}
