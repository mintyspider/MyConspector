import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/inpage-navigation.component'
import Loader from '../components/loader.component'
import BlogPostCard from '../components/blog-post.component'
import MinimalBlogPost from '../components/nobanner-blog-post.component'
import { activeTabLineRef, activeTabRef } from '../components/inpage-navigation.component'
import NoDataMessage from '../components/nodata.component'
import { filterPaginationData } from '../common/filter-pagination-data'

const HomePage = () => {

  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("Новое");

  let categories = ["ИБЭАТ", "ИИЯ", "ИИПСН", "ИЛГСН", "ИМИТ", "МИ", "ИПП", "ИФКСТ", "ИФ", "ИЭП", "ФТИ"]

  const fetchLatestBlogs = (page = 1 ) => {
    axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/latestblogs", { page })
    .then(({ data }) => {

      let formattedBlogs = filterPaginationData({ 
        create_new_arr: true, 
        state: blogs, 
        data: data.blogs, 
        page, 
        countRoute: "/countlatestblogs", 
        data_to_send: { draft: false } 
      })
      setBlogs(formattedBlogs)
      })
      
    .catch(err => {
      console.log(err)
    })
  }

  const fetchBlogsByCategory = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/searchblogs", { tag: pageState.toLowerCase() })
    .then(({ data }) => {
      setBlogs(data.blogs)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const fetchTrendingBlogs = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trendindblogs")
    .then(({ data }) => {
      setTrendingBlogs(data.blogs)
    })
    .catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {

    activeTabRef.current.click();

    if(pageState == "Новое"){
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory()
    }

    if(!trendingBlogs){
      fetchTrendingBlogs();
    }
  }, [pageState])

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toUpperCase();

    setBlogs(null);

    if(pageState == category){
      setPageState("Новое");
      return;
    }

    setPageState(category);
  }

  return (
    <AnimationWrapper>
        <section className='h-cover flex justify-center gap-10'>
            {/* Последние записи */}
            <div className='w-full'>
                <InPageNavigation routes={[pageState, "Популярное"]} defaultHidden={["Популярное"]}>
                  <>
                    {
                      blogs == null 
                      ? <Loader />
                      : blogs.length 
                        ? blogs.map((blog, i) => {
                            return <AnimationWrapper transition={{duration: 1, delay: i*.1 }} key={i}>
                              <BlogPostCard content={blog} author={blog.author.personal_info}/>
                            </AnimationWrapper>
                          })
                          : <NoDataMessage message="Ничего не найдено （＞人＜；）"/>
                    }
                  </>
                  <>
                  {
                      trendingBlogs == null 
                      ? <Loader />
                      : !trendingBlogs.length 
                        ? <NoDataMessage message="Ничего не найдено （＞人＜；）"/>
                        : trendingBlogs.map((blog, i) => {
                          return <AnimationWrapper transition={{duration: 1, delay: i*.1 }} key={i}>
                            <MinimalBlogPost blog={blog} index={i}/>
                          </AnimationWrapper>
                        })
                    }
                  </>
                </InPageNavigation>
            </div>

            {/* Фильтры и самые популярные конспекты */}
            <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden'>
              <div className='flex flex-col gap-10'>
                <div>
                <h1 className='font-medium text-xl mb-8'>Конспекты для всех и каждого</h1>

                <div className='flex gap-3 flex-wrap'>{
                  categories.map((category, i) => {
                    return <button key={i} className={"tag "+ (pageState == category ? "bg-black text-white" : "")} onClick={loadBlogByCategory}>
                      {category}
                    </button>
                  })}
                </div>
                </div>

              <div className=''>
                <h1 className='font-medium text-xl mb-8 gap-2'>
                  Популярное <i className='fi fi-rr-arrow-trend-up'></i>
                </h1>

                {
                      trendingBlogs == null 
                      ? <Loader />
                      : !trendingBlogs.length 
                        ? <NoDataMessage message="Ничего не найдено （＞人＜；）"/>
                        : trendingBlogs.map((blog, i) => {
                            return <AnimationWrapper transition={{duration: 1, delay: i*.1 }} key={i}>
                              <MinimalBlogPost blog={blog} index={i}/>
                            </AnimationWrapper>
                          })
                    }
              </div>
          </div>
          </div>
        </section>
    </AnimationWrapper>
  )
}

export default HomePage
