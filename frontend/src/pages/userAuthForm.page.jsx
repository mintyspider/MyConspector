import React from 'react'
import logo from '../imgs/full-logo.png'

const AuthForm = ({type}) => {
  return (
    <section className='h-cover flex items-center justify-center'>
        <img src={logo} alt="" className='w-[20%]'/>
    </section>
  )
}

export default AuthForm
