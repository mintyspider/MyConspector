import React, { useContext, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { UserContext } from '../App';

const SideNav = () => {
    let { userAuth: {accessToken, username: currentuser} } = useContext(UserContext);

    let [page, setPage] = useState();
    return (
        accessToken === null ?
        <Navigate to="/signin" />
        :
        <>
            <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
                <div className='sticky top-[80px] z-30'>
                    <div className='min-w-[200px] h-cover md:sticky top-24 overflow-y-auto p-8 md:pr-0'>

                        <h1 className='text-xl font-bold text-dark-grey mb-3 gap-2 flex justify-center items-center'>
                            <i className="fi fi-rr-house-blank text-xl"></i>
                            Мое пространство
                        </h1>

                        <hr className='border-grey -ml-6 mb-8 mr-6'/>

                        <NavLink to="/dashboard/blogs" onClick={(e) => setPage(e.target.innerText)} className="sidebar-link"> 
                            <i className='fi fi-rr-document'></i> 
                            Мои конспекты
                        </NavLink>

                        <NavLink to="/dashboard/notification" onClick={(e) => setPage(e.target.innerText)} className="sidebar-link"> 
                            <i className='fi fi-rr-bell'></i> 
                            Оповещения
                        </NavLink>

                        <NavLink to="/editor" onClick={(e) => setPage(e.target.innerText)} className="sidebar-link"> 
                            <i className='fi fi-rr-file-edit'></i> 
                            Новый конспект
                        </NavLink>

                        <h1 className='text-xl font-bold text-dark-grey mt-20 mb-3 gap-2 flex justify-center items-center'>
                            <i className='fi fi-rr-settings'></i>
                            Настройки
                        </h1>

                        <hr className='border-grey -ml-6 mb-8 mr-6'/>

                        <NavLink to="/settings/editprofile" onClick={(e) => setPage(e.target.innerText)} className="sidebar-link"> 
                            <i className="fi fi-rr-user"></i>
                            Редактировать профиль
                        </NavLink>

                        <NavLink to="/settings/changepassword" onClick={(e) => setPage(e.target.innerText)} className="sidebar-link"> 
                            <i className='fi fi-rr-lock'></i> 
                            Сменить пароль
                        </NavLink>

                    </div>
                </div>

                <div className='max-md:-mt-8 mt-5 w-full'>
                    <Outlet />
                </div>
            </section>
            
        </>
    )
}

export default SideNav
