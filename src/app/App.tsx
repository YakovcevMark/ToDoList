import React, {memo, useCallback, useLayoutEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {useAppDispatch, useAppSelector} from "utils/hooks";
import {ErrorSnackbar} from "components/ErrorSnachbar/ErrorSnachbar";
import TodoListsList from "../features/TodoListsList/TodoListsList";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "../features/Login/Login";
import {initializeApp, selectAppStatus, selectIsInitialized} from "app/appSlice";
import {logout} from "features/Login/authReducer";
import {appPath} from "middleware/path";

const App: React.FC = () => {
    const status = useAppSelector(selectAppStatus)
    const isInitialized = useAppSelector(selectIsInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()
    useLayoutEffect(() => {
        dispatch(initializeApp())
    }, [dispatch])
    const logoutHandler = useCallback(() => {
        dispatch(logout())
    }, [dispatch])
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return <>
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" arial-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn
                        ? <Button
                            color="inherit"
                            onClick={logoutHandler}>
                            Logout
                        </Button>
                        :
                        // <NavLink to={`${appPath}/login`}>
                        <Button
                            color="inherit"
                            onClick={() => {
                                return <Navigate to={`${appPath}/login`}/>
                            }}>
                            Login
                        </Button>
                        // </NavLink>
                    }
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={appPath}>
                        <Route path="" element={<TodoListsList/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="404" element={<h1>404: PAGE NOT FOUND</h1>}/>
                        <Route path="*" element={<Navigate to={"/404"}/>}/>
                    </Route>
                </Routes>
            </Container>
        </div>

    </>
}

export default memo(App);
