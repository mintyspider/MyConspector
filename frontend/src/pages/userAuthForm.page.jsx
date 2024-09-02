import React from 'react'
import logo from '../imgs/full-logo.png'
import InputBox from '../components/input.component'

const AuthForm = ({type}) => {
  return (
    <section className={'h-cover flex items-center justify-center md:justify-around flex-col ' + ( type=='sign-in' ? 'md:flex-row' : 'md:flex-row-reverse')}>
        <img src={logo} alt="" className='w-[20%] mb-3 md:w-[49%] md:mb-0'/>
        <form className='w-[80%] max-w-[400px] md:w-[49%]'>
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

        </form>
    </section>
  )
}

export default AuthForm
