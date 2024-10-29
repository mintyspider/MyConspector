import React, { useContext, useEffect, useState } from 'react';
import { BlogContext, handleSaveAsPDF } from '../pages/blog.page';
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import { PdfContext } from '../pages/blog.page';
import axios from 'axios';

const BlogInteraction = () => {
    let { post, post: { _id, blog_id, title, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setPost, isLikedByUser, setIsLikedByUser } = useContext(BlogContext);
    let { userAuth: { username, accessToken } } = useContext(UserContext);
    const { savedAsPDF, setSavedAsPDF } = useContext(PdfContext);  

    // Флаг для контроля уведомления
    const [notificationShown, setNotificationShown] = useState(false);

    useEffect(() => {
        if (username) {
            axios
                .post(import.meta.env.VITE_SERVER_DOMAIN + "/checklike", { _id }, {headers: {"Authorization": `Bearer ${accessToken}`}})
                .then(({ data: {result} }) => {
                    setIsLikedByUser(Boolean(result));
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, []);
    
    const handleLike = () => {
        if (username) {
            setIsLikedByUser(!isLikedByUser);
            setPost({ ...post, activity: { ...activity, total_likes: isLikedByUser ? activity.total_likes - 1 : activity.total_likes + 1 } });

            axios
                .post(import.meta.env.VITE_SERVER_DOMAIN + "/likeblog", { _id, isLikedByUser }, {headers: {"Authorization": `Bearer ${accessToken}`}})
                .then(({ data }) => {
                    console.log("Like response:", data);
                })
                .catch(err => {
                    console.log(err);
                });
            
        } else {
            showAuthErrorNotification();
        }
    }

    const Translit = (word) => {
        const converter = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '_' };
        return word.toLowerCase().split('').map(letter => converter[letter] || letter).join('').replace(/[^-0-9a-z]/g, '-').replace(/[-]+/g, '-').replace(/^\-|-$/g, '');
    };

    const handleShareClick = () => {
        const blogUrl = `${window.location.origin}/blog/${blog_id}`;
        navigator.clipboard.writeText(blogUrl)
            .then(() => {
                toast.success('Ссылка скопирована!');
            })
            .catch(err => {
                console.error('Ошибка копирования: ', err);
            });
    };

    const handlePrintPDF = () => {
        if (username) {
            window.print();
        } else {
            showAuthErrorNotification();
        }
    };

    const handleSaveClick = () => {
        if (username) {
            handleSaveAsPDF(Translit(title), savedAsPDF, setSavedAsPDF, post);
        } else {
            showAuthErrorNotification();
        }
    };

    // Функция для показа уведомления
    const showAuthErrorNotification = () => {
        if (!notificationShown) {
            toast.error("Для этого действия необходима авторизация");
            setNotificationShown(true);
            setTimeout(() => setNotificationShown(false), 1000); // Сброс флага через 1 секунду
        }
    };

    useEffect(() => {
        setPost(post);
    }, [post]);

    return (
        <>
            <Toaster />
            <hr className='border-grey my-2'/>
            <div className='flex gap-6 justify-between'>
                <div className='flex gap-6 items-center'>
                    <div className='flex gap-3 items-center'>
                        <button 
                        onClick={handleLike}
                        className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                            <i className={`text-xl hover:text-purple ${isLikedByUser ? 'fi fi-sr-heart text-red' : 'fi fi-rr-heart'}`}></i>
                        </button>
                        <p className=' text-xl text-dark-grey'>{total_likes}</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                            <i className='fi fi-rr-comment text-xl hover:text-purple'></i>
                        </button>
                        <p className=' text-xl text-dark-grey'>{total_comments}</p>
                    </div>
                </div>
                <div className='flex gap-6 items-center'>
                    {
                        username === author_username ? (
                            <Link to={`/editor/${blog_id}`} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                                <i className='fi fi-rr-edit text-xl hover:text-purple'></i>
                            </Link>
                        ) : ""
                    }
                    <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80' onClick={handleShareClick}>
                        <i className='fi fi-rr-share text-xl hover:text-purple'></i>
                    </button>
                    <button 
                        onClick={handlePrintPDF} 
                        className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-print text-xl hover:text-purple'></i>
                    </button>
                    <button 
                        onClick={handleSaveClick} 
                        className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-file-pdf text-xl hover:text-purple'></i>
                    </button>
                </div>
            </div>
            <hr className='border-grey my-2'/>
        </>
    );
};

export default BlogInteraction;
