import {authAPI} from "api/todolistApi";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {setIsLoggedIn} from "features/Login/authReducer";

export const initializeApp = createAsyncThunk(
    'app/initialize',
    async (_, {dispatch}) => {
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
            dispatch(setAppIsInitialized(true))
        }
    }
)

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

type AppErrorT = string | null

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as AppErrorT,
    isInitialized: false
}

const appSlice = createSlice({
    name: "app",
    initialState: initialState,

    reducers: {
        setAppStatus(state, action) {
            state.status = action.payload
        },
        setAppError(state, action) {
            state.error = action.payload
        },
        setAppIsInitialized(state, action) {
            state.isInitialized = action.payload
        },
    },
    selectors: {
        selectAppError: state => state.error,
        selectAppStatus: state => state.status,
        selectIsInitialized: state => state.isInitialized
    },
})
export const appReducer = appSlice.reducer
export const {setAppStatus, setAppError, setAppIsInitialized} = appSlice.actions

export type AppReducerActionsType =
    ReturnType<typeof setAppStatus> |
    ReturnType<typeof setAppIsInitialized> |
    ReturnType<typeof setAppError>
export const {selectAppError, selectAppStatus, selectIsInitialized} = appSlice.selectors
