import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.component";
import AuthForm from "./pages/userAuthForm.page";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route path="signin" element={ <AuthForm type="sign-in" /> } />
                    <Route path="signup" element={ <AuthForm type="sign-up" /> } />
                </Route>
            </Routes>
        </Router>
    )
}

export default App;