import {AppReducerActionsType, setAppErrorAC, setAppStatusAC} from "../app/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolistApi";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC("Some error occurred"))
    }
    dispatch(setAppStatusAC("failed"))
}
export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC("failed"))
}


type ErrorUtilsDispatchType = Dispatch<AppReducerActionsType>