import React, { useContext, useEffect } from 'react'
import logo from '../imgs/full-logo.png'
import InputBox from '../components/input.component'
import google from '../imgs/google.png'
import { Link, Navigate } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';
import { storeInSession } from '../common/session'
import { UserContext } from '../App'
import { authWithGoogle } from '../common/firebase'

const AuthForm = ({ type }) => {

    let { userAuth = {}, setUserAuth } = useContext(UserContext);
    if(!userAuth){
        return <Navigate to="/signup" />
    }
    let { accessToken } = userAuth;


    const userAuthToServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData).then(({data}) => {
            storeInSession("user", JSON.stringify(data));
            sessionStorage.setItem("accessToken", data.accessToken);
            setUserAuth(data);
        }).catch(({ response }) => {
            toast.error(response.data.error);
        });
    };    

    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        //form data
        let form = new FormData(formAuth);
        let formData = {};
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        for(let [key, value] of form.entries()){
            formData[key] = value;
        }

        let { fullname, email, password, confirmPassword } = formData;
        // validation
        if (serverRoute === '/signup') {
            if (fullname.length < 3) {
                return toast.error('Имя должно содержать хотя бы 3 символа');
            }
    
            if (password !== confirmPassword) {
                return toast.error('Пароли не совпадают');
            }
        }
        if (!email.length) {
            return toast.error('Введите электронную почту');
        }

        if (!emailRegex.test(email)) {
            return toast.error('Неверный формат электронной почты');
        }

        if (!password.length) {
            return toast.error('Введите пароль');
        }

        if (!passwordRegex.test(password)) {
            return toast.error('Пароль должен состоять не менее чем из 6 символов и содержать как минимум одну заглавную букву, одну строчную букву и одну цифру');
        }

        //sending to backend
        userAuthToServer(serverRoute, formData);
    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle().then(user => {
            let serverRoute = "/google-auth";

            let formData = {
                accessToken: user.accessToken
            }

            userAuthToServer(serverRoute, formData)

        }).catch(err => {
            toast.error("Проблемы с использованием Google")
            return console.log(err)
        })
    }  

  return (
    accessToken ?
    <Navigate to='/' />
    :
    <AnimationWrapper key={type}>
        <section className='h-cover flex items-center justify-center md:justify-around flex-col'>
            <Toaster />
            <img src={logo} alt="" className="w-[20%] mx-auto" />
            <h1 className='text-4xl font-gelasio text-center mb-18'>
                {type == 'sign-in' ? 'Входи и действуй!' : 'Здесь все начинается'}
            </h1>
            
            <form id="formAuth" className='w-[80%] max-w-[400px] md:w-[49%]'>
                

                {
                    type == 'sign-up' ?
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Ваше имя"
                            icon="user"
                        />
                    : ''
                }

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
                
                {
                    type == 'sign-up' ? 
                    <>
                        <InputBox
                            name="confirmPassword"
                            type="password"
                            placeholder="Подтвердите пароль"
                            required
                        />
                    </>
                    : ''
                }

                <button className='btn-dark center mt-14' 
                type="submit"
                onClick={handleSubmit}
                >
                    {type == 'sign-in'? 'Войти' : 'Зарегистрироваться'}
                </button>

                <div className='relative w-full flex items-center gap-2 my-10 opacity-10 text-black font-bold'>
                    <hr className='w-1/2 border-black' />
                    <p>или</p>
                    <hr className='w-1/2 border-black' />
                </div>

                <button onClick={handleGoogleAuth}
                className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
                    <img src={google} alt="" className='w-5'/>
                    Воспользоваться Google
                </button>

                {
                    type == 'sign-in'?
                    <p className='text-center mt-6 text-dark-grey text-xl'>
                        Нет аккаунта? <Link to="/signup" className='hover:underline text-xl text-dark-grey ml-1'>Зарегистрироваться</Link>
                    </p>
                    :
                    <p className='text-center mt-6 text-dark-grey text-xl'>
                        Уже есть аккаунт? <Link to="/signin" className='hover:underline text-xl text-dark-grey ml-1'>Войти</Link>
                    </p>
                }

            </form>
        </section>
    </AnimationWrapper>
  )
}

export default AuthForm
