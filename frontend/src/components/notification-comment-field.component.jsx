import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from './../App';
import axios from 'axios';

const NotificationCommentField = ({_id, blog_author, index = undefined, replying_to = undefined, setReplying, notification_id, notification_data}) => {
    let [comment, setComment] = useState('');
    console.log("this is replying_to", replying_to)
    let {_id: user_id} = blog_author;
    let {userAuth: {accessToken}} = useContext(UserContext)
    let {notifications, notifications: {results}, setNotifications} = notification_data;
    const handleComment = () => {

        if (!comment.length) {
            return toast.error("Добавьте свою контекстуру");
        }
        console.log({
            _id, 
            blog_author: user_id, 
            message: comment, 
            replying_to, 
            notification_id
        });
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/addcomment", 
            { _id, blog_author: user_id, message: comment, replying_to, notification_id }, 
            { headers: { "Authorization": `Bearer ${accessToken}` } }
        )
        .then(({ data }) => {
            setReplying(false);
            results[index].reply = { comment, _id: data._id }
            setNotifications({ ...notifications, results })
        })
        .catch(err => {
            console.error("Error adding comment:", err);
            toast.error("Ошибка при добавлении комментария.");
        });
    }
    return (
        <>
            <Toaster />
            <textarea 
                value={comment} 
                placeholder='Поделитесь своей контекстурой...' 
                onChange={(e) => setComment(e.target.value)} 
                className='input-box pl-5 placeholder:text-dark-grey resize-none text-lg h-[150px] overflow-y-auto'
            ></textarea>
            <button 
                className='btn-dark right-0 mt-5 px-10 text-lg' 
                onClick={handleComment}
            >
                Ответить
            </button>
        </>
    )
}

export default NotificationCommentField
