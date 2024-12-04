import React, { useContext, useEffect, useState } from 'react';
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
    const filters = ['Все', 'Нравится', 'Контекстуры', 'Ответы'];
    const { userAuth, userAuth: { accessToken, new_notification_available }, setUserAuth } = useContext(UserContext);
    const [notifications, setNotifications] = useState(null);

    const fetchNotifications = ({ page = 1, deletedDocCount = 0, filter }) => {
        let filterOption;

        switch (filter) {
            case "Все":
                filterOption = "all";
                break;
            case "Нравится":
                filterOption = "like";
                break;
            case "Контекстуры":
                filterOption = "comment";
                break;
            case "Ответы":
                filterOption = "reply";
                break;
            default:
                filterOption = "all";
        }

        console.log("Fetching notifications with filter:", filterOption);

        axios
            .post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/notification`,
                { page, filterOption, deletedDocCount },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            .then(async ({ data: { notifications: data } }) => {
                console.log("Fetched notifications:", data);
                if (new_notification_available) {
                    setUserAuth({ ...userAuth, new_notification_available: false });
                }

                const formattedData = await filterPaginationData({
                    state: notifications,
                    data,
                    page,
                    countRoute: "/allnotificationscount",
                    data_to_send: filterOption,
                    user: accessToken,
                });

                setNotifications(formattedData);
            })
            .catch((err) => console.log("Error fetching notifications:", err));
    };

    const handleFilter = (e) => {
        const btn = e.target;
        const newFilter = btn.innerText;
        setFilter(newFilter); // Обновляем фильтр
        setNotifications(null); // Сбрасываем массив уведомлений
        fetchNotifications({ page: 1, filter: newFilter }); // Загружаем новые уведомления
    };

    useEffect(() => {
        if (accessToken) {
            setNotifications(null); // Сбрасываем уведомления перед загрузкой новых данных
            fetchNotifications({ page: 1, filter });
        }
    }, [filter, accessToken]);

    return (
        <div>
            <h1 className="max-md:hidden text-2xl lg:text-3xl font-medium text-dark-grey text-center">
                Оповещения
            </h1>
            <div className="my-8 flex gap-6">
                {filters.map((filterName, i) => (
                    <button
                        key={i}
                        onClick={handleFilter}
                        className={`text-md md:text-xl font-medium ${
                            filter === filterName ? "text-bold text-purple" : "text-dark-grey"
                        }`}
                    >
                        {filterName}
                    </button>
                ))}
            </div>
            {notifications == null ? (
                <Loader />
            ) : (
                <>
                    {notifications.results.length ? (
                        notifications.results.map((notification, i) => (
                            <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                                <NotificationCard
                                    data={notification}
                                    index={i}
                                    notificationState={{ notifications, setNotifications }}
                                />
                            </AnimationWrapper>
                        ))
                    ) : (
                        <NoDataMessage message="Нет оповещений ≡(▔﹏▔)≡" />
                    )}
                    <LoadMoreDataBtn
                        state={notifications}
                        fetchDataFun={fetchNotifications}
                        additionalData={{ deletedDocCount: notifications.deletedDocCount }}
                    />
                </>
            )}
        </div>
    );
};

export default Notification;
