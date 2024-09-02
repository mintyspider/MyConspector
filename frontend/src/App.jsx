import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.component";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route path="signin" element={ <h1>sign in</h1> } />
                    <Route path="signup" element={ <h1>sign up</h1> } />
                </Route>
            </Routes>
        </Router>
    )
}

export default App;