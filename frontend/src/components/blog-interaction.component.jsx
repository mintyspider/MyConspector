import React, { useContext } from 'react'
import { BlogContext } from '../pages/blog.page';
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

const BlogInteraction = () => {

    let {post: {blog_id, activity, activity: {total_likes, total_comments}, author: {personal_info: {username: author_username} } }, setPost } = useContext(BlogContext);

    let {userAuth: {username}} = useContext(UserContext);
    console.log("username:", username, author_username);

    const handleShareClick = () => {
        const blogUrl = `${window.location.origin}/blog/${blog_id}`;
        console.log(blogUrl);
        
        // Копирование текста ссылки в буфер обмена
        navigator.clipboard.writeText(blogUrl)
            .then(() => {
                toast.success('Ссылка скопирована!');
            })
            .catch(err => {
                console.error('Ошибка копирования: ', err);
            });
    };

    const handleSaveAsPDF = () => {
        window.print(); // Открывает диалог печати, где можно выбрать "Сохранить как PDF"
    };

  return (
    <>
        <Toaster />

        <hr className='border-grey my-2'/>
        <div className='flex gap-6 justify-between'>
            <div className='flex gap-6 items-center'>
                <div className='flex gap-3 items-center'>
                    <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-heart text-xl'></i>
                        
                    </button>
                    <p className=' text-xl text-dark-grey'>{total_likes}</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-comment text-xl'></i>
                        
                    </button>
                    <p className=' text-xl text-dark-grey'>{total_comments}</p>
                </div>
            </div>
            <div className='flex gap-6 items-center'>
                {
                    username === author_username ?
                    <Link to={`/editor/${blog_id}`} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-edit text-xl hover:text-purple'></i>
                    </Link> : ""
                }
                <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80' onClick={handleShareClick}>
                    <i className='fi fi-rr-share text-xl hover:text-purple'></i>
                </button>
                <button onClick={handleSaveAsPDF} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                    <i className='fi fi-rr-file-pdf text-xl hover:text-purple'></i>
                </button>
            </div>
        </div>
        <hr className='border-grey my-2'/>
    </>
  )
}

export default BlogInteraction