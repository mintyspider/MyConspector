import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';

const SideNav = () => {
    let { userAuth: {accessToken, username: currentuser} } = useContext(UserContext);

    let [page, setPage] = useState();
    const [showMenu, setShowMenu] = useState(false); // Состояние для управления видимостью меню
    const location = useLocation();  // Получаем объект location
    const currentPath = location.pathname;  // Доступ к текущему пути
    const pageState = currentPath.split("/")[2];
    page = pageState === "changepassword" ? "Сменить пароль" : pageState === "editprofile" ? "Редактировать профиль" : pageState === "blogs" ? "Мои конспекты" : pageState === "notification" ? "Оповещения" : "Мое пространство";
    const toggleMenu = (e) => {
        setShowMenu(prevState => !prevState);
    };
    useEffect(() => {
        setShowMenu(false); // Сбрасываем состояние меню при изменении пути
    }, [currentPath]);

    return (
        accessToken === null ?
        <Navigate to="/signin" />
        :
        <>
            <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
                <div className='sticky top-[80px] z-30'>
                    <div className='md:hidden flex gap-2 justify-start items-center border-b border-grey'>
                        <button 
                        className="p-5 text-2xl"
                        onClick={toggleMenu}
                        >
                            <i className="fi fi-rr-bars-staggered"></i>
                        </button>
                        <h1 className='text-xl font-bold text-dark-grey'>{page}</h1>
                    </div>
                    
                    <div className={`min-w-[200px] h:[calc(100vh-80px-50px)] md:h-cover md:sticky top-24 overflow-y-auto p-8 md:pr-0 max-md:${showMenu ? "block" : "hidden"}`}>
                        <h1 className='text-xl font-bold text-dark-grey mb-3 gap-2 flex justify-center items-center'>
                            <i className="fi fi-rr-house-blank text-xl"></i>
                            Мое пространство
                        </h1>

                        <hr className='border-grey -ml-6 mb-8 mr-6' />

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

                        <hr className='border-grey -ml-6 mb-8 mr-6' />

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
    );
};

export default SideNav;
