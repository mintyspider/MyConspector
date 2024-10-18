import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { UserContext } from "../App";
import {Link} from 'react-router-dom';
import InPageNavigation from '../components/inpage-navigation.component';

import AboutUser from '../components/about.component';
import { filterPaginationData } from '../common/filter-pagination-data';
import BlogPostCard from '../components/blog-post.component';
import LoadMoreDataBtn from '../components/load-more.component';
import NoDataMessage from '../components/nodata.component';
import NotFound from './404.page';

export const profileDataStructure = {
  personal_info: {
    "fullname": "",
    "email": "",
    "username": "",
    "bio": "",
    "profile_img": ""
  },
  social_links: {},
  account_info: {
    "total_posts": 0,
    "total_reads": 0
  },
  "joinedAt": "",
}
const ProfilePage = () => {

    let {id: profileId } = useParams();
    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let { userAuth } = useContext(UserContext);
    let userId = userAuth?._id;
    let [blogs, setBlogs] = useState(null);
    let [profileLoaded, setProfileLoaded] = useState("");

    let {personal_info: {fullname, username: profile_username, profile_img, bio}, account_info: {total_posts, total_reads}, social_links, joinedAt} = profile;

    const fetchUserProfile = () => {
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/getprofile", {username: profileId})
      .then(({data: user}) => {
        if(user !== null){
          setProfile(user)
          getBlogs({user_id: user._id})
        }
        console.log("profile: ", user._id)
        setProfileLoaded(profileId)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    }

    const getBlogs = async ({ page = 1, user_id }) => {
      try {
          // Если user_id не передан, используем blogs.user_id
          user_id = user_id === undefined ? blogs.user_id : user_id;
  
          // Отправляем запрос на сервер для поиска блогов
          const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/searchblogs", { author: user_id, page });
  
          // Форматируем данные блога
          let formattedBlogs = await filterPaginationData({
              state: blogs,
              data: data.blogs,
              page,
              countRoute: "/countsearchblogs",
              data_to_send: { author: user_id }
          });
  
          // Присваиваем user_id в отформатированные данные
          formattedBlogs.user_id = user_id;
  
          // Обновляем состояние blogs
          setBlogs(formattedBlogs);
      } catch (error) {
          console.error("Error fetching blogs:", error);
      }
  };
  

    const changeConspect = () => {
      if (total_posts % 10 ===1 && total_posts % 100 !== 11) {
        return 'конспект';
      }
      else if (total_posts % 10 >= 2 && total_posts % 10 <= 4 && (total_posts % 100 < 10 || total_posts % 100 >= 20)) {
        return 'конспекта';
      }
      else {
        return 'конспектов';
      }
    }

    const changeReads = () => {
      if (total_reads % 10 === 1 && total_reads % 100 !== 11) {
        return 'прочтение';
      }
      else if (total_reads % 10 >= 2 && total_reads % 10 <= 4 && (total_reads % 100 < 10 || total_reads % 100 >= 20)) {
        return 'прочтения';
      }
      else {
        return 'прочтений';
      }
    }

    const resetStates = () => {
      setProfile(profileDataStructure)
      setProfileLoaded("")
      setLoading(true)
    }
  
  useEffect(() => {
    if(profileId !== profileLoaded){
      setBlogs(null)
    }
    if(blogs == null){
    resetStates()
    fetchUserProfile();}
  }, [profileId, blogs])

  return (
    <AnimationWrapper>
      {
        loading ? <Loader /> : 
        profile_username.length ?
        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
            <img src={profile_img} className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32'/>
            <h1 className='text-2xl font-medium'>{fullname}</h1>
            <p className="text-dark-grey text-xl h-6">"{profile_username}"</p>
            <p>{total_posts.toLocaleString()} {changeConspect()} • {total_reads.toLocaleString()} {changeReads()}</p>

            <div className='flex gap-4 mt-2'>
              {profileId == userId ?
              <Link to="/settings/editprofile" className='btn-light rounded-md'>Редактировать профиль</Link>
              : ""}
              
            </div>

            <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />  
          </div>

          <div className='max-md:mt-12 w-full '>
            <InPageNavigation routes={["Собрание конспектов", "Кто я?"]} defaultHidden={["Кто я?"]}>
              <>
                {
                  blogs == null
                    ? <Loader />
                    : blogs.results.length 
                      ? blogs.results.map((blog, i) => {
                        console.log("blog: ", blog)
                        return <AnimationWrapper transition={{duration: 1, delay: i*.1 }} key={i}>
                            <BlogPostCard content={blog} author={blog.author.personal_info}/>
                          </AnimationWrapper>
                        })
                      : <NoDataMessage message="Ничего не найдено（＞人＜；）"/>
                    }
                    <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
                  </>
                  
                  <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                  
            </InPageNavigation>

          </div>

        </section>
        :<NotFound/>
      }
    </AnimationWrapper> 
  )
}

export default ProfilePage