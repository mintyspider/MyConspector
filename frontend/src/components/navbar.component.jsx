import React, { useState } from 'react';
import logo from "../imgs/logo.png";
import { Link, Outlet } from 'react-router-dom';

const Navbar = () => {

    // toggle search bar
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

  return (
    <>
        <nav className='navbar'>

            <Link to="/" className='w-12 flex-none'>
                <img src={logo} alt="logo" className='w-full' />
            </Link>

            <div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + (searchBoxVisibility ? 'show' : 'hide')}>

                <input type="text"
                placeholder='Поиск...'
                className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'  />

                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                    
            </div>

            <div className='flex items-center gap-3 md:gap-6 ml-auto'>

                <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
                onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}>
                    <i className="fi fi-rr-search text-xl"></i>
                </button>

                <button className='bg-grey w-12 h-12 rounded-full flex items-center justify-center'>
                    <Link to='/editor'>
                        <i className="fi fi-rr-file-edit text-2xl text-dark-grey"></i>
                    </Link>
                </button>

                <Link to='/signin' className='btn-dark py-2 flex'>
                    <i class="fi fi-rr-sign-in-alt"></i>
                    <p className='pl-2'>Вход</p>
                </Link>

                <Link to='/signup' className='btn-light py-2 hidden md:flex'>
                    <i class="fi fi-rr-"></i>
                    <p className='pl-2'>Регистрация</p>
                </Link>

            </div>

        </nav>

        <Outlet/>
    </>
  )
}

export default Navbar;
