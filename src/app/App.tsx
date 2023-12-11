import React, {memo} from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {useAppSelector} from "../utils/hooks";
import {ErrorSnackbar} from "../components/ErrorSnachbar/ErrorSnachbar";
import TodoListsList from "../features/TodoListsList/TodoListsList";
import {Navigate, NavLink, Route, Routes} from "react-router-dom";
import Login from "../features/Login/Login";

const App: React.FC = () => {
    const status = useAppSelector(state => state.app.status)
    return <>
        <div className="App">
            <NavLink to={"/login"}>Login</NavLink>&nbsp;
            <NavLink to={"/"}>/</NavLink>
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" arial-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={"/"}>
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
