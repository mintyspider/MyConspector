import React, { useContext,  useState } from 'react'
import { BlogContext } from '../pages/blog.page'
import CommentField from './comment-field.component';
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';

export const fetchComments = async ({skip = 0, blog_id, setParentCommentCountFun, comment_array = null}) => {
    let res;
    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/getcomments", {blog_id, skip})
    .then(({data}) => {
        data.map(comment => {
            comment.childrenLevel = 0;
        })
        setParentCommentCountFun(prev => prev + data.length);
        if(comment_array == null) {
            console.log("data:", data)
            res = {results: data}
        } else {
            res = {results: [...comment_array, ...data]}
        }
    })
    return res;
}

const CommentsContainer = () => {
    let {post, setPost, post: { title, comments: {results: commentsArr},  activity: {total_parent_comments} }, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded} = useContext(BlogContext);
    let newTotalParentCommentsLoaded;
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    
    totalParentCommentsLoaded == 10 && isButtonClicked == false ? newTotalParentCommentsLoaded = totalParentCommentsLoaded / 2 : newTotalParentCommentsLoaded = totalParentCommentsLoaded;

    setTotalParentCommentsLoaded(newTotalParentCommentsLoaded);

    const loadMoreComments = async () => {
        setIsButtonClicked(true);
        let newCommentArr = await fetchComments({skip: totalParentCommentsLoaded, blog_id: post._id, setParentCommentCountFun: setTotalParentCommentsLoaded, comment_array: commentsArr});
        setPost({...post, comments: newCommentArr});
    }
    
    return (
        <div className={'max-sm:w-full fixed ' + (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") + ' duration-700 max-sm:right-0 sm:top-0 w-[45%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden'}>
            <div className='relative'>
                <button onClick={() => setCommentsWrapper(false)} className='absolute top-0 right-0 w-10 h-10 rounded-full flex items-center justify-center bg-grey hover:bg-dark-grey hover:text-white'>
                    <i className='fi fi-rr-cross text-xl'></i>
                </button>
                <h1 className='text-xl xl:text-2xl font-medium text-black'>Контекстура (╹ڡ╹ )</h1>
                <p className='text-lg xl:text-xl mt-2 w-[70%] text-dark-grey line-clamp-1'>{title}</p>  
            </div>
            <hr className='border-grey my-8 w-[100%]'/>

            <CommentField action="comment"/>
            {
                commentsArr && commentsArr.length ?
                commentsArr.map((comment, index) => {
                    return <AnimationWrapper key={index}>
                        <CommentCard index={index} leftVal={comment.childrenLevel * 4} commentData={comment} />
                    </AnimationWrapper>;
                })
                :
                <NoDataMessage message="Без комментариев ~(>_<。)＼" />
            }
            {
                total_parent_comments > totalParentCommentsLoaded ?
                <button 
                onClick={loadMoreComments}
                className='text-dark-grey p-2 px-3 bg-grey hover:bg-dark-grey hover:text-white rounded-full flex items-center gap-2'>
                    <i className="fi fi-rr-arrow-down text-xl"></i>
                    Загрузить еще (╹ڡ╹ )
                </button>
                : ""
            }
        </div>
    )
}

export default CommentsContainer
