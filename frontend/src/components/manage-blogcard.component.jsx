import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { getFullDay } from '../common/date';

const BlogStats = ({stats}) => {
    let {total_likes, total_comments, total_reads} = stats;
    return (
        <div className='flex lg:flex-col max-lg:flex-row max-lg:my-5 max-lg:gap-5 items-center w-full h-full max-lg:w-[90%] justify-center p-4 px-6 border-grey border-2 rounded-xl'>
            <div className='flex gap-2'>
                <i className='fi fi-rr-eye'></i>
                <h1>{total_reads.toLocaleString()}</h1>
            </div>
            <div className='flex gap-2'>
                <i className='fi fi-rr-heart text-red'></i>
                <h1>{total_likes.toLocaleString()}</h1>
            </div>
            <div className='flex gap-2'>
                <i className='fi fi-rr-comment text-purple'></i>
                <h1>{total_comments.toLocaleString()}</h1>
            </div>
        </div>
    )
}

export const ManageBlogCard = ({blog, index}) => {
    let {blog_id, title, publishedAt, activity} = blog;
    let [showStat, setShowStat] = useState(false);
    return (
        <>
            <div className='flex gap-10 border-b mb-6 max-mb:px-4 border-grey pb-6 items-center'>
            <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{index < 10 ? "0" + index : index}</h1>
                <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
                    <div className='w-[90%]'>
                        <Link to={`/blog/${blog_id}`} className='blog-title line-clamp-1 mb-4 hover:underline hover:text-orange'>{title}</Link>
                        <p className='line-clamp-1'>От {getFullDay(publishedAt)}</p>
                    </div>
                    {
                        showStat ?
                        <div className='lg:hidden'>
                            <BlogStats stats={activity} />
                        </div>
                        : ""
                    }
                    <div className='hidden md:flex gap-6'>
                        <Link to={`/editor/${blog_id}`} className='pr-4 py-2 hover:underline'>Переписать</Link>
                        <button className='lg:hidden pr-4 py-2 text-purple hover:underline' onClick={()=>setShowStat(prev => !prev)}>Статистика</button>
                        <button className='pr-4 py-2 text-red'>Удалить</button>
                    </div>
                    <div className='md:hidden flex gap-8 mt-3'>
                        <Link to={`/editor/${blog_id}`} className='pr-4 py-2 hover:underline'>
                        <i className='fi fi-rr-edit text-2xl'></i></Link>
                        <button className='lg:hidden pr-4 py-2 text-purple hover:underline' onClick={()=>setShowStat(prev => !prev)}>
                            <i className='fi fi-rr-stats text-2xl'></i>
                        </button>
                        <button className='pr-4 py-2 text-red'>
                            <i className='fi fi-rr-trash text-2xl'></i>
                        </button>
                    </div>
                </div>
                <div className='max-lg:hidden'>
                    <BlogStats stats={activity} />
                </div>
            </div>
        </>
    )
}

export const ManageDraftCard = ({blog, index}) => {
    let {blog_id, title, des, publishedAt, activity} = blog;
    return (
        <>
            <div className='flex gap-10 border-b mb-6 max-mb:px-4 border-grey pb-6 items-center'>
                <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{index < 10 ? "0" + index : index}</h1>
                <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
                    <div>
                        <Link to={`/blog/${blog_id}`} className='blog-title mb-4 hover:underline hover:text-orange'>{title}</Link>
                        <p className='line-clamp-2 text-dark-grey mb-3'>{des.length ? des : "Тут еще ничего нет ~(>_<。)＼"}</p>
                        <p className='line-clamp-1'>Создан {getFullDay(publishedAt)}</p>
                    </div>
                    <div className='hidden md:flex gap-6'>
                        <Link to={`/editor/${blog_id}`} className='pr-4 py-2 hover:underline'>Переписать</Link>
                        <button className='pr-4 py-2 text-red'>Удалить</button>
                    </div>
                    <div className='md:hidden flex gap-8 mt-3'>
                        <Link to={`/editor/${blog_id}`} className='pr-4 py-2 hover:underline'>
                        <i className='fi fi-rr-edit text-2xl'></i></Link>
                        <button className='pr-4 py-2 text-red'>
                            <i className='fi fi-rr-trash text-2xl'></i>
                        </button>
                    </div>

                </div>
                <div className='max-sm:hidden'>
                    <BlogStats stats={activity} />
                </div>
            </div>
        </>
    )
}