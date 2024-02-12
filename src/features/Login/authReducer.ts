import {authAPI} from "api/todolistApi";
import {createAsyncSlice} from "middleware/createAsyncSlice";
import {FormikValues} from "formik";
import {PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
}

const authSlice = createAsyncSlice({
    name: "auth",
    initialState,
    selectors: {
        selectIsLoggedIn: s => s.isLoggedIn
    },
    reducers: create => ({
        setIsLoggedIn: create.reducer((s, a: PayloadAction<boolean>) => {
            s.isLoggedIn = a.payload
        }),
        login: create.asyncThunk(
            async (data: FormikValues) => {
                const res = await authAPI.login(data)
                if (res.resultCode === 0) {
                    return
                } else {
                    throw new Error(res.messages[0])
                }
            }, {
                fulfilled: s => {
                    s.isLoggedIn = true
                }
            }),
        logout: create.asyncThunk(
            async (_: void) => {
                const res = await authAPI.logout()
                if (res.resultCode === 0) {
                    return
                } else {
                    throw new Error(res.messages[0])
                }
            }, {
                fulfilled: s => {
                    s.isLoggedIn = false
                }
            })
    }),
})
export const {selectIsLoggedIn} = authSlice.selectors
export const {setIsLoggedIn, login, logout} = authSlice.actions
export const authReducer = authSlice.reducer

