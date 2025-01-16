import React, { useContext, useEffect, useState } from 'react';
import logo from '../imgs/full-logo.png';
import logo_dark from '../imgs/logo-dark.png';
import InputBox from '../components/input.component';
import { Link, Navigate } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';
import { storeInSession } from '../common/session';
import { ThemeContext, UserContext } from '../App';

const AuthForm = ({ type }) => {
    const { userAuth = {}, setUserAuth } = useContext(UserContext);
    const {theme} = useContext(ThemeContext);

    if (!userAuth) {
        return <Navigate to="/signup" />;
    }

    const { accessToken } = userAuth;

    const userAuthToServer = (serverRoute, formData) => {
        axios
            .post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData)
            .then(({ data }) => {
                if(type == "sign-up"){
                    data = data.user
                }
                console.log('Response from server:', data); // Логируем ответ сервер
                storeInSession("user", JSON.stringify(data));
                sessionStorage.setItem("accessToken", data.accessToken);
                setUserAuth(data);
            })
            .catch(({ response }) => {
                console.log("это бред:", response);
                toast.error("Произошла ошибка");
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const serverRoute = type === "sign-in" ? "/signin" : "/signup";
        const form = new FormData(document.getElementById("formAuth"));
        const formData = Object.fromEntries(form.entries());
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        const { fullname, email, password, confirmPassword } = formData;

        if (serverRoute === "/signup") {
            if (!fullname || fullname.length < 3) {
                return toast.error("Имя должно содержать хотя бы 3 символа");
            }

            if (password !== confirmPassword) {
                return toast.error("Пароли не совпадают");
            }
        }

        if (!email || !emailRegex.test(email)) {
            return toast.error("Введите корректный адрес электронной почты");
        }

        if (!password || !passwordRegex.test(password)) {
            return toast.error(
                "Пароль должен быть длиной не менее 6 символов, содержать одну заглавную букву, одну строчную букву и одну цифру"
            );
        }

        userAuthToServer(serverRoute, formData);
    };

    console.log("User Auth: ", userAuth);

    const [toastShown, setToastShown] = useState(false);

    if (accessToken) {
        if (!toastShown) {
            toast.dismiss();
            toast.success("Добро пожаловать домой");
            setToastShown(true); // Устанавливаем, что уведомление уже показано
        }
        
        return <Navigate to={type === "sign-in" ? "/" : "/welcome"} />;
    }

    return (
        <AnimationWrapper key={type}>
            <section className="max-h-screen flex flex-col items-center justify-center p-4">
                { 
                    theme == 'light' ?
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[20%] mb-2"
                    />
                    : <img
                        src={logo_dark}
                        alt="logo"
                        className='w-[18%]'
                    />
                }
                
                <form id="formAuth" className="bg-white shadow-lg shadow-grey rounded-lg p-6 w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl font-gelasio text-center text-dark-grey mb-6">
                        {type === "sign-in" ? "С возвращением!" : "Здесь все начинается"}
                    </h1>
                    {type === "sign-up" && (
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Ваше имя"
                            icon="user"
                        />
                    )}
    
                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Электронная почта"
                        icon="envelope"
                        required
                    />
    
                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        required
                    />
    
                    {type === "sign-up" && (
                        <InputBox
                            name="confirmPassword"
                            type="password"
                            placeholder="Подтвердите пароль"
                            required
                        />
                    )}
    
                    <button
                        className="btn-light center hover:bg-orange hover:text-white rounded-full my-4 transition"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        {type === "sign-in" ? "Войти" : "Зарегистрироваться"}
                    </button>
    
                    <p className="text-center mt-4 text-dark-grey text-sm">
                        {type === "sign-in" ? (
                            <>
                                Нет аккаунта?{" "}
                                <Link
                                    to="/signup"
                                    className="text-purple hover:underline"
                                >
                                    Зарегистрироваться
                                </Link>
                            </>
                        ) : (
                            <>
                                Уже есть аккаунт?{" "}
                                <Link
                                    to="/signin"
                                    className="text-purple hover:underline"
                                >
                                    Войти
                                </Link>
                            </>
                        )}
                    </p>
                </form>
            </section>
        </AnimationWrapper>
    );
}

export default AuthForm;