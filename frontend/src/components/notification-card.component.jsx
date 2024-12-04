import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from './../common/date';
import NotificationCommentField from './notification-comment-field.component';
import { UserContext } from '../App';
import axios from 'axios';

const NotificationCard = ({ data, index, notificationState }) => {
    let [isReplying, setReplying] = useState(false);
    let {userAuth: {accessToken, username: author_username, profile_img: author_profile_img, fullname: author_fullname}} = useContext(UserContext);
    let {type, seen, reply, createdAt, user, user: {personal_info: {profile_img, fullname, username}}} = data;
    let {notifications, notifications: {results, totalDocs}, setNotifications} = notificationState;
    const handleReplyClick = () => {
        setReplying(prev => !prev)
    }
    const handleDelete = (comment_id, type, target) => {
        target.setAttribute("disabled", true);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/deletecomment", {_id: comment_id}, {headers: {'Authorization': `Bearer ${accessToken}`}
        })
        .then(() => {
            if (type == 'comment'){
                results.splice(index, 1)
            } else {
                delete results[index].reply;
            }
            target.removeAttribute("disabled");
            setNotifications({...notifications, results, totalDocs: totalDocs - 1, deleteDocCount: notifications.deleteDocCount + 1})
        })
    }
    const DeleteNotification = (id, target) => {
        target.setAttribute("disabled", true);
        console.log("clicked")
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/deletenotification", {_id: id}, {headers: {'Authorization': `Bearer ${accessToken}`}
        })
        .then(() => {
            delete results[index];
            target.removeAttribute("disabled");
            setNotifications({...notifications, results, totalDocs: totalDocs - 1, deleteDocCount: notifications.deleteDocCount + 1})
        })
    }
    return (
        <div className={'p-6 border-b border-grey border-l-black ' +(!seen ? 'border-l-2' : 'border-l-0')}>
            <div className='flex gap-5 mb-3'>
                <img src={profile_img} className='w-14 h-14 flex-none rounded-full'/>
                <div className='w-full'>
                    <h1 className='font-medium text-xl text-black'>
                        <span className='inline-block capitalize text-black'>{fullname} <Link to={`/user/${username}`} className='text-dark-grey hover:underline mx-1 lowercase'>"{username}"</Link></span>
                        
                        <span className='font-normal'>
                            {
                                type == 'like' ?
                                <>
                                    <span> оценил(а) ваш конспект </span>
                                    <Link to={`/blog/${data.blog.blog_id}`} className='mt-3 font-medium hover:text-purple hover:underline line-clamp-1'>«{data.blog.title}»</Link>
                                </>
                                
                                : type == 'comment' ?
                                " добавил(а) контекстуру" 
                                : " оставил(а) ответ"
                            }
                        </span>
                    </h1>
                    {
                        type == 'comment' ? 
                        <>
                            <div className='p-4 mt-4 rounded-md bg-grey'>
                                <p>{data.comment.comment}</p>
                            </div>
                            <p className='mt-4'>к вашему конспекту <Link to={`/blog/${data.blog.blog_id}`} className='font-medium hover:text-purple hover:underline '>«{data.blog.title}»</Link></p>
                            
                        </>
                        : type == 'reply' ? 
                        <>
                            <div className='p-4 mt-4 rounded-md bg-grey line-clamp-1'>
                                <p>{data.comment.comment}</p>
                            </div>
                            <p className='mt-4'>на вашу контекстуру</p>
                            <div className='p-4 mt-4 rounded-md border border-dark-grey/30 line-clamp-1'>
                                <p>{data.replied_on_comment.comment}</p>
                            </div>
                            <p className='mt-4'>в конспекте <Link to={`/blog/${data.blog.blog_id}`} className='font-medium hover:text-purple hover:underline'>«{data.blog.title}»</Link></p>
                            
                        </>
                        : ""
                    }
                    
                </div>
            </div>
            <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
                <p>{getDay(createdAt)}</p>
                {
                    type != "like" ? 
                    <>
                        <button className='underline hover:text-red' onClick={(e) => handleDelete(data.comment._id, 'comment', e.target)}>Убрать</button>
                        {
                            !reply 
                            ? <button className='underline hover:text-black' onClick={handleReplyClick}>Ответить</button> 
                            : ""
                        }
                        
                    </>
                    : ""
                }
                <button className='hover:text-red flex gap-2' onClick={(e) => DeleteNotification(data._id, e.target)}>
                    <i className="fi fi-rr-trash"></i>
                    Удалить
                </button>
            </div>
            {
                isReplying ? 
                <div className='mt-8 ml-16'>
                    <NotificationCommentField _id={data.blog._id} blog_author={user} index={index} replying_to={data.comment._id} setReplying={setReplying} notification_id={data._id} notification_data={notificationState} />
                </div>
                : ""
            }
            {/*Тут ничего не работает */}
            {
                reply ?
                <div className='ml-20 p-5 bg-grey mt-5 rounded-md'>
                    <div className='flex gap-3 mb-3'>
                        <img src={author_profile_img} className='w-8 h-8 flex-none rounded-full'/>
                        <div className='w-full'>
                            <h1 className='font-medium text-black'>Вы (
                                <span className='inline-block capitalize text-black'> {author_fullname} <Link to={`/user/${author_username}`} className='text-dark-grey hover:underline mx-1 lowercase'>"{author_username}"</Link></span>)
                                <span> ответили:</span>
                            </h1>
                        </div>
                    </div>
                    <p className='ml-14 text-xl my-3'>❝ {reply.comment} ❞</p>
                    <button className='underline hover:text-red ml-14 mt-2' onClick={(e) => handleDelete(data.comment._id, "reply", e.target)}>Удалить</button>
                </div>
                : ""
            }
        </div>
    )
}

export default NotificationCard
