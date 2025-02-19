import React, { useContext, useEffect, useRef, useState } from 'react';
import { BlogContext } from '../pages/blog.page';
import CommentField from './comment-field.component';
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';
import { useLocation } from 'react-router-dom';

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
    let res;
    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/getcomments", { blog_id, skip })
        .then(({ data }) => {
            data.map(comment => {
                comment.childrenLevel = 0;
            });
            setParentCommentCountFun(prev => prev + data.length);
            res = comment_array ? { results: [...comment_array, ...data] } : { results: data };
        });
    return res;
};

const CommentsContainer = () => {
    const location = useLocation();
    const commentsRef = useRef(null);

    useEffect(() => {
        if (location.hash === '#comments' && commentsRef.current) {
            // Получаем текущую позицию комментариев
            const commentsPosition = commentsRef.current.offsetTop;
    
            // Высота вашего навбара (например, 60px)
            const navbarHeight = 80;
    
            // Прокручиваем на нужное место с учетом смещения
            window.scrollTo({
                top: commentsPosition - navbarHeight, // Смещаем прокрутку выше на высоту навбара
                behavior: 'smooth',
            });
            
            // Убираем хэш из URL после прокрутки
            window.history.replaceState(null, null, ' ');
        }
    }, [location]);

    const {
        post,
        setPost,
        post: { title, comments: { results: commentsArr }, activity: { total_parent_comments } },
        commentsWrapper,
        setCommentsWrapper,
        totalParentCommentsLoaded,
        setTotalParentCommentsLoaded
    } = useContext(BlogContext);

    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const loadMoreComments = async () => {
        setIsButtonClicked(true);
        let newCommentArr = await fetchComments({
            skip: totalParentCommentsLoaded,
            blog_id: post._id,
            setParentCommentCountFun: setTotalParentCommentsLoaded,
            comment_array: commentsArr
        });
        setPost({ ...post, comments: newCommentArr });
    };

    return (
        <>
        <div ref={commentsRef} className="bg-white shadow-md rounded-lg p-6 mb-8">
            {/* Заголовок */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-semibold text-black">Комментарии</h1>
                </div>
            </div>
            <hr className="border-grey my-4" />

            {/* Поле для добавления комментариев */}
            <CommentField action="comment" />

            {/* Список комментариев */}
            {commentsArr && commentsArr.length ? (
                commentsArr.map((comment, index) => (
                    <AnimationWrapper key={index}>
                        <CommentCard index={index} leftVal={comment.childrenLevel * 4 == 0 ? 0 : 4} commentData={comment} />
                    </AnimationWrapper>
                ))
            ) : (
                <NoDataMessage message="Без комментариев ~(>_<。)＼" />
            )}

            {/* Кнопка загрузки дополнительных комментариев */}
            {total_parent_comments > totalParentCommentsLoaded && (
                <button
                    onClick={loadMoreComments}
                    className="mt-4 text-gray-600 bg-gray-100 hover:bg-grey hover:text-gray-800 rounded-full px-4 py-2 flex items-center gap-2 transition">
                    <i className="fi fi-rr-arrow-down text-lg"></i>
                    Загрузить еще (╹ڡ╹ )
                </button>
            )}
        </div>
        </>
    );
};

export default CommentsContainer;
