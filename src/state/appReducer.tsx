export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
type AppErrorT = string | null
const initialState = {
    status: "loading" as RequestStatusType,
    error: null as AppErrorT
}
type InitialStateType = typeof initialState
export type AppReducerActionsType =
    ReturnType<typeof setAppStatusAC> |
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
        default:
            return state
    }
}
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: "APP/SET_STATUS", status} as const)
export const setAppErrorAC = (error: AppErrorT) =>
    ({type: "APP/SET_ERROR", error} as const)