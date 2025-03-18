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
import LoadMoreDataBtn from '../components/load-more.component'
import mascot from '../imgs/mascot.png'

const HomePage = () => {

  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("Новое");

  const fetchLatestBlogs = ({ page }) => {
    axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/latestblogs", { page })
    .then( async ({ data }) => {
      console.log(data.blogs, data.blogs.length)
      let formattedBlogs = await filterPaginationData({ 
        state: blogs, 
        data: data.blogs, 
        page, 
        countRoute: "/countlatestblogs", 
      })
      console.log("dataset:", formattedBlogs)
      if (JSON.stringify(formattedBlogs) !== JSON.stringify(blogs)) {
        setBlogs(formattedBlogs);
      }
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
    fetchLatestBlogs({page:1});
    activeTabRef.current.click();

    if(!trendingBlogs){
      fetchTrendingBlogs();
    }
  }, [])

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
                      : blogs.results.length 
                        ? blogs.results.map((blog, i) => {
                            return <AnimationWrapper transition={{duration: 1, delay: i*.1 }} key={i}>
                              <BlogPostCard content={blog} author={blog.author.personal_info}/>
                            </AnimationWrapper>
                          })
                        : <NoDataMessage message="Ничего не найдено（＞人＜；）"/>
                    }
                    <LoadMoreDataBtn state={blogs} fetchDataFun={(pageState == "Новое" ? fetchLatestBlogs : fetchBlogsByCategory)} />
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

            {/* Самые популярные конспекты */}
            <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 max-md:hidden'>
              <div className="flex flex-col max-md:items-center gap-10 md:pl-8 md:border-l border-grey md:sticky md:top-[60px] md:py-8">
              <div>
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
                          </AnimationWrapper>})
                }
              </div>
          </div>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-0 left-0 w-[5%] h-screen hover:bg-grey text-dark-grey text-sm"
            title="Scroll to top"
          >
            <span className='fixed bottom-10 left-1 items-center justify-center'><i className='gap-1 fi fi-rr-angle-small-up'></i>Наверх</span>
        </button>
        </section>
    </AnimationWrapper>
  )
}

export default HomePage
