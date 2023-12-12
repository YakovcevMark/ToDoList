import {AppThunk} from "./store";
import {authAPI} from "../api/todolistApi";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedIn} from "../features/Login/authReducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
type AppErrorT = string | null
const initialState = {
    status: "idle" as RequestStatusType,
    error: null as AppErrorT,
    isInitialized: false
}
type InitialStateType = typeof initialState
export type AppReducerActionsType =
    ReturnType<typeof setAppStatusAC> |
    ReturnType<typeof setAppInitializedAC> |
    ReturnType<typeof setAppErrorAC>

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET_STATUS": {
            return {
                ...state,
                status: action.status
            }
        }
        case "APP/SET_ERROR": {
            return {
                ...state,
                error: action.error
            }
        }
        case "APP/SET_INITIALIZED":{
            return{
                ...state,
                isInitialized: action.value
            }
        }
        default:
            return state
    }
}
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: "APP/SET_STATUS", status} as const)
export const setAppErrorAC = (error: AppErrorT) =>
    ({type: "APP/SET_ERROR", error} as const)
export const setAppInitializedAC = (value: boolean) =>
    ({type: "APP/SET_INITIALIZED", value} as const)
export const initializeApp = (): AppThunk =>
    async (dispatch) => {
        try {
            const res = await authAPI.me()
            if (res.resultCode === 0) {
                dispatch(setIsLoggedIn(true))
            } else {
                handleServerAppError(res, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        } finally {
            dispatch(setAppInitializedAC(true))
        }
    }