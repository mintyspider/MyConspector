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
import UserCard from '../components/usercard.component';

const SearchPage = () => {

    let { query } = useParams();
    query = query.toLowerCase();

    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);

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

    const searchUsers = () => {
      axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/searchusers", {query})
      .then((users) => {
          console.log("users:", users)
          console.log("num=>", users.data.users.length )
          setUsers(users);
          })
      }

    useEffect(() => {
        resetState();
        searchBlogs({page: 1, create_new_arr: true})
        searchUsers();
    }, [query])

    const resetState = () => {
        setBlogs(null)
        setUsers(null)
    }

    const UserCardWrapper = () => {
      return (
        <>
          {
            users == null ?
            <Loader />
            : users.data.users.length ?
              users.data.users.map((user, i) => {
                return <AnimationWrapper key={i} transition={{duration: 1, delay: i*0.08}}>
                  <UserCard user={user} />
                </AnimationWrapper>;
            })
            : <NoDataMessage message={"Тут никого нет (T_T)"} />
          }
          </>
        )
    }

  return (
    <section className='h-cover flex justify-center gap-10'>
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
                <UserCardWrapper />
            </InPageNavigation>
        </div>
        <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
          <h1 className='font-medium text-xl mb-8'>Поиск людей <i className="fi fi-rr-user"></i></h1>
          <UserCardWrapper />
        </div>
    </section>
  )
}

export default SearchPage