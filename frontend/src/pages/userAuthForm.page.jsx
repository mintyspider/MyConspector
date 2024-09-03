import React, { useRef } from 'react'
import logo from '../imgs/full-logo.png'
import InputBox from '../components/input.component'
import google from '../imgs/google.png'
import { Link } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'

const AuthForm = ({ type }) => {

    const auth = useRef();

    const handleSubmit = (e) => {

        e.preventDefault();

        //formData
        let form = new FormData(auth.current);
        let formData = {};
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        for(let [key, value] of form.entries()){
            formData[key] = value;
        }

        let { fullname, email, password } = formData;
        // validation
        if (fullname){
            if (fullname.length < 3) {
                return console.log({ 'error': 'Имя должно содержать хотя бы 3 символа' });
            }
        }
        if (!email.length) {
            return console.log({ 'error': 'Введите электронную почту' });
        }

        if (!emailRegex.test(email)) {
            return console.log({ 'error': 'Неверный формат электронной почты' });
        }

        if (!password.length) {
            return console.log({ 'error': 'Введите пароль' });
        }

        if (!passwordRegex.test(password)) {
            return console.log({
                'error': 'Пароль должен состоять не менее чем из 6 символов и содержать как минимум одну заглавную букву, одну строчную букву и одну цифру'
            });
        }
    }
  return (
    <AnimationWrapper key={type}>
        <section className={'h-cover flex items-center justify-center md:justify-around flex-col ' + ( type=='sign-in' ? 'md:flex-row' : 'md:flex-row-reverse')}>
            <img src={logo} alt="" className='w-[20%] mb-3 md:w-[49%] md:mb-0'/>
            <form ref={auth} className='w-[80%] max-w-[400px] md:w-[49%]'>
                <h1 className='text-4xl font-gelasio text-center mb-24'>
                    {type == 'sign-in' ? 'Входи и действуй!' : 'Здесь все начинается'}
                </h1>

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

                <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
                    <img src={google} alt="" className='w-5'/>
                    Открыть Google
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
