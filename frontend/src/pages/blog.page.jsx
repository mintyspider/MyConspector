import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/loader.component'
import { getFullDay } from '../common/date';

export const blogStructure = {
    title: '', 
    des: '',
    content: [], 
    tags: [],
    author: {
        personal_info: {
            fullname: '', 
            username: '', 
            profile_img: '',
        }
    }, 
    publishedAt: ''
}

const BlogPage = () => {
    let { blog_id } = useParams();
    let [loading, setLoading] = useState(true);
    let [post, setPost] = useState(blogStructure);

    let {title, content, author: {personal_info: {fullname, profile_img, username: author_username}}, publishedAt} = post;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/getblog", { blog_id })
        .then( ({data: {blog}}) => {
            setPost(blog);
            setLoading(false);
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchBlog()
    }, [])

  return (
      <AnimationWrapper>
        {
            loading ? <Loader /> :
            <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                <h2 className='text-center'>{title}</h2>
                <div className='flex max-sm:flex-col justify-between my-8 '>
                    <div className='flex gap-5 items-start'>
                        <img src={profile_img} className='w-12 h-12 rounded-full'/>
                        <p>{fullname} <br /> <Link to={`/user/${author_username}`} className='text-dark-grey underline'>"{author_username}"</Link></p>
                    </div>
                    <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Дата публикации {getFullDay(publishedAt)}</p>
                </div>
            </div>
        }
      </AnimationWrapper>
  )
}

export default BlogPage