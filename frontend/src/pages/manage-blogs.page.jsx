import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App';
import { filterPaginationData } from '../common/filter-pagination-data';
import InPageNavigation from './../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import AnimationWrapper from '../common/page-animation';
import { ManageBlogCard, ManageDraftCard } from '../components/manage-blogcard.component';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState("");
    let {userAuth: {accessToken}} = useContext(UserContext);

    const getBlogs = ({page, draft, deletedDocCount = 0}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/userwrittenblogs", {
            page, draft, query, deletedDocCount
        }, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then( async ({data}) => {
            let formattedData = await filterPaginationData({
                state: draft ? drafts : blogs,
                data: data.blogs,
                page,
                user: accessToken,
                countRoute: "/userwrittenblogscount",
                data_to_send: {draft, query}
            })

            console.log("draft -> ", draft, formattedData)

            if(draft){
                setDrafts(formattedData);
            } else {
                setBlogs(formattedData);
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(accessToken){
            if(blogs == null){
                getBlogs({page: 1, draft: false})
            }
            if(drafts == null){
                getBlogs({page: 1, draft: true})
            }
        }
    }, [accessToken, blogs, drafts, query])

    const handleChange = (e) => {
        let searcQuery = e.target.value;
        setQuery(searcQuery);
        if(e.keyCode == 13 && searcQuery.length){
            setBlogs(null);
            setDrafts(null);
        }
    }

    const handleSearch = (e) => {
        if(!e.target.value.length){
            setQuery("");
            setBlogs(null);
            setDrafts(null);
        }
    }

    return (
        <>
            <h1 className='max-md:hidden text-2xl lg:text-3xl font-medium text-dark-grey text-center'>Мои конспекты</h1>
            <div className='relative max-md:mt-5 md:mt-8 mb-10'>
                <input type="search" 
                className='w-full bg-grey p-4 pl-12 rounded-full placeholder:text-dark-grey'
                placeholder='Найти конспект...'
                onChange={handleChange}
                onKeyDown={handleSearch}/>
                <i className='fi fi-rr-search absolute md:pointer-events-none left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>
            <InPageNavigation routes={["Конспекты", "Черновики"]}>
                {//опубликованные конспекты
                    blogs == null ? <Loader/>
                    : blogs.results.length
                    ? <> 
                        {
                            blogs.results.map((blog, i)=>{
                                return <AnimationWrapper key={i} transition={{delay: i*0.04}}>
                                    <ManageBlogCard blog={{...blog, index: i, setStateFunc: setBlogs}}/>
                                </AnimationWrapper>
                            })
                        }
                    </>
                    : <NoDataMessage message="༼ つ ◕_◕ ༽つ А нет публикаций"/>
                }
                {//черновики
                    drafts == null ? <Loader/>
                    : drafts.results.length
                    ? <> 
                        {
                            drafts.results.map((draft, i)=>{
                                return <AnimationWrapper key={i} transition={{delay: i*0.04}}>
                                    <ManageDraftCard blog={{...draft, index: i, setStateFunc: setDrafts}}/>
                                </AnimationWrapper>
                            })
                        }
                    </>
                    : <NoDataMessage message="༼ つ ◕_◕ ༽つ А нет черновиков"/>
                }
            </InPageNavigation>
        </>
    )
}

export default ManageBlogs
