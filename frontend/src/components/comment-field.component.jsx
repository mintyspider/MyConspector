import React, { useContext, useState } from 'react';
import { UserContext } from '../App';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { BlogContext } from '../pages/blog.page';

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
    const [comment, setComment] = useState("");
    const { 
        userAuth: { accessToken, username, fullname, profile_img } 
    } = useContext(UserContext);
    const { 
        post, 
        post: { _id, author: { _id: blog_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } },
        setPost,
        setTotalParentCommentsLoaded 
    } = useContext(BlogContext);

    console.log("replyingTo:", replyingTo);

    const handleComment = () => {
        if (!accessToken) {
            return toast.error("Сначала войдите в аккаунт");
        }
        if (!comment.length) {
            return toast.error("Добавьте свою контекстуру к конспекту");
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/addcomment", 
            { _id, blog_author, message: comment, replying_to: replyingTo }, 
            { headers: { "Authorization": `Bearer ${accessToken}` } }
        )
        .then(({ data }) => {
            setComment("");

            // Добавляем данные автора комментария
            data.commented_by = {
                personal_info: { username, fullname, profile_img },
            };

            let newCommentArr;

            if (replyingTo) {
                if (commentsArr[index]) {
                    commentsArr[index].children = commentsArr[index].children || [];
                    commentsArr[index].children.push(data._id);
                    data.childrenLevel = (commentsArr[index].childrenLevel || 0) + 1;
                    data.parentIndex = index;
                    commentsArr[index].isReplyLoaded = true;

                    // Создаём новый массив
                    newCommentArr = [
                        ...commentsArr.slice(0, index + 1),
                        data,
                        ...commentsArr.slice(index + 1),
                    ];

                    if (setReplying) setReplying(false);
                } else {
                    return toast.error("Ошибка при добавлении ответа.");
                }
            } else {
                data.childrenLevel = 0;
                newCommentArr = [data, ...commentsArr];
            }

            let parentCommentIncrement = replyingTo ? 0 : 1;

            setPost({
                ...post, 
                comments: { ...comments, results: newCommentArr }, 
                activity: { 
                    ...activity, 
                    total_comments: total_comments + 1, 
                    total_parent_comments: total_parent_comments + parentCommentIncrement 
                }
            });

            if (setTotalParentCommentsLoaded) {
                setTotalParentCommentsLoaded(prev => prev + parentCommentIncrement);
            }
        })
        .catch(err => {
            console.error("Error adding comment:", err);
            toast.error("Ошибка при добавлении комментария.");
        });
    };

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
                {action === "comment" ? "Записать" : "Ответить"}
            </button>
        </>
    );
};

export default CommentField;
