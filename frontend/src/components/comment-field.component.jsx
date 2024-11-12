import React, { useContext, useState } from 'react'
import { UserContext } from '../App';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { BlogContext } from '../pages/blog.page';

const CommentField = ({action}) => {
    const [comment, setComment] = useState("");
    let {userAuth: {accessToken, username, fullname, profile_img}} = useContext(UserContext);
    let {post, post: {_id, author: {_id: blog_author }, comments, comments: {results: commentsArr}, activity, activity: {total_comments, total_parent_comments}}, setPost, setTotalParentCommentsLoaded} = useContext(BlogContext);

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
            setComment("");
            data.commented_by = {
                personal_info: { username, fullname, profile_img },
            }
            let newCommentArr;
            data.childrenLevel = 0;
            newCommentArr = [data, ...commentsArr];
            let parentCommentIncrement = 1;
            setPost({...post, comments:{...comments, results: newCommentArr}, activity: {...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrement}});
            setTotalParentCommentsLoaded(prev => prev+parentCommentIncrement);
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
