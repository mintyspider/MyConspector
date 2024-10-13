import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.component";
import AuthForm from "./pages/userAuthForm.page";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";

export const UserContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState();

    useEffect(() => {
        let userInSession = lookInSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({accessToken: null})
    }, [])

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Router>
                <Routes>
                    <Route path="/editor" element={<EditorPage/>} />
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<HomePage />}/>
                        <Route path="signin" element={ <AuthForm type="sign-in" /> } />
                        <Route path="signup" element={ <AuthForm type="sign-up" /> } />
                        <Route path="search/:query" element={<SearchPage />} />
                    </Route>
                </Routes>
            </Router>
        </UserContext.Provider>
    );

}

export default App;