import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InPageNavigation from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import NoDataMessage from '../components/nodata.component';
import BlogPostCard from '../components/blog-post.component';
import LoadMoreDataBtn from '../components/load-more.component';
import axios from 'axios';
import { filterPaginationData } from '../common/filter-pagination-data';

const SearchPage = () => {

    let { query } = useParams();
    query = query.toLowerCase();

    let [blogs, setBlogs] = useState(null);

    const searchBlogs = ({page = 1, create_new_arr = false}) => {
        axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/searchblogs", {query, page})
        .then( async ({ data }) => {
            console.log(data.blogs, data.blogs.length)
            let formattedBlogs = await filterPaginationData({ 
              state: blogs, 
              data: data.blogs, 
              page, 
              countRoute: "/countsearchblogs", 
              data_to_send: { query },
              create_new_arr
            })
            console.log("dataset:", formattedBlogs)
            if (JSON.stringify(formattedBlogs) !== JSON.stringify(blogs)) {
              setBlogs(formattedBlogs);
            }
        }
    )}

    useEffect(() => {
        resetState()
        searchBlogs({page: 1, create_new_arr : true})
    }, [query])

    const resetState = () => {
        setBlogs(null)
    }

  return (
    <section className='h-cover flexbox justify-center gap-10'>
        <h1 className='mt-4 mb-4 text-center text-xl md:text-2xl font-serifs'>Результаты поиска по запросу: {query}</h1>
        <div className='w-full'>
            <InPageNavigation routes={["Конспекты", "Люди"]} defaultHidden={["Люди"]}>
                <>
                    {
                        blogs == null
                        ? <Loader />
                        : blogs.results.length 
                          ? blogs.results.map((blog, i) => {
                              return <AnimationWrapper transition={{duration: 1, delay: i*.1 }} key={i}>
                                <BlogPostCard content={blog} author={blog.author.personal_info}/>
                              </AnimationWrapper>
                            })
                          : <NoDataMessage message="Еще ничего не написано ಥ_ಥ"/>
                    }
                    <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
                </>
            </InPageNavigation>
        </div>
    </section>
  )
}

export default SearchPage