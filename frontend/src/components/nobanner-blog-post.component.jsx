import React from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';

const MinimalBlogPost = ({ blog, index }) => {

    let { publishedAt, title, blog_id: id, author: { personal_info: { fullname, username, profile_img } } } = blog;
  return (
    <Link to={`/blog/${id}`} className='flex gap-5 mb-8'>
        <h1 className='blog-index'>{"0" + (index + 1)}</h1>

        <div>
            <div className='flex gap-2 items-center mb-7'>
                <img src={profile_img} className='w-6 h-6 rounded-full'/>
                <p className='line-clamp-1'>{fullname}</p>
                <small className='text-dark-grey'>"{username}"</small>
                <p className='min-w-fit'>{ getDay(publishedAt) }</p>
            </div>

            <h1 className='blog-title'>{title}</h1>
        </div>
    </Link>
  )
}

export default MinimalBlogPost
