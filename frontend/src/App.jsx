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
import Notification from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";
import WelcomePage from "./pages/welcome.page";
import { Toaster } from "react-hot-toast";

export const UserContext = createContext({});

export const ThemeContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState(null);

    const [theme, setTheme ] = useState("light");

    useEffect(() => {
        const userInSession = lookInSession("user");
        const themeInSession = lookInSession("theme");
    
        if (userInSession) {
            try {
                const parsedUser = JSON.parse(userInSession);  
                setUserAuth(parsedUser);  
                console.log("parsed user", parsedUser);
            } catch (error) {
                console.error("Ошибка парсинга userInSession:", error);
                sessionStorage.removeItem("user"); // Очистка некорректных данных
                setUserAuth({ accessToken: null });
            }
        } else {
            setUserAuth({ accessToken: null });
        }
    
        if (themeInSession) {
            setTheme(() => {
                document.body.setAttribute("data-theme", themeInSession);
                return themeInSession;
            });
        } else {
            document.body.setAttribute("data-theme", theme);
        }
    }, []);
    

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <UserContext.Provider value={{userAuth, setUserAuth}}>
                <Toaster position="top-center" reverseOrder={false} />
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
                            <Route path="dashboard" element={<SideNav />}>
                                <Route path="notification" element={<Notification />}/>
                                <Route path="blogs" element={<ManageBlogs />}/>
                            </Route>
                            <Route path="signin" element={ <AuthForm type="sign-in" /> } />
                            <Route path="signup" element={ <AuthForm type="sign-up" /> } />
                            <Route path="search/:query" element={<SearchPage />} />
                            <Route path="user/:id" element={<ProfilePage />} />
                            <Route path="blog/:blog_id" element={<BlogPage />} />
                            <Route path="welcome" element={<WelcomePage/>}/>
                            <Route path="tour" element={<h1>Here is tour</h1>} />
                            <Route path="*" element={<NotFound/>}/>
                        </Route>
                    </Routes>
                </Router>
            </UserContext.Provider>
        </ThemeContext.Provider>
    );

}

export default App;