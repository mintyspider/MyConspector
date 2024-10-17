import React from 'react'
import img404 from "../imgs/404.png"
import {Link} from 'react-router-dom'
import logo from '../imgs/textlogo.png'

const NotFound = () => {
  return (
      <section className='max-h-screen overflow-hidden flex flex-col items-center gap-20 text-center p-10 relative'>
        <img src={img404} className="select-none shadow-2xl shadow-black w-[35%] object-cover rounded-xl" alt="404"/>
        <h1 className='text-2xl md:text-3xl font-gelasio leading-11'>
          Извините (；′⌒`), страница не найдена
        </h1>
        <p className='text-xl md:text-2xl text-dark-grey -mt-8'>
          Пора вернуться к тому, что точно <Link to="/" className="underline text-2xl">в конспекте!</Link>
        </p>

        <div className='-mt-5'>
          <img src={logo} className=' h-9 object-contain block mx-auto select-none' />
          <p className='mt-2 text-dark-grey'>Без паники, у меня все записано</p>
        </div>

    </section>
  )
}

export default NotFound