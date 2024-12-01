import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App';
import { filterPaginationData } from '../common/filter-pagination-data';
import axios from 'axios';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import NoDataMessage from '../components/nodata.component';
import NotificationCard from '../components/notification-card.component';
import LoadMoreDataBtn from '../components/load-more.component';
const Notification = () => {

    const [filter, setFilter] = useState("Все");
    let filters = ['Все', 'Нравится', 'Контекстуры', 'Ответы'];
    let {userAuth: { accessToken }} = useContext(UserContext);
    const [notifications, setNotifications] = useState(null);

    const fetchNotifications = ({page = 1, deletedDocCount = 0, filter}) => {
        let filterOption;
        console.log("page=>", page);
        if(filter === "Все") {
            filterOption = "all";
        }
        if(filter === "Нравится") {
            filterOption = "like";
        }
        if(filter === "Контекстуры") {
            filterOption = "comment";
        }
        if(filter === "Ответы") {
            filterOption = "reply";
        }
        console.log("filterOption=>", filterOption);
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notification", {page, filterOption, deletedDocCount}, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then( async ({data: { notifications: data }}) => {
            console.log("data=>", data);
            setNotifications(null);
            let formattedData = await filterPaginationData({
                state: notifications,
                data,
                page,
                countRoute: "/allnotificationscount",
                data_to_send: filterOption,
                user: accessToken
            })
            if(!notifications){
                setNotifications(formattedData);
            } else {
                setNotifications(null);
                setNotifications(formattedData);
            }
        })
        .catch(err => console.log(err));
        console.log("notifications=>", notifications);
    }

    const handleFilter = (e) => {
        let btn = e.target;
        setFilter(btn.innerText);
        console.log("filter=>",filter)
        fetchNotifications(null);
    }
    useEffect(()=>{
        if(accessToken) {
            setNotifications(null);
            fetchNotifications({page: 1, filter: filter});
        }
    }, [filter]);
    return (
        <div>
            <h1 className='max-md:hidden text-2xl lg:text-3xl font-medium text-dark-grey text-center'>Оповещения</h1>
            <div className='my-8 flex gap-6'>
                {
                    filters.map((filterName, i) => {
                        return (
                            <button key={i} onClick={handleFilter} className={`text-md md:text-xl font-medium ${filter === filterName ? "text-bold text-purple" : "text-dark-grey"}`}>{filterName}</button>
                        )
                    })
                }
            </div>
            {
                notifications == null ? <Loader /> :
                <>
                    {
                        notifications.results.length ? 
                        notifications.results
                        .map((notification, i) => {
                            return <AnimationWrapper key={i} transition={{delay: i*0.08}}>
                                        <NotificationCard data={notification} index={i} notificationState={{notifications, setNotifications}}/>
                                    </AnimationWrapper>
                        })
                        : <NoDataMessage message="Нет оповещений ≡(▔﹏▔)≡"/>
                    }
                    <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotifications} additionalData={{deletedDocCount: notifications.deletedDocCount}}/>
                </>
            }
        </div>
    )
}

export default Notification
