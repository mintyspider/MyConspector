import React, { act, useContext, useState } from 'react'
import { getDay } from '../common/date';
import { UserContext } from '../App';
import { toast } from 'react-hot-toast';
import CommentField from './comment-field.component';
import { BlogContext } from '../pages/blog.page';
import axios from 'axios';

const CommentCard = ({index, leftVal, commentData}) => {

    let {commented_by: {personal_info: {profile_img, username, fullname}}, commentedAt, comment, _id, children} = commentData;
    let {post: {author: {personal_info:{username:blog_author}}, activity, activity: {total_parent_comments},comments, comments : {results: commentsArr}}, post, setPost, setTotalParentCommentsLoaded} = useContext(BlogContext);
    let { userAuth: {accessToken, username: currentuser} } = useContext(UserContext);
    const [isReplying, setIsReplying] = useState(false);

    const handleReplyClick = () => {
        if(!accessToken) {
            return toast.error("Сначала войдите в аккаунт");
        }
        setIsReplying(prev => !prev);
        console.log(isReplying)
    }
    const getParentIndex = () => {
        let start = index - 1;
        try {
            while(commentsArr[start].childrenLevel >= commentData.childrenLevel) {
                start--;
            }
        }
        catch {
            start = undefined
        }
        return start;
    }
    const removeCommentsCard = (startIndex, isDelete = false) => {
        while (
            commentsArr[startIndex] &&
            commentsArr[startIndex].childrenLevel > commentData.childrenLevel
        ) {
            commentsArr.splice(startIndex, 1);
        }
        if(isDelete) {
            let parentIndex = getParentIndex();
            if(parentIndex !== undefined) {
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child !== _id);
                if (!commentsArr[parentIndex].children.length) {
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }
            commentsArr.splice(index, 1);
        }
        if(commentData.childrenLevel == 0 && isDelete){
            setTotalParentCommentsLoaded(prev => prev - 1);
        }
        setPost({ ...post, comments: { results: commentsArr }, activity: {...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)} });
    };
    
    const showReplies = ({ skip = 0, currentIndex = index }) => {
        if (commentsArr[currentIndex].children.length) {
            hideReplies(); // Сначала скрываем предыдущие ответы
            axios
                .post(import.meta.env.VITE_SERVER_DOMAIN + "/getreplies", { _id: commentsArr[currentIndex]._id, skip })
                .then(({ data: { replies } }) => {
                    commentsArr[currentIndex].isReplyLoaded = true;
                    replies.forEach((reply, i) => {
                        reply.childrenLevel = (commentsArr[currentIndex].childrenLevel || 0) + 1; // Увеличиваем уровень
                        commentsArr.splice(currentIndex + i + 1 + skip, 0, reply);
                    });
                    setPost({ ...post, comments: { ...comments, results: commentsArr } });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };    
    const hideReplies = () => {
        commentData.isReplyLoaded = false;
        removeCommentsCard(index+1)
    }
    const deleteComment = (e) => {
        e.target.setAttribute("disabled", true);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/deletecomment", { _id }, { headers: { "Authorization": `Bearer ${accessToken}` } })
        .then(({ data }) => {
            toast.success("Комментарий удален");
            e.target.removeAttribute("disabled");
            removeCommentsCard(index + 1, true);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const LoadMoreRepliesButon = () => {
        let parentIndex = getParentIndex();
        let button = <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={() => showReplies({ skip: index-parentIndex, currentIndex: parentIndex })}>Еще комментарии ╰(*°▽°*)╯</button>
        if (commentsArr[index + 1]){
            if (commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel) {
                if((index-parentIndex) < commentsArr[parentIndex].children.length) {
                    return button;
                }
            }
        } else {
            console.log(parentIndex)
            if(parentIndex >= 0){
                if((index-parentIndex) < commentsArr[parentIndex].children.length) {
                    return button;
                }
            }
        }
    }

    return (
        <div className='w-full' style={{paddingLeft : `${leftVal * 10}px`}}>
            <div className='my-5 p-6 rounded-md border border-grey'>
                <div className='flex gap-3 items-center mb-8'>
                    <img src={profile_img} className='w-6 h-6 rounded-full' />
                    <p className='line-clamp-1'>{fullname} <span className='text-dark-grey'>"{username}"</span></p>
                    <p className='min-w-fit'>{getDay(commentedAt)}</p>
                </div>
                <p className='font-gelasio text-xl ml-3'>{comment}</p>
                <div className='flex gap-5 items-center mt-5'>
                    <button className='underline text-dark-grey'
                    onClick={handleReplyClick}>
                        Ответить (●ˇ∀ˇ●)
                    </button>
                    {
                        commentData.isReplyLoaded? 
                        <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={hideReplies}>
                            (*/ω＼*) Скрыть
                        </button> 
                        : children.length > 0 ?
                        <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={showReplies}>
                            <i className='fi fi-rr-arrow-down'></i>{children.length} (ง •_•)ง
                        </button> : null
                    }
                    {
                        username === currentuser || currentuser === blog_author ?
                        <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2 ml-auto hover:bg-red/30 hover:text-red'
                        onClick={deleteComment}>
                            <i className='fi fi-rr-trash pointer-events-none'></i>
                        </button> : null
                    }
                </div>
                {
                    isReplying ?
                    <div className='mt-8'>
                        <CommentField action="reply" index={index} replyingTo={_id} setReplying={setIsReplying} />
                    </div> 
                    : null
                }
            </div>
            <LoadMoreRepliesButon />
        </div>
    )
}

export default CommentCard
