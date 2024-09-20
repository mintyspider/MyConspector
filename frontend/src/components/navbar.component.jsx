import React, { useContext, useState } from 'react';
import logo from "../imgs/logo.png";
import { Link, Outlet } from 'react-router-dom';
import { UserContext } from '../App';
import UserNavigation from './user-navigation.component';

const Navbar = () => {

    // toggle search bar
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

    const { userAuth } = useContext(UserContext);
    const accessToken = userAuth?.accessToken;
    const profile_img = userAuth?.profile_img;

    const [ menu, setMenu ] = useState(false);

    const handleMenu = () => {
        setMenu(cur => !cur)
    }

    const handleHideMenu = () => {
        setTimeout(() => {
            setMenu(false);
        }, 200)
    }

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
                    <i className="fi fi-rr-search block mt-2 text-xl"></i>
                </button>

                <Link to='/editor'>
                    <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'>    
                        <i className="fi fi-rr-file-edit text-2xl block mt-2 text-dark-grey"></i>
                    </button>
                </Link>
                
                <Link to='/editor' className='btn-light py-2 hidden md:flex'>
                    <i className="fi fi-rr-file-edit"></i>
                    <p className='pl-2'>Новый конспект</p>
                </Link>

                {
                    accessToken ?
                    <>
                        <Link to="/dashboard/notification">
                            <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                <i className="fi fi-rr-bell text-2xl block mt-2 text-dark-grey"></i>
                            </button>
                        </Link>

                        <div className='relative' onClick={handleMenu} onBlur={handleHideMenu}>
                            <button className='w-12 h-12 mt-2'>
                                <img src={profile_img} className='w-full h-full object-cover rounded-full' />
                            </button>

                            { menu ?
                                <UserNavigation /> 
                                : ""
                            }
                                
                        </div>
                    </>
                    :
                    <>
                        <Link to='/signin'>
                            <button className='bg-grey w-12 h-12 rounded-full flex md:hidden items-center justify-center'>
                                <i className="fi fi-rr-sign-in-alt text-2xl block mt-2 text-dark-grey"></i>
                            </button>
                        </Link>

                        <Link to='/signup'>
                            <button className='bg-grey w-12 h-12 rounded-full flex md:hidden items-center justify-center'>
                                <i className="fi fi-rr-user-add text-2xl block mt-2 text-dark-grey"></i>
                            </button>
                        </Link>

                        <Link to='/signin' className='btn-dark py-2 hidden md:flex'>
                            <i className="fi fi-rr-sign-in-alt"></i>
                            <p className='pl-2'>Вход</p>
                        </Link>

                        <Link to='/signup' className='btn-light py-2 hidden md:flex'>
                            <i className="fi fi-rr-user-add"></i>
                            <p className='pl-2'>Регистрация</p>
                        </Link>
                    </>
                }
            </div>

        </nav>

        <Outlet/>
    </>
  )
}

export default Navbar;
