import React from 'react'
import img404 from "../imgs/404.png"
import {Link} from 'react-router-dom'
import logo from '../imgs/textlogo.png'

const NotFound = () => {
  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
        <img src={img404} className="select-none shadow-2xl shadow-black w-[40%] object-cover rounded-xl"/>
        <h1 className='text-3xl md:text-4xl font-gelasio leading-11'>
            Извините (；′⌒`), <br className="hidden md:block"/> страница не найдена
        </h1>
        <p className='text-2xl text-dark-grey -mt-8'>
            Пора вернуться к тому, что точно  <Link to="/" className="underline text-2xl">в конспекте!</Link>
        </p>

        <div className='mt-auto'>
          <img src={logo} className='h-9 object-contain block mx-auto select-none' />
          <p className='mt-3 text-dark-grey text-xl'>Без паники, у меня все записано</p>
        </div>

    </section>
  )
}

export default NotFound