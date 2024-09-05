import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.component";
import AuthForm from "./pages/userAuthForm.page";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/editor.pages";

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
                        <Route path="signin" element={ <AuthForm type="sign-in" /> } />
                        <Route path="signup" element={ <AuthForm type="sign-up" /> } />
                    </Route>
                </Routes>
            </Router>
        </UserContext.Provider>
    );

}

export default App;