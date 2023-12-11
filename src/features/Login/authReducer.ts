import {AppThunk} from "../../app/store";
import {authAPI} from "../../api/todolistApi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {setAppStatusAC} from "../../app/appReducer";
import {FormikValues} from "formik";

const initialState = {
    isLoggedIn: false,
    // sessionUserData: {login:null,email:null,id:null} as SessionUserInfoType
}
type AuthReducerStateType = typeof initialState
export type AuthReducerActionsType =
    ReturnType<typeof setIsLoggedIn>
    // ReturnType<typeof logoutAC>
export const authReducer = (state: AuthReducerStateType = initialState, action: AuthReducerActionsType): AuthReducerStateType => {
    switch (action.type) {
        // case "AUTH/LOGIN": {
        //     return {...state, ...action.data}
        // }
        // case "AUTH/LOGOUT": {
        //     return {...state, sessionUserData: {login:null,email:null,id:null}}
        // }
        case "AUTH/SET_IS_LOGGED_IN":{
            return{...state,isLoggedIn: action.v}
        }
        default:
            return {...state}

    }
}
const setIsLoggedIn = (v:boolean) => ({
    type:"AUTH/SET_IS_LOGGED_IN", v
}as const)
// const loginAC = (data: SessionUserInfoType) =>
//     ({type: "AUTH/LOGIN", data} as const)
// const logoutAC = () =>
//     ({type: "AUTH/LOGOUT"} as const)
export const authorization = (): AppThunk =>
    async (dispatch) => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await authAPI.me()
        if (res.resultCode === 0) {
            dispatch(setIsLoggedIn(true))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}
export const login = (data:FormikValues): AppThunk =>
    async (dispatch) => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await authAPI.login(data)
        if (res.resultCode === 0) {
            // dispatch(loginAC(res.data))
            dispatch(setIsLoggedIn(true))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}
export const logout = (): AppThunk =>
    async (dispatch) => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await authAPI.logout()
        if (res.resultCode === 0) {
            // dispatch(loginAC(res.data))
            dispatch(setIsLoggedIn(false))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}
