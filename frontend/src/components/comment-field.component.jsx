import React, { useContext, useState } from 'react'
import { UserContext } from '../App';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { BlogContext } from '../pages/blog.page';

const CommentField = ({action}) => {
    const [comment, setComment] = useState("");
    let {userAuth: {accessToken}} = useContext(UserContext);
    let {post: {_id, author: {_id: blog_author }}} = useContext(BlogContext);

    const handleComment = () => {
        console.log(accessToken);
        if(!accessToken) {
            return toast.error("Сначала войдите в аккаунт");
        }
        if(!comment.length) {
            return toast.error("Добавьте свою контекстуру к конспекту");
        }
        console.log(comment);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/addcomment", {_id, blog_author, message: comment}, {headers: {"Authorization": `Bearer ${accessToken}`}})
        .then(({data}) => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (
        <>
            <Toaster/>
            <textarea value={comment} placeholder='Поделитесь своей контекстурой...' onChange={(e) => setComment(e.target.value)} className='input-box pl-5 placeholder:text-dark-grey resize-none text-lg h-[150px] overflow-y-auto'></textarea>
            <button className='btn-dark right-0 mt-5 px-10 text-lg'
            onClick={handleComment}>{action == "comment" ? "Записать" : "Ответить"}</button>
        </>
    )
}

export default CommentField
