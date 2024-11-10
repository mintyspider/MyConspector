import React, { useContext } from 'react'
import { BlogContext } from '../pages/blog.page'
import CommentField from './comment-field.component';

const CommentsContainer = () => {
    let {post: {title}, commentsWrapper, setCommentsWrapper} = useContext(BlogContext);
    console.log(commentsWrapper);
    return (
        <div className={'max-sm:w-full fixed ' + (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") + ' duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden'}>
            <div className='relative'>
                <h1 className='text-2xl font-medium text-center mx-auto'>Контекстура (╹ڡ╹ )</h1>
                <p className='text-xl mt-2 w-[70%] text-dark-grey text-center line-clamp-2 mx-auto'>{title}</p>
                <button onClick={() => setCommentsWrapper(false)} className='absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center bg-grey hover:bg-dark-grey hover:text-white'>
                    <i className='fi fi-rr-cross text-xl'></i>
                </button>
            </div>
            <hr className='border-grey my-8 w-[100%]'/>

            <CommentField action="comment"/>
        </div>
    )
}

export default CommentsContainer
