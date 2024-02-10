import {authAPI} from "api/todolistApi";
import {Action, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedIn} from "features/Login/authReducer";
import {fulfilled, pending, rejected, rejectedWithValue} from "app/appSlice/config";
import {createAsyncSlice} from "middleware/createAsyncSlice";


export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

type AppErrorT = string | null

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as AppErrorT,
    isInitialized: false
}

const appSlice = createAsyncSlice({
    name: "app",
    initialState,
    selectors: {
        selectAppError: state => state.error,
        selectAppStatus: state => state.status,
        selectIsInitialized: state => state.isInitialized
    },
    reducers: create => ({
        setAppStatus: create.reducer((state, action: PayloadAction<RequestStatusType>) => {
            state.status = action.payload
        }),
        setAppError: create.reducer((state, action: PayloadAction<AppErrorT>) => {
            state.error = action.payload
        }),
        initializeApp: create.asyncThunk(
            async (_: void, {dispatch}) => {
                const res = await authAPI.me()
                if (res.resultCode === 0) {
                    dispatch(setIsLoggedIn(true))
                    return
                } else {
                    throw new Error(res.messages[0])
                }
            }, {
                rejected: (state, action) => {
                    state.status = "failed"
                    state.error = action.error.message || "Some error occurred"
                },
                settled: state => {
                    state.isInitialized = true
                }
            })
    }),
    extraReducers: builder => {
        builder
            .addMatcher(pending, state => {
                state.status = "loading"
            })
            .addMatcher(fulfilled, state => {
                state.status = "succeeded"
            })
            .addMatcher(rejected, (state, action) => {
                debugger
                state.status = "failed"
                state.error = action.error.message || "Some error occurred"
            })
            .addMatcher(rejectedWithValue, (state, action) => {
                debugger
                state.status = "failed"
                state.error = action.error.message || "Some error occurred"
            })

    }

})
export const appReducer = appSlice.reducer
export const {
    setAppStatus, setAppError, initializeApp
} = appSlice.actions

export type AppReducerActionsType =Action<string>
    // ReturnType<typeof setAppStatus> |
    // ReturnType<typeof setAppIsInitialized> |
    // ReturnType<typeof setAppError>
export const {selectAppError, selectAppStatus, selectIsInitialized} = appSlice.selectors
