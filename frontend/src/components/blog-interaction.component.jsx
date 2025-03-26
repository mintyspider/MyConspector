import React, { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../pages/blog.page';
import { toast } from "react-hot-toast";
import { UserContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BlogInteraction = () => {
    let { 
        post, 
        post: { _id, blog_id, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, 
        setPost, 
        isLikedByUser, 
        setIsLikedByUser 
    } = useContext(BlogContext);

    let { userAuth: { accessToken, username } } = useContext(UserContext);

    const [notificationShown, setNotificationShown] = useState(false);
    const navigate = useNavigate(); // Используем для навигации

    useEffect(() => {
        if (username) {
            axios
                .post(import.meta.env.VITE_SERVER_DOMAIN + "/checklike", { _id }, { headers: { "Authorization": `Bearer ${accessToken}` } })
                .then(({ data: { result } }) => {
                    setIsLikedByUser(Boolean(result));
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, []);

    const handleLike = () => {
        if (accessToken) {
            setIsLikedByUser(!isLikedByUser);
            setPost({ ...post, activity: { ...post.activity, total_likes: isLikedByUser ? total_likes - 1 : total_likes + 1 } });

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/likeblog", { _id, isLikedByUser }, { headers: { "Authorization": `Bearer ${accessToken}` } })
                .catch(err => console.log(err));
        } else {
            showAuthErrorNotification();
        }
    };

    const handleCommentsClick = () => {
        // Переход на страницу блога с хэшем для прокрутки к комментариям
        navigate(`/blog/${blog_id}#comments`);
    };

    const handleShareClick = () => {
        const blogUrl = `${window.location.origin}/blog/${blog_id}`;
        navigator.clipboard.writeText(blogUrl)
            .then(() => toast.success('Ссылка скопирована!'))
            .catch(err => console.error('Ошибка копирования: ', err));
    };

    const handlePrintPDF = () => {
        if (username) {
            window.print();
        } else {
            showAuthErrorNotification();
        }
    };

    const showAuthErrorNotification = () => {
        if (!notificationShown) {
            toast.error("Для этого действия необходима авторизация");
            setNotificationShown(true);
            setTimeout(() => setNotificationShown(false), 1000);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg border-t border-grey">
            <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
                {/* Лайки и комментарии */}
                <div className="flex gap-6 items-center">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-2 text-dark-grey hover:text-purple transition-colors">
                        <i className={`text-2xl ${isLikedByUser ? 'fi fi-sr-heart text-red' : 'fi fi-rr-heart'}`}></i>
                        <span>{total_likes}</span>
                    </button>
                    <button
                        onClick={handleCommentsClick}
                        className="flex items-center gap-2 text-dark-grey hover:text-purple transition-colors">
                        <i className="text-2xl fi fi-rr-comment"></i>
                        <span>{total_comments}</span>
                    </button>
                </div>

                {/* Действия */}
                <div className="flex gap-4 items-center">
                    {username === author_username && (
                        <Link
                            to={`/editor/${blog_id}`}
                            className="text-dark-grey hover:text-purple transition-colors">
                            <i className="fi fi-rr-edit text-2xl"></i>
                        </Link>
                    )}
                    <button
                        onClick={handleShareClick}
                        className="text-dark-grey hover:text-purple transition-colors">
                        <i className="fi fi-rr-share text-2xl"></i>
                    </button>
                    <button
                        onClick={handlePrintPDF}
                        className="text-dark-grey hover:text-purple transition-colors">
                        <i className="fi fi-rr-print text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogInteraction;
