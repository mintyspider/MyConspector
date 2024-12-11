import React, { useContext } from 'react';
import AnimationWrapper from '../common/page-animation';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { removeFromSession } from '../common/session';

const UserNavigation = () => {
    const { userAuth } = useContext(UserContext);
    const { setUserAuth } = useContext(UserContext);
    const username = userAuth?.username;

    const signOutUser = () => {
        removeFromSession('user');
        setUserAuth({ accessToken: null });
    };

    return (
        <AnimationWrapper
            className="fixed top-[80px] right-0 z-50 transition-all duration-200"
            transition={{ duration: 0.2 }}
        >
            {/* Панель инструментов */}
            <div className="bg-white border border-grey w-60 h-auto shadow-lg p-1">
                <Link to="/editor" className="flex gap-2 pl-8 py-4 link">
                    <i className="fi fi-rr-file-edit text-dark-grey"></i>
                    Новый конспект
                </Link>

                <Link to={`/user/${username}`} className="flex gap-2 pl-8 py-4 link">
                    <i className="fi fi-rr-circle-user text-dark-grey"></i>
                    Моя страница
                </Link>

                <Link to="/dashboard/blogs" className="flex gap-2 pl-8 py-4 link">
                    <i className="fi fi-rr-note text-dark-grey"></i>
                    Конспекты
                </Link>

                <Link to="/settings/editprofile" className="flex gap-2 pl-8 py-4 link">
                    <i className="fi fi-rr-settings-sliders text-dark-grey"></i>
                    Настройки
                </Link>

                <Link className="text-left p-4 link pl-8 py-4" onClick={signOutUser}>
                    <h1 className="font-bold text-xl text-black mb-1">Выход</h1>
                    <p className="text-dark-grey">@{username}</p>
                </Link>
            </div>
        </AnimationWrapper>
    );
};

export default UserNavigation;
