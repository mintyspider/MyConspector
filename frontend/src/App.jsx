import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.component";
import AuthForm from "./pages/userAuthForm.page";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import NotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";

export const UserContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState(null); // Инициализация состояния с null

    useEffect(() => {
        const userInSession = lookInSession("user");

        if (userInSession) {
            const parsedUser = JSON.parse(userInSession);  // Парсим данные пользователя
            setUserAuth(parsedUser);  // Устанавливаем пользователя в состояние
            console.log("parsed user", parsedUser);
        } else {
            setUserAuth({ accessToken: null });  // Если пользователя нет, устанавливаем значение по умолчанию
        }
    }, []);

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Router>
                <Routes>
                    <Route path="/editor" element={<EditorPage/>} />
                    <Route path="/editor/:blog_id" element={<EditorPage/>} />
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<HomePage />}/>
                        <Route path="settings" element={<SideNav />}>
                            <Route path="editprofile" element={<EditProfile />}/>
                            <Route path="changepassword" element={<ChangePassword />}/>
                        </Route>
                        <Route path="signin" element={ <AuthForm type="sign-in" /> } />
                        <Route path="signup" element={ <AuthForm type="sign-up" /> } />
                        <Route path="search/:query" element={<SearchPage />} />
                        <Route path="user/:id" element={<ProfilePage />} />
                        <Route path="blog/:blog_id" element={<BlogPage />} />
                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </Routes>
            </Router>
        </UserContext.Provider>
    );

}

export default App;