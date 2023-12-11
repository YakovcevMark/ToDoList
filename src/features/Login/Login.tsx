import React from 'react';
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "@mui/material";
import {useFormik} from "formik";
import {login} from "./authReducer";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

const Login: React.FC = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        validate: val => {
            const errors: FormikErrorType = {};
            if (!val.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val.email)) {
                errors.email = 'Invalid email address';
            }
            if (!val.password) {
                errors.password = 'Required';
            } else if (val.password.length < 2) {
                errors.password = 'Your password should be more than 1 symbol';
            }
            return errors;
        },
        onSubmit: val => {
            dispatch(login(val))
            formik.resetForm()
        }
    })
    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>

            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered&nbsp;
                            <a
                                href="https://social-network.samuraijs.com/"
                                target={'_blank'}
                                rel="noreferrer">here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}/>
                        <MyErrorMessage touched={formik.touched.email} errors={formik.errors.email}/>
                        {/*{formik.touched.email && formik.errors.email ? (*/}
                        {/*    <div style={{color: "red"}}>{formik.errors.email}</div>*/}
                        {/*) : null}*/}
                        <TextField
                            label="password"
                            margin="normal"
                            type="password"
                            {...formik.getFieldProps('password')}/>
                        <MyErrorMessage touched={formik.touched.password} errors={formik.errors.password}/>
                        {/*{formik.touched.password && formik.errors.password ? (*/}
                        {/*    <div style={{color: "red"}}>{formik.errors.password}</div>*/}
                        {/*) : null}*/}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox/>}
                            {...formik.getFieldProps('rememberMe')}/>
                        <MyErrorMessage touched={formik.touched.rememberMe} errors={formik.errors.rememberMe}/>
                        <Button
                            type={"submit"}
                            variant={'contained'}
                            color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>

        </Grid>
    </Grid>
};
const MyErrorMessage: React.FC<{ touched: boolean | undefined, errors: string | undefined }> =
    ({
         touched,
         errors
     }) => {
        return touched && errors ? (
            <div style={{color: "red"}}>{errors}</div>
        ) : null
    }

export default Login;