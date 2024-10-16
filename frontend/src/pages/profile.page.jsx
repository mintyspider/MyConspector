import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';

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

    let {personal_info: {fullname, username: profile_username, profile_img, bio}, account_info: {total_posts, total_reads}, social_links, joinedAt} = profile;

    const fetchUserProfile = () => {
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/getprofile", {username: profileId})
      .then(({data: user}) => {
        setProfile(user)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    }

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
  
  useEffect(() => {
    fetchUserProfile();
  }, [])

  return (
    <AnimationWrapper>
      {
        loading ? <Loader /> : 
        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
            <img src={profile_img} className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32'/>
            <h1 className='text-2xl font-medium'>{fullname}</h1>
            <p className="text-dark-grey text-xl h-6">"{profile_username}"</p>
            <p>{total_posts} {changeConspect()} • {total_reads} {changeReads()}</p>
          </div>
        </section>
      }
    </AnimationWrapper> 
  )
}

export default ProfilePage